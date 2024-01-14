// slider.js

function createSlider({
  sliderSelector,
  slidesSelector,
  nextSlideSelector,
  prevSlideSelector,
  selectSelectors
}) {
  let isDragging = false;
  let dragStartX = 0;
  let currentIndex = 0;
  const slider = document.querySelector(sliderSelector);
  const slides = document.querySelector(slidesSelector);
  const totalSlides = document.querySelectorAll(`${slidesSelector} .slide`).length;
  const nextSlideElement = document.querySelector(nextSlideSelector);
  const prevSlideElement = document.querySelector(prevSlideSelector);

  if (!slides || totalSlides <= 1 || !slider || !nextSlideElement || !prevSlideElement) {
    return;
  }

  const slideSelectors = selectSelectors.map(selector => document.querySelector(selector));

  function getChangeColorNextOrPrev(index) {
    slideSelectors.forEach((s, i) => {
      s.style.backgroundColor = i === index ? "#36689E" : "#C4C4C4";
    });
  }

  function showSlide(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index > totalSlides - 1) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    const transformValue = -currentIndex * 100 + "%";
    slides.style.transform = `translateX(${transformValue})`;
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
    getChangeColorNextOrPrev(currentIndex);
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
    getChangeColorNextOrPrev(currentIndex);
  }

  function startDragging(e) {
    isDragging = true;
    dragStartX = e.clientX;
  }

  function stopDragging() {
    isDragging = false;
  }

  function drag(e) {
    if (!isDragging) return;
    const dragDistance = e.clientX - dragStartX;
    const slidesWidth = slides.clientWidth;

    const percentageDragged = (dragDistance / slidesWidth) * 100;
    slides.style.transform = `translateX(calc(-${currentIndex * 100}% + ${percentageDragged}px))`;

    if (Math.abs(percentageDragged) > 20) {
      isDragging = false;
      if (percentageDragged > 0) {
        showSlide(currentIndex - 1);
      } else {
        showSlide(currentIndex + 1);
      }
    }
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  }

  slider.addEventListener("mousedown", startDragging);
  slider.addEventListener("mouseup", stopDragging);
  slider.addEventListener("mouseleave", stopDragging);
  slider.addEventListener("mousemove", drag);
  document.addEventListener("keydown", handleKeyDown);

  nextSlideElement.addEventListener("click", nextSlide);
  prevSlideElement.addEventListener("click", prevSlide);

  slideSelectors.forEach((selector, index) => {
    selector?.addEventListener("click", () => {
      showSlide(index);
      getChangeColorNextOrPrev(index);
    });
  });
}

export {
  createSlider
}