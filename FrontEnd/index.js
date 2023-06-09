// IMPORTS

import { getWorksCollection } from "./works.service.js"
import { isMainPage } from "./utils.js"
import { login, isUserLogged } from "./auth.js"
import { toggleModal, closeConfirmModal } from "./modals.js"
import {
	renderGallery,
	renderFilters,
	handleEditButtonsRender
} from "./render.js"

// DOM

const loginButton = document.getElementById("loginButton")
const modal = document.getElementById("modal")
const confirmModalCloseBtn = document.getElementById("confirmModalCloseBtn")

// ON LOAD EVENTS

function onLoadEvents() {
	isUserLogged()
	handleEditButtonsRender()
	if (isMainPage()) {
		renderGallery(getWorksCollection())
		renderFilters()
		modal.addEventListener("click", toggleModal)
		confirmModalCloseBtn.addEventListener("click", closeConfirmModal)
	} else {
		loginButton.addEventListener("click", login)
	}
}

onLoadEvents()
