const apiURL = "http://localhost:5678/api";
let isModalDisplayed = false;

// COLLETIONS

const worksCollection = await getWorks();
const displayedWorks = worksCollection;

// DOM

const gallery = document.getElementById("gallery");
const galleryFilters = document.getElementById("galleryFilters");
const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const navLogin = document.getElementById("navLogin");
const modal = document.getElementById("modal");
const closeModalIcon = document.getElementById("closeModalIcon");
const editButton = document.getElementById("editButton");

// API - GETTER FUNCTIONS

function getWorks() {
  if (isMainPage()) {
    const works = fetch(`${apiURL}/works`)
      .then((res) => res.json())
      .then((data) => {
        return data;
      })
      .catch((err) => console.error(err));
    return works;
  }
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
          <button id=${id} class='basic-button filter-button'>${name}</button>
      `;
    });
    const filterButtons = document.querySelectorAll(".filter-button");
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
  const filterButtons = document.querySelectorAll(".filter-button");
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
    headerEditBar.style.display = "flex";
    editButtons.forEach((button) => {
      button.style.display = "flex";
    });
    editButton.addEventListener("click", toggleModal);
  } else if (!isUserLogged() && headerEditBar) {
    headerEditBar.style.display = "none";
    editButtons.forEach((button) => {
      button.style.display = "none";
    });
  }
}

// MODAL

function toggleModal(event) {
  if (event.target !== modal && event.target !== editButton) {
    event.stopPropagation();
  } else {
    if (isModalDisplayed) {
      modal.style.display = "none";
      isModalDisplayed = false;
    } else {
      modal.style.display = "flex";
      isModalDisplayed = true;
      renderModalWorks();
    }
  }
}

function closeModal() {
  modal.style.display = "none";
  isModalDisplayed = false;
}

function renderModalWorks() {
  const modalList = document.getElementById("modalWorkList");
  modalList.innerHTML = "";
  worksCollection.forEach(({ imageUrl, title, id }) => {
    modalList.innerHTML += `
    <figure class="modal-work" id=${id}>
      <div class="modal-work__trash">
        <i class="fa-solid fa-trash-can"></i>
      </div>
      <img
        width="100%"
        src=${imageUrl}
        alt=${title}
      />
      <figcaption>éditer</figcaption>
    </figure>
    `;
  });
}

// OTHER

function isMainPage() {
  const currentURL = window.location.pathname;
  if (currentURL.includes("login")) {
    return false;
  } else {
    return true;
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
if (closeModalIcon) {
  closeModalIcon.addEventListener("click", closeModal);
}
modal.addEventListener("click", toggleModal);
