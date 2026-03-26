// ============================================
// SCHOLASTIC PREP DATA - Update this file only!
// ============================================

const siteData = {
    // Site Identity
    siteName: "Scholastic Prep",
    siteLogo: "Prep<span>Portal</span>",
    
    // Hero Section
    hero: {
        title: "Scholastic<br>Prep.",
        tagline: "Elite competition drills structured by school level — built for students who aim for the top.",
        stats: [
            { value: "5", label: "Years" },
            { value: "2", label: "Rounds" },
            { value: "2026", label: "Edition" }
        ]
    },
    
    // Navigation
    navigation: [
        { text: "Exams", href: "../index.html#exams" },
        { text: "Writing", href: "../index.html#writing" },
        { text: "About", href: "../index.html#about" },
        { text: "Results", href: "#" }
    ],
    ctaButton: { text: "Choose Year", href: "#categories" },
    
    // Ticker (announcement bar)
    tickerItems: [
        "Scholastic Prep",
        "2021-2025 Papers",
        "First Round",
        "Final Round",
        "Competition Drills",
        "Prep Portal"
    ],
    
    // Section Headers
    sections: {
        exams: {
            title: "Competition Years",
            subtitle: "2021 · 2022 · 2023 · 2024 · 2025"
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
    
    // Categories are the years, items are First Round and Final Round
    examCategories: [
        {
            id: "2021",
            title: "2021 Competition",
            description: "Scholastic competition papers from 2021 with First and Final rounds.",
            badge: "2 Rounds",
            items: [
                { id: "first-round", name: "First Round", link: "./2021/first-round.html", live: true, status: "Available", description: "2021 First Round Competition Paper" },
                { id: "final-round", name: "Final Round", link: "./2021/final-round.html", live: true, status: "Available", description: "2021 Final Round Competition Paper" }
            ]
        },
        {
            id: "2022",
            title: "2022 Competition",
            description: "Scholastic competition papers from 2022 with First and Final rounds.",
            badge: "2 Rounds",
            items: [
                { id: "first-round", name: "First Round", link: "./2022/first-round.html", live: true, status: "Available", description: "2022 First Round Competition Paper" },
                { id: "final-round", name: "Final Round", link: "./2022/final-round.html", live: true, status: "Available", description: "2022 Final Round Competition Paper" }
            ]
        },
        {
            id: "2023",
            title: "2023 Competition",
            description: "Scholastic competition papers from 2023 with First and Final rounds.",
            badge: "2 Rounds",
            items: [
                { id: "first-round", name: "First Round", link: "./2023/first-round.html", live: true, status: "Available", description: "2023 First Round Competition Paper" },
                { id: "final-round", name: "Final Round", link: "./2023/final-round.html", live: true, status: "Available", description: "2023 Final Round Competition Paper" }
            ]
        },
        {
            id: "2024",
            title: "2024 Competition",
            description: "Scholastic competition papers from 2024 with First and Final rounds.",
            badge: "2 Rounds",
            items: [
                { id: "first-round", name: "First Round", link: "./2024/first-round.html", live: true, status: "Available", description: "2024 First Round Competition Paper" },
                { id: "final-round", name: "Final Round", link: "./2024/final-round.html", live: true, status: "Available", description: "2024 Final Round Competition Paper" }
            ]
        },
        {
            id: "2025",
            title: "2025 Competition",
            description: "Scholastic competition papers from 2025 with First and Final rounds.",
            badge: "2 Rounds",
            items: [
                { id: "first-round", name: "First Round", link: "./2025/first-round.html", live: true, status: "Available", description: "2025 First Round Competition Paper" },
                { id: "final-round", name: "Final Round", link: "./2025/final-round.html", live: true, status: "Available", description: "2025 Final Round Competition Paper" }
            ]
        }
    ],
    
    // Subjects (for the subjects section)
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
            label: "What is Scholastic?",
            title: "Academic Competition Prep",
            description: "Scholastic Prep covers all school levels — Lower Primary to Senior Secondary — with drills built for high-stakes academic contests."
        },
        {
            label: "How to use it",
            title: "Pick Your Year. Drill Hard.",
            description: "Select your competition year, work through First Round and Final Round questions, and review your score with full worked solutions."
        },
        {
            label: "Coming soon",
            title: "More Years Dropping",
            description: "Additional competition years and school levels are in active development. New releases each term."
        }
    ],
    
    // CTA Band
    ctaBand: {
        title: "Ready to <em>compete at the top?</em>",
        buttonText: "Start with 2025 →",
        buttonLink: "#categories"
    },
    
    // Footer
    footer: {
        description: "A structured archive of scholastic competition papers, practice tests, and study resources for students preparing for academic contests.",
        copyright: "&copy; 2026 Prep Portal. All rights reserved.",
        sections: [
            {
                title: "Competitions",
                links: [
                    { text: "2021 Papers", href: "#" },
                    { text: "2022 Papers", href: "#" },
                    { text: "2023 Papers", href: "#" },
                    { text: "2024 Papers", href: "#" },
                    { text: "2025 Papers", href: "#" }
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
                    { text: "About", href: "../index.html#about" },
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