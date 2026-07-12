//Auto highlight active nav link
/*document.addEventListener("DOMContentLoaded", function() {
	// Auto active nav link
	const currentPage = window.location.pathname.split("/").pop() || "index.html";
	const navLinks = document.querySelectorAll(".main-nav a");

	navLinks.forEach(link => {
		const linkPage = link.getAttribute("href");
		if (linkPage === currentPage) {
			link.classList.add("active");
		}
	});

	// Mobile Hamburger Menu toggle
	const hamburger = document.querySelector(".hamburger");
	const mainNav = document.querySelector(".main-nav");

	hamburger.addEventListener("click", () => {
		mainNav.classList.toggle("active");
	});
});*/

function toggleMenu(el) {
	document.getElementById("mainNav").classList.toggle("active");
	el.classList.toggle("active");  // this makes the x 
}


// Show button when user scrolls 300px down
const btn = document.getElementById("backToTop");

window.onscroll = function() {
	if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
		btn.style.display = "block";
	} else {
		btn.style.display = "none";
	}
};

// Scroll to top smoothly when clicked
btn.onclick = function() {
	window.scrollTo({top: 0, behavior: 'smooth'});
};