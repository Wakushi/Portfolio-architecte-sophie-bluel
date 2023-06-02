import { selectedImage } from "./works.service.js";

function isMainPage() {
  return !window.location.pathname.includes("login")
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

export { isMainPage, checkWorkFormValidity };
