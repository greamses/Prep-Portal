// ============================================
// BLOG MASTER DATA - Connects to main.js
// ============================================

const siteData = {
    // Site Identity
    siteName: "PrepPortal Blogs",
    siteLogo: "Prep<span>Portal</span>",
    
    // Hero Section
    hero: {
        title: "Blog <br>Portal.",
        tagline: "Insights, study strategies, and exam updates — curated for students who want to stay ahead.",
        stats: [
            { value: "500+", label: "Articles" },
            { value: "5", label: "Core Categories" },
            { value: "Daily", label: "Updates" },
            { value: "Expert", label: "Study Tips" },
            { value: "24/7", label: "Access" }
        ]
    },
    
    // Navigation
    navigation: [
        { text: "Dashboard", href: "../dashboard.html" },
        { text: "Archives", href: "#exams" },
        { text: "Academic Hubs", href: "#subjects" },
        { text: "Updates", href: "#theory" },
        { text: "About", href: "#info-strip" }
    ],
    ctaButton: { text: "Start Reading", href: "#exams" },
    
    // Ticker (announcement bar)
    tickerItems: [
        "WAEC Timetable Out", "JAMB Registration Tips", "Science Deep Dives",
        "Math Hacks", "Literacy & Essay Writing", "General Study Tips",
        "Cambridge A-Level Advice", "Overcoming Exam Anxiety", "New Articles Added"
    ],
    
    // Section Headers
    sections: {
        exams: {
            title: "Article Archives",
            subtitle: "Academics · Strategies · News"
        },
        subjects: {
            eyebrow: "Subject-Based Articles",
            title: "Academic Hubs",
            description: "Deep dives into complex topics, simplified explanations, and subject-specific study strategies.",
            tag: "All Hubs"
        },
        theory: {
            eyebrow: "News & Announcements",
            title: "Exam Updates",
            description: "Stay informed with the latest timetables, registration deadlines, and syllabus changes for national and international exams.",
            tag: "Live Updates"
        }
    },
    
    // Blog Categories (Mapped to the original 'examCategories' renderer)
    examCategories: [
        {
            id: "academic",
            title: "Academic Focus",
            description: "Subject-specific articles designed to break down difficult topics into easy-to-understand concepts.",
            badge: "/Blogs/Academic/",
            items: [
                {
                    name: "Science Blogs",
                    link: "./science-blog/blog.html",
                    live: true,
                    status: "Updated"
                },
                {
                    name: "Math Blogs",
                    link: "#",
                    live: false,
                    status: "Coming Soon"
                },
                {
                    name: "Literacy Blogs",
                    link: "./literacy-blog/blog.html",
                    live: true,
                    status: "Updated"
                }
            ]
        },
        {
            id: "prep",
            title: "Prep & Strategy",
            description: "Study techniques, time management, and mental preparation for high-stakes exams.",
            badge: "/Blogs/Strategy/",
            items: [
                {
                    name: "General Blogs",
                    link: "./genera-blog/blog.html",
                    live: true,
                    status: "Live"
                },
                {
                    name: "Exam Techniques",
                    link: "./general/blogs.html",
                    live: false,
                    status: "Coming Soon"
                },
                {
                    name: "University Admissions",
                    link: "#",
                    live: false,
                    status: "Coming Soon"
                }
            ]
        },
        {
            id: "news",
            title: "News & Alerts",
            description: "Official announcements, timetable releases, and syllabus updates.",
            badge: "/Blogs/News/",
            items: [
                {
                    name: "Exam Updates",
                    link: "./updates/index.html",
                    live: true,
                    status: "Trending"
                },
                {
                    name: "Scholarship Alerts",
                    link: "#",
                    live: false,
                    status: "Coming Soon"
                }
            ]
        }
    ],
    
    // Subject Cards (Mapped to the original 'subjects' renderer)
    subjects: [
        {
            name: "Science Blogs",
            description: "Physics formulas explained, Biology processes simplified, and Chemistry reactions decoded.",
            link: "./science-blog/blog.html",
            color: "green",
            badge: "/Hub/Science/",
            cta: "Read Articles"
        },
        {
            name: "Literacy Blogs",
            description: "Essay structures, comprehension strategies, vocabulary building, and grammar rules.",
            link: "./literacy-blog/blog.html",
            color: "blue",
            badge: "/Hub/Literacy/",
            cta: "Read Articles"
        },
        // {
        //     name: "Math Blogs",
        //     description: "Step-by-step problem solving, algebra hacks, geometry proofs, and calculus basics.",
        //     link: "./math-blog/blogs.html",
        //     color: "yellow",
        //     badge: "/Hub/Math/",
        //     cta: "Read Articles"
        // },
        {
            name: "General Blogs",
            description: "Study motivation, timetable planning, and tips for balancing school and life.",
            link: "./general-blog/blog.html",
            color: "amber",
            badge: "/Hub/General/",
            cta: "Read Articles"
        }
    ],
    
    drills: [
        {
            name: "Exam Updates Hub",
            description: "WAEC Timetables · JAMB Cut-off Marks · NECO Registration · Cambridge Deadlines",
            link: "./updates/index.html",
            color: "red",
            badge: "/News/Updates/",
            cta: "View Latest News"
        }
    ],
    
    // Info Strip (About section)
    infoStrip: [
        {
            label: "What is the Blog Portal?",
            title: "Your Academic Companion",
            description: "More than just past papers, we provide the context, strategies, and news you need to approach your exams with absolute confidence."
        },
        {
            label: "How to use it",
            title: "Read. Apply. Succeed.",
            description: "Browse our academic hubs for subject help, or check the General blogs for study routines that actually work."
        },
        {
            label: "Always fresh",
            title: "Auto-Updated Content",
            description: "Our AI publishers ensure that new science explanations, literacy guides, and exam updates are added continuously."
        }
    ],
    
    // CTA Band
    ctaBand: {
        title: "Ready to <em>test your knowledge?</em>",
        buttonText: "Go to Exams Dashboard →",
        buttonLink: "../index.html"
    },
    
    // Footer
    footer: {
        description: "A structured archive of academic articles and updates for students preparing for high-stakes examinations in 2026.",
        copyright: "&copy; 2026 Prep Portal. All rights reserved.",
        sections: [
            {
                title: "Categories",
                links: [
                    { text: "Academic Focus", href: "#exams" },
                    { text: "Prep & Strategy", href: "#exams" },
                    { text: "News & Alerts", href: "#exams" }
                ]
            },
            {
                title: "Hubs",
                links: [
                    { text: "Science Blogs", href: "./science-blog/blogs.html" },
                    // { text: "Math Blogs", href: "./math-blog/blogs.html" },
                    { text: "Literacy Blogs", href: "./literacy-blog/blog.html" },
                    { text: "General Blogs", href: "./general-blog/blog.html" }
                ]
            },
            {
                title: "Updates",
                links: [
                    { text: "Exam News", href: "./updates/index.html" }
                ]
            },
            {
                title: "Portal",
                links: [
                    { text: "Main Dashboard", href: "../index.html" },
                    { text: "Theory Drills", href: "../theory-page/index.html" }
                ]
            }
        ],
        bottomLinks: [
            { text: "Terms", href: "#" },
            { text: "Privacy", href: "#" },
            { text: "Sitemap", href: "#" }
        ]
    }
};