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
            { value: "3", label: "Exam Categories" },
            { value: "7+", label: "Exam Papers" },
            { value: "200+", label: "Questions" },
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
        "Common Entrance", "Cambridge", "Grade 5 Spring", "WAEC",
        "TULIP Questions", "Scholastic Prep", "Grade 4 Spring",
        "Essay Writing", "Formal Letters", "Comprehension",
        "2026 Edition", "New Papers Added", "Practice Now"
    ],
    
    // Section Headers
    sections: {
        exams: {
            title: "Available Examinations",
            subtitle: "Browse · Practice · Master"
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
                    link: "../WAEC/index.html",
                    live: true,
                    status: "Live",
                    description: "West African Senior School Certificate Examination",
                    questions: 120,
                    duration: "180 mins"
                },
                {
                    name: "Grade 4 Spring",
                    link: "../Grade-4-Exam/index.html",
                    live: true,
                    status: "Live",
                    description: "Second term revision for Year 4 students",
                    questions: 80,
                    duration: "120 mins"
                },
                {
                    name: "Grade 5 Spring",
                    link: "../Grade-5-Exam/index.html",
                    live: true,
                    status: "Live",
                    description: "Intensive prep for Year 5 promotional exams",
                    questions: 100,
                    duration: "150 mins"
                },
                {
                    name: "Common Entrance",
                    link: "#",
                    live: false,
                    status: "Coming Soon",
                    description: "National baseline assessments",
                    questions: 0,
                    duration: "TBD"
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
                    link: "../Cambridge/index.html",
                    live: true,
                    status: "Live",
                    description: "International standard papers for primary learners",
                    questions: 90,
                    duration: "120 mins"
                },
                {
                    name: "International Baccalaureate",
                    link: "#",
                    live: false,
                    status: "Coming Soon",
                    description: "IB Diploma Programme preparation",
                    questions: 0,
                    duration: "TBD"
                },
                {
                    name: "SAT Prep",
                    link: "#",
                    live: false,
                    status: "Coming Soon",
                    description: "Scholastic Assessment Test preparation",
                    questions: 0,
                    duration: "TBD"
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
                    link: "../Scholarstic/index.html",
                    live: true,
                    status: "Live",
                    description: "Elite-level competition drills",
                    questions: 150,
                    duration: "180 mins"
                },
                {
                    name: "TULIP Questions",
                    link: "#",
                    live: false,
                    status: "Coming Soon",
                    description: "Exclusive TULIP scholarship entrance",
                    questions: 0,
                    duration: "TBD"
                },
                {
                    name: "Math Olympiad",
                    link: "#",
                    live: false,
                    status: "Coming Soon",
                    description: "International Math Olympiad preparation",
                    questions: 0,
                    duration: "TBD"
                }
            ]
        }
    ],
    
    // Info Strip (About section)
    infoStrip: [
        {
            label: "How to Use",
            title: "Click Any Exam Card",
            description: "Each card opens a complete interactive examination paper with questions, answer submission, and instant scoring."
        },
        {
            label: "Practice Mode",
            title: "Learn While Testing",
            description: "Review answers immediately after submission. Each question includes detailed explanations and worked solutions."
        },
        {
            label: "Track Progress",
            title: "Monitor Your Scores",
            description: "Keep track of your performance across different subjects and identify areas that need improvement."
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
                    { text: "English & Writing", href: "../Writing/index.html" },
                    { text: "Mathematics", href: "../Math/index.html" },
                    { text: "Science", href: "../Science/index.html" },
                    { text: "Social Studies", href: "../Social-Studies/index.html" }
                ]
            },
            {
                title: "Theory",
                links: [
                    { text: "Theory Drill", href: "../Theory-Page/index.html" }
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