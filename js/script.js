// 1. Specialists Carousel
const slider = document.querySelector(".specialists__carousel");
const prevBtn = document.querySelector(".specialists-prev-button");
const nextBtn = document.querySelector(".specialists-next-button");
const paginationWrapper = document.querySelector(".specialists__buttons");

let childWidth;
let isAnimating = false;
let currentIndex = 0;
let totalItems = 0;

function updateChildWidth() {
  const firstChild = slider.querySelector(".specialist");
  if (!firstChild) return;

  const style = window.getComputedStyle(firstChild);
  const gap = parseInt(style.marginRight) || 20;
  childWidth = firstChild.offsetWidth + gap;

  totalItems = slider.querySelectorAll(".specialist").length;

  renderPaginationDots();
  updateActiveDot();
}

function renderPaginationDots() {
  paginationWrapper.innerHTML = "";

  for (let i = 0; i < totalItems; i++) {
    const dot = document.createElement("button");
    dot.classList.add("button", "specialists-button");
    if (i === currentIndex) dot.classList.add("active");

    dot.addEventListener("click", () => {
      if (i === currentIndex || isAnimating) return;
      slideToIndex(i);
    });
    paginationWrapper.appendChild(dot);
  }
}

function updateActiveDot() {
  const dots = document.querySelectorAll(".specialists-button");
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });
}

function slideToIndex(targetIndex) {
  const diff = targetIndex - currentIndex;
  if (diff === 0 || isAnimating) return;

  isAnimating = true;

  const direction = diff > 0 ? 1 : -1;
  const steps = Math.abs(diff);

  if (direction > 0) {
    for (let i = 0; i < steps; i++) {
      const clone = slider.children[i].cloneNode(true);
      slider.appendChild(clone);
    }

    slider.style.transition = "transform 0.3s ease";
    slider.style.transform = `translateX(-${childWidth * steps}px)`;

    slider.addEventListener("transitionend", function handler() {
      slider.style.transition = "none";
      for (let i = 0; i < steps; i++) {
        slider.removeChild(slider.children[0]);
      }
      slider.style.transform = `translateX(0)`;
      isAnimating = false;
      slider.removeEventListener("transitionend", handler);
    });
  } else {
    const children = Array.from(slider.children);
    for (let i = 0; i < steps; i++) {
      const childToMove = children[children.length - 1 - i].cloneNode(true);
      slider.insertBefore(childToMove, slider.firstElementChild);
    }

    slider.style.transition = "none";
    slider.style.transform = `translateX(-${childWidth * steps}px)`;

    requestAnimationFrame(() => {
      slider.style.transition = "transform 0.3s ease";
      slider.style.transform = `translateX(0)`;
    });

    slider.addEventListener("transitionend", function handler() {
      for (let i = 0; i < steps; i++) {
        slider.removeChild(slider.lastElementChild);
      }
      isAnimating = false;
      slider.removeEventListener("transitionend", handler);
    });
  }

  currentIndex = (targetIndex + totalItems) % totalItems;
  updateActiveDot();
}

nextBtn.addEventListener("click", () => {
  if (isAnimating) return;

  const newIndex = (currentIndex + 1) % totalItems;
  slideToIndex(newIndex);
});

prevBtn.addEventListener("click", () => {
  if (isAnimating) return;

  const newIndex = (currentIndex - 1 + totalItems) % totalItems;
  slideToIndex(newIndex);
});

window.addEventListener("resize", () => {
  updateChildWidth();
});

updateChildWidth();

// 2. Testimonials Carousel
const testimonialsSlider = document.querySelector(".testimonials__carousel");
const testimonialsPrevBtn = document.querySelector(".testimonials-prev-button");
const testimonialsNextBtn = document.querySelector(".testimonials-next-button");

let testimonialChildWidth;
let isTestimonialsAnimating = false;

function updateTestimonialChildWidth() {
  const firstChild = testimonialsSlider.querySelector(".testimonial");
  if (!firstChild) return;

  const style = window.getComputedStyle(firstChild);
  const gap = parseInt(style.marginRight) || 24;
  testimonialChildWidth = firstChild.offsetWidth + gap;
}

function slideTestimonials(direction) {
  if (isTestimonialsAnimating) return;
  isTestimonialsAnimating = true;

  if (direction === "next") {
    const firstChild = testimonialsSlider.children[0];
    const clone = firstChild.cloneNode(true);
    testimonialsSlider.appendChild(clone);

    testimonialsSlider.style.transition = "transform 0.3s ease";
    testimonialsSlider.style.transform = `translateX(-${testimonialChildWidth}px)`;

    testimonialsSlider.addEventListener("transitionend", function handler() {
      testimonialsSlider.style.transition = "none";
      testimonialsSlider.removeChild(firstChild);
      testimonialsSlider.style.transform = `translateX(0)`;
      isTestimonialsAnimating = false;
      testimonialsSlider.removeEventListener("transitionend", handler);
    });
  }

  if (direction === "prev") {
    const lastChild = testimonialsSlider.lastElementChild;
    testimonialsSlider.insertBefore(
      lastChild,
      testimonialsSlider.firstElementChild
    );

    testimonialsSlider.style.transition = "none";
    testimonialsSlider.style.transform = `translateX(-${testimonialChildWidth}px)`;

    requestAnimationFrame(() => {
      testimonialsSlider.style.transition = "transform 0.3s ease";
      testimonialsSlider.style.transform = `translateX(0)`;
    });

    testimonialsSlider.addEventListener("transitionend", function handler() {
      isTestimonialsAnimating = false;
      testimonialsSlider.removeEventListener("transitionend", handler);
    });
  }
}

testimonialsNextBtn.addEventListener("click", () => {
  slideTestimonials("next");
});

testimonialsPrevBtn.addEventListener("click", () => {
  slideTestimonials("prev");
});

window.addEventListener("resize", updateTestimonialChildWidth);
updateTestimonialChildWidth();

// 3. About Carousel
const aboutSlider = document.querySelector(".about-gallery");
const aboutPrevBtn = document.querySelector(".about-prev-button");
const aboutNextBtn = document.querySelector(".about-next-button");
const aboutMainImage = document.querySelector(".about-center__image img");

let aboutChildWidth = 0;
let isAboutAnimating = false;

function updateAboutChildWidth() {
  const firstChild = aboutSlider.querySelector(".about-gallery-image");
  if (!firstChild) return;

  const style = window.getComputedStyle(aboutSlider);
  const gap = parseInt(style.gap) || 0;

  aboutChildWidth = firstChild.offsetWidth + gap;
}

const resizeObserver = new ResizeObserver(updateAboutChildWidth);
resizeObserver.observe(aboutSlider);

function slideAbout(direction) {
  if (isAboutAnimating) return;
  isAboutAnimating = true;

  if (direction === "next") {
    const firstChild = aboutSlider.children[0];
    const clone = firstChild.cloneNode(true);
    aboutSlider.appendChild(clone);

    aboutSlider.style.transition = "transform 0.3s ease";
    aboutSlider.style.transform = `translateX(-${aboutChildWidth}px)`;

    aboutSlider.addEventListener("transitionend", function handler() {
      aboutSlider.style.transition = "none";
      aboutSlider.style.transform = "translateX(0)";
      aboutSlider.removeChild(firstChild);
      isAboutAnimating = false;
      aboutSlider.removeEventListener("transitionend", handler);
    });
  }

  if (direction === "prev") {
    const lastChild = aboutSlider.lastElementChild;
    const clone = lastChild.cloneNode(true);
    aboutSlider.insertBefore(clone, aboutSlider.firstElementChild);
    aboutSlider.removeChild(lastChild);

    aboutSlider.style.transition = "none";
    aboutSlider.style.transform = `translateX(-${aboutChildWidth}px)`;

    void aboutSlider.offsetWidth;

    aboutSlider.style.transition = "transform 0.3s ease";
    aboutSlider.style.transform = "translateX(0)";

    aboutSlider.addEventListener("transitionend", function handler() {
      aboutSlider.style.transition = "none";
      isAboutAnimating = false;
      aboutSlider.removeEventListener("transitionend", handler);
    });
  }
}

aboutNextBtn.addEventListener("click", () => {
  slideAbout("next");
});

aboutPrevBtn.addEventListener("click", () => {
  slideAbout("prev");
});

aboutSlider.addEventListener("click", (e) => {
  const clickedImage = e.target.closest(".about-gallery-image img");
  if (!clickedImage) return;

  aboutMainImage.src = clickedImage.src;
  aboutMainImage.alt = clickedImage.alt;
});

window.addEventListener("resize", updateAboutChildWidth);
updateAboutChildWidth();

// 4. Modal window
const openModalBtn = document.querySelectorAll(".modal-btn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalOverlay = document.querySelector(".modal-container");

openModalBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    modalOverlay.style.display = "flex";
  });
});

closeModalBtn.addEventListener("click", () => {
  modalOverlay.style.display = "none";
});

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.style.display = "none";
  }
});

// 5. Burger menu
const burger = document.querySelector(".header__burger");
const menu = document.querySelector(".header__nav-list");

burger.addEventListener("click", () => {
  menu.classList.toggle("header__nav-list--open");
  burger.classList.toggle("header__burger--active");
});

document.querySelectorAll(".header__nav-item").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("header__nav-list--open");
    burger.classList.remove("header__burger--active");
  });
});

// Mask
const phone = document.getElementById("phone");

phone.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);

  let formatted = "+7 ";
  if (value.length > 1) formatted += `(${value.slice(1, 4)}`;
  if (value.length >= 4) formatted += `) ${value.slice(4, 7)}`;
  if (value.length >= 7) formatted += `-${value.slice(7, 9)}`;
  if (value.length >= 9) formatted += `-${value.slice(9, 11)}`;

  e.target.value = formatted;
});
