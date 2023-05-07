const apiURL = "http://localhost:5678/api";

// COLLETIONS

const worksCollection = await getWorks();
const displayedWorks = worksCollection;

// DOM

const gallery = document.getElementById("gallery");
const galleryFilters = document.getElementById("galleryFilters");
const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const navLogin = document.getElementById("navLogin");

// API - GETTER FUNCTIONS

function getWorks() {
  const works = fetch(`${apiURL}/works`)
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((err) => console.error(err));
  return works;
}

function getCategories() {
  const categories = fetch(`${apiURL}/categories`)
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

// lOGIN METHOD

function login(event) {
  event.preventDefault();
  const email = loginForm.elements.email.value;
  const password = loginForm.elements.password.value;

  const user = {
    email: email,
    password: password,
  };

  fetch(`${apiURL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then((data) => {
      window.location.href = "../index.html";
      localStorage.setItem("token", data.token);
    })
    .catch((err) => {
      console.error(err);
      alert("Incorrect email or password.");
    });
}

function isUserLogged() {
  const storageToken = localStorage.getItem("token");
  if (storageToken) {
    navLogin.innerText = "logout";
    navLogin.addEventListener("click", logOut);
    return true;
  } else {
    navLogin.innerText = "login";
    return false;
  }
}

function logOut() {
  localStorage.clear("token");
}

// EDIT FEATURES

function handleEditButtons() {
  const editButtons = document.querySelectorAll(".edit-button");
  const headerEditBar = document.getElementById("headerEditBar");
  if (isUserLogged()) {
    headerEditBar.style.display = "flex"
    editButtons.forEach((button) => {
      button.style.display = "flex";
    });
  } else {
    headerEditBar.style.display = "none"
    editButtons.forEach((button) => {
      button.style.display = "none";
    });
  }
}

// ON LOAD EVENTS

renderGallery(worksCollection);
renderFilters();
isUserLogged();
if (loginButton) {
  loginButton.addEventListener("click", login);
}
handleEditButtons();
