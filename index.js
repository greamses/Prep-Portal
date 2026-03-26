// ============================================
// DATA
// ============================================

// Ticker items
const tickerItems = [
    "Common Entrance", "Cambridge", "Grade 5 Spring", "WAEC",
    "TULIP Questions", "Scholastic Prep", "Grade 4 Spring",
    "Essay Writing", "Formal Letters", "Comprehension",
    "2026 Edition", "New Papers Added", "Interactive Quizzes"
];

// Category data
const categories = [
    {
        title: "National Exams",
        description: "Standardized assessments for national curricula and transition examinations.",
        badge: "/Exams/National/",
        items: [
            { name: "Common Entrance", link: "#", status: "coming", live: false },
            { name: "WAEC", link: "./WAEC/index.html", status: "live", live: true },
            { name: "Grade 4 Spring", link: "./Grade-4-Exam/index.html", status: "live", live: true },
            { name: "Grade 5 Spring", link: "./Grade-5-Exam/index.html", status: "live", live: true }
        ]
    },
    {
        title: "International Exams",
        description: "Globally recognized qualifications and international benchmark assessments.",
        badge: "/Exams/International/",
        items: [
            { name: "Cambridge Exam", link: "./Cambridge/index.html", status: "live", live: true },
            { name: "International Baccalaureate", link: "#", status: "coming", live: false },
            { name: "SAT Prep", link: "#", status: "coming", live: false }
        ]
    },
    {
        title: "Competition Exams",
        description: "Elite-level scholarship and academic competition preparation materials.",
        badge: "/Exams/Competition/",
        items: [
            { name: "Scholastic Prep", link: "./Scholarstic/index.html", status: "live", live: true },
            { name: "TULIP Questions", link: "#", status: "coming", live: false },
            { name: "Math Olympiad", link: "#", status: "coming", live: false }
        ]
    }
];

// Subject data
const subjects = [
    {
        name: "English & Writing",
        description: "Essay · Letter Writing · Comprehension · Summary · Speech · Report",
        link: "./Writing/index.html",
        color: "blue",
        badge: "/Writing/",
        cta: "Explore"
    },
    {
        name: "Mathematics",
        description: "Arithmetic · Algebra · Geometry · Calculus · Statistics",
        link: "./Math/index.html",
        color: "yellow",
        badge: "/Math/",
        cta: "Explore"
    },
    {
        name: "Science",
        description: "Biology · Chemistry · Physics · Integrated Science",
        link: "./Science/index.html",
        color: "green",
        badge: "/Science/",
        cta: "Explore"
    },
    {
        name: "Social Studies",
        description: "History · Geography · Government · Civic Education",
        link: "./Social-Studies/index.html",
        color: "amber",
        badge: "/Social-Studies/",
        cta: "Explore"
    }
];

// Drill data
const drills = [
    {
        name: "Theory Drill Hub",
        description: "Subject-Specific Drills · Worked Examples · Step-by-Step Solutions · Exam-Style Questions",
        link: "./theory-page/index.html",
        color: "red",
        badge: "/Theory-Page/",
        cta: "Start Drilling"
    }
];

// ============================================
// DYNAMIC GENERATION FUNCTIONS
// ============================================

// Generate category cards
function generateCategoryCards() {
    const container = document.getElementById('category-grid');
    if (!container) return;
    
    categories.forEach(category => {
        const card = document.createElement('div');
        card.className = 'card category-card';
        
        const itemList = document.createElement('div');
        itemList.className = 'item-list';
        
        category.items.forEach(item => {
            const link = document.createElement('a');
            link.href = item.link;
            link.className = 'list-item';
            link.innerHTML = `
                <span>${item.name}</span>
                <span class="status ${item.status === 'live' ? 'live' : ''}">${item.status === 'live' ? 'Live' : 'Coming Soon'}</span>
            `;
            if (!item.live) link.style.opacity = '0.6';
            itemList.appendChild(link);
        });
        
        card.innerHTML = `
            <div class="card-inner">
                <h3>${category.title}</h3>
                <p>${category.description}</p>
                ${itemList.outerHTML}
                <span class="badge">${category.badge}</span>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Generate subject cards
function generateSubjectCards() {
    const container = document.getElementById('subject-grid');
    if (!container) return;
    
    subjects.forEach(subject => {
        const card = document.createElement('a');
        card.href = subject.link;
        card.className = `subject-card ${subject.color} section-link`;
        card.innerHTML = `
            <div class="subject-card-inner">
                <h3>${subject.name}</h3>
                <p>${subject.description}</p>
                <span class="badge">${subject.badge}</span>
                <div class="card-arrow">→ ${subject.cta}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Generate drill cards
function generateDrillCards() {
    const container = document.getElementById('drill-grid');
    if (!container) return;
    
    drills.forEach(drill => {
        const card = document.createElement('a');
        card.href = drill.link;
        card.className = `subject-card ${drill.color} section-link`;
        card.innerHTML = `
            <div class="subject-card-inner">
                <h3>${drill.name}</h3>
                <p>${drill.description}</p>
                <span class="badge">${drill.badge}</span>
                <div class="card-arrow">→ ${drill.cta}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Generate footer subject links
function generateFooterLinks() {
    const container = document.getElementById('footer-subjects');
    if (!container) return;
    
    subjects.forEach(subject => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${subject.link}">${subject.name}</a>`;
        container.appendChild(li);
    });
}

// ============================================
// TICKER GENERATION
// ============================================

function generateTicker() {
    const tickerTrack = document.getElementById('ticker-track');
    if (!tickerTrack) return;
    
    [...tickerItems, ...tickerItems].forEach(t => {
        const s = document.createElement('span');
        s.className = 'ticker-item';
        s.innerHTML = t + '<span class="ticker-dot"></span>';
        tickerTrack.appendChild(s);
    });
}

// ============================================
// SPLIT TEXT ANIMATION
// ============================================

function splitText(el) {
    if (!el) return;
    const lines = el.innerHTML.split('<br>');
    el.innerHTML = '';
    lines.forEach((line, li) => {
        const div = document.createElement('div');
        div.style.display = 'block';
        line.split('').forEach((char, ci) => {
            const wrapper = document.createElement('span');
            wrapper.className = 'char-wrapper';
            const span = document.createElement('span');
            span.className = 'char';
            span.innerHTML = char === ' ' ? '&nbsp;' : char;
            span.style.transitionDelay = `${li * 0.2 + ci * 0.03}s`;
            wrapper.appendChild(span);
            div.appendChild(wrapper);
        });
        el.appendChild(div);
    });
}

// ============================================
// REVEAL OBSERVER
// ============================================

function initRevealObserver() {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                revealObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    // Nav toggle
    const toggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('open');
            navLinks.classList.toggle('open');
        });
    }
    
    // Nav shadow on scroll
    const siteNav = document.querySelector('.site-nav');
    if (siteNav) {
        window.addEventListener('scroll', () => {
            siteNav.style.boxShadow = window.scrollY > 10 ? '0 4px 0 0 #0a0a0a' : 'none';
        }, { passive: true });
    }
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    // Generate all dynamic content
    generateTicker();
    generateCategoryCards();
    generateSubjectCards();
    generateDrillCards();
    generateFooterLinks();
    
    // Initialize animations and interactions
    splitText(document.getElementById('main-title'));
    initRevealObserver();
    initNavigation();
    
    // Activate body for animations
    window.onload = () => document.body.classList.add('active');
}

// Start everything when DOM is ready
document.addEventListener('DOMContentLoaded', init);

console.log('hello')