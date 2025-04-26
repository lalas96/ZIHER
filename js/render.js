function renderPropertyDetails(
  item,
  containerSelector,
  galleryKey = "property-gallery"
) {
  const images = item.images?.slice(0, 5) || [];
  const div = document.createElement("div");
  div.classList.add("details-card");

  div.innerHTML = `
    <div class="container">
      ${renderTopCard(item)}
    </div>
    <div class="long-line"></div>
    <div class="container">
      ${renderMainDetails(item, images, galleryKey)}
    </div>
  `;

  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.innerHTML = "";
  container.appendChild(div);

  // 👇 Replace default init with custom config
  const galleryBtn = container.querySelector(".gallery-btn");
  if (galleryBtn) {
    galleryBtn.addEventListener("click", () => {
      const lightbox = new SimpleLightbox(`a[data-title="${item.title}"]`, {
        animationSlide: false,
        animationSpeed: 0,
        fadeSpeed: 0,
        closeOnOverlayClick: false,
        disableScroll: true,
      });

      lightbox.open(); // 👈 open immediately on button click

      // Optional listeners
      lightbox.on("shown.simplelightbox", () => {
        document.body.classList.add("prevent-clicks");
      });

      lightbox.on("closed.simplelightbox", () => {
        document.body.classList.remove("prevent-clicks");
      });

      lightbox.on("change.simplelightbox", () => {
        const waitForImage = () => {
          const img = document.querySelector(".sl-wrapper .sl-image img");
          if (!img) {
            requestAnimationFrame(waitForImage);
            return;
          }

          img.style.opacity = "0";

          img.addEventListener(
            "load",
            () => {
              img.style.opacity = "1";
            },
            { once: true }
          );
        };

        requestAnimationFrame(waitForImage);
      });
    });
  }

  initializeGalleryLayout();
}
function renderTopCard(item) {
  return `
    <div class="card-top-container">
      <div class="card-title">
        <div class="flex">
          <h5>${item.category}</h5>
          <div class="line"></div>
          <h5>${item.type}</h5>
           <div class="line"></div>
           <h5>ID:${item.id}</h5>
        </div>
        <div class="column">
          <h1>${item.title}</h1>
          <h1>${item.location}</h1>
        </div>
      </div>
      <div class="column-info">
        <div class="list-group">
          <ul>
            ${
              item.propertyNumber
                ? `<li><p>Broj Nekretnina:</p><p>${item.propertyNumber}</p></li>`
                : ""
            }
            <li><p>Cijena:</p><p>$${addCommasToNumber(item.price)}</p></li>
            <li><p>Površina:</p><p>${item.surface}</p></li>
            <li><p>Broj soba:</p><p>${item.rooms}</p></li>
            <li><p>Bazen:</p><p>${item.pool ? "Da" : "Ne"}</p></li>
            <li><p>Parking:</p><p>${item.parking ? "Da" : "Ne"}</p></li>
            <li><p>ID:</p><p>${item.id}</p></li>
          </ul>
        </div>
        <div class="flex">
          <a href="kontakt.html" class="btn">Kontaktirajte nas</a>
        </div>
      </div>
    </div>
  `;
}

function renderMainDetails(item, images, galleryKey) {
  return `
    <div class="nekretnina-details">
      <div class="property-info">
        <div class="box">
          <div class="flex">
            <div class="h7">${item.category}</div> 
          <svg width="12" height="14"><svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.125 11.5002L7.875 7.40927L4.125 3.31836L4.125 11.5002Z" fill="#1B1B1B" fill-opacity="0.15"/>
            </svg></svg>
            <div class="h7">${item.title}, ${item.location}</div> 
            <svg width="12" height="14"><svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.125 11.5002L7.875 7.40927L4.125 3.31836L4.125 11.5002Z" fill="#1B1B1B" fill-opacity="0.15"/>
              </svg></svg>
            <div class="h7">ID:${item.id}</div> 
          </div>
        </div>
      </div>
      <div class="grid js-grid">
        ${images
          .map(
            (image, index) => `
          <div class="image-wrapper">
          <a href="${image}" class="lightbox-image" data-title="${item.title}">
              <img src="${image}" alt="Image" />
            </a>
            ${
              index === 0
                ? `
              <button class="btn gallery-btn">
               <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.1291 11.8791H12.4707L12.2374 11.6541C13.0541 10.7041 13.5457 9.47074 13.5457 8.12907C13.5457 5.1374 11.1207 2.7124 8.12907 2.7124C5.1374 2.7124 2.7124 5.1374 2.7124 8.12907C2.7124 11.1207 5.1374 13.5457 8.12907 13.5457C9.47074 13.5457 10.7041 13.0541 11.6541 12.2374L11.8791 12.4707V13.1291L16.0457 17.2874L17.2874 16.0457L13.1291 11.8791ZM8.12907 11.8791C6.05407 11.8791 4.37907 10.2041 4.37907 8.12907C4.37907 6.05407 6.05407 4.37907 8.12907 4.37907C10.2041 4.37907 11.8791 6.05407 11.8791 8.12907C11.8791 10.2041 10.2041 11.8791 8.12907 11.8791Z" fill="#004F96"/>
              </svg>
                <small>Pogledaj galeriju</small>
              </button>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>
        <div class="nekretnina-details-text">
      <div class="details-bottom">
       <div class="text">
      <p class="h8">We ensure you the best experience when buying a new house. We have a great team that supports you through everything. Our realtors, our escrow agents and even inspectors are there to help you so don't worry about anything at all!</p>
      <p>
      You will get a service of a high quality. Our realtors are trusted by top agencies and they provide a service that is on the highest level. Also, working with us you will get money back guarantee because we know that we can provide you with the best property.
      You will get a service of a high quality. Our realtors are trusted by top agencies and they provide a service that is on the highest level. Also, working with us you will get money back guarantee because we know that we can provide you with the best property.
      You will get a service of a high quality. Our realtors are trusted by top agencies and they provide a service that is on the highest level. Also, working with us you will get money back guarantee because we know that we can provide you with the best property.</p>
      <p>You will get a service of a high quality. Our realtors are trusted by top agencies and they provide a service that is on the highest level. Also, working with us you will get money back guarantee because we know that we can provide you with the best property.</p>
       </div>
        <h3>Opis</h3>
        <div class="list-group">
          <ul>
            <li><p>Cijena:</p><p>$${addCommasToNumber(item.price)}</p></li> 
            <li><p>Tip:</p><p>${item.type}</p></li> 
            <li><p>Kategorija:</p><p>${item.category}</p></li> 
            <li><p>Površina:</p><p>${item.surface}</p></li> 
            <li><p>Broj soba:</p><p>${item.rooms}</p></li> 
            <li><p>ID:</p><p>${item.id}</p></li> 
            <li><p>Bazen:</p><p>${item.pool ? "Da" : "Ne"}</p></li> 
            <li><p>Parking:</p><p>${item.parking ? "Da" : "Ne"}</p></li> 
          </ul>
        </div>
      </div>
    </div>
    </div>
    </div>
  `;
}

async function displayNekretnineDetails() {
  const id = new URLSearchParams(window.location.search).get("id");
  const data = await fetchLocalData();
  if (!data) return;
  const item = data.estate.find((el) => el.id === id);
  if (!item) return showAlert("Nekretnina not found", "error");
  renderPropertyDetails(item, "#nekretnina-details", "property-gallery");
}

async function displayProjektiDetails() {
  const id = new URLSearchParams(window.location.search).get("id");
  const data = await fetchLocalData();
  if (!data) return;
  const item = data.projectsArray.find((el) => el.id === id);
  if (!item) return showAlert("Projekat nije pronađen", "error");
  renderPropertyDetails(item, "#projekti-details", "property-gallery");
}
//-------------------GALLERY
function initializeGalleryLayout() {
  const grid = document.querySelector(".js-grid");

  if (!grid) {
    console.error(".js-grid not found!");
    return;
  }

  const imageWrappers = Array.from(grid.querySelectorAll(".image-wrapper"));
  const remainingImages = imageWrappers.slice(1);

  remainingImages.forEach((wrapper) => {
    wrapper.classList.remove(
      "stretch-span-2",
      "stretch-span-2-rows",
      "stretch-span-2-rows-2-cols"
    );
  });

  if (remainingImages.length === 1) {
    remainingImages.forEach((wrapper) =>
      wrapper.classList.add("stretch-span-2-rows-2-cols")
    );
  }

  if (remainingImages.length === 2) {
    remainingImages.forEach((wrapper) =>
      wrapper.classList.add("stretch-span-2")
    );
  }

  if (remainingImages.length === 3 || remainingImages.length === 4) {
    remainingImages[remainingImages.length - 1].classList.add("stretch-span-2");
  }

  //  stretch the last image
  if (remainingImages.length === 4 || remainingImages.length === 5) {
    remainingImages[remainingImages.length - 1].classList.add("stretch-span-1");
  }
}
//-------------------GALLERY
//NAVIGATION  START

const logoSVG = `
  <svg width="131" height="30" viewBox="0 0 131 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M94.6477 15.4974V14.9991V14.7847V13.8482V13.7353V13.237H84.416V0.5H74.9629V0.712503L76.5162 2.8883V27.1098L74.9629 29.2837V29.4981H84.416V15.4974H94.6477Z" fill="#231F20"/>
    <path d="M87.7656 28.2604V29.4978H95.8786L99.7562 19.0664H98.8615L87.7656 28.2604Z" fill="#231F20"/>
    <path d="M98.5898 10.3729L95.3595 0.5H87.5605V1.76373L97.6761 10.3729H98.5898Z" fill="#231F20"/>
    <path d="M29.0762 0.712503L30.6295 2.8883V27.1098L29.0762 29.2856V29.4981H40.0826V29.2856L38.5293 27.1098V2.8883L40.0826 0.712503V0.5H29.0762V0.712503Z" fill="#231F20"/>
    <path d="M60.847 0.712503L62.4004 2.8883V13.237H52.6445V2.8883L54.1979 0.712503V0.5H43.1914V0.712503L44.7447 2.8883V27.1098L43.1914 29.2856V29.4981H54.1979V29.2856L52.6445 27.1098V15.4974H62.4004V27.1098L60.847 29.2856V29.4981H71.8535V29.2856L70.3002 27.1098V2.8883L71.8535 0.712503V0.5H60.847V0.712503Z" fill="#231F20"/>
    <path d="M25.7268 0.5H16.0147V1.76373L0 29.1145V29.4981H9.6968V28.2607L25.7268 0.883634V0.5Z" fill="#231F20"/>
    <path d="M14 28.2604V29.4978H22.172L26.3485 19.0664H25.4538L14 28.2604Z" fill="#231F20"/>
    <path d="M11.7046 1.76373V0.5H3.77999L0.730469 10.3767H1.64609L11.7046 1.76373Z" fill="#231F20"/>
    <path d="M121.588 15.9375C125.818 14.828 128.149 12.3363 128.149 9.05282C128.149 4.78773 124.135 0.501953 116.797 0.501953H101.629V0.714456L103.184 2.89025V27.1118L101.629 29.2857V29.4982H112.637V29.2857L111.084 27.1118V2.76238H114.467C118.135 2.76238 119.517 4.87424 119.517 9.35183C119.517 13.5737 118.093 15.5558 114.64 15.5558H113.128V16.4942L122.108 29.5001H130.999V29.3722L121.588 15.9394V15.9375Z" fill="#231F20"/>
  </svg>
`;

function generateDropdownHTML() {
  const path = window.location.pathname;
  let optionsHTML = "";
  let currentLabel = "";
  const name = "category-select";
  const id = "category-select";

  if (path.includes("osiguranje")) {
    currentLabel = "Osiguranje";
  } else {
    currentLabel = "Nekretnine";
  }

  if (
    path.includes("osiguranje.html") ||
    path.includes("onama-osiguranje.html") ||
    path.includes("kontakt-osiguranje.html")
  ) {
    optionsHTML += `<option value="index.html">Nekretnine</option>`;
  } else {
    optionsHTML += `<option value="osiguranje.html">Osiguranje</option>`;
  }

  return `
    <div class="custom-select">
      <small>${currentLabel}</small>
      <select name="${name}" id="${id}">
        <option value="" selected hidden></option>
        ${optionsHTML}
      </select>
      <div class="arrow">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 7.5L10 12.5L15 7.5" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      </div>
    </div>
  `;
}

const mobileToggleHTML = `
<div class="mobile-menu-toggle" onclick="toggleNav()">
  <div class="hamburger">
    ${[...Array(3)]
      .map(
        () => `
      <svg class="line" width="18" height="2" viewBox="0 0 18 2" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect height="2" fill="#2A71BF" />
      </svg>`
      )
      .join("")}
  </div>
</div>
`;

function generateMobileOverlay(navListHTML) {
  return `
    <div id="toggleMobileNav" class="overlay">
      <div class="overlay-content">
        <nav class="mobile-nav">
          ${navListHTML}
        </nav>
        <a href="javascript:void(0)" class="closebtn" onclick="closeNav()"></a>
      </div>
    </div>
  `;
}
const navListNekretnineHTML = `
<ul class="nav_list">
<li class="nav_item"><a class="nav_link" href="onama.html">O nama</a></li>
<li class="nav_item"><a class="nav_link" href="nekretnine.html">Nekretnine</a></li>
<li class="nav_item"><a class="nav_link" href="projekti.html">Projekti</a></li>
<li class="nav_item"><a class="nav_link" href="kontakt.html">Kontakt</a></li>
</ul>
`;

const navListOsiguranjeHTML = `
<ul class="nav_list">
<li class="nav_item"><a class="nav_link" href="onama-osiguranje.html">O nama</a></li>
<li class="nav_item"><a class="nav_link" href="kontakt-osiguranje.html">Kontakt</a></li>
</ul>
`;
let logoHTML = `
<a href="index.html" class="logo">${logoSVG}</a>
`;

function renderNavBar(navListHTML) {
  const mobileOverlayNavHTML = generateMobileOverlay(navListHTML);

  const navBarHTML = `
    <nav class="navigation">
      <div class="navbar">
        ${logoHTML}
        <nav class="nav desktop-nav">
          ${navListHTML}
        </nav>
        <div class="mobile-container">
        ${generateDropdownHTML()}
          ${mobileToggleHTML}
        </div>
      </div>
    </nav>
    ${mobileOverlayNavHTML}
  `;

  const container = document.getElementById("navbar-container");
  if (container) {
    container.innerHTML = navBarHTML;
  } else {
    console.warn("Navbar container not found!");
  }
  initializeCustomSelects();
  attachDropdownEvents();

  document
    .getElementById("category-select")
    .addEventListener("change", function () {
      const url = this.value;
      window.location.href = url;
    });
}
document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname;

  if (
    path.includes("osiguranje.html") ||
    path.includes("onama-osiguranje.html") ||
    path.includes("kontakt-osiguranje.html")
  ) {
    logoHTML = `<a href="osiguranje.html" class="logo">${logoSVG}</a>`;
    renderNavBar(navListOsiguranjeHTML);
  } else {
    logoHTML = `<a href="index.html" class="logo">${logoSVG}</a>`;
    renderNavBar(navListNekretnineHTML);
  }
});
function attachDropdownEvents() {
  const dropdown = document.querySelector(".dropdown");
  const dropdownBtn = document.querySelector(".dropdown-btn");

  if (dropdown && dropdownBtn) {
    dropdownBtn.addEventListener("click", function (event) {
      dropdown.classList.toggle("show");
      event.stopPropagation();
    });

    document.addEventListener("click", function (event) {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove("show");
      }
    });
  } else {
    console.warn("Dropdown or Dropdown button not found!");
  }
}
// Toggle mobile
window.toggleNav = () => {
  const navOverlay = document.getElementById("toggleMobileNav");
  if (!navOverlay) return;
  const isOpen = navOverlay.style.height === "100%";
  navOverlay.style.height = isOpen ? "0%" : "100%";
  document.body.classList.toggle("no-scroll", !isOpen);
};
function closeNav() {
  const navOverlay = document.getElementById("toggleMobileNav");
  if (navOverlay) {
    navOverlay.style.height = "0%";
    document.body.classList.remove("no-scroll");
  }
}
//highlight active link
function highlightActiveLink() {
  const links = document.querySelectorAll(".nav_link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage.replace("/", "")) {
      link.classList.add("active");
    }
  });
}
//NAVIGATION END
function renderHeader() {
  // Default heading
  let headingText = `Sigurno<br> dobar <span class="lead-text">odabir</span>.`;
  let paragraphText = `<strong>ZIHER</strong> agencija pronalazi nekretnine koje odgovaraju tvojim životnim ciljevima!`;

  // Get current path
  const path = window.location.pathname.toLowerCase();

  // Update heading based on path
  if (path.includes("nekretnine.html")) {
    headingText = `Potraži svoju idealnu <span class="lead-text">nekretninu</span>.`;
    paragraphText = `Pronađi svoj prostor iz snova. Pronađi svoj novi dom. Pronađi idealnu nekretninu.`;
  } else if (path.includes("kuce")) {
    headingText = `Nova<br>kuća je <span class="lead-text">blizu</span>.`;
  } else if (path.includes("zemljiste")) {
    headingText = `Nađi savršeno<br><span class="lead-text">zemljište</span>.`;
  } else if (path.includes("kontakt")) {
    headingText = `Javi nam se,<br>tu smo <span class="lead-text">za tebe</span>.`;
  }

  // Build the full header HTML
  const headerHTML = `
    <header class="showcase">
      <div class="container">
        <div class="left-section">
          <div class="content">
            <h1>${headingText}</h1>
          </div>
        </div>
        <div class="right-section">
          <div class="content">
            <div class="img-box">
              <img src="img/Avatar1.png" alt="">
              <img src="img/Avatar2.png" alt="">
              <img src="img/Avatar3.png" alt="">
            </div>
            <div class="text">
                    <p>${paragraphText}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  `;

  // Inject into the container
  const container = document.getElementById("header-container");
  if (container) {
    container.innerHTML = headerHTML;
  }
}

function renderHeaderOsiguranje() {
  const headerHTML = `
  <header class="showcase-osiguranje">
  <div class="showcase">
  <div class="container">
  <div class="left-section">
  <div class="content">
  <h3>Što vam nudimo</h3>
  <h1>Posrednik u osiguranju.</h1>
  </div>
  </div>
  <div class="right-section">
  <div class="content">
  <div class="text">
  <p>ZIHER najbolja agencija za traženje kuća i stanova za vaš budući život!
  </p>
  </div>
  </div>
  </div>
  </div>
  </div>
  </header>
  `;

  const container = document.getElementById("header-osiguranje-container");
  if (container) {
    container.innerHTML = headerHTML;
  }
}
function renderHeaderContact() {
  const headerHTML = `
  <header class="showcase-osiguranje">
  <div class="showcase">
  <div class="container">
  <div class="left-section">
  <div class="content">
  <h3>Što vam nudimo</h3>
  <h1>Posrednik u osiguranju.</h1>
  </div>
  </div>
  <div class="right-section">
  <div class="content">
  <div class="text">
  <p>ZIHER najbolja agencija za traženje kuća i stanova za vaš budući život!
  </p>
  </div>
  </div>
  </div>
  </div>
  </div>
  </header>
  `;

  const container = document.getElementById("header-contact-container");
  if (container) {
    container.innerHTML = headerHTML;
  }
}
//------------------------------------------------------------------------SEARCHBAR
function renderSearchBarProjekti() {
  const selectsTop = [
    createSelect({
      label: "Broj Nekretnina",
      name: "propertyNumber",
      id: "propertyNumber",
      options: [
        ["1", "1"],
        ["2", "2"],
        ["3", "3"],
        ["4", "4"],
      ],
    }),
    createSelect({
      label: "Cijena",
      name: "price",
      id: "Price",
      options: [
        ["1", "100K-120K"],
        ["2", "120K-150K"],
        ["3", "150K-200K"],
        ["4", "200K-300K"],
      ],
    }),
    createSelect({
      label: "Površina",
      name: "surface",
      id: "Surface",
      options: [
        ["1", "100-150m2"],
        ["2", "150-200m2"],
        ["3", "200-300m2"],
      ],
    }),
  ];

  const locationSelect = createSelect({
    label: "Lokacija",
    name: "location",
    id: "location-nekretnina",
    options: [
      ["Zagreb", "Zagreb"],
      ["Split", "Split"],
    ],
  });

  const checkboxes = [
    createCheckbox("pool", "Bazen"),
    createCheckbox("parking", "Parking"),
  ];

  const searchBarHTML = `
    <section class="section-search-bar">
      <div class="container">
        <div class="search-bar">
          <div id="alert"></div>
          <form action="/search-projekti.html" class="search-form" method="GET">
            <div class="filter-items">
              <div class="select-row">
                <div class="box">${selectsTop[0]}</div>
                <div class="box">${selectsTop[1]}${selectsTop[2]}</div>
              </div>
             <div class="search-flex">
                <div class="flex-location-icon">
                  <img src="/img//locationblue.svg" alt="">
                  <small>Lokacija</small>
                  <input type="text" placeholder="Koju lokaciju tražite?" name="search-term" id="search-term" />
                </div>
                <button class="btn" type="submit">
                  <div class="flex">
                    <i class="fas fa-search"></i>
                    <h5>Pretraži</h5>
                  </div>
                </button>
              </div>
              <div class="additional">
                <div class="wrapper">
                  <div class="search">
                    <input class="id-search" type="text" name="search-id" id="search-id" placeholder="ID nekretnine" />
                    ${locationSelect}
                  </div>
                  <div class="checkbox-column">
                    ${checkboxes.join("")}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
        
  <div class="long-line"></div>
  `;

  const container = document.getElementById("search-bar-projekti-container");
  if (container) {
    container.innerHTML = searchBarHTML;
    initializeCustomSelects();
  }
}

function renderSearchBar() {
  const selectsTopLeft = [
    createSelect({
      label: "Vrsta",
      name: "type",
      id: "type-nekretnina",
      options: [
        ["Prodaja", "Prodaja"],
        ["Najam", "Najam"],
      ],
    }),
    createSelect({
      label: "Tip",
      name: "category",
      id: "category-nekretnina",
      options: [
        ["Stan", "Stan"],
        ["Kuća", "Kuća"],
        ["Zemljište", "Zemljište"],
        ["Poslovni Prostor", "Poslovni Prostor"],
      ],
    }),
    createSelect({
      label: "Broj Soba",
      name: "rooms",
      id: "rooms-number",
      options: [
        ["1", "1"],
        ["2", "2"],
        ["3", "3"],
        ["4", "4"],
        ["5", "5"],
      ],
    }),
  ];

  const selectsTopRight = [
    createSelect({
      label: "Cijena",
      name: "price",
      id: "Price",
      options: [
        ["1", "100K-120K"],
        ["2", "120K-150K"],
        ["3", "150K-200K"],
        ["4", "200K-300K"],
      ],
    }),
    createSelect({
      label: "Površina",
      name: "surface",
      id: "Surface",
      options: [
        ["1", "100-150m2"],
        ["2", "150-200m2"],
        ["3", "200-300m2"],
      ],
    }),
  ];

  const checkboxes = [
    createCheckbox("pool", "Bazen"),
    createCheckbox("parking", "Parking"),
  ];

  const searchBarHTML = `
    <section class="section-search-bar">
      <div class="container">
        <div class="search-bar">
          <div id="alert"></div>
          <form action="/search.html" class="search-form" method="GET">
            <div class="filter-items">
              <div class="select-row">
                <div class="box">
                  ${selectsTopLeft.join("")}
                </div>
                <div class="box">
                  ${selectsTopRight.join("")}
                </div>
              </div>
              <div class="search-flex">
                <div class="flex-location-icon">
                  <img src="/img//locationblue.svg" alt="">
                  <small>Lokacija</small>
                  <input type="text" placeholder="Koju lokaciju tražite?" name="search-term" id="search-term" />
                </div>
                <button class="btn" type="submit">
                  <div class="flex">
                    <i class="fas fa-search"></i>
                    <h5>Pretraži</h5>
                  </div>
                </button>
              </div>
              <div class="additional">
                <div class="wrapper">
                  <div class="search">
                    <input class="id-search" type="text" name="search-id" id="search-id" placeholder="ID nekretnine" />
                  </div>
                  <div class="checkbox-column">
                    ${checkboxes.join("")}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
        <div class="long-line"></div>
  `;

  const container = document.getElementById("search-bar-container");
  if (container) {
    container.innerHTML = searchBarHTML;
    initializeCustomSelects();
  }
}

function createSelect({ label, name, id, options }) {
  const optionsHTML = options
    .map(([value, text]) => `<option value="${value}">${text}</option>`)
    .join("");

  return `
    <div class="custom-select">
      <small>${label}</small>
      <select name="${name}" id="${id}">
        <option value="" selected></option>
        ${optionsHTML}
      </select>
      <div class="arrow">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3.75 7.5L10 13.75L16.25 7.5H3.75Z" fill="#026451"/>
        </svg>
      </div>
    </div>
  `;
}

function createCheckbox(name, label) {
  return `
    <div class="checkbox-option">
      <input type="checkbox" name="${name}" id="${name}-checkbox" value="true" />
      <label for="${name}-checkbox">${label}</label>
    </div>
  `;
}

function initializeCustomSelects() {
  const customSelects = document.querySelectorAll(".custom-select");

  customSelects.forEach((selectWrapper) => {
    const select = selectWrapper.querySelector("select");

    // Cleanup previous custom elements if they exist
    selectWrapper
      .querySelectorAll(".select-selected, .select-items")
      .forEach((el) => el.remove());

    const selected = document.createElement("div");
    selected.className = "select-selected";
    selected.textContent = select.options[select.selectedIndex].textContent;

    const optionsContainer = document.createElement("div");
    optionsContainer.className = "select-items select-hide";

    function renderOptions(excludeIndex) {
      optionsContainer.innerHTML = ""; // Clear old options

      Array.from(select.options).forEach((option, index) => {
        if (index !== excludeIndex) {
          const optionDiv = document.createElement("div");
          optionDiv.textContent = option.textContent;

          optionDiv.addEventListener("click", () => {
            select.selectedIndex = index;
            selected.textContent = option.textContent;

            // Re-render options excluding the new selection
            renderOptions(index);

            select.dispatchEvent(new Event("change"));
            selected.click(); // Close dropdown
          });

          optionsContainer.appendChild(optionDiv);
        }
      });
    }

    renderOptions(select.selectedIndex);

    selected.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllSelect(selected);
      optionsContainer.classList.toggle("select-hide");
      selected.classList.toggle("select-arrow-active");
    });

    selectWrapper.appendChild(selected);
    selectWrapper.appendChild(optionsContainer);
  });

  document.addEventListener("click", closeAllSelect);
}

function closeAllSelect(current) {
  document.querySelectorAll(".select-selected").forEach((el) => {
    if (el !== current) el.classList.remove("select-arrow-active");
  });

  document.querySelectorAll(".select-items").forEach((el) => {
    if (!el.previousSibling || el.previousSibling !== current) {
      el.classList.add("select-hide");
    }
  });
}
//------------------------------------------------------------------------SEARCHBAR END
//------------------------------------------------------------------------FILTERHBAR
function renderFilterBar() {
  const filterBarHTML = `
     <section class="section-filter-bar">
          <div class="container">
          <p>Reci nam što tražiš</p>
          <div class="filter-bar">
            <form id="filter-form" class="filter-form">
              <div class="filter-group">
              <h2>Pronađi mi</h2>
                 <div class="custom-select">
                <select name="category" id="filter-category">
                  <option value="Stan" selected>Stan</option>
                  <option value="Kuća">Kuća</option>       
                  <option value="Zemljište">Zemljište</option>
                  <option value="Poslovni Prostor">Poslovni Prostor</option>
                </select>
                   <div class="arrow">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.75 7.5L10 13.75L16.25 7.5H3.75Z" fill="#026451"/>
                    </svg>
                    </div>
                    </div>
                    <h2>blizu</h2>
                      <div class="custom-select">
                <select name="location" id="filter-location">
                  <option value="Zagreb" selected>Zagreb</option>
                  <option value="Split">Split</option>
                </select>
                   <div class="arrow">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.75 7.5L10 13.75L16.25 7.5H3.75Z" fill="#026451"/>
                  </svg>
                  </div>
                </div>
                 <h2>za</h2>
                    <div class="custom-select">
                <select name="type" id="filter-type">
                  <option value="Prodaja" selected>Prodaju</option>
                  <option value="Najam">Najam</option>
                </select>
                <div class="arrow">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.75 7.5L10 13.75L16.25 7.5H3.75Z" fill="#026451"/>
                  </svg>
                </div>
                </div>
           </div>
          <div class="container">
            <div id="propertyGrid" class="grid"></div>
            <div class="flex-total">
            <p>Imamo preko <span class="lead-text total-number"></span> <span class="lead-text">nekretnina</span> za život u našoj bazi podataka</p>
              <button class="flex-btn" type="submit">Vidi sve<img class="icon-img" src="../img/arrowblack.png" alt="arrow">
              </button>
              </form>
          </div>
          </div>
      </section>
<section class="section-row-box">
      <div class="container">
      <div class="grid">
        <div class="box">
          <h3>Kuće</h3>
          <p>Pronađi savršen dom za svoj životni stil.</p>
          <a class="btn-empty" href="search-filter.html?category=Ku%C4%87a">
            <div class="flex-btn">Vidi sve<img class="icon-img" src="../img/arrowblack.png" alt="arrow">
            </div>
          </a>
        </div>
        <div class="box">
          <h3>Stanovi</h3>
          <p>Stanovi koji odgovaraju tvojim željama i potrebama.</p>
          <a class="btn-empty" href="search-filter.html?category=Stan">
            <div class="flex-btn">Vidi sve<img class="icon-img" src="../img/arrowblack.png" alt="arrow">
            </div>
          </a>
        </div>
        <div class="box">
          <h3>Zemljišta</h3>
          <p>Zemljišta s potencijalom za tvoju budućnost.</p>
          <a class="btn-empty" href="search-filter.html?category=Zemlji%C5%A1te">
            <div class="flex-btn">Vidi sve<img class="icon-img" src="../img/arrowblack.png" alt="arrow">
            </div>
          </a>
        </div>
        <div class="box">
          <h3>Projekti</h3>
          <p>Pronađite svoj idealan stan u kvalitetnim stambenim projektima.</p>
          <a class="btn-empty" href="search-filter.html?category=Poslovni+Prostor">
            <div class="flex-btn">Vidi sve<img class="icon-img" src="../img/arrowblack.png" alt="arrow">
            </div>
          </a>
        </div>
      </div>
      </div>
    </section>
    `;

  const container = document.getElementById("filter-bar-container");
  if (container) {
    container.innerHTML = filterBarHTML;

    // Add event listeners after rendering the filter bar
    const typeSelect = document.getElementById("filter-type");
    const categorySelect = document.getElementById("filter-category");
    const locationSelect = document.getElementById("filter-location");

    [typeSelect, categorySelect, locationSelect].forEach((select) =>
      select.addEventListener("change", displayFilteredHomepageCards)
    );

    document.getElementById("filter-form").addEventListener("submit", (e) => {
      e.preventDefault();

      const type = typeSelect.value;
      const category = categorySelect.value;
      const location = locationSelect.value;

      const params = new URLSearchParams();
      if (type) params.set("type", type);
      if (category) params.set("category", category);
      if (location) params.set("location", location);

      window.location.href = `/search-filter.html?${params.toString()}`;
    });
    initializeCustomSelects();
  }
  displayFilteredHomepageCards();
}
//------------------------------------------------------------------------FILTERBAR END
//------------------------------------------------------------------------SEARCHRESULTS
function renderSearchResults() {
  const TeamHTML = `
  <div class="search-results">
    <div class="container">
      <div class="flex">
        <h1>Rezultati pretraživanja</h1>
        <div class="flex-total">
          <p>Imamo preko <span class="lead-text total-number"></span> <span class="lead-text">nekretnina</span>  za tebe</p>
        </div>
      </div>
    <div id="search-results" class="grid"></div>
    <div id="pagination"></div>
`;

  const container = document.getElementById("search-results-container");
  if (container) {
    container.innerHTML = TeamHTML;
  }
}
//------------------------------------------------------------------------SEARCHRESULTS END
function displayFilteredHomepageCards() {
  const type = document.getElementById("filter-type")?.value || "Prodaja";
  const category = document.getElementById("filter-category")?.value || "Stan";
  const location =
    document.getElementById("filter-location")?.value || "Zagreb";

  fetchLocalData().then((data) => {
    if (!data) return;

    let filtered = data.estate;

    filtered = filtered.filter(
      (item) =>
        item.type === type &&
        item.category === category &&
        item.location === location
    );

    const limited = filtered.slice(0, 3);
    const container = document.getElementById("propertyGrid");
    if (container) {
      container.innerHTML = limited
        .map((nekretnina) => generateCard(nekretnina, false))
        .join("");
    }

    const totalSpan = document.querySelector(".total-number");
    if (totalSpan) {
      totalSpan.textContent = filtered.length;
    }
  });
}
//-------------------TEAM
function renderTeam() {
  const TeamHTML = `
<section class="contact-team">
  <div class="container">
    <div class="title">
      <h6>Kontaktiraj nas!</h6>
    </div>
    
  <div class="grid">
      <div class="box">
        <h3>Pošalji upit</h3>
        <p id="contact-query-text">Nisi siguran odakle krenuti? Piši nam preko našeg weba – zajedno ćemo naći pravi prostor za tebe.</p>
        <a class="btn" href="kontakt.html">Pošalji upit</a>
      </div>
      <div class="box">
        <h3>Nazovi nas</h3>
        <p>Slobodno nas nazovi tijekom radnog vremena. PON – SUB (08:00 – 20:00). Rado ćemo odgovoriti na sva tvoja pitanja.</p>
        <a class="btn-empty" href="tel:+1234567893">
          <div class="flex-btn">
            +1 234 567 893
            <img class="icon-img" src="../img/arrowblack.png" alt="arrow">
          </div>
        </a>
      </div>
      <div class="box">
        <h3>Pošalji e-mail</h3>
        <p>Nema potrebe za ispunjavanjem obrazaca. Skoči na svoj e-mail i pošaljemo što god trebaš. Tu smo da pomognemo.</p>
        <a class="btn-empty" href="mailto:support@ziher.com">
          <div class="flex-btn">
            support@ziher.com
            <img class="icon-img" src="../img/arrowblack.png" alt="arrow">
          </div>
        </a>
      </div>
    </div>
  </div>
</section>
`;

  const container = document.getElementById("contact-team-container");
  if (container) {
    container.innerHTML = TeamHTML;
  }
  const currentPage = window.location.pathname;
  const buttons = document.querySelectorAll(".btn");
  const contactQueryText = document.getElementById("contact-query-text");

  if (currentPage.includes("osiguranje.html")) {
    buttons.forEach((button) => {
      button.classList.add("btn-green");
      button.classList.remove("btn-primary");
    });

    if (contactQueryText) {
      contactQueryText.textContent =
        "Nisi siguran koje osiguranje ti treba? Piši nam preko weba – zajedno ćemo pronaći najbolje osiguranje za tebe.";
    }
  } else {
    buttons.forEach((button) => {
      button.classList.add("btn-primary");
    });
    if (contactQueryText) {
      contactQueryText.textContent =
        "Nisi siguran odakle krenuti? Piši nam preko našeg weba – zajedno ćemo naći pravi prostor za tebe.";
    }
  }
}

function renderTeamShort() {
  const TeamHTML = `
<section class="contact-team-short">
<div class="container">
  <div class="title">
    <h6>Contact our Team</h6>
  </div>
  <div class="grid">
   <div class="box">
      <h3>Nazovi nas</h3>
      <p>Slobodno nas nazovi tijekom radnog vremena. PON – SUB (08:00 – 20:00). Rado
ćemo odgovoriti na sva tvoja pitanja.</p>
             <a class="btn-empty" href="tel:+1234567893">
            <div class="flex-btn">+1 234 567 893<img class="icon-img" src="../img/arrowblack.png" alt="arrow">
            </div>
          </a>
    </div>

    <div class="box">
      <h3>Pošalji e-mail</h3>
       <p>Nema potrebe za ispunjavanjem obrazaca. Skoči na svoj e-mail i pošalji nam što god trebaš. Tu smo da pomognemo.</p>
           <a class="btn-empty" href="mailto:support@ziher.com">
            <div class="flex-btn">support@ziher.com<img class="icon-img" src="../img/arrowblack.png" alt="arrow">
            </div>
          </a>
    </div>
  </div>
</div>
</section>
`;

  const container = document.getElementById("contact-team-short-container");
  if (container) {
    container.innerHTML = TeamHTML;
  }
}
function renderContactform() {
  const TeamHTML = `
    <div class="container">
    <div class="grid">
    <div class="column">
      <div class="text">
      <p>Prosječno vrijeme odgovora je 24 radna sata. Radno vrijeme: PON – SUB (08:00 –
20:00)</p>
          </div>
          <div class="contact-form">
            <div class="form-container">
              <form role="form" enctype="multipart/form-data" method="POST" class="form">
              <div class="flex">
            <div class="input-data">
            <input type="text" name="name" id="username" placeholder="Ime">
            </div>
            <div class="input-data">
            <input type="text" name="surname" id="prezime" placeholder="Prezime">
          </div>
        </div>
          <div class="input-data">
            <input name="email" id="email" type="text" placeholder="E-mail">
          </div>
          <div class="input-data">
            <input name="telefon" id="telefon" type="text" placeholder="Broj telefona">
          </div>
            <div class="textarea" >
            <div class="input-data">
            <textarea name="message" id="message" placeholder="Upit"></textarea>
            </div>
            </div>
            <div class="input-data">
              <input type="submit" class="btn-primary" value="Pošalji Upit!" name="submit" >
            </div>
            </form>
            </div>
        </div>
    </div>
    <div class="column">
      <div class="content">
      <img src="img/agentica.jpg" alt="">
       </div>
      </div>
      </div>
      </div>
    </div> 
    </div> 
    </div> 
`;

  const container = document.getElementById("contact-form-container");
  if (container) {
    container.innerHTML = TeamHTML;
  }
}
window.onload = renderContactform;
//-------------------TEAM
//-------------------FOOTER
function renderFooter() {
  const footerHTML = `
<div class="footer-top">
  <div class="container">
    <div class="footer-nav">
    <ul class="nav_list">
      <li class="nav_item">
        <a class="h8 nav_link" href="O nama.html">O nama</a>
      </li>
      <li><img src="/img/dot.svg"></img></li>
      <li class="nav_item">
        <a class="h8 nav_link" href="index.html">Naslovna</a>
      </li>
      <li><img src="/img/dot.svg"></img></li>
      <li class="nav_item">
        <a class="h8 nav_link" href="nekretnine.html">Nekretnine</a>
      </li>
      <li><img src="/img/dot.svg"></img></li>
      <li class="nav_item">
        <a class="h8 nav_link" href="projekti.html">Projekti</a>
      </li>
      <li><img src="/img/dot.svg"></img></li>
      <li class="nav_item">
        <a class="h8 nav_link" href="kontakt.html">Kontakt</a>
      </li>
      </ul>
      </div>
    <span class="logo-img">
      <img src="/img/logo.svg" alt="Logo">
      </span>
      </div>
</div>
  <section class="footer-bottom">
<div class="container">
    <div class="grid">
      <div class="box">
        <div class="column">
          <p>Usluge osiguranja</p>
          <h1>Osiguranje</h1>
        </div>
      </div>
      <div class="box">
        <div class="column">
        <h3 class="h8">Tekst</h3>
          <p>Otkrijte našu ponudu osiguranja. Pametan korak za bolju budućnost.</p>
          <a class="btn-empty" href=""><div class="flex">Pogledaj stranicu ZIHER nekretnine
          <img class="icon-img" src="../img/arrowwhite.png" alt="arrow">
          </div>
        </a>
        </div>
      </div>
    </div>
  </div>
  </section>
`;

  const container = document.getElementById("footer-container");
  if (container) {
    container.innerHTML = footerHTML;
  }
  handleFooterScroll();
}
function handleFooterScroll() {
  const footerTop = document.querySelector(".footer-top");
  const footerBottom = document.querySelector(".footer-bottom");

  if (!footerTop || !footerBottom) return;

  window.addEventListener("scroll", function () {
    const footerTopBottomPosition = footerTop.getBoundingClientRect().bottom;
    if (footerTopBottomPosition <= window.innerHeight + 300) {
      footerBottom.classList.add("show-footer");
    } else {
      footerBottom.classList.remove("show-footer");
    }
  });
}

window.onload = renderFooter;

function renderFooterOsiguranje() {
  const footerHTML = `
<div class="footer-top">
  <div class="container">
    <div class="footer-nav">
    <ul class="nav_list">
      <li class="nav_item">
        <a class="h8 nav_link" href="O nama.html">O nama</a>
      </li>
      <li><img src="/img/dot.svg"></img></li>
      <li class="nav_item">
        <a class="h8 nav_link" href="index.html">Naslovna</a>
      </li>
      </ul>
      </div>
    <span class="logo-img">
      <img src="/img/logo.svg" alt="Logo">
      </span>
      <div class="flex">
      <p class="h7">© 2025 ZIHER</p>
      <div class="box">
      <a class="h7" href="nekretnine.html">Nekretnine</a>
      <a class="h7 nav_link" href="projekti.html">Projekti</a>
      </div>
    </div>
      </div>
</div>
    <section class="footer-bottom blue">
<div class="container">
  <div class="grid">
    <div class="box">
      <div class="column">
        <p>Usluge nekretnina</p>
        <h1>Nekretnine</h1>
      </div>
    </div>
    <div class="box">
      <div class="column">
        <p>Otkrijte našu ponudu nekretnina. Sigurno dobar odabir.</p>
        <a class="btn-empty" href="search-filter.html?category=Kuća">
            <div class="flex-btn">Pogledaj stranicu ZIHER nekretnina<img class="icon-img" src="../img/arrowwhite.png" alt="arrow">
            </div>
          </a>
      </div>
    </div>
  </div>
</div>
    </section>
  `;

  const container = document.getElementById("footer-osiguranje-container");
  if (container) {
    container.innerHTML = footerHTML;
  }
  handleFooterScroll();
}
function handleFooterScroll() {
  const footerTop = document.querySelector(".footer-top");
  const footerBottom = document.querySelector(".footer-bottom");

  if (!footerTop || !footerBottom) return;

  window.addEventListener("scroll", function () {
    const footerTopBottomPosition = footerTop.getBoundingClientRect().bottom;
    if (footerTopBottomPosition <= window.innerHeight + 300) {
      footerBottom.classList.add("show-footer");
    } else {
      footerBottom.classList.remove("show-footer");
    }
  });
}

window.onload = renderFooterOsiguranje;
//-------------------FOOTER

//initialize on page load
document.addEventListener("DOMContentLoaded", renderNavBar);
document.addEventListener("DOMContentLoaded", renderSearchBar);
document.addEventListener("DOMContentLoaded", renderFilterBar);
document.addEventListener("DOMContentLoaded", renderSearchResults);
document.addEventListener("DOMContentLoaded", renderSearchBarProjekti);
document.addEventListener("DOMContentLoaded", renderHeader);
document.addEventListener("DOMContentLoaded", renderHeaderOsiguranje);
document.addEventListener("DOMContentLoaded", renderContactform);
document.addEventListener("DOMContentLoaded", renderTeam);
document.addEventListener("DOMContentLoaded", renderFooter);
document.addEventListener("DOMContentLoaded", renderFooterOsiguranje);
