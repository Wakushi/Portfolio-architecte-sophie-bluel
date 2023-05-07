const gallery = document.getElementById("gallery");
const galleryFilters = document.getElementById("galleryFilters");
const worksCollection = await getWorks();
const displayedWorks = worksCollection;

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

async function renderFilters() {
  const categories = await getCategories();
  categories.forEach(({ id, name }) => {
    galleryFilters.innerHTML += `
        <button id=${id} class='filter-button'>${name}</button>
    `;
  });
  const filterButtons = document.querySelectorAll(".filter-button");
  filterButtons.forEach((button) =>
    button.addEventListener("click", onFilterGallery)
  );
}

async function renderGallery(workArray) {
  workArray.forEach(({ imageUrl, title }) => {
    gallery.innerHTML += `
        <figure>
            <img src=${imageUrl} alt=${title}/>
            <figcaption>${title}</figcaption>
        </figure>
        `;
  });
}

function onFilterGallery({ target }) {
  const buttonId = target.id;
  const filterButtons = document.querySelectorAll(".filter-button");
  filterButtons.forEach((button) => {
    button.classList.remove("filter--active");
  });
  gallery.innerHTML = "";
  if (buttonId === "filterAll") {
    document.getElementById(buttonId).classList.add("filter--active");
    renderGallery(worksCollection);
  } else {
    document.getElementById(buttonId).classList.add("filter--active");
    const filteredGallery = worksCollection.filter(
      (work) => work.categoryId == buttonId
    );
    renderGallery(filteredGallery);
  }
}

// ON LOAD EVENTS
renderGallery(worksCollection);
renderFilters();
