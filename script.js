document.addEventListener("DOMContentLoaded", () => {
   // бегущая строка
   const marquees = document.querySelectorAll(".marquee-js");  
  marquees.forEach(marquee => {
    if (marquee) {
      // Клонируем внутренний HTML-код для каждой строки отдельно
      marquee.innerHTML += marquee.innerHTML;
    }
  });
  // этапы
  const gridContainer = document.getElementById("stages-slider2");
  const prevBtn = document.getElementById("slide-prev");
  const nextBtn = document.getElementById("slide-next");
  const paginationContainer = document.getElementById("slider-pagination");

  if (!gridContainer || !prevBtn || !nextBtn || !paginationContainer) return;

  let currentSlide = 0;
  let slides = [];

  function initSlider() {
    if (window.innerWidth < 768) {
      slides = Array.from(gridContainer.children).filter((el) => {
        return !el.classList.contains("airplane-decor");
      });

      createDots();
      updateSlider();
    } else {
      gridContainer.style.transform = "translate3d(0, 0, 0)";
      paginationContainer.innerHTML = "";
      currentSlide = 0;
    }
  }

  function createDots() {
    paginationContainer.innerHTML = "";
    slides.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (index === currentSlide) dot.classList.add("active");

      dot.addEventListener("click", () => {
        currentSlide = index;
        updateSlider();
      });
      paginationContainer.appendChild(dot);
    });
  }

  function updateSlider() {
    if (slides.length === 0) return;

    const slideWidth = slides[0].offsetWidth;

    gridContainer.style.transform = `translate3d(-${currentSlide * slideWidth}px, 0, 0)`;

    const dots = paginationContainer.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });

    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === slides.length - 1;
  }

  nextBtn.addEventListener("click", () => {
    if (currentSlide < slides.length - 1) {
      currentSlide++;
      updateSlider();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentSlide > 0) {
      currentSlide--;
      updateSlider();
    }
  });

  // участники
  const track = document.getElementById("members-track");

  const prevBtnPc = document.getElementById("member-prev");
  const nextBtnPc = document.getElementById("member-next");
  const counterPc = document.getElementById("member-counter");
  const prevBtnMobile = document.getElementById("member-prev-mobile");
  const nextBtnMobile = document.getElementById("member-next-mobile");
  const counterMobile = document.getElementById("member-counter-mobile");

  if (!track) return;

  const originalItems = Array.from(track.children);
  const totalOriginal = originalItems.length;

  function getVisibleCount() {
    return window.innerWidth < 768 ? 1 : 3;
  }

  let visibleCount = getVisibleCount();
  let cloneCount = visibleCount;
  let currentIndex = cloneCount;
  let autoPlayTimer = null;

  function setupCarousel() {
    track.innerHTML = ""; 
    const endClones = originalItems.slice(-cloneCount).map((el) => el.cloneNode(true));
    const startClones = originalItems.slice(0, cloneCount).map((el) => el.cloneNode(true));

    const finalItems = [...endClones, ...originalItems, ...startClones];
    finalItems.forEach((item) => track.appendChild(item));

    track.style.transition = "none";
    moveTrack();
  }

  function moveTrack() {
    if (!track.children.length) return;
    const itemWidth = track.children[0].getBoundingClientRect().width;
    track.style.transform = `translate3d(-${currentIndex * itemWidth}px, 0, 0)`;
    updateCounter();
  }

  function updateCounter() {
    let realIndex = currentIndex - cloneCount;

    if (realIndex < 0) {
      realIndex = totalOriginal - visibleCount;
    } else if (realIndex >= totalOriginal) {
      realIndex = 0;
    }

    const displayIndex = window.innerWidth < 768 ? realIndex + 1 : Math.min(realIndex + visibleCount, totalOriginal);
    function renderCounter(counterElement) {
      if (!counterElement) return;
      const currentSpan = counterElement.querySelector(".current");
      const totalSpan = counterElement.querySelector(".total");

      if (currentSpan) currentSpan.textContent = displayIndex;
      if (totalSpan) totalSpan.textContent = totalOriginal;
    }

    renderCounter(counterPc);
    renderCounter(counterMobile);
  }

  function rotate(direction) {
    track.style.transition = "transform 0.5s ease-in-out";
    currentIndex += direction;
    moveTrack();

    track.addEventListener("transitionend", function handler() {
      track.removeEventListener("transitionend", handler);

      if (currentIndex >= totalOriginal + cloneCount) {
        track.style.transition = "none";
        currentIndex = cloneCount;
        moveTrack();
      } else if (currentIndex < cloneCount) {
        track.style.transition = "none";
        currentIndex = totalOriginal + cloneCount - visibleCount;
        moveTrack();
      }
    });
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      rotate(1);
    }, 4000);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  }

  function bindEvents(btn, direction) {
    if (btn) {
      btn.addEventListener("click", () => {
        rotate(direction);
        startAutoPlay();
      });
    }
  }

  bindEvents(nextBtnPc, 1);
  bindEvents(prevBtnPc, -1);

  bindEvents(nextBtnMobile, 1);
  bindEvents(prevBtnMobile, -1);

  track.addEventListener("mouseenter", stopAutoPlay);
  track.addEventListener("mouseleave", startAutoPlay);

//   animation
  const observerOptions = {
    root: null,       
    rootMargin: '0px',  
    threshold: 0.2      
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
   
      if (entry.isIntersecting) {
        entry.target.classList.add('animated'); 
        observer.unobserve(entry.target);   
      }
    });
  }, observerOptions);


  const headings = document.querySelectorAll('h2');
  headings.forEach(heading => observer.observe(heading));

  window.addEventListener("resize", () => {
    const newVisibleCount = getVisibleCount();
    if (newVisibleCount !== visibleCount) {
      visibleCount = newVisibleCount;
      cloneCount = visibleCount;
      currentIndex = cloneCount;
      setupCarousel();
    } else {
      moveTrack();
    }
    startAutoPlay();
    setTimeout(initSlider, 100);
  });

  setupCarousel();
  startAutoPlay();
  initSlider();
});
