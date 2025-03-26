/*
    Name: Dylan Gill & Joel Hieckert
    Class Code: INFT-2202-03
    Description: gallery.ts
    Date: March 22, 2025
*/

"use strict";

interface GalleryImage {
    thumbnail: string;
    fullsize: string;
    description: string;
}

export function loadGallery(): void {
    const galleryContainer = document.getElementById("gallery") as HTMLElement | null;
    const lightbox = document.getElementById("lightbox") as HTMLElement | null;
    const lightboxImg = document.getElementById("lightbox-img") as HTMLImageElement | null;
    const closeLightbox = document.getElementById("close-lightbox") as HTMLElement | null;

    fetch("/gallery.json") 
        .then(response => response.json())
        .then((data: { images: GalleryImage[] }) => {
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
        lightbox.addEventListener("click", (e: MouseEvent) => {
            if (e.target === lightbox) {
                lightbox.classList.add("hidden");
            }
        });
    }
}
