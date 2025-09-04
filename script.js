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

// Define the maximum border-radius you want to achieve for each side (in pixels)
const maxRadius = 500; // Adjust this value for the desired effect

// Listen for the scroll event on the window
window.addEventListener('scroll', () => {
  // Get the current scroll position
  const scrollPosition = window.scrollY;
  
  // Get the height of the hero section
  const heroHeight = heroSection.offsetHeight;

  // Calculate the scroll percentage within the hero section
  const scrollPercentage = Math.min(scrollPosition / heroHeight, 1);

  // Calculate the new border-radius value
  const newRadius = scrollPercentage * maxRadius;

  // Apply the new border-radius to both bottom sides
  heroSection.style.borderBottomLeftRadius = `${newRadius}px`;
  heroSection.style.borderBottomRightRadius = `${newRadius}px`;
});

// Function to add the 'active' class when an element is visible
function revealOnScroll(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      // Stop observing the element after it has been revealed
      observer.unobserve(entry.target);
    }
  });
}

// Set up the Intersection Observer
const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(revealOnScroll, {
  root: null, // use the viewport as the root
  threshold: 0.15, // trigger when 15% of the element is visible
});

// Observe each of the reveal elements
revealElements.forEach(element => {
  observer.observe(element);
});