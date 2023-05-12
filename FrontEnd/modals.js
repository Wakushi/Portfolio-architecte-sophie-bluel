import { renderLandingModal, displaySelectedImage } from "./render.js";
import { checkWorkFormValidity } from "./utils.js";
import {
  sendWorkData,
  getCategories,
  setSelectedWorkId,
} from "./works.service.js";

let isModalDisplayed = false;
const modalContent = document.getElementById("modalContent");
const editButton = document.getElementById("editButton");
const confirmModal = document.getElementById("confirmModal");

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
      setIsModalDisplayed(false);
    } else {
      modal.style.display = "flex";
      setIsModalDisplayed(true);
      renderLandingModal();
    }
  }
}

function closeModal() {
  modal.style.display = "none";
  isModalDisplayed = false;
}

function openConfirmModal(event) {
  setSelectedWorkId(event.target.id);
  confirmModal.style.display = "flex";
}

function closeConfirmModal() {
  if (confirmModal) confirmModal.style.display = "none";
}

function resetCloseModalEvent() {
  document
    .getElementById("closeModalIcon")
    .addEventListener("click", closeModal);
}

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

function setIsModalDisplayed(bool) {
  isModalDisplayed = bool;
}

export {
  landingModalContent,
  modalFormContent,
  closeModal,
  isModalDisplayed,
  setIsModalDisplayed,
  toggleModal,
  openConfirmModal,
  closeConfirmModal,
  onAddWork,
  resetCloseModalEvent,
};
