import {
  landingModalContent,
  openConfirmModal,
  onAddWork,
  resetCloseModalEvent,
  toggleModal,
} from "./modals.js";
import {
  getWorksCollection,
  setSelectedImage,
  getCategories,
} from "./works.service.js";
import { isUserLogged } from "./auth.js";

const gallery = document.getElementById("gallery");
const galleryFilters = document.getElementById("galleryFilters");
const modalContent = document.getElementById("modalContent");
const editButton = document.getElementById("editButton");

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

function renderFilters() {
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

function onFilterGallery({ target }) {
  const buttonId = target.id;
  const filterButtons = document.querySelectorAll(".filter-button");
  filterButtons.forEach((button) => {
    button.classList.remove("button--active");
  });
  gallery.innerHTML = "";
  if (buttonId === "filterAll") {
    document.getElementById(buttonId).classList.add("button--active");
    renderGallery(getWorksCollection());
  } else {
    document.getElementById(buttonId).classList.add("button--active");
    const filteredGallery = getWorksCollection().filter(
      (work) => work.categoryId == buttonId
    );
    renderGallery(filteredGallery);
  }
}

function renderLandingModal() {
  modalContent.innerHTML = landingModalContent;
  renderModalWorks();
  document.getElementById("addWorkButton").addEventListener("click", onAddWork);
  resetCloseModalEvent();
  setSelectedImage(undefined);
}

function renderModalWorks() {
  const modalList = document.getElementById("modalWorkList");
  modalList.innerHTML = "";
  getWorksCollection().forEach(({ imageUrl, title, id }) => {
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

function displaySelectedImage(event) {
  const file = event.target.files[0];
  if (file) {
    setSelectedImage(file);
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

export {
  renderGallery,
  renderLandingModal,
  renderModalWorks,
  displaySelectedImage,
  renderFilters,
  handleEditButtonsRender,
};
