/*
File: script.js
Description: Controls the image slider. Manages current slide index,
updates transform, generates dots, and handles auto-play.
*/

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelector('.slides');
    const images = document.querySelectorAll('.slides img');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('dotsContainer');
    const slider = document.querySelector('.slider');
    const captionText = document.getElementById('captionText');
    
    let currentIndex = 0;    // Tracks which slide. Starts at 0
    const totalSlides = images.length;
    let autoSlideInterval; // To store our setInterval
    
    // ========== 1. CREATE DOTS DYNAMICALLY ==========
    // create 1 dot for each image
    images.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => goToSlide(index)); // Click dot to jump
        dotsContainer.appendChild(dot);
    });
    const dots = document.querySelectorAll('.dot');
    
    // ========== 2. UPDATE SLIDER POSITION + CAPTION ==========
    function updateSlider() {
        // Move the .slides track left by currentIndex * 100%
        // e.g. slide 2 = -200%
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update caption text from current image's data-caption
        const currentCaption = images[currentIndex].getAttribute('data-caption');
        captionText.style.opacity = 0;    // fade out
        setTimeout(() => {
            captionText.textContent = currentCaption;
            captionText.style.opacity = 1;   // fade in
        }, 200);
        
        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // ========== 3. NAVIGATION FUNCTIONS ==========
    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
        resetAutoSlide(); // Restart timer when user clicks
    }
    
    function nextSlide() {
        // If at last slide, go back to 0. Else +1
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }
    
    function prevSlide() {
        // If at first slide, go to last. Else -1
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }
    
    // ========== 4. AUTO SLIDE ==========
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 3000); // Change every 3 seconds
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }
    
    // ========== 5. EVENT LISTENERS ==========
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });
    
    // Pause auto-slide when mouse is over slider. Resume on leave. Good UX
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
    
    // ========== 6. INITIALIZE ==========
    updateSlider(); // Show first slide + active dot
    startAutoSlide(); // Start auto play
});