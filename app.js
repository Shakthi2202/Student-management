/* ============================================
   Campus Connect — shared app logic
   ============================================ */

/* ---------- Toast notifications ---------- */

function ensureToastStack(){
    let stack = document.getElementById("toast-stack");
    if(!stack){
        stack = document.createElement("div");
        stack.id = "toast-stack";
        document.body.appendChild(stack);
    }
    return stack;
}

function showToast(message, type, duration){
    type = type || "info";
    duration = duration || 3200;

    const icons = { success:"✓", error:"!", info:"i" };
    const stack = ensureToastStack();

    const toast = document.createElement("div");
    toast.className = "toast " + type;
    toast.innerHTML = "<strong>" + (icons[type] || "i") + "</strong><span>" + message + "</span>";

    stack.appendChild(toast);

    setTimeout(function(){
        toast.classList.add("hide");
        setTimeout(function(){ toast.remove(); }, 250);
    }, duration);
}

/* ---------- Active nav highlighting ---------- */

document.addEventListener("DOMContentLoaded", function(){
    const current = location.pathname.split("/").pop() || "Home.html";
    document.querySelectorAll(".nav").forEach(function(link){
        const href = link.getAttribute("href");
        if(href && href.toLowerCase() === current.toLowerCase()){
            link.classList.add("active");
        }
    });
});

/* ---------- Course data & learning paths ---------- */

const COURSES = [
    {
        id:"Python Programming",
        level:"Beginner",
        duration:"6 weeks",
        desc:"Learn Python from basics to advanced, building real projects along the way.",
        steps:[
            {title:"Python Basics", desc:"Syntax, variables, control flow"},
            {title:"Data Structures", desc:"Lists, tuples, dicts, sets"},
            {title:"Functions & OOP", desc:"Reusable code and classes"},
            {title:"File Handling", desc:"Reading & writing data"},
            {title:"Capstone Project", desc:"Build a complete Python app"}
        ]
    },
    {
        id:"Java Programming",
        level:"Intermediate",
        duration:"8 weeks",
        desc:"Object oriented programming using Java, from fundamentals to multithreading.",
        steps:[
            {title:"Java Syntax & OOP", desc:"Classes, objects, inheritance"},
            {title:"Collections Framework", desc:"Lists, maps, sets in Java"},
            {title:"Exception Handling", desc:"Writing robust code"},
            {title:"Multithreading", desc:"Concurrent programming basics"},
            {title:"Capstone Project", desc:"Build a Java application"}
        ]
    },
    {
        id:"UI / UX Design",
        level:"Beginner",
        duration:"5 weeks",
        desc:"Design beautiful, usable interfaces from first principles to prototypes.",
        steps:[
            {title:"Design Principles", desc:"Color, type, layout basics"},
            {title:"Wireframing", desc:"Sketch low-fidelity screens"},
            {title:"Prototyping", desc:"Interactive high-fidelity mockups"},
            {title:"User Testing", desc:"Validate with real users"},
            {title:"Portfolio Project", desc:"Ship a polished case study"}
        ]
    },
    {
        id:"Machine Learning",
        level:"Advanced",
        duration:"10 weeks",
        desc:"An introduction to machine learning algorithms and how to apply them.",
        steps:[
            {title:"Python for ML", desc:"NumPy, pandas essentials"},
            {title:"Statistics Foundations", desc:"Probability & inference"},
            {title:"Supervised Learning", desc:"Regression & classification"},
            {title:"Unsupervised Learning", desc:"Clustering & dimensionality"},
            {title:"Model Deployment", desc:"Ship a trained model"}
        ]
    },
    {
        id:"Cloud Computing",
        level:"Intermediate",
        duration:"7 weeks",
        desc:"AWS and Google Cloud basics, from core services to deployment.",
        steps:[
            {title:"Cloud Fundamentals", desc:"Core concepts & services"},
            {title:"AWS Essentials", desc:"Compute, storage, networking"},
            {title:"Google Cloud Basics", desc:"GCP core services"},
            {title:"Deployment & DevOps", desc:"CI/CD pipelines"},
            {title:"Capstone Project", desc:"Deploy a cloud app"}
        ]
    }
];

/* ---------- Enrollment & progress storage ---------- */

function getEnrolledCourses(){
    return JSON.parse(localStorage.getItem("courses")) || [];
}

function saveEnrolledCourses(list){
    localStorage.setItem("courses", JSON.stringify(list));
}

function isEnrolled(courseName){
    return getEnrolledCourses().includes(courseName);
}

function enroll(courseName){
    const courses = getEnrolledCourses();

    if(courses.includes(courseName)){
        showToast(courseName + " — you're already enrolled.", "info");
        return false;
    }

    courses.push(courseName);
    saveEnrolledCourses(courses);
    showToast("Enrolled in " + courseName + "!", "success");
    return true;
}

function getAllProgress(){
    return JSON.parse(localStorage.getItem("progress")) || {};
}

function getCourseProgress(courseName){
    const all = getAllProgress();
    return all[courseName] || [];
}

function toggleStep(courseName, stepIndex){
    if(!isEnrolled(courseName)){
        showToast("Enroll in " + courseName + " to track your progress.", "info");
        return;
    }

    const all = getAllProgress();
    const done = all[courseName] || [];
    const pos = done.indexOf(stepIndex);

    if(pos === -1){
        done.push(stepIndex);
        showToast("Marked complete — nice progress!", "success");
    }else{
        done.splice(pos, 1);
    }

    all[courseName] = done;
    localStorage.setItem("progress", JSON.stringify(all));
}

function courseProgressPercent(courseName, totalSteps){
    const done = getCourseProgress(courseName);
    if(!totalSteps) return 0;
    return Math.round((done.length / totalSteps) * 100);
}