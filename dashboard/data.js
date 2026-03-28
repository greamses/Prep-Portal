// ============================================
// MASTER DATA - Update this file only!
// ============================================

const siteData = {
    // Site Identity
    siteName: "PrepPortal",
    siteLogo: "Prep<span>Portal</span>",
    
    // Hero Section
    hero: {
        title: "Prep <br>Portal.",
        tagline: "A curated vault of past papers, worked solutions, and prep kits — built for students who take results seriously.",
        stats: [
            { value: "50+", label: "Practice Papers" },
            { value: "1000+", label: "Questions" },
            { value: "30+", label: "Subjects" },
            { value: "Wide", label: "Teachers Resources" },
            { value: "24/7", label: "Access" }
        ]
    },
    
    // Navigation
    navigation: [
        { text: "Exams", href: "#exams" },
        { text: "Subjects", href: "#subjects" },
        { text: "Theory Drill", href: "#theory" },
        { text: "About", href: "#about" }
    ],
    ctaButton: { text: "Start Revising", href: "#exams" },
    
    // Ticker (announcement bar)
    tickerItems: [
        "Common Entrance", "Cambridge", "Grade 5 Spring", "WAEC",
        "TULIP Questions", "Scholastic Prep", "Grade 4 Spring",
        "Essay Writing", "Formal Letters", "Comprehension",
        "2026 Edition", "New Papers Added", "Practice Now"
    ],
    
    // Section Headers
    sections: {
        exams: {
            title: "Exam Archives",
            subtitle: "National · International · Competition"
        },
        subjects: {
            eyebrow: "Subject-Based Resources",
            title: "Subject Exams",
            description: "Comprehensive subject-specific exam materials, practice questions, and revision guides across all core disciplines.",
            tag: "All Subjects"
        },
        theory: {
            eyebrow: "Practice & Revision",
            title: "Theory Drill",
            description: "Structured theory questions, worked examples, and detailed explanations to reinforce key concepts across all subjects.",
            tag: "Drill Mode"
        }
    },
    
    // Exam Categories - The 3 main folders
    examCategories: [
        {
            id: "national",
            title: "National Exams",
            description: "Standardized assessments for national curricula and transition examinations.",
            badge: "/Exams/National/",
            items: [
                {
                    name: "WAEC",
                    link: "./exam-archive/national/WAEC/index.html",
                    live: true,
                    status: "Live"
                },
                {
                    name: "NECO",
                    link: "./exam-archive/national/NECO/index.html",
                    live: true,
                    status: "Live"
                },
                {
                    name: "JAMB",
                    link: "./exam-archive/national/JAMB/index.html",
                    live: true,
                    status: "Live"
                },
                {
                    name: "Common Entrance",
                    link: "#",
                    live: false,
                    status: "Coming Soon"
                }
            ]
        },
        {
            id: "international",
            title: "International Exams",
            description: "Globally recognized qualifications and international benchmark assessments.",
            badge: "/Exams/International/",
            items: [
                {
                    name: "Cambridge Exam",
                    link: "./Cambridge/index.html",
                    live: true,
                    status: "Live"
                },
                {
                    name: "International Baccalaureate",
                    link: "#",
                    live: false,
                    status: "Coming Soon"
                },
                {
                    name: "SAT Prep",
                    link: "#",
                    live: false,
                    status: "Coming Soon"
                }
            ]
        },
        {
            id: "competition",
            title: "Competition Exams",
            description: "Elite-level scholarship and academic competition preparation materials.",
            badge: "/Exams/Competition/",
            items: [
                {
                    name: "Scholastic Prep",
                    link: "./exam-archive/competitions/scholastic/index.html",
                    live: true,
                    status: "Live"
                },
                {
                    name: "TULIP Questions",
                    link: "#",
                    live: false,
                    status: "Coming Soon"
                },
                {
                    name: "Math Olympiad",
                    link: "#",
                    live: false,
                    status: "Coming Soon"
                }
            ]
        }
    ],
    
    // Subject Cards
    subjects: [
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
    ],
    
    // Drill Cards
    drills: [
        {
            name: "Theory Drill Hub",
            description: "Subject-Specific Drills · Worked Examples · Step-by-Step Solutions · Exam-Style Questions",
            link: "../theory-page/index.html",
            color: "red",
            badge: "/Theory-Page/",
            cta: "Start Drilling"
        }
    ],
    
    // Info Strip (About section)
    infoStrip: [
        {
            label: "What is Prep Portal?",
            title: "Built for Exam Season",
            description: "A structured study resource covering national and international exam boards — from Common Entrance to WAEC, all in one place."
        },
        {
            label: "How to use it",
            title: "Click. Practice. Review.",
            description: "Each exam opens a full interactive paper. Answer questions, check your score, and review worked solutions immediately."
        },
        {
            label: "Coming soon",
            title: "More Sets Dropping",
            description: "Grade 4 Spring, TULIP Questions, and Scholastic Prep are in active development. Check back each term for new releases."
        }
    ],
    
    // CTA Band
    ctaBand: {
        title: "Ready to <em>raise your grade?</em>",
        buttonText: "Browse All Exams →",
        buttonLink: "#exams"
    },
    
    // Footer
    footer: {
        description: "A structured archive of past papers and prep kits for students preparing for high-stakes examinations in 2026.",
        copyright: "&copy; 2026 Prep Portal. All rights reserved.",
        sections: [
            {
                title: "Exams",
                links: [
                    { text: "National Exams", href: "#exams" },
                    { text: "International Exams", href: "#exams" },
                    { text: "Competition Exams", href: "#exams" }
                ]
            },
            {
                title: "Subjects",
                links: [
                    { text: "English & Writing", href: "./Writing/index.html" },
                    { text: "Mathematics", href: "./Math/index.html" },
                    { text: "Science", href: "./Science/index.html" },
                    { text: "Social Studies", href: "./Social-Studies/index.html" }
                ]
            },
            {
                title: "Theory",
                links: [
                    { text: "Theory Drill", href: "./Theory-Page/index.html" }
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