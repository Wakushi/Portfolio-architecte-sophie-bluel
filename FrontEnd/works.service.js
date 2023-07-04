import { isMainPage } from "./utils.js"
import { renderGallery, renderModalWorks } from "./render.js"
import { closeConfirmModal } from "./modals.js"

const API_URL = "http://localhost:5678/api"
let worksCollection = await getWorks()
let selectedImage

function getWorks() {
	if (isMainPage()) {
		const works = fetch(`${API_URL}/works`)
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

function deleteWork(workId) {
	const userToken = localStorage.getItem("token")
	fetch(`${API_URL}/works/${workId}`, {
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

// SETTER & GETTER METHODS


function setSelectedImage(image) {
	selectedImage = image
}

function getWorksCollection() {
	return worksCollection
}

export {
	getWorksCollection,
	worksCollection,
	getCategories,
	API_URL,
	deleteWork,
	selectedImage,
	setSelectedImage
}
