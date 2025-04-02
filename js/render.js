//display nekretnine details
async function displayNekretnineDetails() {
const nekretninaId = new URLSearchParams(window.location.search).get("id");
const data = await fetchLocalData();

if (!data) return;
const nekretnina = data.estate.find((item) => item.id === nekretninaId);

if (!nekretnina) {
showAlert("Nekretnina not found.", "error");
return;
}

// nekretnina card
const images = nekretnina.images ? nekretnina.images.slice(0, 5) : [];
const div = document.createElement("div");
div.classList.add("details-card");
div.innerHTML = `
<div class="container">
<div class="card-top-container">
    <div class="card-title">
    <div class="flex">
    <h5>${nekretnina.category}</h5>
      <div class="line"></div>
    <h5>${nekretnina.type}</h5>
      </div>
    <div class="column">
    <h1>${nekretnina.title}</h1>
    <h1>${nekretnina.location}</h1>
      </div>
    </div>
    <div class="column-info">
  <div class="list-group">
    <ul>
    <li><p>Cijena:</p><p>$${addCommasToNumber(nekretnina.price)}</p></li> 
    <li><p>Površina:</p><p>${nekretnina.size}</p></li> 
    <li><p>Broj soba:</p><p>${nekretnina.rooms}</p></li> 
    <li><p>Bazen:</p><p>${nekretnina.pool ? "Da" : "Ne"}</p></li> 
    <li><p>Parking:</p><p>${nekretnina.parking ? "Da" : "Ne"}</p></li> 
    <li><p>Id nekretnine:</p><p>${nekretnina.id}</p></li> 
  </ul>
</div>
  <div class="flex">
        <a href="kontakt.html" class="btn">Kontaktirajte nas</a>
  </div>
  </div>
</div>
</div>
<div class="long-line"></div>
    <div class="container">
<div class="nekretnina-details">
<div class="property-info">
<div class="box">
<div class="flex">
<div> ${nekretnina.category}</div> 
<svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.125 11.5002L7.875 7.40927L4.125 3.31836L4.125 11.5002Z" fill="rgba(0, 0, 0, 0.50)" fill-opacity="0.5"/>
</svg> 
<div>${nekretnina.title}, ${nekretnina.location}</div>    
    </div>
</div>
</div>
    <div class="grid">
${images.map((image, index) => `
<div class="image-wrapper">
<img src="${image}" alt="Property Image">
${index === 0 ? `
  <a href="gallery.html?id=${nekretnina.id}" class="btn">
    <img class="icon-img" src="../img/search.png" alt="Logo">
    <h5> Pogledaj galeriju</h5>
  </a>` : ''}
</div>
`).join('')}
</div>
<div class="details-bottom">
  ${nekretnina.description || "No description available."}
    <h4>Opis nekretnine</h4>
  <div class="list-group">
  <ul>
    <li><p>Cijena:</p><p>$${addCommasToNumber(nekretnina.price)}</p></li> 
    <li><p>Tip nekretnine:</p><p>${nekretnina.type}</p></li> 
    <li><p>Kategorija:</p><p>${nekretnina.category}</p></li> 
    <li><p>Površina:</p><p>${nekretnina.size}</p></li> 
    <li><p>Broj soba:</p><p> ${nekretnina.rooms}</p></li> 
    <li><p>Id nekretnine:</p><p> ${nekretnina.id}</p></li> 
    <li><p>Bazen:</p><p>${nekretnina.pool ? "Da" : "Ne"}</p></li> 
    <li><p>Parking:</p><p>${nekretnina.parking ? "Da" : "Ne"}</p></li> 
  </div>
  </ul>
  <div class="details-bottom-map">
    <iframe 
      width="100%" 
      height="400" 
      src="${nekretnina.map}" 
      frameborder="0" 
      style="border:0" 
      allowfullscreen>
    </iframe>
  </div>
</div>
</div>
</div>
</div>
  <div class="inquiry" id="kontakt">
<div class="container">
<div class="grid">
<div class="column">
  <div class="text">
  <h5>Contact Agent</h5>
  <h2>Property request</h2>
  <p>Avg. responding time is 8 working hours. 
  </p>
  <p>Our working time Mon - Frid (8:00 - 16:00)</p>
      </div>
  <div class="contact-form">
    <div class="form-container">
<form role="form" enctype="multipart/form-data" method="POST" class="form">
    <input type="hidden" name="property_id" value="${nekretnina.id}">
      <div class="flex">
    <div class="input-data">
    <input type="text" name="name" id="username" placeholder="Enter your name..."></div>
    <div class="input-data">
    <input type="text" name="surname" id="surname"  placeholder="Enter your surname...">
  </div>
</div>
<div class="input-data">
  <input name="email" id="email" type="text" placeholder="Enter your email...">
</div>
  <div class="input-data">
    <input name="telefon" id="telefon" type="text" placeholder="Enter your phone...">
  </div>
    <div class="textarea" >
    <div class="input-data">
    <textarea name="message" id="message" placeholder="Enter your name..."></textarea>
    </div>
    </div>
    <div class="input-data">
      <input type="submit" class="btn-primary" value="Contact Agent" name="submit" >
    </div>
    </form>
    <p>By clicking on “Send message” you agree with our Terms and Conditions, meaning you agree to get back in touch with you based on provided infomations based filling your forms.</p>
    </div>
</div>
</div>
<div class="column">
<div class="content">
<img src="${nekretnina.images[0]}" alt="">
<div class="text">
  <h5>Meet Filip</h5>
  <p>“As your agent I am ready to help you find your future living. There are no barriers. I will find your dream house for you.”</p>
  <div class="flex">
    <div class="btn-empty">Our Mission</div>
    <div class="btn-empty">Our Team</div>
  </div>
</div>
</div>
</div>
</div>
</div>`;
document.querySelector("#nekretnina-details").appendChild(div);
}
document.addEventListener('DOMContentLoaded', renderNavBar);
document.addEventListener('DOMContentLoaded', renderSearchBar);
document.addEventListener('DOMContentLoaded', renderHeader);
document.addEventListener('DOMContentLoaded', renderFooter);
//NAVIGATION  START
function renderNavBar() {
const navBarHTML = `
  <nav id="navbar" class="navigation">
      <div class="navbar">
      <a href="index.html" class="logo">
      <img src="../img/logo.png" alt="Logo">
      </a>

      <nav class="nav desktop-nav">
      <ul class="nav_list">
      <li class="nav_item">
        <a class="nav_link" href="landing.html">Landing</a>
      </li>
      <li class="nav_item">
        <a class="nav_link" href="index.html">Naslovna</a>
      </li>
      <li class="nav_item">
        <a class="nav_link" href="prodaja.html">Prodaja</a>
      </li>
      <li class="nav_item">
        <a class="nav_link" href="najam.html">Najam</a>
      </li>
      <li class="nav_item">
        <a class="nav_link" href="onama.html">O nama</a>
      </li>
      <li class="nav_item">
        <a class="nav_link" href="kontakt.html">Kontakt</a>
      </li>
      </ul>
      </nav>
      
      <!-- Dropdown Container -->
       <div class="mobile-container">
      <div class="dropdown">
        <button class="dropdown-btn">Select an option ▼</button>
        <div class="dropdown-menu">
          <a href="all.html">Osiguranje</a>
        </div>
        </div>
      
      <!--  toggle -->
      <div class="mobile-menu-toggle" onclick="toggleNav()">
      <div class="hamburger">
      <svg
        class="line"
        width="18"
        height="2"
        viewBox="0 0 18 2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <rect width="18" height="2" fill="#2A71BF" />
      </svg>
      <svg
        class="line"
        width="18"
        height="2"
        viewBox="0 0 18 2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <rect width="18" height="2" fill="#2A71BF" />
      </svg>
      </div>
      </div>
      </div>
    
      </nav>
      
      <!--  toggle -->
      <div id="toggleMobileNav" class="overlay">
      <div class="overlay-content">
      <nav class="mobile-nav">
      <ul class="nav_list">
      <li class="nav_item">
        <a class="nav_link" href="landing.html">Landing</a>
      </li>
      <li class="nav_item">
        <a class="nav_link" href="index.html">Naslovna</a>
      </li>
      <li class="nav_item">
        <a class="nav_link" href="prodaja.html">Prodaja</a>
      </li>
      <li class="nav_item">
        <a class="nav_link" href="najam.html">Najam</a>
      </li>
      <li class="nav_item">
        <a class="nav_link" href="onama.html">O nama</a>
      </li>
      <li class="nav_item">
        <a class="nav_link" href="kontakt.html">Kontakt</a>
      </li>
      </ul>
      </nav>
      <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">
      </a>
      </div>
      </div>
`;
const container = document.getElementById("navbar-container");
if (container) {
container.innerHTML = navBarHTML;
}
attachDropdownEvents();
}
function attachDropdownEvents() {
  const dropdown = document.querySelector(".dropdown");
  const dropdownBtn = document.querySelector(".dropdown-btn");

  if (dropdownBtn) {
    dropdownBtn.addEventListener("click", function (event) {
      dropdown.classList.toggle("show");
      event.stopPropagation(); // Prevent closing immediately
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove("show");
      }
    });
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
function renderHeader(){
const headerHTML = `
<header class="showcase">
<div class="showcase">
<div class="container">
<div class="left-section">
<div class="content">
<h1>Sigurno dobar <span class="lead-text">odabir</span>.</h1>
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
<p>ZIHER najbolja agencija za traženje kuća i stanova za vaš budući život!
</p>
</div>
</div>
</div>
</div>
</div>
</header>
`;

const container = document.getElementById('header-container'); 
if (container) {
container.innerHTML = headerHTML;
}
}
 //------------------------------------------------------------------------SEARCHBAR
function renderSearchBar() {
  const searchBarHTML = `
  <section class="section-ponuda-showcase">
  <div class="container">
  <div class="search-bar">
  <div id="alert"></div>
  
  <form action="/search.html" class="search-form" method="GET">
  <div class="filter-items">
  
  <div class="select-row">
  
  <div class="custom-select">
  <small>Vrsta</small>
    <select name="type" id="type-nekretnina">
      <option value="">Vrsta</option>
      <option value="Prodaja">Prodaja</option>
      <option value="Najam">Najam</option>
    </select>
          <div class="arrow">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3.75 7.5L10 13.75L16.25 7.5H3.75Z" fill="#026451"/>
  </svg></div>
  </div>
  
    <div class="custom-select">
            <small>Tip</small>
    <select name="category" id="category-nekretnina">
      <option value="">Tip</option>
      <option value="Stan">Stan</option>
      <option value="Kuća">Kuća</option>
    </select>
            <div class="arrow">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3.75 7.5L10 13.75L16.25 7.5H3.75Z" fill="#026451"/>
  </svg></div>
  </div>
  
    <div class="custom-select">
            <small>Broj Soba</small>
    <select name="rooms" id="rooms-number">
      <option value="">Sobe</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>
            <div class="arrow">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3.75 7.5L10 13.75L16.25 7.5H3.75Z" fill="#026451"/>
  </svg></div>
  </div>
  
  <div class="custom-select">
          <small>Lokacija</small>
    <select name="location" id="location-nekretnina">
        <option value="">Lokacija</option>
      <option value="Zagreb">Zagreb</option>
      <option value="Split">Split</option>
    </select>
            <div class="arrow">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3.75 7.5L10 13.75L16.25 7.5H3.75Z" fill="#026451"/>
  </svg></div>
  </div>
  
  <div class="search-flex">
    <button class="btn" type="submit">
      <div class="flex">
      <i class="fas fa-search"></i>
      <h5>Pretraži</h5> 
      </div>
    </button>
          <input type="text" placeholder="Search by Location..." name="search-term" id="search-term" />
  </div>
  </div>
  <div class="additional">
      <div class="wrapper">
        <div class="search">
      <input class="id-search" type="text" name="search-id" id="search-id" placeholder="ID nekretnine" />
        </div>
 
   
  <div class="price-range">
    <input type="number" name="min-price" id="min-price" placeholder="Min price" />
    <input type="number" name="max-price" id="max-price" placeholder="Max price" />
  </div>
    </div>
   <div class="wrapper">
  <div class="surface-range">
    <input type="number" name="min-surface" id="min-surface" placeholder="Min surface (m²)" />
    <input type="number" name="max-surface" id="max-surface" placeholder="Max surface (m²)" />
  </div>
  <div class="checkbox-column">
    <div class="checkbox-option">
      <input type="checkbox" name="pool" id="pool-checkbox" value="true" />
      <label for="pool-checkbox">Bazen</label>
    </div>
    <div class="checkbox-option">
      <input type="checkbox" name="parking" id="parking-checkbox" value="true" />
      <label for="parking-checkbox">Parking</label>
    </div>
  </div>
    </div>
  </div>
  </div>
  </form>
  </div>
  </div>
  </section>
  `;
  
  const container = document.getElementById('search-bar-container');
  if (container) {
  container.innerHTML = searchBarHTML;
  
  initializeCustomSelects();  
  }
  }
  //initialize on page load
  document.addEventListener("DOMContentLoaded", renderSearchBar);
  
  function initializeCustomSelects() {
  const x = document.getElementsByClassName("custom-select");
  const l = x.length;
  
  //Loop through each custom select element and initialize
  for (let i = 0; i < l; i++) {
  const selElmnt = x[i].getElementsByTagName("select")[0];
  const ll = selElmnt.length;
  const a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  
  const b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (let j = 1; j < ll; j++) {
  const c = document.createElement("DIV");
  c.innerHTML = selElmnt.options[j].innerHTML;
  c.addEventListener("click", function (e) {
  let y, i, k, s, h, sl, yl;
  s = this.parentNode.parentNode.getElementsByTagName("select")[0];
  sl = s.length;
  h = this.parentNode.previousSibling;
  for (let i = 0; i < sl; i++) {
  if (s.options[i].innerHTML == this.innerHTML) {
  s.selectedIndex = i;
  h.innerHTML = this.innerHTML;
  const y = this.parentNode.getElementsByClassName("same-as-selected");
  const yl = y.length;
  for (let k = 0; k < yl; k++) {
  y[k].removeAttribute("class");
  }
  this.setAttribute("class", "same-as-selected");
  break;
  }
  }
  h.click();
  });
  b.appendChild(c);
  }
  x[i].appendChild(b);
  
  
  a.addEventListener("click", function (e) {
  e.stopPropagation();
  closeAllSelect(this); // Close others when clicking one
  this.nextSibling.classList.toggle("select-hide");
  this.classList.toggle("select-arrow-active");
  });
  }
  
  document.addEventListener("click", closeAllSelect);
  }
  function closeAllSelect(elmnt) {
  const x = document.getElementsByClassName("select-items");
  const y = document.getElementsByClassName("select-selected");
  const xl = x.length;
  const yl = y.length;
  const arrNo = [];
  for (let i = 0; i < yl; i++) {
  if (elmnt == y[i]) {
  arrNo.push(i);
  } else {
  y[i].classList.remove("select-arrow-active");
  }
  }
  for (let i = 0; i < xl; i++) {
  if (arrNo.indexOf(i) === -1) {
  x[i].classList.add("select-hide");
  }
  }
  }
  //------------------------------------------------------------------------SEARCHBAR END

//-------------------GALLERY
async function displayGalleryPage() {
  const nekretninaId = new URLSearchParams(window.location.search).get("id");
  const data = await fetchLocalData();
  if (!data) {
      console.error('No data available');
      return;
  }
  const nekretnina = data.estate.find((item) => item.id === nekretninaId);
  if (!nekretnina) {
      console.error('Nekretnina not found.');
      return;
  }
  if (!nekretnina.images || nekretnina.images.length === 0) {
      console.error('No images found for this property.');
      return;
  }
  // Create gallery HTML content
  const div = document.createElement("div");
  div.classList.add("gallery-page");
  div.innerHTML = `
      <div class="container">
          <h1>Galerija Slika</h1>
          <div class="grid gallery">
              ${nekretnina.images.map(image => `
                  <a href="${image}" class="gallery-item">
                      <img src="${image}" alt="Property Image">
                  </a>
              `).join('')}
          </div>
      </div>
  `;
  document.querySelector("#gallery-container").innerHTML = ""; // Clear previous content
  document.querySelector("#gallery-container").appendChild(div);
  setTimeout(() => {
      new SimpleLightbox('.gallery a', {
          captions: true,
          captionsData: "alt",
          captionDelay: 250,
      });
  }, 100);
};
//-------------------GALLERY
//-------------------TEAM
function renderTeam(){
const TeamHTML = `
<section class="contact-team">
<div class="container">
  <div class="title">
    <h3>Contact our Team</h3>
  </div>
  
  <div class="grid">
    <div class="box">
      <h4>Contact us</h4>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque assumenda ad eius ut dolorem eveniet nobis quam officiis labore nisi!</p>
      <div class="btn" href="">Contact</div>
    </div>
    <div class="box">
      <h4>Call us</h4>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque assumenda ad eius ut dolorem eveniet nobis quam officiis labore nisi!</p>
      <a class="btn-empty" href="">
      <div class="flex">+1 234 567 893<img class="icon-img" src="../img/arrowblack.png" alt="arrow">
      </div>
    </a>
    </div>
    <div class="box">
      <h4>Mail us</h4>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque assumenda ad eius ut dolorem eveniet nobis quam officiis labore nisi!</p>
      <a class="btn-empty" href="">
      <div class="flex">support@ziher.com<img class="icon-img" src="../img/arrowblack.png" alt="arrow">
      </div>
    </a>
    </div>
  </div>
</div>
</section>
`;

const container = document.getElementById('contact-team-container'); 
if (container) {
  container.innerHTML = TeamHTML;
}
}
//-------------------TEAM
//-------------------FOOTER
function renderFooter() {
const footerHTML = `
<div class="footer-top">
  <div class="container">
    <span class="logo-img">
      <img src="../img/logo.png" alt="Logo">
      </span>
  </div>
</div>
  <section class="footer">
<div class="container">
  <div class="grid">
    <div class="box">
      <div class="column">
        <h4>Usluge nekretnina</h4>
        <h1>Nekretnine</h1>
      </div>
    </div>
    <div class="box">
      <div class="column">
        <h5>tekst</h5>
        <h4>tekst</h4>
        <a class="btn-empty" href=""><div class="flex">Pogledaj  stranicu  ZIHER osiguranja
        <img class="icon-img" src="../img/arrowwhite.png" alt="arrow">
        </div>
      </a>
      </div>
    </div>
  </div>
</div>
  </section>
    <div class="footer-bottom">
<div class="container">
  <p>Stranicu izradio: Nianse agency ©, <span id="date"></span></p>
</div>
</div>

`;

const container = document.getElementById("footer-container");
if (container) {
container.innerHTML = footerHTML;
}
}
//-------------------FOOTER
//-------------------ROUTER
function init() {
switch (global.currentPage) {
case "/":
case "/index.html":
renderNavBar();
renderSearchBar();
displayLatestNekretnine();
renderTeam();
renderFooter();
break;
case "/nekretnina-details.html":
renderNavBar();
renderSearchBar();
displayNekretnineDetails();
displayLatestNekretnine();
renderFooter();
break;
case "/search.html":
renderNavBar();
renderSearchBar();
search();
renderFooter();
break;
case "/prodaja.html":
renderNavBar();
renderSearchBar();
displayProdajaNekretnine();
renderFooter();
break;
case "/najam.html":
renderNavBar();
renderSearchBar();
displayNajamNekretnine();
renderFooter();
break;
case "/all.html":
renderNavBar();
renderSearchBar();
displayAllNekretnine();
renderFooter();
break;
case "/gallery.html":
renderNavBar();
renderSearchBar();
renderFooter();
displayGalleryPage()
break;
}

highlightActiveLink();
};
//-------------------GALLERY
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
        updateCards();
        startRotation();
        addHoverListeners(); // Attach hover listeners after loading cards
    } catch (error) {
        console.error("Error fetching properties:", error);
    }
}

function updateCards() {
  for (let i = 0; i < 5; i++) {
      let cardElement = document.getElementById(`card${i + 1}`);
      if (!cardElement) continue; // Skip if element is not found

      let nekretnina = nekretnine[(startIndex + i) % nekretnine.length];

      // Use the reusable generateCard function
      let cardHTML = generateCard(nekretnina);

      cardElement.style.opacity = 0;
      setTimeout(() => {
          cardElement.innerHTML = cardHTML;
          cardElement.style.opacity = 1;
      }, 500);
  }
  startIndex = (startIndex + 1) % (nekretnine.length - 4);
}

function startRotation() {
    interval = setInterval(updateCards, 6000);
}
function stopRotation() {
    clearInterval(interval);
}

// Attach event listeners to all cards
function addHoverListeners() {
    for (let i = 1; i <= 5; i++) {
        let card = document.getElementById(`card${i}`);
        if (card) {
            card.addEventListener("mouseenter", stopRotation);
            card.addEventListener("mouseleave", startRotation);
        }
    }
}

document.addEventListener("DOMContentLoaded", fetchProperties);
