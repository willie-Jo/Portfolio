/*********************************************************************
* File: script.js
* Project: LearnHub - Learning Management System UI
* Author: William Adejoh
* Description: Handles dynamic rendering of course data on the dashboard.
               Uses a dummy courses array and injects course cards into DOM.
               Sidebar navigation, stat cards, course cards, and mobile breakpoints.
               In a production app, this data would come from PHP/MySQL API.
***********************************************************************/  

// Grabs DOM #courseGrid
const courseGrid = document.getElementById('courseGrid');


console.log(courseGrid);

const courses = [
    {title:"PHP", fullTitle: "PHP for Beginners", progress: 80, color: "linear-gradient(135deg,#4f46e5,#6366f1)"},
    {title:"JS", fullTitle: "Modern JavaScript", progress: 45, color: "linear-gradient(135deg,#f59e0b,#fbbf24)"},
    {title:"UI/UX", fullTitle: "UI/UX Design Fundamentals", progress: 60, color: "linear-gradient(135deg,#ec4899,#8b5cf6)"},
    {title:"SQL", fullTitle: "Database with MySQL", progress: 20, color: "linear-gradient(135deg,#22c55e,#0ea5e9)"},
  ];
  
  // Loop through courses array and inject HTML cards into #courseGrid
  function renderCourses(){
    courseGrid.innerHTML = courses.map(course => `
    <div class="course-card">
      <div class="course-thumb" style="background:${course.color}">${course.title}</div
      <div class="course-info">
        <h4>${course.title}</h4>
        <div class="progress-bar">
          <div class="progress" style="width:${course.progress}%"></div>
        </div>
        <p style="font-size:12px; padding:0 0 4px 16px; color:var(--muted); margin-top:4px">${course.progress}% Complete</p>
      </div>
    </div>
  `).join('');    // .join(') converts array of strings to single string
  }

  //Initial render when page loads
  renderCourses(); 