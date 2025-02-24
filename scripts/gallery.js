"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const galleryContainer = document.getElementById("gallery");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeLightbox = document.getElementById("close-lightbox");

    // Load gallery images from gallery.json
    fetch("gallery.json")
        .then(response => response.json())
        .then(data => {
            data.images.forEach(image => {
                const divElement = document.createElement("div");
                divElement.classList.add("gallery-item");

                const imgElement = document.createElement("img");
                imgElement.src = image.thumbnail;
                imgElement.alt = image.description;
                imgElement.classList.add("gallery-img");

                const caption = document.createElement("p");
                caption.textContent = image.description;

                // Open lightbox when clicking an image
                imgElement.addEventListener("click", () => {
                    lightboxImg.src = image.fullsize;
                    lightbox.classList.remove("hidden");
                });

                divElement.appendChild(imgElement);
                divElement.appendChild(caption);
                galleryContainer.appendChild(divElement);
            });
        })
        .catch(error => console.error("Error loading gallery images:", error));

    // Close lightbox when clicking the close button
    closeLightbox.addEventListener("click", () => {
        lightbox.classList.add("hidden");
    });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.classList.add("hidden");
        }
    });
});
