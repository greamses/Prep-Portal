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
            { value: "5", label: "Categories" },
            { value: "1", label: "Live Now" },
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
    ctaButton: { text: "Choose Level", href: "#categories" },
    
    // Ticker (announcement bar)
    tickerItems: [
        "Scholastic Prep",
        "Upper Primary",
        "Lower Primary",
        "Middle Primary",
        "Junior Secondary",
        "Senior Secondary",
        "2026 Edition",
        "Competition Drills",
        "Prep Portal"
    ],
    
    // Section Headers
    sections: {
        exams: {
            title: "All Categories",
            subtitle: "5 levels"
        }
    },
    
    // Categories (School Levels)
    examCategories: [
        {
            id: "lower-primary",
            title: "Lower Primary",
            description: "Foundation drills for Primary 1–3 students.",
            badge: "Coming Soon",
            items: [
                {
                    name: "Coming Soon",
                    link: "#",
                    live: false,
                    status: "2026",
                    description: "Foundation drills for Primary 1–3"
                }
            ]
        },
        {
            id: "middle-primary",
            title: "Middle Primary",
            description: "Challenge sets for Primary 4–5 students.",
            badge: "Coming Soon",
            items: [
                {
                    name: "Coming Soon",
                    link: "./upper-primary/inde",
                    live: false,
                    status: "2026",
                    description: "Challenge sets for Primary 4–5"
                }
            ]
        },
        {
            id: "upper-primary",
            title: "Upper Primary",
            description: "Intensive prep for Primary 5–6 top placements.",
            badge: "Live Now",
            items: [
                {
                    name: "Start Upper Primary",
                    link: "./Upper-Primary/index.html",
                    live: true,
                    status: "Live",
                    description: "Intensive prep for Primary 5–6 top placements"
                }
            ]
        },
        {
            id: "junior-secondary",
            title: "Junior Secondary",
            description: "Problem sets for JSS1–JSS3 competition entrants.",
            badge: "Coming Soon",
            items: [
                {
                    name: "Coming Soon",
                    link: "#",
                    live: false,
                    status: "2026",
                    description: "Problem sets for JSS1–JSS3"
                }
            ]
        },
        {
            id: "senior-secondary",
            title: "Senior Secondary",
            description: "Advanced modules for SSS academic contest prep.",
            badge: "Coming Soon",
            items: [
                {
                    name: "Coming Soon",
                    link: "#",
                    live: false,
                    status: "2026",
                    description: "Advanced modules for SSS"
                }
            ]
        }
    ],
    
    // Featured items (Live Now)
    featuredItems: [
        {
            name: "Upper Primary",
            link: "./Upper-Primary/index.html",
            live: true,
            badge: "Live"
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
            title: "Pick Your Level. Drill Hard.",
            description: "Select your category, work through the questions, and review your score with full worked solutions to sharpen your edge."
        },
        {
            label: "Coming soon",
            title: "More Levels Dropping",
            description: "Lower Primary, Middle Primary, Junior Secondary, and Senior Secondary are in active development. New releases each term."
        }
    ],
    
    // CTA Band
    ctaBand: {
        title: "Ready to <em>compete at the top?</em>",
        buttonText: "Start Upper Primary →",
        buttonLink: "#categories"
    },
    
    // Footer
    footer: {
        description: "A structured archive of past papers and prep kits for students preparing for high-stakes examinations in 2026.",
        copyright: "&copy; 2026 Prep Portal. All rights reserved.",
        sections: [
            {
                title: "Scholastic",
                links: [
                    { text: "Lower Primary", href: "#" },
                    { text: "Middle Primary", href: "#" },
                    { text: "Upper Primary", href: "./Upper-Primary/index.html" },
                    { text: "Junior Secondary", href: "#" },
                    { text: "Senior Secondary", href: "#" }
                ]
            },
            {
                title: "Exams",
                links: [
                    { text: "Common Entrance", href: "../index.html#exams" },
                    { text: "Cambridge", href: "../Cambridge/index.html" },
                    { text: "Grade 5 Spring", href: "../Grade-5-Exam/index.html" },
                    { text: "WAEC", href: "../WAEC/index.html" }
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