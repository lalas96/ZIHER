
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
//fetch Data from JSON file
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
//generate cards
async function createCards(data, containerId, filterType = null, page = 1) {
  const ITEMS_PER_PAGE = 6; // items per page

  const results = filterType 
    ? data.estate.filter((nekretnina) => nekretnina.type === filterType)
    : data.estate.slice(0);

  const paginatedResults = results.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const container = document.querySelector(`#${containerId}`);
  if (!container) return;

  container.innerHTML = paginatedResults
    .map(nekretnina => {
      const firstImage = nekretnina.images?.[0] || '../images/no-image.jpg';
      return `
        <div class="card">
            <a href="nekretnina-details.html?id=${nekretnina.id}">
                <img src="${firstImage}" class="card-img-top" alt="${nekretnina.title}" />
            </a>
            <div class="card-body">
                <div class="card-text">
                    <h5>${nekretnina.type}</h5>
                    <h4 class="card-title">${nekretnina.title}</h4>
                    <div class="flex">    
                        <div class="flex">    
                            <small>
                                <img class="icon-img" src="../img/house.png" alt="">
                                ${nekretnina.size} m²
                            </small>
                        </div>
                        <div class="flex">
                            <small>
                                <img class="icon-img" src="../img/rooms.png" alt="">
                                ${nekretnina.rooms}
                            </small>
                        </div>
                        <div class="flex"> 
                            <small>Cijena: $${addCommasToNumber(nekretnina.price)}</small>
                        </div>
                    </div>
                    <div class="long-line"></div>
                    <div class="flex"> 
                        <small>
                            <img class="icon-img" src="../img/place.png" alt="">
                            <h5>${nekretnina.location}</h5>
                        </small>
                    </div>
                </div>
            </div>
        </div>`;
    })
    .join("");

  displayPagination(results.length, ITEMS_PER_PAGE, page, containerId, filterType);
}
//DISPLAY CARDS FOR DIFFERENT PAGES
async function displayNekretnine(containerId, filterType = null, limit = null) {
  global.search.page = 1;
  const data = await fetchLocalData();
  if (!data) return;

  let filteredData = filterType 
    ? data.estate.filter(nekretnina => nekretnina.type === filterType) 
    : data.estate;

  const totalItems = filteredData.length;
  if (limit) filteredData = filteredData.slice(0, limit); 
  await createCards({ estate: filteredData }, containerId, filterType, global.search.page);
  document.querySelector(".total-number").textContent = totalItems;
}

const displayAllNekretnine = () => displayNekretnine("all-nekretnine");
const displayLatestNekretnine = () => displayNekretnine("latest-nekretnine", null, 3);
const displayProdajaNekretnine = () => displayNekretnine("prodaja-nekretnine", "Prodaja");
const displayNajamNekretnine = () => displayNekretnine("najam-nekretnine", "Najam");
const displayTopNekretnine = () => displayNekretnine("top-nekretnine", null, 5);

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
  
  const searchParams = ["type", "location", "category", "rooms", "min-price", "max-price", "min-surface", "max-surface", "pool", "parking"];
  
  searchParams.forEach(param => global.search[param] = urlParams.get(param) || "");
  
  global.search.term = urlParams.get('search-term') || "";
  global.search.id = urlParams.get('search-id') || "";

  const hasSearchParams = ['term', 'id', 'type', 'location', 'category', 'rooms', 'min-price', 'max-price', 'min-surface', 'max-surface', 'pool', 'parking'].some(param => global.search[param]);

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



function addCheckboxStateToURL() {
  const poolChecked = document.getElementById("pool-checkbox").checked ? "true" : "false";
  const parkingChecked = document.getElementById("parking-checkbox").checked ? "true" : "false";

  const url = new URL(window.location.href);
  url.searchParams.set("pool", poolChecked);
  url.searchParams.set("parking", parkingChecked);
  history.replaceState(null, "", url);

  global.search.pool = poolChecked === "true";
  global.search.parking = parkingChecked === "true";

  search();
}

document.getElementById("pool-checkbox")?.addEventListener("change", addCheckboxStateToURL);
document.getElementById("parking-checkbox")?.addEventListener("change", addCheckboxStateToURL);

async function searchAPIData() {
  const data = await fetchLocalData(); // Fetch data from local JSON file
  if (!data) return { results: [], total_pages: 0, page: 1, total_results: 0 };

  const { term, id, type, category, location, rooms, minPrice, maxPrice, minSurface, maxSurface, pool, parking } = global.search;

  const isPoolChecked = pool;
  const isParkingChecked = parking;

  // Combine all data
  const combinedData = [...data.estate];
  const uniqueResults = Array.from(new Set(combinedData.map(item => item.id)))
    .map(id => combinedData.find(item => item.id === id));

  const filteredResults = uniqueResults.filter(item => {
    return (
      (term ? String(item.title).toLowerCase().includes(term.toLowerCase()) || item.location.toLowerCase().includes(term.toLowerCase()) : true) &&
      (id ? String(item.id).toLowerCase().includes(id.toLowerCase()) : true) &&
      (type ? item.type.toLowerCase() === type.toLowerCase() : true) &&
      (category ? item.category.toLowerCase() === category.toLowerCase() : true) &&
      (location ? item.location.toLowerCase() === location.toLowerCase() : true) &&
      (rooms ? item.rooms === parseInt(rooms) : true) &&
      item.price >= (minPrice || 0) && item.price <= (maxPrice || Infinity) &&
      item.size >= (minSurface || 0) && item.size <= (maxSurface || Infinity) &&
      (isPoolChecked ? item.pool : true) &&
      (isParkingChecked ? item.parking : true)
    );
  });

  // Pagination logic
  const resultsPerPage = 6;
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const currentPage = global.search.page;

  const results = filteredResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return { results, total_pages: totalPages, page: currentPage, total_results: filteredResults.length };
}

// Displaying results
function displaySearchResults(results, totalResults) {
  // Clear previous results
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";

  document.querySelector(".total-number").textContent = totalResults;

  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");

    const firstImage = result.images && result.images.length > 0 
      ? result.images[0]
      : "../images/no-image.jpg";

    div.innerHTML = `
      <a href="nekretnina-details.html?id=${result.id}">
        <img src="${firstImage}" class="card-img-top" alt="${result.title}" />
      </a>
      <div class="card-body">
        <h5 class="card-title">${result.title}</h5>
        <p class="card-text">
          <small>Lokacija: ${result.location}</small>
          <small>Površina: ${result.size}</small>
          <small>Broj soba: ${result.rooms}</small>
          <small>Broj soba: ${result.category}</small>
          <small>Bazen: ${result.pool ? "Da" : "Ne"}</small>
          <small>Parking: ${result.parking ? "Da" : "Ne"}</small>
          <small>Tip nekretnine: ${result.type}</small>
          <small>Cijena: ${result.price}</small>
        </p>
      </div>
    `;
    document.querySelector("#search-results").appendChild(div);
  });

  // Display pagination
  displaySearchPagination(totalResults, global.search.page);
}
// Pagination for search results
function displaySearchPagination(totalResults, currentPage) {
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);
  const paginationContainer = document.querySelector("#pagination");

  paginationContainer.innerHTML = `
    <div class="pagination">
      <button id="prev" class="btn btn-primary" ${currentPage === 1 ? "disabled" : ""}>Prev</button>
      <span>Page ${currentPage} of ${totalPages}</span>
      <button id="next" class="btn btn-primary" ${currentPage === totalPages ? "disabled" : ""}>Next</button>
    </div>
  `;

  document.querySelector("#prev").addEventListener("click", async () => {
    if (currentPage > 1) {
      global.search.page--;
      await search();
    }
  });

  document.querySelector("#next").addEventListener("click", async () => {
    if (currentPage < totalPages) {
      global.search.page++;
      await search();
    }
  });
}
function displayPagination(totalItems, itemsPerPage, currentPage, containerId, filterType = null) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationContainer = document.querySelector("#pagination");
    if (!paginationContainer) return;

    paginationContainer.innerHTML = ""; // Clear previous pagination
    
    if (totalPages <= 1) return;
  
    const paginationDiv = document.createElement("div");
    paginationDiv.classList.add("pagination");
 
    const prevButton = document.createElement("button");
    prevButton.textContent = "Prev";
    prevButton.classList.add("btn", "btn-primary"); 
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => changePage(currentPage - 1, containerId, filterType));
    paginationDiv.appendChild(prevButton);

    const pageInfo = document.createElement("span");
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    paginationDiv.appendChild(pageInfo);
  
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.classList.add("btn", "btn-primary"); 
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener("click", () => changePage(currentPage + 1, containerId, filterType));
    paginationDiv.appendChild(nextButton);

    paginationContainer.appendChild(paginationDiv);
}

function changePage(newPage, containerId, filterType) {
    global.search.page = newPage;
    fetchLocalData().then(data => {
        if (!data) return;
        createCards(data, containerId, filterType, newPage);
    });
}



