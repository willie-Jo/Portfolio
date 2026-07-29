// Toggle Mobile Menu
function toggleMenu(btn) {
    btn.classList.toggle('active');
    document.getElementById('mainNav').classList.toggle('active');
}

// Close menu when a link is click
document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('mainNav').classList.remove('active');
    });
});

// Back to Top Button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 300? 'block' : 'none';
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== SCROLL SPY - SIMPLE + WORKS =====
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // -100 accounts for sticky header
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Smooth scroll for nav links, scroll smoothly instead of jumping
document.querySelectorAll('.main-nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();  // stop the instant jump
        const targetId = this.getAttribute('href');  //get #about, #services, #contact, #projects
        const targetSection = document.querySelector(targetId);
        targetSection.scrollIntoView({behavior: 'smooth', block: 'start'});
    });
});

// Avatar Lightbox
const modal = document.getElementById("avatarModal");
const modalImg = document.getElementById("modalImg");
const avatarLink = document.querySelector(".avatar-link");

avatarLink.onclick = function(e) {
    e.preventDefault();  // stop opening new tab
    modal.style.display = "block";
    modalImg.src = this.href; // uses the large image
}
document.querySelector(".close").onclick = () => modal.style.display = "none";
modal.onclick =  (e) => { if(e.target == modal) modal.style.display = "none";}

// Poject Filters 
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // 1. Don't do anything if button is disabled
            if (btn.disabled) return;

            // 2. Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));

            // 3. Add active to clicked button
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            /*const filter = btn.getAttribute('data-filter');*/
            
            // 3. Show/hide projects
            projectCards.forEach(card => {
                const categories = card.dataset.category;  

                if (filter === 'all') {
                    card.style.display = 'block';
                } else if (categories && categories.includes(filter)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
})
