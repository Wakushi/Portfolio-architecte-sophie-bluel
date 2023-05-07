const gallery = document.getElementById("gallery");
const galleryFilters = document.getElementById("galleryFilters");
const worksCollection = await getWorks();

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
        <button id=${id}>${name}</button>
    `;
  });
}

async function renderGallery() {
  worksCollection.forEach(({ imageUrl, title }) => {
    gallery.innerHTML += `
        <figure>
            <img src=${imageUrl} alt=${title}/>
            <figcaption>${title}</figcaption>
        </figure>
        `;
  });
}

renderGallery();
renderFilters();
