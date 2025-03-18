/*
    Name: Dylan Gill & Joel Hieckert
    Class Code: INFT-2202-03
    Date: February 23, 2025
    Description: gallery.js
*/

"use strict";

// Runs when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    const galleryContainer = document.getElementById("gallery");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeLightbox = document.getElementById("close-lightbox");

    // Fetches and loads gallery images from gallery.json
    fetch("../../data/gallery.json")
        .then(response => response.json()) 
        .then(data => {
            // Loops through each image in the data
            data.images.forEach(image => {
                const divElement = document.createElement("div");
                divElement.classList.add("gallery-item");

                const imgElement = document.createElement("img");
                imgElement.src = image.thumbnail;
                imgElement.alt = image.description;
                imgElement.classList.add("gallery-img");

                const caption = document.createElement("p");
                caption.textContent = image.description;

                // Adds click listener to open lightbox when image is clicked
                imgElement.addEventListener("click", () => {
                    lightboxImg.src = image.fullsize;
                    lightbox.classList.remove("hidden");
                });
                divElement.appendChild(imgElement);
                divElement.appendChild(caption);
                galleryContainer.appendChild(divElement);
            });
        })
        .catch(error => {
            // Logs any errors fetching gallery images
            console.error("Error loading gallery images:", error);
        });

    // Closes the lightbox when the close button is clicked
    closeLightbox.addEventListener("click", () => {
        lightbox.classList.add("hidden");
    });

    // Closes the lightbox when clicking outside the image
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.classList.add("hidden");
        }
    });
});