import { isMainPage } from "./utils.js"
import { renderGallery, renderModalWorks } from "./render.js"
import { closeModal, closeConfirmModal } from "./modals.js"

const apiURL = "http://localhost:5678/api"
let worksCollection = await getWorks()
let selectedWorkId
let selectedImage

function getWorks() {
	if (isMainPage()) {
		const works = fetch(`${apiURL}/works`)
			.then((res) => res.json())
			.catch((err) => console.error(err))
		return works
	}
}

function getCategories() {
	const categoryMap = new Map()
	worksCollection.forEach((work) => {
		categoryMap.set(work.category.id, work.category.name)
	})
	return categoryMap
}

function sendWorkData() {
	const workForm = document.getElementById("addWorkForm")
	const formData = new FormData(workForm)
	const userToken = localStorage.getItem("token")
	if (selectedImage) {
		formData.append("image", selectedImage)
	}
	fetch(`${apiURL}/works`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${userToken}`
		},
		body: formData
	})
		.then((res) => {
			if (!res.ok) {
				throw new Error(`HTTP error ${res.status}: ${res.statusText}`)
			}
			return res.json()
		})
		.then((data) => {
			worksCollection.push(data)
			renderGallery(worksCollection)
			closeModal()
		})
		.catch((err) => console.error(err))
}

// DELETE WORK METHOD

function deleteWork(workId) {
	const userToken = localStorage.getItem("token")
	fetch(`${apiURL}/works/${workId}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${userToken}`
		},
		body: workId
	})
		.then((res) => {
			if (!res.ok) {
				throw new Error(`HTTP error ${res.status}: ${res.statusText}`)
			}
		})
		.then(async () => {
			worksCollection = await getWorks()
			renderGallery(worksCollection)
			renderModalWorks()
			closeConfirmModal()
		})
		.catch((err) => console.error(err))
}

// SETTER METHODS

function setSelectedWorkId(workId) {
	selectedWorkId = workId
}

function setSelectedImage(image) {
	selectedImage = image
}

function getWorksCollection() {
	return worksCollection
}

export {
	getWorksCollection,
	getCategories,
	apiURL,
	sendWorkData,
	deleteWork,
	selectedWorkId,
	setSelectedWorkId,
	selectedImage,
	setSelectedImage
}
