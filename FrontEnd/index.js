// VARIABLES

const apiURL = "http://localhost:5678/api";
let worksCollection = await getWorks();
let isModalDisplayed = false;
let selectedImage;
let selectedWorkId;

// DOM

const gallery = document.getElementById("gallery");
const galleryFilters = document.getElementById("galleryFilters");
const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const navLogin = document.getElementById("navLogin");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const editButton = document.getElementById("editButton");
const confirmModal = document.getElementById("confirmModal");
const confirmModalCloseBtn = document.getElementById("confirmModalCloseBtn");
const confirmDeletionBtn = document.getElementById("confirmDeletionBtn");

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
  let categoryMap = new Map();
  worksCollection.forEach((work) => {
    categoryMap.set(work.category.id, work.category.name);
  });
  return categoryMap;
}

// RENDERING FUNCTIONS

async function renderFilters() {
  if (galleryFilters) {
    getCategories().forEach((name, id) => {
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

function renderGallery(workArray) {
  if (gallery) {
    gallery.innerHTML = "";
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

// AUTH METHOD

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

// PAGE EDIT FEATURES

function handleEditButtonsRender() {
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

// WORKS EDIT MODAL

const landingModalContent = `
    <i id="closeModalIcon" class="fa-solid fa-xmark"></i>
    <h2>Galerie photo</h2>
    <section id="modalWorkList" class="modal-work-list"></section>
    <button id="addWorkButton" class="basic-button">Ajouter une photo</button>
    <button id="deleteGalleryBtn">Supprimer la galerie</button>`;

const modalFormContent = `
    <i id="returnModalIcon" class="fa-solid fa-arrow-left"></i>
    <i id="closeModalIcon" class="fa-solid fa-xmark"></i>
    <h2>Ajout Photo</h2>
    <form id="addWorkForm" class="basic-form">
      <section id="modalAddPicture" class="modal__add-picture flex--center flex--column flex--aligned">
        <img class="picture-icon" src='./assets/icons/picture.png' alt="Picture icon" />
        <label class="basic-button add-picture--button" for="image">+ Ajouter photo</label>
        <input name="image" id="image" type="file" style="display:none;"/>
        <span>jpg, png : 4mo max</span>
      </section>
      <p id="imageWarning" class="warning--text">*Champ obligatoire</p>
      <section class="modal__add-info flex--center flex--column">
        <div class="form--sub-section flex--column">
          <label class="label--text" for="title">Titre</label>
          <input id="title" name="title" type="text" />
          <p id="titleWarning" class="warning--text">*Champ obligatoire</p>
        </div>
        <div class="form--sub-section flex--column">
          <label class="label--text" for="category">Catégorie</label>
          <select id="category" name="category"></select>
        <div>
      </section>
    </form>
    <button id="sendWorkBtn" class="basic-button button--active" disabled="true">Valider</button>`;

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
      renderLandingModal();
    }
  }
}

function renderLandingModal() {
  modalContent.innerHTML = landingModalContent;
  renderModalWorks();
  document.getElementById("addWorkButton").addEventListener("click", onAddWork);
  resetCloseModalEvent();
  selectedImage = undefined;
}

function closeModal() {
  modal.style.display = "none";
  isModalDisplayed = false;
}

function resetCloseModalEvent() {
  document
    .getElementById("closeModalIcon")
    .addEventListener("click", closeModal);
}

function renderModalWorks() {
  const modalList = document.getElementById("modalWorkList");
  modalList.innerHTML = "";
  worksCollection.forEach(({ imageUrl, title, id }) => {
    modalList.innerHTML += `
    <figure class="modal-work">
      <div id=${id} class="modal-work__trash delete-work-icon flex--center">
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
  const deleteWorkIcons = document.querySelectorAll(".delete-work-icon");
  deleteWorkIcons.forEach((icon) => {
    icon.addEventListener("click", openConfirmModal);
  });
}

// MODAL - ADD WORK SECTION

async function onAddWork() {
  modalContent.innerHTML = modalFormContent;
  resetCloseModalEvent();

  document
    .getElementById("returnModalIcon")
    .addEventListener("click", renderLandingModal);

  document
    .getElementById("image")
    .addEventListener("change", displaySelectedImage);

  document
    .getElementById("addWorkForm")
    .addEventListener("change", checkWorkFormValidity);

  document
    .getElementById("sendWorkBtn")
    .addEventListener("click", sendWorkData);

  getCategories().forEach((name, id) => {
    document.getElementById(
      "category"
    ).innerHTML += `<option value=${id}>${name}</option>`;
  });
}

function displaySelectedImage(event) {
  const file = event.target.files[0];
  if (file) {
    selectedImage = file;
    const reader = new FileReader();
    reader.onload = function (e) {
      const modalAddPicture = document.getElementById("modalAddPicture");
      modalAddPicture.innerHTML = `
          <img height="165px" src=${e.target.result} alt="Selected picture"/>
      `;
      modalAddPicture.style.padding = "0";
    };
    reader.readAsDataURL(file);
  }
}

function checkWorkFormValidity() {
  const title = document.getElementById("title");
  const sendWorkBtn = document.getElementById("sendWorkBtn");
  if (selectedImage !== undefined) {
    document.getElementById("imageWarning").style.display = "none";
  }
  if (title.value) {
    document.getElementById("titleWarning").style.display = "none";
  } else {
    document.getElementById("titleWarning").style.display = "block";
  }
  if (selectedImage !== undefined && title.value) {
    sendWorkBtn.disabled = false;
  } else {
    sendWorkBtn.disabled = true;
  }
}

// DATABASE INTERACTIONS

// ADD WORK METHOD

function sendWorkData() {
  const workForm = document.getElementById("addWorkForm");
  const formData = new FormData(workForm);
  const userToken = localStorage.getItem("token");
  if (selectedImage) {
    formData.append("image", selectedImage);
  }
  fetch(`${apiURL}/works`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
    body: formData,
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then((data) => {
      worksCollection.push(data);
      renderGallery(worksCollection);
      closeModal();
    })
    .catch((err) => console.error(err));
}

// DELETE WORK METHOD

function deleteWork() {
  const userToken = localStorage.getItem("token");
  fetch(`${apiURL}/works/${selectedWorkId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
    body: selectedWorkId,
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }
    })
    .then(async () => {
      worksCollection = await getWorks();
      renderGallery(worksCollection);
      renderModalWorks();
      closeConfirmModal();
    })
    .catch((err) => console.error(err));
}

function openConfirmModal(event) {
  selectedWorkId = event.target.id;
  confirmModal.style.display = "flex";
}

function closeConfirmModal() {
  if (confirmModal) confirmModal.style.display = "none";
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

function onLoadEvents() {
  renderGallery(worksCollection);
  renderFilters();
  isUserLogged();
  if (loginButton) {
    loginButton.addEventListener("click", login);
  }
  handleEditButtonsRender();
  if (isMainPage()) {
    modal.addEventListener("click", toggleModal);
    confirmModalCloseBtn.addEventListener("click", closeConfirmModal);
    confirmDeletionBtn.addEventListener("click", deleteWork);
  }
}

onLoadEvents();
