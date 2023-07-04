import { closeModal } from "./modals.js"
import {
	setSelectedImage,
	selectedImage,
	API_URL,
	worksCollection
} from "./works.service.js"
import { renderGallery } from "./render.js"

function sendWorkData() {
	const workForm = document.getElementById("addWorkForm")
	const formData = new FormData(workForm)
	const userToken = localStorage.getItem("token")
	if (selectedImage) {
		formData.append("image", selectedImage)
	}
	fetch(`${API_URL}/works`, {
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

function displaySelectedImage(event) {
	const file = event.target.files[0]
	if (file) {
		setSelectedImage(file)
		const reader = new FileReader()
		reader.onload = function (e) {
			const modalAddPicture = document.getElementById("modalAddPicture")
			modalAddPicture.innerHTML = `
              <img height="165px" src=${e.target.result} alt="Selected picture"/>
          `
			modalAddPicture.style.padding = "0"
		}
		reader.readAsDataURL(file)
	}
}

export { displaySelectedImage, sendWorkData }
