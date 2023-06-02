import { apiURL } from "./works.service.js"

// DOM

const loginForm = document.getElementById("loginForm")
const navLogin = document.getElementById("navLogin")

// AUTH METHODS

function login(event) {
	event.preventDefault()
	const email = loginForm.elements.email.value
	const password = loginForm.elements.password.value

	const user = {
		email: email,
		password: password
	}

	fetch(`${apiURL}/users/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(user)
	})
		.then((res) => {
			if (!res.ok) {
				throw new Error(`HTTP error ${res.status}: ${res.statusText}`)
			}
			return res.json()
		})
		.then(({ token }) => {
			window.location.href = "../index.html"
			localStorage.setItem("token", token)
		})
		.catch((err) => {
			console.error(err)
			alert("Incorrect email or password.")
		})
}

function isUserLogged() {
	const storageToken = localStorage.getItem("token")
	if (storageToken) {
		navLogin.innerText = "logout"
		navLogin.addEventListener("click", logOut)
		return true
	} else {
		navLogin.innerText = "login"
		return false
	}
}

function logOut() {
	localStorage.clear("token")
}

export { login, logOut, isUserLogged }
