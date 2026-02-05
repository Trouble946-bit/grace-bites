// Mobile Menu Toggle
function initMobileMenu() {
  const navbar = document.querySelector('.navbar');
  const navMenu = document.querySelector('.nav-menu');
  const navContainer = document.querySelector('.nav-container');
  
  // Create hamburger menu button if it doesn't exist
  if (!document.querySelector('.hamburger')) {
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    navContainer.appendChild(hamburger);

    // Add hamburger click handler
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu on window resize if screen gets large
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }
}

// Initialize mobile menu on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
  initMobileMenu();
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Form validation is handled in contact.html with WhatsApp integration

// Email validation helper
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Notification system
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background-color: ${type === 'success' ? '#27ae60' : '#e74c3c'};
    color: white;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease;
    font-weight: 500;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Image Lightbox
const pictureBoxes = document.querySelectorAll('.picture-box img');
if (pictureBoxes.length > 0) {
  // Create lightbox HTML
  const lightboxHTML = `
    <div class="lightbox" id="lightbox" style="display:none;">
      <div class="lightbox-content">
        <span class="lightbox-close">&times;</span>
        <button class="lightbox-prev">&#10094;</button>
        <img class="lightbox-image" src="" alt="" />
        <button class="lightbox-next">&#10095;</button>
        <div class="lightbox-caption"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', lightboxHTML);

  let currentImageIndex = 0;
  const images = Array.from(pictureBoxes);

  // Click image to open lightbox
  pictureBoxes.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentImageIndex = index;
      openLightbox();
    });
    img.style.cursor = 'pointer';
  });

  function openLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');

    lightboxImg.src = images[currentImageIndex].src;
    lightboxCaption.textContent = images[currentImageIndex].alt;
    lightbox.style.display = 'flex';
  }

  function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
  }

  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    openLightbox();
  }

  function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    openLightbox();
  }

  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  document.querySelector('.lightbox-next').addEventListener('click', nextImage);
  document.querySelector('.lightbox-prev').addEventListener('click', prevImage);

  // Close lightbox on background click
  document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.style.display === 'flex') {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeLightbox();
    }
  });
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  .lightbox {
    display: none;
    position: fixed;
    z-index: 2000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .lightbox-content {
    position: relative;
    background: white;
    border-radius: 10px;
    max-width: 90%;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
  }

  .lightbox-image {
    max-width: 100%;
    max-height: 70vh;
    object-fit: contain;
  }

  .lightbox-caption {
    padding: 1rem;
    text-align: center;
    font-weight: bold;
    color: #2c3e50;
    width: 100%;
  }

  .lightbox-close {
    position: absolute;
    right: 20px;
    top: 10px;
    font-size: 2rem;
    cursor: pointer;
    color: #2c3e50;
    background: white;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .lightbox-close:hover {
    background-color: #ecf0f1;
  }

  .lightbox-prev,
  .lightbox-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.7);
    border: none;
    font-size: 2rem;
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.2s;
    z-index: 2001;
  }

  .lightbox-prev:hover,
  .lightbox-next:hover {
    background-color: rgba(255, 255, 255, 0.95);
  }

  .lightbox-prev {
    left: 10px;
  }

  .lightbox-next {
    right: 10px;
  }

  @media (max-width: 768px) {
    .lightbox-prev,
    .lightbox-next {
      font-size: 1.5rem;
      padding: 8px 12px;
    }

    .lightbox-close {
      width: 35px;
      height: 35px;
      font-size: 1.5rem;
    }
  }
`;
document.head.appendChild(style);

// Add scroll animation for elements
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.picture-box, .info-box').forEach(element => {
  element.style.opacity = '0';
  observer.observe(element);
});

const fadeInUpStyle = document.createElement('style');
fadeInUpStyle.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(fadeInUpStyle);

// Hero Background Slideshow
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length === 0) return;
  
  let currentSlide = 0;
  
  function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }
  
  // Change slide every 4 seconds
  setInterval(nextSlide, 4000);
}

// Initialize slideshow on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroSlideshow);
} else {
  initHeroSlideshow();
}
