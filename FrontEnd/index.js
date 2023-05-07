const gallery = document.getElementById("gallery");
const galleryFilters = document.getElementById("galleryFilters");
const worksCollection = await getWorks();
const displayedWorks = worksCollection;

// API - GETTER FUNCTIONS

function getWorks() {
  const works = fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((err) => console.error(err));
  return works;
}

function getCategories() {
  const categories = fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((err) => console.error(err));
  return categories;
}

// RENDERING FUNCTIONS

async function renderFilters() {
  if (galleryFilters) {
    const categories = await getCategories();
    categories.forEach(({ id, name }) => {
      galleryFilters.innerHTML += `
          <button id=${id} class='basic-button'>${name}</button>
      `;
    });
    const filterButtons = document.querySelectorAll(".basic-button");
    filterButtons.forEach((button) =>
      button.addEventListener("click", onFilterGallery)
    );
  }
}

async function renderGallery(workArray) {
  if (gallery) {
    workArray.forEach(({ imageUrl, title }) => {
      gallery.innerHTML += `
        <figure>
            <img src=${imageUrl} alt=${title}/>
            <figcaption>${title}</figcaption>
        </figure>
        `;
    });
  }
}

// FILTER METHOD

function onFilterGallery({ target }) {
  const buttonId = target.id;
  const filterButtons = document.querySelectorAll(".basic-button");
  filterButtons.forEach((button) => {
    button.classList.remove("button--active");
  });
  gallery.innerHTML = "";
  if (buttonId === "filterAll") {
    document.getElementById(buttonId).classList.add("button--active");
    renderGallery(worksCollection);
  } else {
    document.getElementById(buttonId).classList.add("button--active");
    const filteredGallery = worksCollection.filter(
      (work) => work.categoryId == buttonId
    );
    renderGallery(filteredGallery);
  }
}

// ON LOAD EVENTS
renderGallery(worksCollection);
renderFilters();
