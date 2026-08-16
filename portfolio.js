/* =======================================================
* Author: William Adejoh
* Portfolio Website Main JS
* v2.5
* Description:
* Handles mobile nav toggle, back to top button,
* scroll spy for active nav, smooth scrolling,
* avatar lightbox, project filtering, and dragable 
* Hire-me-button on mobile/tablet screen.
======================================================== */

document.addEventListener('DOMContentLoaded', () => {
    /* ===== 1. MOBILE MENU TOGGLE ===== */
    window.toggleMenu = (btn) => { // global for onclick
        btn.classList.toggle('active');
        document.getElementById('mainNav').classList.toggle('active');
    };
    
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('mainNav').classList.remove('active');
            document.querySelector('.hamburger').classList.remove('active');
        });
    });
    
    /* ===== 2. BACK TO TOP ===== */
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backToTop.style.display = window.scrollY > 300? 'block' : 'none';
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    
    /* ===== 3. SCROLL SPY + SMOOTH SCROLL ===== */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(link.getAttribute('href')).scrollIntoView({behavior: 'smooth'});
        });
    });
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => { if (pageYOffset >= section.offsetTop - 120) current = section.id });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    });
    
    /* ===== 4. AVATAR LIGHTBOX ===== */
    const modal = document.getElementById("avatarModal");
    const modalImg = document.getElementById("modalImg");
    document.querySelector(".avatar-link")?.addEventListener('click', (e) => {
        e.preventDefault(); modal.style.display = "block"; modalImg.src = e.currentTarget.href;
    });
    document.querySelector(".close").onclick = () => modal.style.display = "none";
    modal.onclick = (e) => { if(e.target == modal) modal.style.display = "none";}
    
    /* ===== 5. PROJECT FILTERS ===== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            filterBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
            const filter = btn.dataset.filter;
            projectCards.forEach(card => {
                card.style.display = (filter === 'all' || card.dataset.category.includes(filter))? 'flex' : 'none';
            });
        });
    });
    
    /* ===== 6. DRAGGABLE HIRE ME BUTTON ===== */
    const dragBtn = document.querySelector('.floating-cta');
    let isDragging = false, offsetX, offsetY;
    dragBtn.addEventListener('touchstart', (e) => {
        isDragging = true; 
        const touch = e.touches[0];
        offsetX = touch.clientX - dragBtn.getBoundingClientRect().left;
        offsetY = touch.clientY - dragBtn.getBoundingClientRect().top;
    });
    dragBtn.addEventListener('touchmove', (e) => {
        if(!isDragging) return; 
        e.preventDefault();
        const touch = e.touches[0];
        dragBtn.style.right = 'auto'; 
        dragBtn.style.bottom = 'auto';
        dragBtn.style.left = `${touch.clientX - offsetX}px`;
        dragBtn.style.top = `${touch.clientY - offsetY}px`;
    });
    dragBtn.addEventListener('touchend', () => {
        isDragging = false;
        document.body.classList.remove('dragging');
    });
    

    /*// CONFIGURATION: Replace these with your actual GitHub details
    const GITHUB_USERNAME = "willie-Jo";
    const REPO_NAME = "Portfolio";
    const BRANCH = "main"; 
    const FOLDER_PATH = "projects";   // folder containing individual projects
    
    const container = document.getElementById("projects-grid");
    
    // GitHub REST API endpoint to get folder contents
    const apiUrl = `https://github.com{GITHUB_USERNAME}/${REPO_NAME}/contents/${FOLDER_PATH}?ref=${BRANCH}`;
    
    // Fetch data from GitHub
    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Filter out files (like READMEs) and keep only subfolders (dir)
        const projectFolders = data.filter(item => item.type === "dir");
        
        if (projectFolders.length === 0) {
            container.innerHTML = "<p>No projects found.</p>";
            return;
        }
        
        // Clear any loading text
        container.innerHTML = "";
        
        // Loop through each folder and build the card template
        projectFolders.forEach(project => {
            // Format folder name into a clean title (e.g., "my-weather-app" -> "My Weather App")
            const cleanTitle = project.name
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, char => char.toUpperCase());
            
            // Generate the GitHub source code URL dynamically
            const sourceCodeUrl = project.html_url;
            
            // Create the card element
            const card = document.createElement("div");
            card.className = "project-card";
            
            // Inject the HTML template for the card
            card.innerHTML = `
            <h3>${cleanTitle}</h3>
            <p>Source code directory for the ${cleanTitle} project.</p>
            <div class="project-links">
            <a href="${sourceCodeUrl}" target="_blank" class="btn btn-code">View Code</a>
            </div>
            `;
            
            // Append the new card to the container
            container.appendChild(card);
        });
    })
    .catch(error => {
        console.error("Error fetching projects:", error);
        container.innerHTML = "<p>Failed to load projects from GitHub.</p>";
    });*/
    
    
});