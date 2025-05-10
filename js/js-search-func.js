const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    dataFile: "./nekretnine.json",
  },
};
function resetSearchState() {
  global.search = {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  };
}
//fetch Data
async function fetchLocalData() {
  showSpinner();
  try {
    const response = await fetch(global.api.dataFile);
    if (!response.ok) throw new Error("Failed to fetch data.");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching local data:", error);
    showAlert("Failed to load data. Please try again later.", "error");
    return null;
  } finally {
    hideSpinner();
  }
}
function addCommasToNumber(number) {
  const num = Number(number);
  if (isNaN(num)) return "";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//generate cards
async function createCards(
  data,
  containerId,
  filterType = null,
  page = 1,
  isTopNekretnina = false,
  cardGenerator = generateCard
) {
  const ITEMS_PER_PAGE = 6;

  const results = data.estate?.length
    ? filterType
      ? data.estate.filter((n) => n.type === filterType)
      : data.estate
    : data.projectsArray;

  const paginatedResults = results.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const container = document.querySelector(`#${containerId}`);
  if (!container) return;

  container.innerHTML = paginatedResults
    .map((item) => cardGenerator(item, isTopNekretnina))
    .join("");

  displayPagination(
    results.length,
    ITEMS_PER_PAGE,
    page,
    containerId,
    filterType
  );

  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 50);
}
//display nekretnina cards
async function displayNekretnine(containerId, filterType = null, limit = null) {
  global.search.page = 1;
  const data = await fetchLocalData();
  if (!data) return;

  let filteredData = filterType
    ? data.estate.filter((nekretnina) => nekretnina.type === filterType)
    : data.estate;

  const totalItems = filteredData.length;
  if (limit) filteredData = filteredData.slice(0, limit);
  await createCards(
    { estate: filteredData },
    containerId,
    filterType,
    global.search.page
  );
  const totalNumberEl = document.querySelector(".total-number");
  if (totalNumberEl) {
    totalNumberEl.textContent = totalItems;
  }
}
//display projekti cards
async function displayProjekti(containerId, projektiData = null, limit = null) {
  global.search.page = 1;
  const data = await fetchLocalData();
  if (!data) return;

  let filteredProjekti = data.projectsArray;

  if (limit) {
    filteredProjekti = filteredProjekti.slice(0, limit);
  }

  const totalItems = filteredProjekti.length;

  await createCards(
    { projectsArray: filteredProjekti },
    containerId,
    null,
    global.search.page,
    false,
    generateProjektiCard
  );

  const totalNumberEl = document.querySelector(".total-number");
  if (totalNumberEl) {
    totalNumberEl.textContent = totalItems;
  }
}

const displayAllNekretnine = () => displayNekretnine("all-nekretnine");
const displayLatestNekretnine = () =>
  displayNekretnine("latest-nekretnine", null, 3);
const displayLatestProjekti = () => displayProjekti("latest-projekti", null, 3);

document.addEventListener("DOMContentLoaded", () => {
  displayProjekti("projekti");
  displayAllNekretnine();
  displayLatestNekretnine();
  displayLatestProjekti();
});

//SPINNER
function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}
function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}
/*-------------------------- SEARCH------------------------------- */
document.addEventListener("DOMContentLoaded", init);

async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const searchParams = [
    "type",
    "location",
    "category",
    "rooms",
    "price",
    "surface",
  ];

  searchParams.forEach(
    (param) => (global.search[param] = urlParams.get(param) || "")
  );
  global.search.term = urlParams.get("search-term") || "";

  const hasSearchParams = [
    "term",
    "id",
    "type",
    "location",
    "category",
    "rooms",
    "price",
    "surface",
  ].some((param) => global.search[param]);

  if (hasSearchParams) {
    showSpinner();
    const { results, total_pages, page, total_results } = await searchAPIData();
    hideSpinner();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      document.querySelector("#search-results").innerHTML = "";
      document.querySelector("#pagination").innerHTML = "";
      showAlert("No results found for your search", "error");
      return;
    }

    displaySearchResults(results, total_results);
    displaySearchPagination(total_results, page);
  } else {
    showAlert("Please enter a search term or select a filter");
  }
}
/*-------------------------- SEARCH PROJEKTI----------*/
async function searchProjekti() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const searchParams = ["category", "propertyNumber", "price", "surface"];

  const location = urlParams.get("location")?.toLowerCase() || "";
  const term = urlParams.get("search-term")?.toLowerCase() || "";

  const filters = {};
  searchParams.forEach((param) => {
    filters[param] = urlParams.get(param) || "";
  });

  const priceRanges = {
    1: [100000, 120000],
    2: [120001, 150000],
    3: [150001, 200000],
    4: [200001, 300000],
  };

  const surfaceRanges = {
    1: [100, 150],
    2: [151, 200],
    3: [201, 300],
  };

  const data = await fetchLocalData();
  if (!data || !data.projectsArray) return;

  const filteredProjects = data.projectsArray.filter((project) => {
    const matchesLocation = location
      ? project.location?.toLowerCase() === location
      : true;

    const matchesTerm = term
      ? Object.values(project).some(
          (value) =>
            typeof value === "string" && value.toLowerCase().includes(term)
        )
      : true;

    const matchesCategory = filters.category
      ? project.category?.toLowerCase() === filters.category.toLowerCase()
      : true;

    const matchesPropertyNumber = filters.propertyNumber
      ? project.propertyNumber
          ?.toString()
          .toLowerCase()
          .includes(filters.propertyNumber.toLowerCase())
      : true;

    const matchesPrice = filters.price
      ? (() => {
          const range = priceRanges[filters.price];
          const price = Number(project.price);
          return range ? price >= range[0] && price <= range[1] : true;
        })()
      : true;

    const matchesSurface = filters.surface
      ? (() => {
          const range = surfaceRanges[filters.surface];
          const surface = Number(project.surface);
          return range ? surface >= range[0] && surface <= range[1] : true;
        })()
      : true;

    return (
      matchesLocation &&
      matchesTerm &&
      matchesCategory &&
      matchesPropertyNumber &&
      matchesPrice &&
      matchesSurface
    );
  });

  const resultsPerPage = 6;
  const totalPages = Math.ceil(filteredProjects.length / resultsPerPage);
  const currentPage = global.search.page || 1;

  const resultsToShow = filteredProjects.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  if (filteredProjects.length === 0) {
    document.querySelector("#search-results").innerHTML = "";
    document.querySelector("#pagination").innerHTML = "";
    showAlert("Nema rezultata za zadanu lokaciju", "error");
    return;
  }

  displayProjectsResults(resultsToShow);
  displaySearchPagination(filteredProjects.length, currentPage);
  document.querySelector(".total-number").textContent = filteredProjects.length;
}

/*-------------------------- SEARCH PROJEKTI----------*/
async function searchAPIData() {
  const data = await fetchLocalData();
  if (!data) return { results: [], total_pages: 0, page: 1, total_results: 0 };

  const { term, id, type, category, location, rooms } = global.search;
  const price = global.search.price;
  const surface = global.search.surface;

  const combinedData = [...data.estate];

  const priceRanges = {
    1: [100000, 120000],
    2: [120001, 150000],
    3: [150001, 200000],
    4: [200001, 300000],
  };

  const surfaceRanges = {
    1: [100, 150],
    2: [151, 200],
    3: [201, 300],
  };

  const uniqueResults = Array.from(
    new Set(combinedData.map((item) => item.id))
  ).map((id) => combinedData.find((item) => item.id === id));

  const filteredResults = uniqueResults.filter((item) => {
    const itemPrice = Number(item.price);
    const itemSurface = Number(item.surface);

    const priceMatches = price
      ? itemPrice >= priceRanges[price][0] && itemPrice <= priceRanges[price][1]
      : true;

    const surfaceMatches = surface
      ? itemSurface >= surfaceRanges[surface][0] &&
        itemSurface <= surfaceRanges[surface][1]
      : true;

    const DEFAULTS = {
      type: "Prodaja",
      category: "Kuća",
      rooms: "1",
      price: "1",
      surface: "1",
    };

    return (
      (term
        ? item.title.toLowerCase().includes(term.toLowerCase()) ||
          item.location.toLowerCase().includes(term.toLowerCase())
        : true) &&
      (id ? String(item.id).toLowerCase().includes(id.toLowerCase()) : true) &&
      (type && type !== DEFAULTS.type
        ? item.type.toLowerCase() === type.toLowerCase()
        : item.type.toLowerCase() === DEFAULTS.type.toLowerCase()) && // Prodaja by default
      (category
        ? item.category.toLowerCase() === category.toLowerCase()
        : true) &&
      (location
        ? item.location.toLowerCase() === location.toLowerCase()
        : true) &&
      (rooms ? item.rooms === parseInt(rooms) : true) &&
      priceMatches &&
      surfaceMatches
    );
  });

  // Pagination setup
  const resultsPerPage = 6;
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const currentPage = global.search.page || 1;

  const results = filteredResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return {
    results,
    total_pages: totalPages,
    page: currentPage,
    total_results: filteredResults.length,
  };
}

// display results
function displaySearchResults(results, totalResults) {
  const container = document.querySelector("#search-results");
  const pagination = document.querySelector("#pagination");

  container.innerHTML = "";
  pagination.innerHTML = "";

  document.querySelector(".total-number").textContent = totalResults;

  if (!results || results.length === 0) {
    container.innerHTML = "<p>No results found</p>";
    return;
  }

  container.innerHTML = results
    .map((nekretnina) => generateCard(nekretnina, false))
    .join("");

  displaySearchPagination(totalResults, global.search.page);
}
// display projekti results
function displayProjectsResults(results) {
  const container = document.querySelector("#search-results");
  container.innerHTML = results
    .map((projekat) => generateProjektiCard(projekat))
    .join("");
}

// Pagination
function displaySearchPagination(totalResults, currentPage) {
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);
  const paginationContainer = document.querySelector("#pagination");

  paginationContainer.innerHTML = "";

  if (totalPages <= 1) return;

  const paginationDiv = document.createElement("div");
  paginationDiv.classList.add("pagination");

  const selectWrapper = document.createElement("div");
  selectWrapper.classList.add("pagination-custom-select");
  selectWrapper.style.position = "relative";

  const selectedPageDiv = document.createElement("div");
  selectedPageDiv.classList.add("selected-page");
  selectedPageDiv.textContent = `Stranica ${currentPage}`;
  selectedPageDiv.dataset.value = currentPage;

  const arrow = document.createElement("span");
  arrow.classList.add("custom-select-arrow");
  arrow.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.75 7.5L10 13.75L16.25 7.5H3.75Z" fill="#004F96"/>
    </svg>
  `;

  const dropdownMenu = document.createElement("ul");
  dropdownMenu.classList.add("custom-dropdown-menu");

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.textContent = `Stranica ${i}`;
    li.dataset.value = i;
    dropdownMenu.appendChild(li);

    li.addEventListener("click", () => {
      selectedPageDiv.textContent = `Stranica ${i}`;
      selectedPageDiv.dataset.value = i;
      dropdownMenu.style.display = "none";
    });
  }

  selectedPageDiv.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownMenu.style.display =
      dropdownMenu.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!selectWrapper.contains(e.target)) {
      dropdownMenu.style.display = "none";
    }
  });

  selectWrapper.appendChild(selectedPageDiv);
  selectWrapper.appendChild(arrow);
  selectWrapper.appendChild(dropdownMenu);

  const goButton = document.createElement("button");
  goButton.textContent = "Prikaži više";
  goButton.classList.add("btn", "btn-primary", "ml-2");

  goButton.addEventListener("click", () => {
    const selectedPage = parseInt(selectedPageDiv.dataset.value, 10);
    changePage(selectedPage, "search-results", global.search.filterType);
  });

  const pageInfo = document.createElement("span");
  pageInfo.textContent = `Stranica ${currentPage} od ${totalPages}`;
  pageInfo.classList.add("mx-2");

  paginationDiv.appendChild(selectWrapper);
  paginationDiv.appendChild(goButton);
  paginationDiv.appendChild(pageInfo);

  paginationContainer.appendChild(paginationDiv);
}

function changePage(newPage, containerId, filterType) {
  global.search.page = newPage;

  const container = document.querySelector(`#${containerId}`);
  if (container) {
    container.innerHTML = "";
  }

  const hasSearchParams = [
    "term",
    "id",
    "type",
    "location",
    "category",
    "rooms",
    "price",
    "surface",
  ].some((param) => global.search[param]);

  const scrollToTop = () => {
    setTimeout(() => {
      window.scrollTo({ top: 400, behavior: "smooth" });
    }, 100); 
  };

  if (hasSearchParams) {
    if (global.currentPage.includes("projekti")) {
      searchProjekti().then(scrollToTop);
    } else {
      search().then(scrollToTop);
    }
  } else {
    fetchLocalData().then((data) => {
      if (!data) return;

      if (global.currentPage.includes("projekti")) {
        createCards(
          { projectsArray: data.projectsArray },
          containerId,
          null,
          newPage,
          false,
          generateProjektiCard
        ).then(scrollToTop);
      } else {
        createCards({ estate: data.estate }, containerId, filterType, newPage)
          .then(scrollToTop);
      }
    });
  }
}
function displayPagination(
  totalItems,
  itemsPerPage,
  currentPage,
  containerId,
  filterType = null
) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationContainer = document.querySelector("#pagination");
  if (!paginationContainer) return;

  paginationContainer.innerHTML = "";
  if (totalPages <= 1) return;

  const paginationDiv = document.createElement("div");
  paginationDiv.classList.add("pagination");

  const selectWrapper = document.createElement("div");
  selectWrapper.classList.add("pagination-custom-select");
  selectWrapper.style.position = "relative";

  const selectedPageDiv = document.createElement("div");
  selectedPageDiv.classList.add("selected-page");
  selectedPageDiv.textContent = `Stranica ${currentPage}`;
  selectedPageDiv.dataset.value = currentPage;

  const arrow = document.createElement("span");
  arrow.classList.add("custom-select-arrow");
  arrow.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.75 7.5L10 13.75L16.25 7.5H3.75Z" fill="#004F96"/>
    </svg>
  `;

  const dropdownMenu = document.createElement("ul");
  dropdownMenu.classList.add("custom-dropdown-menu");

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.textContent = `Stranica ${i}`;
    li.dataset.value = i;
    dropdownMenu.appendChild(li);

    li.addEventListener("click", () => {
      selectedPageDiv.textContent = `Stranica ${i}`;
      selectedPageDiv.dataset.value = i;
      dropdownMenu.style.display = "none";
    });
  }

  selectedPageDiv.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownMenu.style.display =
      dropdownMenu.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!selectWrapper.contains(e.target)) {
      dropdownMenu.style.display = "none";
    }
  });

  selectWrapper.appendChild(selectedPageDiv);
  selectWrapper.appendChild(arrow);
  selectWrapper.appendChild(dropdownMenu);

  const goButton = document.createElement("button");
  goButton.textContent = "Prikaži Više";
  goButton.classList.add("btn", "btn-primary", "ml-2");

  goButton.addEventListener("click", () => {
    const selectedPage = parseInt(selectedPageDiv.dataset.value, 10);
    changePage(selectedPage, containerId, filterType);

      window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const pageInfo = document.createElement("span");
  pageInfo.textContent = `Stranica ${currentPage} od ${totalPages}`;
  pageInfo.classList.add("mx-2");

  paginationDiv.appendChild(selectWrapper);
  paginationDiv.appendChild(goButton);
  paginationDiv.appendChild(pageInfo);

  paginationContainer.appendChild(paginationDiv);
}

//-------------------ROUTER
