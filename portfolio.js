/* ==========================================================================
AUTHOR: William Adejoh
Portfolio Main JS
VERSION: 2.0
DESCRIPTION: Handles asynchronous smooth scrolling, back to top detection,
and custom dynamic category opacity filtering systems.
========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. Smooth Scroll For Navigation Links --- */
    
    const navigationLinks = document.querySelectorAll('a[href^="#"]');   // finds links that start with '#' and glides smoothly to that section
    navigationLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const targetID = link.getAttribute('href');
            const targetSection = document.querySelector(targetID);
            
            if (targetSection) {
                event.preventDefault(); // Stops default instant page jump
                
                // Performs the smooth glide calculation animation
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    /* --- 2. Back-T0-Top Button Display Engine --- */
    // Shows the floating arrow only when the user scrolls down the page
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            // If the page is scrolled down past 300 pixels, reveal the button
            if (window.scrollY > 300) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });
        
        // Slides the browser window smoothly back up to the top coordinate
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    /* --- 3. Dynamic Projects Grid Filter Mechanism --- */
    // Sorts project cards
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-grid .project-card');
    
    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                
                // Swaps the active button styling tab highlight
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Grabs the custom data-filter category name from the clicked button
                const selectedFilter = button.getAttribute('data-filter');
                
                projectCards.forEach(card => {
                    // Splits categories into a readable text array space list
                    const cardCategories = card.getAttribute('data-category').split(' ');
                    
                    // Checks if the card matches the selection or if 'All' is active
                    if (selectedFilter === 'all' || cardCategories.includes(selectedFilter)) {
                        card.classList.remove('hide'); // Reveals card matching choices
                    } else {
                        card.classList.add('hide');   // Hides non-matching project cards
                    }
                });
            });
        });
    }

    /* --- 4. Interactive Light/Dark Theme Mode Switcher --- */
    // This script lets users toggle between light and dark backgrounds smoothly
    const themeToggleButton = document.getElementById('themeToggle');
    const themeIcon = document.querySelector('#themeToggle i');
    
    // Check if the user previously saved a theme preference in their browser cache
    const savedThemePreference = localStorage.getItem('portfolio-theme-layout');
    
    // If they previously selected light theme, apply it immediately on page load
    if (savedThemePreference === 'dark') {
        document.body.classList.add('dark-theme');
        
        // Swap the icon to a sun since light theme is active
        if (themeIcon) {
            themeIcon.className = 'fa-solid fa-sun';
        }
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            
            // Toggle the .light-theme class on the main <body> element tag tracks
            document.body.classList.toggle('dark-theme');
            
            // Check if light mode is currently active after the click transition
            const isCurrentlyLightMode = document.body.classList.contains('dark-theme');
            
            if (isCurrentlyLightMode) {
                // If it is light mode, change the icon font glyph vector to a sun
                if (themeIcon) {
                    themeIcon.className = 'fa-solid fa-sun';
                }
                // Save this choice to browser storage so it stays active across pages
                localStorage.setItem('portfolio-theme-layout', 'dark');
            } else {
                // If it is back to base dark mode, restore the moon icon style
                if (themeIcon) {
                    themeIcon.className = 'fa-solid fa-moon';
                }
                // Save this choice to browser storage so it stays active across pages
                localStorage.setItem('portfolio-theme-layout', 'light');
            }
        });
    }
});
