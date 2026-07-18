// Toggle Mobile Menu
function toggleMenu(btn) {
    document.getElementById('mainNav').classList.toggle('active');
    /*btn.classList.toggle('active');*/
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

// ===== Poject Filters 

const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 1. Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // 2. Add active to clicked button
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        // 3. Show/hide projects
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});