
/* typing animation */
document.addEventListener('DOMContentLoaded', function() {
    var typed = new Typed('#hero-title-typed', {
        strings: [
            "Hello there!",
          "I'm <span style='color:#5f0e1b;'>Zeus Benavides</span>",
          "A <span style='color:#5f0e1b;'>Web Designer</span>",
          "Front End Developer",
          "And <span style='color:#5f0e1b;'>Data Annotation Specialist</span>",
          "Welcome to my portfolio!"
          ],
        typeSpeed: 80,
        backSpeed: 50,
        loop: true,
        smartBackspace: false
    });
});



// Generic slider for .slider elements
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.slider').forEach(initSlider);
});

function initSlider(slider){
  const slidesRow = slider.querySelector('.slides');
  const slides = Array.from(slidesRow.children);
  const prevBtn = slider.querySelector('.prev');
  const nextBtn = slider.querySelector('.next');
  const dotsContainer = slider.querySelector('.dots');
  const autoplay = slider.dataset.autoplay === "true";
  const intervalMs = parseInt(slider.dataset.interval) || 4000;

  let index = 0;
  let timer = null;

  // create dots
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', `Go to slide ${i+1}`);
    btn.addEventListener('click', () => { goTo(i); resetAutoplay(); });
    dotsContainer.appendChild(btn);
  });

  const dots = Array.from(dotsContainer.children);

  function update(){
    slidesRow.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function goTo(i){
    index = (i + slides.length) % slides.length;
    update();
  }

  function next(){
    goTo(index + 1);
  }

  function prev(){
    goTo(index - 1);
  }

  // event handlers
  if(nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
  if(prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });

  // keyboard support when slider is focused
  slider.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowRight') { next(); resetAutoplay(); }
    if(e.key === 'ArrowLeft') { prev(); resetAutoplay(); }
  });

  // autoplay
  function startAutoplay(){
    if(!autoplay) return;
    stopAutoplay();
    timer = setInterval(next, intervalMs);
  }
  function stopAutoplay(){
    if(timer) { clearInterval(timer); timer = null; }
  }
  function resetAutoplay(){
    stopAutoplay();
    startAutoplay();
  }

  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);
  slider.addEventListener('focusin', stopAutoplay);
  slider.addEventListener('focusout', startAutoplay);

  goTo(0);
  startAutoplay();

  window.addEventListener('resize', update);
}

// --- Border-Radius Scroll Effect ---
const heroSection = document.getElementById('hero');
const maxRadius = 500; 

window.addEventListener('scroll', () => {

  const scrollPosition = window.scrollY;
  const heroHeight = heroSection.offsetHeight;
  const scrollPercentage = Math.min(scrollPosition / heroHeight, 1);
  const newRadius = scrollPercentage * maxRadius;


  heroSection.style.borderBottomLeftRadius = `${newRadius}px`;
  heroSection.style.borderBottomRightRadius = `${newRadius}px`;
});


function revealOnScroll(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      
      observer.unobserve(entry.target);
    }
  });
}

const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(revealOnScroll, {
  root: null,
  threshold: 0.15,
});

revealElements.forEach(element => {
  observer.observe(element);
});


const menuIcon = document.getElementById("menu-icon");
const menuList = document.getElementById("menu-list");

  menuIcon.addEventListener("click", () => {
  menuList.classList.toggle("show");
});
  

function openModal(src) {
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImg");
  modal.style.display = "flex";
  modalImg.src = src;
}

function closeModal() {
  document.getElementById("imgModal").style.display = "none";
}

// * Modal * /

let scale = 1;
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;
const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImg");

function openModal(src) {
  modal.style.display = "flex";
  modalImg.src = src;

  // Reset zoom & position
  resetZoom();

  // Enable scroll zoom
  modalImg.addEventListener("wheel", onWheelZoom, { passive: false });
}

function closeModal() {
  modal.style.display = "none";
  // Cleanup events
  modalImg.removeEventListener("wheel", onWheelZoom);
  resetZoom();
}

function zoomIn() {
  scale += 0.2;
  updateTransform();
}

function zoomOut() {
  if (scale > 0.4) {
    scale -= 0.2;
    updateTransform();
  }
}

function resetZoom() {
  scale = 1;
  translateX = 0;
  translateY = 0;
  updateTransform();
}

function updateTransform() {
  modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

// --- Scroll to Zoom ---
function onWheelZoom(e) {
  e.preventDefault();
  if (e.deltaY < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
}

// --- Dragging (Desktop) ---
modalImg.addEventListener("mousedown", (e) => {
  if (scale <= 1) return; 
  isDragging = true;
  startX = e.clientX - translateX;
  startY = e.clientY - translateY;
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  translateX = e.clientX - startX;
  translateY = e.clientY - startY;
  updateTransform();
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

// --- Touch (Mobile) ---
modalImg.addEventListener("touchstart", (e) => {
  if (scale <= 1) return;
  isDragging = true;
  startX = e.touches[0].clientX - translateX;
  startY = e.touches[0].clientY - translateY;
});

modalImg.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  translateX = e.touches[0].clientX - startX;
  translateY = e.touches[0].clientY - startY;
  updateTransform();
});

modalImg.addEventListener("touchend", () => {
  isDragging = false;
});

// Close modal with ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.style.display === "flex") {
    closeModal();
  }
});
