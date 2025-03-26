// src/gallery.ts
"use strict";
export function loadGallery() {
    const galleryContainer = document.getElementById("gallery");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeLightbox = document.getElementById("close-lightbox");
    fetch("/gallery.json")
        .then(response => response.json())
        .then((data) => {
        data.images.forEach(image => {
            const divElement = document.createElement("div");
            divElement.classList.add("gallery-item");
            const imgElement = document.createElement("img");
            imgElement.src = image.thumbnail;
            imgElement.alt = image.description;
            imgElement.classList.add("gallery-img");
            const caption = document.createElement("p");
            caption.textContent = image.description;
            imgElement.addEventListener("click", () => {
                if (lightbox && lightboxImg) {
                    lightboxImg.src = image.fullsize;
                    lightbox.classList.remove("hidden");
                }
            });
            divElement.appendChild(imgElement);
            divElement.appendChild(caption);
            if (galleryContainer) {
                galleryContainer.appendChild(divElement);
            }
        });
    })
        .catch(error => {
        console.error("Error loading gallery images:", error);
    });
    if (closeLightbox && lightbox) {
        closeLightbox.addEventListener("click", () => {
            lightbox.classList.add("hidden");
        });
    }
    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                lightbox.classList.add("hidden");
            }
        });
    }
}
