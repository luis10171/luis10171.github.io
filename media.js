/* PHOTO SETTINGS
   Add your real photos to assets/, then put their paths below.
   Leave src empty to keep the designed placeholder. No broken images appear.
   Headshot positioning: adjust position, e.g. "50% 30%" to move the crop.
   Trophy and presentation photos join their page's click-to-enlarge gallery. */
const portfolioPhotos = {
  headshot: {
    src: "assets/Hernandez_Luis_Headshot.jpg", // Example: "assets/Hernandez_Luis_Headshot.jpg"
    alt: "Luis Hernandez Sanchez",
    position: "50% 35%",
  },
  stepTrophy: {
    src: "assets/STEP-Trophy.jpg", // Example: "assets/STEP-Trophy.jpg"
    alt: "The first-place trophy from the New York STEP Science Fair",
    position: "center",
  },
  stepPresentation: {
    src: "", // Example: "assets/step-presentation.jpg"
    alt: "Luis presenting the STEP facial recognition project at the science fair",
    position: "center",
  },
  atlasAward: {
    src: "", // Example: "assets/atlas-award.jpg"
    alt: "Luis presenting AtlasOne at the Shark Tank-style competition",
    position: "center",
  },
};

// Load optional photos before replacing a placeholder, so missing files degrade gracefully.
document.querySelectorAll("[data-photo-slot]").forEach((slot) => {
  const photo = portfolioPhotos[slot.dataset.photoSlot];
  if (!photo?.src) return;
  const image = new Image();
  image.alt = photo.alt;
  image.style.objectPosition = photo.position;
  image.addEventListener("load", () => {
    if (slot.dataset.photoSlot === "headshot") {
      slot.replaceChildren(image);
    } else {
      const link = document.createElement("a");
      link.href = photo.src;
      link.className = "photo-link";
      link.dataset.gallery = slot.dataset.galleryGroup;
      link.setAttribute("aria-label", `Enlarge: ${photo.alt}`);
      link.append(image);
      slot.querySelector(".photo-placeholder").replaceWith(link);
    }
  });
  image.src = photo.src;
});

// Native dialog supplies keyboard focus containment and Escape-to-close.
// Real screenshot links still open their image if JavaScript is disabled.
const photoDialog = document.createElement("dialog");
photoDialog.className = "photo-dialog";
photoDialog.setAttribute("aria-labelledby", "photo-dialog-caption");
photoDialog.innerHTML = `
  <div class="photo-dialog-toolbar">
    <span id="photo-position"></span>
    <button type="button" class="dialog-close" aria-label="Close image">Close ×</button>
  </div>
  <img class="enlarged-photo" alt="">
  <div class="photo-dialog-bottom">
    <button type="button" class="gallery-prev" aria-label="Previous image">←</button>
    <p id="photo-dialog-caption" aria-live="polite"></p>
    <button type="button" class="gallery-next" aria-label="Next image">→</button>
  </div>`;
document.body.append(photoDialog);
let galleryLinks = [];
let photoIndex = 0;
let previousOverflow = "";

function showPhoto(index) {
  photoIndex = (index + galleryLinks.length) % galleryLinks.length;
  const link = galleryLinks[photoIndex];
  const sourceImage = link.querySelector("img");
  const image = photoDialog.querySelector(".enlarged-photo");
  image.src = link.href;
  image.alt = sourceImage.alt;
  photoDialog.querySelector("#photo-dialog-caption").textContent =
    sourceImage.alt;
  photoDialog.querySelector("#photo-position").textContent =
    `${photoIndex + 1} / ${galleryLinks.length}`;
  photoDialog
    .querySelectorAll(".gallery-prev, .gallery-next")
    .forEach((button) => {
      button.disabled = galleryLinks.length < 2;
    });
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-gallery]");
  if (
    !link ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  )
    return;
  if (typeof photoDialog.showModal !== "function") return;
  event.preventDefault();
  galleryLinks = [...document.querySelectorAll("a[data-gallery]")].filter(
    (item) => item.dataset.gallery === link.dataset.gallery,
  );
  showPhoto(galleryLinks.indexOf(link));
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  photoDialog.showModal();
});
photoDialog
  .querySelector(".dialog-close")
  .addEventListener("click", () => photoDialog.close());
photoDialog
  .querySelector(".gallery-prev")
  .addEventListener("click", () => showPhoto(photoIndex - 1));
photoDialog
  .querySelector(".gallery-next")
  .addEventListener("click", () => showPhoto(photoIndex + 1));
photoDialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    showPhoto(photoIndex + (event.key === "ArrowLeft" ? -1 : 1));
  }
});
photoDialog.addEventListener("close", () => {
  document.body.style.overflow = previousOverflow;
});
