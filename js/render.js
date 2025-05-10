//jedan generate card za sve nekretnine
function generateCard(nekretnina, isTopNekretnina = false) {
  const firstImage = nekretnina.images?.[0] || "../images/no-image.jpg";

  return `
   <a href="nekretnina-details.html?id=${
     nekretnina.id
   }" class="card-link-wrapper">
  <div class="card">
    <img src="${firstImage}" class="card-img-top" alt="${
    nekretnina.title
  }" loading="lazy" />
    <div class="card-body">
      <div class="card-text">
        <small>${nekretnina.type}</small>
        <h5 class="card-title">${nekretnina.title}</h5>
        <div class="column"> 
          <p>${isTopNekretnina ? `${nekretnina.description}` : ""}</p>
          <div class="flex"> 
            <small>
              <img class="icon-img" src="../img/rooms.svg" alt="">
              ${nekretnina.surface} m²
            </small>
            <small> 
              <img class="icon-img" src="../img/euro.svg" alt="">${addCommasToNumber(
                nekretnina.price
              )}
            </small>
          </div>
        </div>
        <div class="long-line"></div>
        <small>
          <div class="flex-icon"> 
            <img class="icon-img" src="../img/place.svg" alt="">
            <p>${nekretnina.location}</p>
          </div>
          ${isTopNekretnina ? `<div class="btn-empty">Vidi Više</div>` : ""}
        </small>
      </div>
    </div>
  </div>
</a>
`;
}
function generateTopNekretnineCard(nekretnina, isTopNekretnina = false) {
  const firstImage = nekretnina.images?.[0] || "../images/no-image.jpg";
  const link = `nekretnina-details.html?id=${nekretnina.id}`;
  return `
  <a href="${link}" class="card card-link-wrapper">
        <img src="${firstImage}" class="card-img-top" alt="${
    nekretnina.title
  }" loading="lazy" />

        <div class="card-body">
            <div class="card-text">
                <small>${nekretnina.type}</small>
                <h5 class="card-title">${nekretnina.title}</h5>
                <div class="column"> 
                    <p>${isTopNekretnina ? `${nekretnina.description}` : ""}</p>
                    <div class="flex"> 
                       <small>
                            <img class="icon-img" src="../img/rooms.svg" alt="">
                            ${nekretnina.surface} m²
                        </small>
                        <small> 
                            <img class="icon-img" src="../img/euro.svg" alt="">${addCommasToNumber(
                              nekretnina.price
                            )}
                        </small>
                    </div>
                </div>
                <div class="long-line"></div>
                <small>
                    <div class="flex-icon"> 
                        <img class="icon-img" src="../img/place.svg" alt="">
                        <p>${nekretnina.location}</p>
                    </div>
                    ${
                      isTopNekretnina
                        ? `<span class="btn-empty">Vidi Više</span>`
                        : ""
                    }
                </small>
            </div>
        </div>
    </a>`;
}
//Projekti generate card za sve projekte
function generateProjektiCard(projekat) {
  const firstImage = projekat.images?.[0] || "./images/no-image.jpg";
  return `
    <div class="projekti-card">
      <a href="projekti-details.html?id=${
        projekat.id
      }" class="projekti-card-link">
             <img src="${firstImage}" class="card-img-top" alt="${
    projekat.title
  }"  loading="lazy"/>
     </a>   
        <div class="card-body">
          <div class="card-text">
            <small>${projekat.type}</small>
            <h5 class="card-title">${projekat.title}</h5>
            <div class="column"> 
              <ul class="card-list">
                <li><p>Broj nekretnina</p>${projekat.propertyNumber}</li>
                <li><p>Površina</p>${projekat.surface}</li>
                <li><p>Cijena</p>${addCommasToNumber(projekat.price)}</li>
                <li><p>Cijena/m2</p>${addCommasToNumber(
                  projekat.priceSurface
                )}</li>
                <li><p>Datum završetka</p>${projekat.date}</li>
              </ul>
              <p class="projekti-description">${projekat.description}</p>
              <div class="long-line"></div>
              <div class="flex"> 
                <small>
                   <div class="flex-icon"> 
                        <img class="icon-img" src="../img/place.svg" alt="">
                        <p>${projekat.location}</p>
                           </div>
                </small>
              </div>
            </div> 
          </div> 
        </div> 
    </div> 
  `;
}
//TOP-NEKRETNINE
let startIndex = 0;
let interval;
let nekretnine = [];

async function fetchProperties() {
  try {
    const response = await fetch("nekretnine.json");
    const data = await response.json();

    if (!data || !data.estate || data.estate.length === 0) {
      console.error("No properties found in JSON.");
      return;
    }
    nekretnine = data.estate;
    topNekretnineCards();
    startRotation();
    addHoverListeners();
  } catch (error) {
    console.error("Error fetching properties:", error);
  }
}

function topNekretnineCards() {
  for (let i = 0; i < 5; i++) {
    let cardElement = document.getElementById(`card${i + 1}`);
    if (!cardElement) continue;

    let nekretnina = nekretnine[(startIndex + i) % nekretnine.length];

    let cardHTML = generateTopNekretnineCard(nekretnina, true);
    cardElement.style.opacity = 0;
    setTimeout(() => {
      cardElement.innerHTML = cardHTML;
      cardElement.style.opacity = 1;
    }, 500);
  }
  startIndex = (startIndex + 1) % (nekretnine.length - 4);
}

function startRotation() {
  interval = setInterval(topNekretnineCards, 6000);
}
function stopRotation() {
  clearInterval(interval);
}

function addHoverListeners() {
  for (let i = 1; i <= 5; i++) {
    let card = document.getElementById(`card${i}`);
    if (!card) continue;
    card.addEventListener("mouseenter", stopRotation);
    card.addEventListener("mouseleave", startRotation);

    card.addEventListener("click", function (e) {
      if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
        e.stopPropagation();

        card.classList.toggle("active");

        document.querySelectorAll(".grid .card").forEach((c) => {
          if (c !== card) c.classList.remove("active");
        });
      }
    });
  }
  document.addEventListener("click", () => {
    document
      .querySelectorAll(".grid .card")
      .forEach((c) => c.classList.remove("active"));
  });
}
document.addEventListener("DOMContentLoaded", fetchProperties);
//TOP-NEKRETNINE

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

  div.addEventListener("click", (e) => {
    const clickedImageLink = e.target.closest("a[data-title]");
    const clickedGalleryBtn = e.target.closest(".gallery-btn");

    if (!clickedImageLink && !clickedGalleryBtn) return;

    e.preventDefault();

    if (!lightboxInstance) {
      lightboxInstance = new SimpleLightbox("a[data-title]", {
        animationSlide: false,
        animationSpeed: 0,
        fadeSpeed: 0,
        closeOnOverlayClick: false,
        disableScroll: true,
      });

      lightboxInstance.on("shown.simplelightbox", () => {
        document.body.classList.add("prevent-clicks");
      });

      lightboxInstance.on("closed.simplelightbox", () => {
        document.body.classList.remove("prevent-clicks");
      });

      lightboxInstance.on("change.simplelightbox", () => {
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
    }
    lightboxInstance.open();
  });

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
          </ul>
        </div>
      </div>
    </div>
    </div>
    </div>
  `;
}
let lightboxInstance = null;

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

  if (remainingImages.length === 4 || remainingImages.length === 5) {
    remainingImages[remainingImages.length - 1].classList.add("stretch-span-1");
  }
}
//-------------------GALLERY
//NAVIGATION  START

const logoSVG = `
<img class="logo-nav" src="img/logo.png" alt="Logo">
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

  const dropdownStyle =
    path.includes("osiguranje.html") ||
    path.includes("onama-osiguranje.html") ||
    path.includes("kontakt-osiguranje.html")
      ? 'style="background-color:#005245;"'
      : "";

  return `
    <div class="custom-select ${
      path.includes("osiguranje") ? "osiguranje-page" : ""
    }" ${dropdownStyle}>
      <small>${currentLabel}</small>
      <select name="${name}" id="${id}">
        <option value="" selected hidden></option>
        ${optionsHTML}
      </select>
      <div class="select-selected">Select Category</div>
      <div class="select-items select-hide">
        ${optionsHTML}
      </div>
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

<div class="menu-toggle" onclick="this.classList.toggle('open')">
  <svg class="icon icon-menu" viewBox="0 0 40 40" width="40" height="40">
    <path d="M6.6665 28.7821V27.1154H33.3332V28.7821H6.6665ZM6.6665 20.8333V19.1666H33.3332V20.8333H6.6665ZM6.6665 12.8846V11.2179H33.3332V12.8846H6.6665Z" fill="#1B1B1B"/>
  </svg>

 <svg class="icon icon-close" viewBox="0 0 40 40" width="40" height="40">
    <path d="M10.6669 30.5129L9.4873 29.3333L18.8206 20L9.4873 10.6667L10.6669 9.48709L20.0002 18.8204L29.3336 9.48709L30.5131 10.6667L21.1798 20L30.5131 29.3333L29.3336 30.5129L20.0002 21.1796L10.6669 30.5129Z" fill="#1B1B1B"/>
  </svg>
</div>
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
                  <ul class="nav-list nav_list-2">
<li><h4>Naše usluge</h4></li>
<li class="nav_item"><a class="nav_link" href="nekretnine.html">Nekretnine</a></li>
<li class="nav_item"><a class="nav_link" href="osiguranje.html">Osiguranje</a></li>
</ul>
        <a href="javascript:void(0)" class="closebtn" onclick="closeNav()"></a>
      </div>
    </div>
    </div>
  `;
}
const navListNekretnineHTML = `
<div class="column">
<ul class="nav_list">
<li class="nav_item"><a class="nav_link" href="onama.html">O nama</a></li>
<li class="nav_item"><a class="nav_link" href="nekretnine.html">Nekretnine</a></li>
<li class="nav_item"><a class="nav_link" href="projekti.html">Projekti</a></li>
<li class="nav_item"><a class="nav_link" href="kontakt.html">Kontakt</a></li>
</ul>

</div>
`;
const navListOsiguranjeHTML = `
<div class="column">
<ul class="nav_list nav_list-osiguranje">
<li class="nav_item"><a class="nav_link" href="onama-osiguranje.html">O nama</a></li>
<li class="nav_item"><a class="nav_link" href="kontakt-osiguranje.html">Kontakt</a></li>
</ul>
</div>
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
  }
  initializeCustomSelects();
  attachDropdownEvents();

  document
    .getElementById("category-select")
    .addEventListener("change", function () {
      const url = this.value;

      const dropdown = this.closest(".custom-select");
      if (dropdown) {
        dropdown.style.visibility = "hidden";
      }
      document.body.classList.add("fade-out");

      setTimeout(() => {
        window.location.href = url;
      }, 10);
    });
}
document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname;

  if (
    path.includes("osiguranje.html") ||
    path.includes("onama-osiguranje.html") ||
    path.includes("kontakt-osiguranje.html")
  ) {
    document.body.classList.add("osiguranje-page");
    logoHTML = `<a href="osiguranje.html" class="logo">${logoSVG}</a>`;
    renderNavBar(navListOsiguranjeHTML);
  } else {
    logoHTML = `<a href="index.html" class="logo">${logoSVG}</a>`;
    renderNavBar(navListNekretnineHTML);
  }
});
function attachDropdownEvents() {
  const dropdown = document.querySelector(".custom-select");
  const dropdownBtn = dropdown ? dropdown.querySelector(".arrow") : null;

  if (dropdown && dropdownBtn) {
    dropdownBtn.addEventListener("click", function (event) {
      event.stopPropagation();

      const optionsContainer = dropdown.querySelector(".select-items");
      if (optionsContainer) {
        optionsContainer.classList.toggle("select-hide");
      }

      dropdown.classList.toggle("select-arrow-active");
    });

    document.addEventListener("click", function (event) {
      if (!dropdown.contains(event.target)) {
        const optionsContainer = dropdown.querySelector(".select-items");
        if (optionsContainer) {
          optionsContainer.classList.add("select-hide");
        }
        dropdown.classList.remove("select-arrow-active");
      }
    });
  }
}
// Toggle mobile
window.toggleNav = () => {
  const navOverlay = document.getElementById("toggleMobileNav");
  const menuToggle = document.querySelector(".menu-toggle");
  if (!navOverlay) return;

  const isOpen = navOverlay.style.height === "100%";
  navOverlay.style.height = isOpen ? "0%" : "100%";
  document.body.classList.toggle("no-scroll", !isOpen);

  if (menuToggle) {
    menuToggle.classList.toggle("open", !isOpen);
  }
};
function closeNav() {
  const navOverlay = document.getElementById("toggleMobileNav");
  const menuToggle = document.querySelector(".menu-toggle");
  if (navOverlay) {
    navOverlay.style.height = "0%";
    document.body.classList.remove("no-scroll");
  }
  if (menuToggle) {
    menuToggle.classList.remove("open");
  }
}
document.addEventListener("click", function (event) {
  const navOverlay = document.getElementById("toggleMobileNav");
  if (!navOverlay) return;

  const isLink = event.target.closest("a");
  const isInsideOverlay = event.target.closest("#toggleMobileNav");
  const isOverlayOpen = navOverlay.style.height === "100%";

  if (isOverlayOpen && isInsideOverlay && !isLink) {
    closeNav();
  }
});

function toggleDropdown(selectWrapper) {
  const selected = selectWrapper.querySelector(".select-selected");
  const optionsContainer = selectWrapper.querySelector(".select-items");

  closeAllSelect(selectWrapper);

  optionsContainer.classList.toggle("select-hide");

  selected.classList.toggle("select-arrow-active");

  const customSelect = selectWrapper.closest(".custom-select");
  if (customSelect) {
    customSelect.classList.toggle("open");
  }
}

function closeAllSelect(current) {
  const customSelects = document.querySelectorAll(".custom-select");

  customSelects.forEach((selectWrapper) => {
    const selected = selectWrapper.querySelector(".select-selected");
    const optionsContainer = selectWrapper.querySelector(".select-items");

    if (current !== selectWrapper) {
      selected.classList.remove("select-arrow-active");
      optionsContainer.classList.add("select-hide");
      selectWrapper.classList.remove("open");
    }
  });
}

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
  let headingText = `100%<br> dobar <span class="lead-text">odabir</span>.`;
  let paragraphText = `<strong>ZIHER</strong> agencija za nekretnine koja razumije vaš budući život.`;

  const path = window.location.pathname.toLowerCase();

  if (path.includes("nekretnine.html") || path.includes("projekti.html")) {
    headingText = `Potražite idealnu <span class="lead-text">nekretninu</span>.`;
    paragraphText = `<strong>ZIHER</strong> agencija za nekretnine koja razumije vaš budući život.`;
  } else if (path.includes("kuce")) {
    headingText = `Nova<br>kuća je <span class="lead-text">blizu</span>.`;
  } else if (path.includes("zemljiste")) {
    headingText = `Pronađite savršeno<br><span class="lead-text">zemljište</span>.`;
  } else if (path.includes("kontakt")) {
    headingText = `Javi nam se,<br>tu smo <span class="lead-text">za vas</span>.`;
  }

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

  const container = document.getElementById("header-container");
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

  const searchBarHTML = `
    <section class="section-search-bar">
      <div class="container">
        <div class="search-bar">
          <div id="alert"></div>
          <form action="/search-projekti.html" class="search-form" method="GET">
            <div class="filter-items">
              <div class="select-row">
                 <div class="search-flex">
                <div class="flex-location-icon">
                  <img src="/img/locationblue.svg" alt="">
                  <small>Lokacija</small>
                  <input type="text" placeholder="Koju lokaciju tražite?" name="search-term" id="search-term" />
                </div>
              </div>
                <div class="box box-projekti">${selectsTop[1]}${selectsTop[0]}</div>
              </div>
                    <div class="flex-end">
              <button class="btn" type="submit">
                  <div class="flex">
                     <img src="/img/search.svg" alt="">
                    <h5>Pretraži</h5>
                  </div>
                </button>
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
                       <img src="/img/search.svg" alt="">
                    <h5>Pretraži</h5>
                  </div>
                </button>
              </div>
              <div class="additional">
                <div class="wrapper">
                  <div class="search">
                    <input class="id-search" type="text" name="search-id" id="search-id" placeholder="ID nekretnine" />
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
          <path d="M3.75 7.5L10 13.75L16.25 7.5H3.75Z" fill="#004f96"/>
        </svg>
      </div>
    </div>
  `;
}

function initializeCustomSelects() {
  const customSelects = document.querySelectorAll(".custom-select");

  customSelects.forEach((selectWrapper) => {
    const select = selectWrapper.querySelector("select");

    selectWrapper
      .querySelectorAll(".select-selected, .select-items")
      .forEach((el) => el.remove());

    const selected = document.createElement("div");
    selected.className = "select-selected";
    selected.textContent = select.options[select.selectedIndex].textContent;

    const optionsContainer = document.createElement("div");
    optionsContainer.className = "select-items select-hide";

    function renderOptions(excludeIndex) {
      optionsContainer.innerHTML = "";

      Array.from(select.options).forEach((option, index) => {
        if (index !== excludeIndex) {
          const optionDiv = document.createElement("div");
          optionDiv.textContent = option.textContent;

          optionDiv.addEventListener("click", () => {
            select.selectedIndex = index;
            selected.textContent = option.textContent;

            renderOptions(index);

            select.dispatchEvent(new Event("change"));
            selected.click();
          });

          optionsContainer.appendChild(optionDiv);
        }
      });
    }

    renderOptions(select.selectedIndex);

    selected.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleDropdown(selectWrapper);
    });

    const arrow = selectWrapper.querySelector(".arrow");
    arrow.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleDropdown(selectWrapper);
    });

    selectWrapper.appendChild(selected);
    selectWrapper.appendChild(optionsContainer);
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".custom-select")) {
      closeAllSelect();
    }
  });
}

//------------------------------------------------------------------------SEARCHBAR END
//------------------------------------------------------------------------FILTERHBAR
function renderFilterBar() {
  const filterBarHTML = `
     <section class="section-filter-bar">
          <div class="container">
          <p>Recite nam što tražite</p>
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
                    <path d="M3.75 7.5L10 13.75L16.25 7.5H3.75Z" fill="#004f96"/>
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
                  <path d="M3.75 7.5L10 13.75L16.25 7.5H3.75Z" fill="#004f96"/>
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
                  <path d="M3.75 7.5L10 13.75L16.25 7.5H3.75Z" fill="#004f96"/>
                  </svg>
                </div>
                </div>
           </div>
          <div class="container">
            <div id="propertyGrid" class="grid"></div>
            <div class="flex-total">
            <p>Imamo preko <span class="lead-text total-number"></span> <span class="lead-text">nekretnina</span> za život u našoj bazi podataka</p>
              <button class="flex-btn btn-empty" type="submit">Vidi sve<img class="icon-img" src="../img/arrowblack.png" alt="arrow">
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
          <p>Pronađite savršen dom za vaš životni stil.</p>
          <a class="btn-empty" href="search-filter.html?category=Ku%C4%87a">
            <div class="flex-btn">Vidi sve<img class="icon-img" src="../img/arrowblack.png" alt="arrow">
            </div>
          </a>
        </div>
        <div class="box">
          <h3>Stanovi</h3>
          <p>Stanovi koji odgovaraju vašim željama i potrebama.</p>
          <a class="btn-empty" href="search-filter.html?category=Stan">
            <div class="flex-btn">Vidi sve<img class="icon-img" src="../img/arrowblack.png" alt="arrow">
            </div>
          </a>
        </div>
        <div class="box">
          <h3>Zemljišta</h3>
          <p>Zemljišta s potencijalom za vašu budućnost.</p>
          <a class="btn-empty" href="search-filter.html?category=Zemlji%C5%A1te">
            <div class="flex-btn">Vidi sve<img class="icon-img" src="../img/arrowblack.png" alt="arrow">
            </div>
          </a>
        </div>
        <div class="box">
          <h3>Poslovni prostori</h3>
          <p>Pronađite vaš idealan poslovni prostor.</p>
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
  const SearchResultsHTML = `
  <div class="search-results">
    <div class="container">
      <div class="flex pb-48">
        <h1>Rezultati pretraživanja</h1>
        <div class="flex-total">
          <p>Imamo preko <span class="lead-text total-number"></span> <span class="lead-text">nekretnina</span>  za vas</p>
        </div>
      </div>
    <div id="search-results" class="grid"></div>
    <div id="pagination"></div>
`;

  const container = document.getElementById("search-results-container");
  if (container) {
    container.innerHTML = SearchResultsHTML;
    initializeCustomSelects();
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
function renderTeam({
  containerId = "contact-team-container",
  showEmail = true,
  showQuery = true,
} = {}) {
  const currentPage = window.location.pathname.split("/").pop();

  const isKontakt = currentPage === "kontakt.html";
  const isKontaktOsiguranje = currentPage === "kontakt-osiguranje.html";

  if (isKontakt || isKontaktOsiguranje) {
    showQuery = false;
    showEmail = true;
  }

  const heading = isKontaktOsiguranje
    ? "Kontaktiraj nas!"
    : "Obratite nam se s povjerenjem!";

  const queryText = isKontaktOsiguranje
    ? "Niste sigurni koje osiguranje vam treba? Pišite nam preko weba – zajedno ćemo pronaći najbolje osiguranje za vas."
    : "Niste sigurni odakle krenuti? Pišite nam preko našeg weba – zajedno ćemo naći pravi prostor za vas.";

  const btnClass = isKontaktOsiguranje ? "btn btn-green" : "btn btn-primary";

  let boxes = "";
  if (showQuery) {
    boxes += `
      <div class="box">
        <h3>Pošaljite upit</h3>
        <p id="contact-query-text">${queryText}</p>
        <a class="${btnClass}" href="kontakt.html">Pošaljite upit</a>
      </div>
    `;
  }
  boxes += `
    <div class="box">
      <h3>Nazovite nas</h3>
      <p>Slobodno nas nazovite tijekom radnog vremena. PON – SUB (08:00 – 20:00). Rado ćemo odgovoriti na sva vaša pitanja.</p>
      <a class="btn-empty" href="tel:+385 98 359 876">
        <div class="flex-btn">
          +385 98 359 876
          <img class="icon-img" src="../img/arrowblack.png" alt="arrow">
        </div>
      </a>
    </div>
  `;
  if (showEmail) {
    boxes += `
      <div class="box">
        <h3>Pošaljite e-mail</h3>
        <p>Nema potrebe za ispunjavanjem obrazaca. Skočite na vaš e-mail i pošaljite nam što god trebate. Tu smo da pomognemo.</p>
        <a class="btn-empty" href="mailto:ivor@ziher-partner.hr">
          <div class="flex-btn">
            ivor@ziher-partner.hr
            <img class="icon-img" src="../img/arrowblack.png" alt="arrow">
          </div>
        </a>
      </div>
    `;
  }

  const TeamHTML = `
    <section class="contact-team">
      <div class="container">
        <div class="title">
          <h6>${heading}</h6>
        </div>
        <div class="grid">
          ${boxes}
        </div>
      </div>
    </section>
  `;

  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = TeamHTML;
  }
}

function renderContactform() {
  const path = window.location.pathname;
  const isOsiguranjePage = path.includes("osiguranje");

  const buttonClass = isOsiguranjePage ? "btn-green" : "btn-blue";

  const imageSrc = isOsiguranjePage
    ? "img/sloganzelena.png"
    : "img/sloganplava.png";

  const TeamHTML = `
    <div class="container">
      <div class="grid">
        <div class="column">
          <div class="text">
            <p>Prosječno vrijeme odgovora je 24 sata. <br>Radno vrijeme: PON – SUB (08:00 – 20:00)</p>
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
                <div class="textarea">
                  <div class="input-data">
                    <textarea name="message" id="message" placeholder="Upit"></textarea>
                  </div>
                </div>
                <div class="input-data">
                  <input type="submit" class="${buttonClass}" value="Pošaljite upit" name="submit">
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="content">
        <img src="${imageSrc}" alt="Kontakt Slogan">
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
  const currentPage = window.location.pathname;
  const isOsiguranje = currentPage.includes("osiguranje");

  const topNavLinks = isOsiguranje
    ? `
      <ul class="nav_list osiguranje-nav">
        <li class="nav_item">
          <a class="h8 nav_link" href="O nama.html">O nama</a>
        </li>
        <li><img src="/img/dot.svg" alt="dot"></li>
        <li class="nav_item">
          <a class="h8 nav_link" href="index.html">Naslovna</a>
        </li>
      </ul>`
    : `
      <ul class="nav_list">
        <li class="nav_item">
          <a class="h8 nav_link" href="O nama.html">O nama</a>
        </li>
        <li><img src="/img/dot.svg" alt="dot"></li>
        <li class="nav_item">
          <a class="h8 nav_link" href="index.html">Naslovna</a>
        </li>
        <li><img src="/img/dot.svg" alt="dot"></li>
        <li class="nav_item">
          <a class="h8 nav_link" href="nekretnine.html">Nekretnine</a>
        </li>
        <li><img src="/img/dot.svg" alt="dot"></li>
        <li class="nav_item">
          <a class="h8 nav_link" href="projekti.html">Projekti</a>
        </li>
        <li><img src="/img/dot.svg" alt="dot"></li>
        <li class="nav_item">
          <a class="h8 nav_link" href="kontakt.html">Kontakt</a>
        </li>
      </ul>`;

  const bottomSectionContent = isOsiguranje
    ? {
        title: "Nekretnine",
        description: "Otkrijte našu ponudu nekretnina. Sigurno dobar odabir.",
        buttonText: "Pogledajte stranicu ZIHER nekretnina",
        link: "nekretnine.html",
      }
    : {
        title: "Osiguranje",
        description:
          "Otkrijte našu ponudu osiguranja. Pametan korak za bolju budućnost.",
        buttonText: "Pogledajte stranicu ZIHER osiguranje",
        link: "osiguranje.html",
      };

  const bottomSection = `
    <section class="footer-bottom ${isOsiguranje ? "blue" : ""}">
      <div class="container">
        <div class="grid">
          <div class="box">
            <div class="column">
              <h1>${bottomSectionContent.title}</h1>
            </div>
          </div>
          <div class="box">
            <div class="column">
              <p>${bottomSectionContent.description}</p>
              <a class="btn-empty" href="${bottomSectionContent.link}">
                <div class="flex-btn">${bottomSectionContent.buttonText}
                  <img class="icon-img" src="../img/arrowwhite.png" alt="arrow">
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>`;

  const footerHTML = `
    <div class="footer-top">
      <div class="container">
        <div class="footer-nav">
          ${topNavLinks}
        </div>
        <span class="logo-img">
          <img src="/img/logo.svg" alt="Logo">
        </span>
         <div class="flex">
         <p>© 2025 ZIHER</p>
         <ul>
          <li class="nav_item">
          <a class="nav_link" href="">Pravila privatnosti</a>
        </li>
      </ul>
      </div>
      </div>
    </div>
    ${bottomSection}
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
//-------------------FOOTER

document.addEventListener("DOMContentLoaded", renderNavBar);
document.addEventListener("DOMContentLoaded", renderSearchBar);
document.addEventListener("DOMContentLoaded", renderFilterBar);
document.addEventListener("DOMContentLoaded", renderSearchResults);
document.addEventListener("DOMContentLoaded", renderSearchBarProjekti);
document.addEventListener("DOMContentLoaded", renderHeader);
document.addEventListener("DOMContentLoaded", renderContactform);
document.addEventListener("DOMContentLoaded", renderTeam);
document.addEventListener("DOMContentLoaded", renderFooter);

function init() {
  switch (global.currentPage) {
    case "/":
    case "/landing.html":
      break;
    case "/index.html":
      renderNavBar(navListNekretnineHTML);
      renderFilterBar();
      displayLatestNekretnine();
      renderTeam();
      renderFooter();
      break;
    case "/nekretnina-details.html":
      renderNavBar(navListNekretnineHTML);
      renderSearchBar();
      displayNekretnineDetails();
      displayLatestNekretnine();
      renderTeam();
      renderFooter();
      break;
    case "/projekti-details.html":
      renderNavBar(navListNekretnineHTML);
      renderSearchBar();
      displayProjektiDetails();
      displayLatestProjekti();
      renderTeam();
      renderFooter();
      break;
    case "/search.html":
      renderNavBar(navListNekretnineHTML);
      renderSearchBar();
      renderSearchResults();
      search();
      renderFooter();
      break;
    case "/search-projekti.html":
      renderNavBar(navListNekretnineHTML);
      renderSearchBarProjekti();
      searchProjekti();
      renderFooter();
      break;
    case "/search-filter.html":
      renderNavBar(navListNekretnineHTML);
      renderSearchBar();
      renderSearchResults();
      search();
      renderFooter();
      break;
    case "/nekretnine.html":
      renderNavBar(navListNekretnineHTML);
      renderSearchBar();
      displayAllNekretnine();
      renderTeam();
      renderFooter();
      break;
    case "/projekti.html":
      renderNavBar(navListNekretnineHTML);
      renderSearchBarProjekti();
      displayProjekti();
      renderTeam();
      renderFooter();
      break;
    case "/onama.html":
      renderNavBar(navListNekretnineHTML);
      renderTeam();
      renderFooter();
      break;
    case "/onama-osiguranje.html":
      renderNavBar(navListOsiguranjeHTML);
      renderTeam();
      renderFooter();
      break;
    case "/osiguranje.html":
      renderNavBar(navListOsiguranjeHTML);
      renderHeader();
      renderTeam();
      renderFooter();
      break;
    case "/kontakt.html":
      renderNavBar(navListNekretnineHTML);
      renderHeader();
      renderContactform();
      renderTeam();
      renderFooter();
      break;
    case "/kontakt-osiguranje.html":
      renderNavBar(navListOsiguranjeHTML);
      renderContactform();
      renderTeam();
      renderFooter();
      break;
  }

  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener(
    "touchstart",
    function () {
      document.body.classList.add("no-hover");
    },
    { once: true }
  );
});

//FORM
$(document).ready(function () {
  const $loader = $("#loader").hide();
  const $messageContainer = $("#messageContainer");

  function applyValidation($form) {
    const fields = ["name", "surname", "email", "telefon", "message"];

    $form.validate({
      rules: fields.reduce((acc, field) => {
        acc[field] = { required: true };
        if (field === "email") acc[field].email = true;
        return acc;
      }, {}),
      messages: fields.reduce((acc, field) => {
        acc[field] = `Please enter your ${
          field === "telefon" ? "phone number" : field
        }`;
        return acc;
      }, {}),
    });

    $form.ajaxForm({
      dataType: "json",
      beforeSubmit: function () {
        if (!$form.valid()) return false;
        $loader.show();
      },
      success: function () {
        showMessage("Message sent successfully!", "success");
      },
      error: function () {
        showMessage("Mail failed, try again", "danger");
      },
    });
  }

  function showMessage(message, type) {
    $loader.hide();
    $messageContainer
      .removeClass("alert-success alert-danger")
      .addClass(`alert-${type}`)
      .text(message)
      .show();
    setTimeout(() => $messageContainer.hide(), 3000);
  }

  const $kontaktForm = $("#kontakt .form");
  if ($kontaktForm.length) {
    applyValidation($kontaktForm);
    $.data($kontaktForm[0], "validated", true);
  }
});

//FORM
function showAlert(message, className = "error") {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEl);
  setTimeout(() => alertEl.remove(), 3000);
}
function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ACCORDION
let accordions = document.querySelectorAll(".accordion-wrapper .accordion");
accordions.forEach((acco) => {
  acco.addEventListener("click", () => {
    acco.classList.toggle("active");
    let content = acco.nextElementSibling;
    if (content) {
      if (acco.classList.contains("active")) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = null;
      }
    }
    accordions.forEach((otherAcco) => {
      if (otherAcco !== acco && otherAcco.classList.contains("active")) {
        otherAcco.classList.remove("active");
        let otherContent = otherAcco.nextElementSibling;
        if (otherContent) {
          otherContent.style.maxHeight = null;
        }
      }
    });
  });
});
