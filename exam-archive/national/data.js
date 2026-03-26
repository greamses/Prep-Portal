// ============================================
// EXAM ARCHIVE DATA - Update this file only!
// ============================================

const siteData = {
    // Site Identity
    siteName: "Exam Archive",
    siteLogo: "Prep<span>Portal</span>",
    
    // Hero Section
    hero: {
        title: "Exam<br>Archive.",
        tagline: "Complete collection of past examination papers, practice tests, and assessment materials across all academic levels.",
        stats: [
            { value: "5", label: "Exam Papers" },
            { value: "500+", label: "Questions" },
            { value: "4", label: "Resources" },
            { value: "2026", label: "Edition" }
        ]
    },
    
    // Navigation
    navigation: [
        { text: "Exams", href: "#exams" },
        { text: "Subjects", href: "../index.html#subjects" },
        { text: "Theory Drill", href: "../index.html#theory" },
        { text: "About", href: "#about" }
    ],
    ctaButton: { text: "Start Revising", href: "#exams" },
    
    // Ticker (announcement bar)
    tickerItems: [
        "WAEC", "NECO", "JAMB", "Common Entrance", "Level Exams",
        "Scheme of Work", "Exam Brochure", "Study Materials",
        "2026 Edition", "New Papers Added", "Practice Now"
    ],
    
    // Section Headers
    sections: {
        exams: {
            title: "National Examinations",
            subtitle: "Practice · Resources · Master"
        },
        subjects: {
            eyebrow: "Subjects",
            title: "Subject Areas",
            description: "Comprehensive coverage across all core subjects with detailed explanations.",
            tag: "4 Subjects"
        },
        theory: {
            eyebrow: "Theory Drill",
            title: "Theory Practice",
            description: "Essay questions and structured answers to build strong theoretical foundations.",
            tag: "Coming Soon"
        }
    },
    
    // Exam Categories - National Exams with Practice and Resources
    examCategories: [
        {
            id: "practice",
            title: "Practice Exams",
            description: "Interactive examination papers with questions, answers, and instant scoring.",
            badge: "5 Papers Available",
            items: [
                {
                    name: "WAEC",
                    link: "../WAEC/index.html",
                    live: true,
                    status: "Practice",
                    description: "West African Senior School Certificate Examination",
                    questions: 120,
                    duration: "180 mins"
                },
                {
                    name: "NECO",
                    link: "../NECO/index.html",
                    live: false,
                    status: "Practice",
                    description: "National Examination Council senior secondary certification",
                    questions: 120,
                    duration: "180 mins"
                },
                {
                    name: "JAMB",
                    link: "../JAMB/index.html",
                    live: true,
                    status: "Practice",
                    description: "Joint Admissions and Matriculation Board UTME preparation",
                    questions: 180,
                    duration: "120 mins"
                },
                {
                    name: "Common Entrance",
                    link: "../common-entrance/index.html",
                    live: true,
                    status: "Practice",
                    description: "National common entrance examination for secondary admission",
                    questions: 100,
                    duration: "120 mins"
                },
                {
                    name: "Level Exams",
                    link: "../level-exams/index.html",
                    live: true,
                    status: "Practice",
                    description: "Grade-level promotional examinations and assessments",
                    questions: 80,
                    duration: "90 mins"
                }
            ]
        },
        {
            id: "resources",
            title: "Study Resources",
            description: "Supporting materials including scheme of work, brochures, and study guides.",
            badge: "4 Resources",
            items: [
                {
                    name: "Scheme of Work",
                    link: "../scheme-of-work/index.html",
                    live: true,
                    status: "Available",
                    description: "Complete curriculum breakdown and termly teaching schedules for all subjects",
                    fileType: "PDF",
                    size: "2.5 MB"
                },
                {
                    name: "Exam Brochure",
                    link: "../brochure/index.html",
                    live: true,
                    status: "Available",
                    description: "Official examination guidelines, syllabus, and registration information",
                    fileType: "PDF",
                    size: "1.8 MB"
                },
                {
                    name: "Study Materials",
                    link: "../study-materials/index.html",
                    live: true,
                    status: "Available",
                    description: "Comprehensive notes, revision guides, and topic summaries",
                    fileType: "Mixed",
                    size: "15 MB"
                },
                {
                    name: "Past Questions",
                    link: "../past-questions/index.html",
                    live: true,
                    status: "Available",
                    description: "Collection of previous examination papers with answer keys",
                    fileType: "PDF/ZIP",
                    size: "25 MB"
                }
            ]
        }
    ],
    
    // Subjects
    subjects: [
        {
            name: "English & Writing",
            link: "../Writing/index.html",
            color: "english",
            description: "Comprehensive English language and composition practice",
            badge: "Essay, Comprehension, Grammar",
            cta: "Start Writing"
        },
        {
            name: "Mathematics",
            link: "../Math/index.html",
            color: "math",
            description: "Arithmetic, algebra, geometry, and problem-solving",
            badge: "Numbers, Algebra, Geometry",
            cta: "Solve Problems"
        },
        {
            name: "Science",
            link: "../Science/index.html",
            color: "science",
            description: "Basic science, biology, chemistry, and physics fundamentals",
            badge: "Biology, Chemistry, Physics",
            cta: "Explore Science"
        },
        {
            name: "Social Studies",
            link: "../Social-Studies/index.html",
            color: "social",
            description: "Civics, history, geography, and cultural studies",
            badge: "History, Geography, Civics",
            cta: "Learn More"
        }
    ],
    
    // Drills
    drills: [
        {
            name: "Essay Writing",
            link: "../Theory-Page/index.html",
            color: "essay",
            description: "Practice structured essay writing with guided templates",
            badge: "Coming Soon",
            cta: "Coming Soon"
        },
        {
            name: "Formal Letters",
            link: "../Theory-Page/index.html",
            color: "letters",
            description: "Master the art of writing formal and official correspondence",
            badge: "Coming Soon",
            cta: "Coming Soon"
        },
        {
            name: "Comprehension",
            link: "../Theory-Page/index.html",
            color: "comprehension",
            description: "Develop critical reading and analysis skills",
            badge: "Coming Soon",
            cta: "Coming Soon"
        }
    ],
    
    // Info Strip
    infoStrip: [
        {
            label: "Practice Mode",
            title: "Interactive Exams",
            description: "Click any exam card to access complete interactive examination papers with questions, answer submission, and instant scoring."
        },
        {
            label: "Resources",
            title: "Study Materials",
            description: "Access scheme of work, exam brochures, past questions, and comprehensive study guides for effective preparation."
        },
        {
            label: "Track Progress",
            title: "Monitor Performance",
            description: "Keep track of your scores across different subjects and identify areas that need improvement."
        }
    ],
    
    // CTA Band
    ctaBand: {
        title: "Ready to <em>ace your exam?</em>",
        buttonText: "Start Practicing →",
        buttonLink: "#exams"
    },
    
    // Footer
    footer: {
        description: "A structured archive of past papers, practice tests, and study resources for students preparing for national examinations.",
        copyright: "&copy; 2026 Prep Portal. All rights reserved.",
        sections: [
            {
                title: "Exams",
                links: [
                    { text: "WAEC", href: "../WAEC/index.html" },
                    { text: "NECO", href: "../NECO/index.html" },
                    { text: "JAMB", href: "../JAMB/index.html" },
                    { text: "Common Entrance", href: "../common-entrance/index.html" },
                    { text: "Level Exams", href: "../level-exams/index.html" }
                ]
            },
            {
                title: "Resources",
                links: [
                    { text: "Scheme of Work", href: "../scheme-of-work/index.html" },
                    { text: "Exam Brochure", href: "../brochure/index.html" },
                    { text: "Study Materials", href: "../study-materials/index.html" },
                    { text: "Past Questions", href: "../past-questions/index.html" }
                ]
            },
            {
                title: "Subjects",
                links: [
                    { text: "English & Writing", href: "../Writing/index.html" },
                    { text: "Mathematics", href: "../Math/index.html" },
                    { text: "Science", href: "../Science/index.html" },
                    { text: "Social Studies", href: "../Social-Studies/index.html" }
                ]
            },
            {
                title: "Info",
                links: [
                    { text: "About", href: "#about" },
                    { text: "Study Guides", href: "#" },
                    { text: "Contact", href: "#" },
                    { text: "Privacy", href: "#" }
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