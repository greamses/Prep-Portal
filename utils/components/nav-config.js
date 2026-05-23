/* =========================================
   NAV CONFIG – PURE DATA (NO FUNCTION CALLS)
   ========================================= */

const NAV_CONFIG = [
  /* =========================
      EXAMS
  ========================= */
  {
    text: "Exams",

    icon: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>`,

    image: `
    <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg">
      <pattern id="grid-exams" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="var(--light-muted)" opacity="0.3"/>
      </pattern>
      <rect width="600" height="320" fill="url(#grid-exams)"/>
      
      <!-- Exam Paper Shadow -->
      <rect x="200" y="38" width="220" height="260" rx="8" fill="var(--ink)"/>
      <!-- Exam Paper Main -->
      <rect x="190" y="30" width="220" height="260" rx="8" fill="var(--paper)" stroke="var(--ink)" stroke-width="4"/>
      
      <!-- Lines -->
      <line x1="220" y1="80" x2="380" y2="80" stroke="var(--muted)" stroke-width="4" stroke-linecap="round"/>
      <line x1="220" y1="120" x2="350" y2="120" stroke="var(--muted)" stroke-width="4" stroke-linecap="round"/>
      <line x1="220" y1="160" x2="360" y2="160" stroke="var(--muted)" stroke-width="4" stroke-linecap="round"/>
      <line x1="220" y1="200" x2="300" y2="200" stroke="var(--muted)" stroke-width="4" stroke-linecap="round"/>

      <!-- Checkmarks -->
      <path d="M350 110 l 15 15 l 30 -35" fill="none" stroke="var(--green)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M360 150 l 15 15 l 30 -35" fill="none" stroke="var(--green)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Big A+ Grade -->
      <text x="320" y="260" font-family="sans-serif" font-weight="900" font-size="64" fill="var(--red)" transform="rotate(-15, 320, 260)">A+</text>

      <!-- Floating Pencil -->
      <g transform="translate(100, 150) rotate(45)">
        <rect x="0" y="10" width="120" height="20" fill="var(--ink)"/>
        <rect x="-5" y="5" width="120" height="20" fill="var(--yellow)" stroke="var(--ink)" stroke-width="4"/>
        <polygon points="115,5 115,25 145,15" fill="var(--paper)" stroke="var(--ink)" stroke-width="4"/>
        <polygon points="135,11.6 135,18.3 145,15" fill="var(--ink)"/>
        <rect x="-25" y="5" width="20" height="20" fill="var(--red)" stroke="var(--ink)" stroke-width="4"/>
      </g>
    </svg>`,

    description: "Ace every test",

    children: [
      {
        text: "National",

        icon: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
          <line x1="4" y1="22" x2="4" y2="15"/>
        </svg>`,

        description: "Local exam prep",

        children: [
          {
            text: "CEE",
            href: "#common-entrance",
            description: "Entrance exam mastery",
          },
          {
            text: "WASSCE",
            href: "/exam-archive/national/exams/index.html",
            description: "Senior school success",
          },
          {
            text: "SSCE",
            href: "/exam-archive/national/exams/index.html",
            description: "Internal exam prep",
          },
          {
            text: "UTME",
            href: "/exam-archive/national/exams/index.html",
            description: "University admission prep",
          },
        ],
      },

      {
        text: "International",

        icon: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>`,

        description: "Global exam standards",

        children: [
          {
            text: "IGCSE",
            href: "/exam-archive/international/exams/index.html",
            description: "British curriculum prep",
          },
          {
            text: "SAT",
            href: "/exam-archive/international/exams/index.html",
            description: "American college prep",
          },
        ],
      },

      {
        text: "Competitions",

        icon: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 21h8m-4-4v4m-5-4h10a2 2 0 0 0 2-2v-2a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v2a2 2 0 0 0 2 2Z"/>
          <path d="M3 9v2a5 5 0 0 0 5 5h0"/>
          <path d="M21 9v2a5 5 0 0 1-5 5h0"/>
        </svg>`,

        description: "Win top prizes",

        children: [
          {
            text: "ANMC",
            href: "/exam-archive/competitions/exams/index.html",
            description: "National math contest",
          },
        ],
      },
    ],
  },

  /* =========================
      BLOGS
  ========================= */
  {
    text: "Blogs",

    icon: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
      <path d="M18 14h-8"/>
      <path d="M15 18h-5"/>
      <path d="M10 6h8v4h-8V6Z"/>
    </svg>`,

    image: `
    <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg">
      <pattern id="dot-blogs" width="16" height="16" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="2" fill="var(--light-muted)" opacity="0.2"/>
      </pattern>
      <rect width="600" height="320" fill="url(#dot-blogs)"/>

      <!-- Browser Window Shadow -->
      <rect x="90" y="50" width="440" height="240" rx="12" fill="var(--ink)"/>
      <!-- Browser Window Main -->
      <rect x="80" y="40" width="440" height="240" rx="12" fill="var(--paper)" stroke="var(--ink)" stroke-width="5"/>

      <!-- Top Bar -->
      <path d="M 80 80 L 520 80" stroke="var(--ink)" stroke-width="5"/>
      <circle cx="110" cy="60" r="6" fill="var(--red)" stroke="var(--ink)" stroke-width="2"/>
      <circle cx="130" cy="60" r="6" fill="var(--yellow)" stroke="var(--ink)" stroke-width="2"/>
      <circle cx="150" cy="60" r="6" fill="var(--green)" stroke="var(--ink)" stroke-width="2"/>

      <!-- Content Blocking -->
      <!-- Image Box -->
      <rect x="110" y="100" width="140" height="100" rx="8" fill="var(--blue)" stroke="var(--ink)" stroke-width="4"/>
      <!-- Text Lines -->
      <rect x="270" y="100" width="220" height="14" rx="7" fill="var(--ink)"/>
      <rect x="270" y="130" width="180" height="10" rx="5" fill="var(--muted)"/>
      <rect x="270" y="150" width="200" height="10" rx="5" fill="var(--muted)"/>
      <rect x="270" y="170" width="160" height="10" rx="5" fill="var(--muted)"/>
      <rect x="270" y="190" width="190" height="10" rx="5" fill="var(--muted)"/>

      <!-- Comment Segment -->
      <rect x="110" y="220" width="380" height="40" rx="8" fill="var(--off)" stroke="var(--ink)" stroke-width="3"/>
      <circle cx="135" cy="240" r="12" fill="var(--amber)"/>
      <rect x="160" y="235" width="200" height="10" rx="5" fill="var(--muted)"/>
    </svg>`,

    description: "Learn with stories",

    children: [
      {
        text: "Science",

        icon: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 3h6"/>
          <path d="M10 3v4l-4 7a4 4 0 0 0 3 6h6a4 4 0 0 0 3-6l-4-7V3"/>
          <path d="M14 14H10"/>
        </svg>`,

        description: "Science made fun",

        children: [
          {
            text: "Animal Biology Articles",
            href: "/blogs/science/biology/animal/blog/blog.html",
            description: "Discover amazing creatures",
          },
          {
            text: "Plant Science Articles",
            href: "/blogs/science/biology/plant/blog/blog.html",
            description: "Explore green wonders",
          },
          {
            text: "Human Body Facts",
            href: "#human-body",
            description: "Know your body",
          },
          {
            text: "Space & Astronomy",
            href: "#space",
            description: "Journey through stars",
          },
        ],
      },

      {
        text: "Math",

        icon: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 7h16M4 17h16"/>
          <line x1="8" y1="3" x2="8" y2="21"/>
          <line x1="16" y1="3" x2="16" y2="21"/>
          <circle cx="12" cy="12" r="2"/>
        </svg>`,

        description: "Numbers made easy",

        children: [
          {
            text: "Math Tricks",
            href: "#math-tricks",
            description: "Quick calculation tips",
          },
        ],
      },

      // {
      //   text: "English",

      //   icon: `
      //   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      //     <path d="M4 7V4h16v3"/>
      //     <path d="M9 20h6"/>
      //     <path d="M12 4v16"/>
      //   </svg>`,

      //   description: "Master the language",

      //   children: [
      //     {
      //       text: "Grammar Police",
      //       href: "#grammar",
      //       description: "Rules made simple",
      //     },
      //     {
      //       text: "Vocabulary Builders",
      //       href: "#vocabulary",
      //       description: "Expand your words",
      //     },
      //     {
      //       text: "Writing Tips",
      //       href: "#writing",
      //       description: "Craft better essays",
      //     },
      //     {
      //       text: "Reading Comprehension",
      //       href: "#reading",
      //       description: "Understand every text",
      //     },
      //   ],
      // },

      // {
      //   text: "History",

      //   icon: `
      //   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      //     <circle cx="12" cy="12" r="10"/>
      //     <polyline points="12 6 12 12 16 14"/>
      //   </svg>`,

      //   description: "Travel through time",

      //   children: [
      //     {
      //       text: "Ancient Civilizations",
      //       href: "#ancient",
      //       description: "Discover old worlds",
      //     },
      //     {
      //       text: "Modern History",
      //       href: "#modern-history",
      //       description: "Recent world events",
      //     },
      //     {
      //       text: "African History",
      //       href: "#african-history",
      //       description: "Our rich heritage",
      //     },
      //     {
      //       text: "World Wars",
      //       href: "#world-wars",
      //       description: "Global conflicts explained",
      //     },
      //   ],
      // },

      // {
      //   text: "Technology",

      //   icon: `
      //   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      //     <rect x="2" y="3" width="20" height="14" rx="2"/>
      //     <line x1="8" y1="21" x2="16" y2="21"/>
      //     <line x1="12" y1="17" x2="12" y2="21"/>
      //   </svg>`,

      //   description: "Future is now",

      //   children: [
      //     {
      //       text: "Coding Basics",
      //       href: "#coding",
      //       description: "Learn to program",
      //     },
      //     {
      //       text: "AI & Robotics",
      //       href: "#ai-robotics",
      //       description: "Smart machines explained",
      //     },
      //     {
      //       text: "Gadget Reviews",
      //       href: "#gadgets",
      //       description: "Latest tech reviews",
      //     },
      //     {
      //       text: "Internet Safety",
      //       href: "#internet-safety",
      //       description: "Stay safe online",
      //     },
      //   ],
      // },

      // {
      //   text: "Arts & Culture",

      //   icon: `
      //   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      //     <circle cx="12" cy="12" r="10"/>
      //     <circle cx="12" cy="12" r="6"/>
      //     <circle cx="12" cy="12" r="2"/>
      //   </svg>`,

      //   description: "Express your creativity",

      //   children: [
      //     {
      //       text: "Drawing Tutorials",
      //       href: "#drawing",
      //       description: "Learn to draw",
      //     },
      //     {
      //       text: "Music & Rhythm",
      //       href: "#music",
      //       description: "Feel the beat",
      //     },
      //     {
      //       text: "Cultural Festivals",
      //       href: "#festivals",
      //       description: "Celebrate diversity worldwide",
      //     },
      //     {
      //       text: "Famous Artists",
      //       href: "#artists",
      //       description: "Meet creative masters",
      //     },
      //   ],
      // },
    ],
  },

  /* =========================
      ACTIVITIES
  ========================= */
  {
    text: "Activities",

    icon: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>`,

    image: `
    <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="320" fill="var(--app-bg)"/>
      
      <!-- Big Dynamic Game Controller -->
      <g transform="translate(150, 80) rotate(-10)">
        <!-- Shadow -->
        <rect x="10" y="10" width="300" height="160" rx="80" fill="var(--ink)"/>
        <!-- Main -->
        <rect x="0" y="0" width="300" height="160" rx="80" fill="var(--paper)" stroke="var(--ink)" stroke-width="6"/>
        
        <!-- D-Pad -->
        <path d="M 60 60 L 80 60 L 80 40 L 100 40 L 100 60 L 120 60 L 120 80 L 100 80 L 100 100 L 80 100 L 80 80 L 60 80 Z" fill="var(--ink)"/>
        
        <!-- Action Buttons -->
        <circle cx="220" cy="100" r="15" fill="var(--green)" stroke="var(--ink)" stroke-width="4"/>
        <circle cx="250" cy="60" r="15" fill="var(--red)" stroke="var(--ink)" stroke-width="4"/>
        
        <!-- Analog Sticks -->
        <circle cx="130" cy="110" r="20" fill="var(--blue)" stroke="var(--ink)" stroke-width="4"/>
        <circle cx="180" cy="110" r="20" fill="var(--yellow)" stroke="var(--ink)" stroke-width="4"/>
      </g>
      
      <!-- Accent marks for motion -->
      <path d="M 50 50 L 70 30 M 80 60 L 100 40" stroke="var(--amber)" stroke-width="5" stroke-linecap="round"/>
      <path d="M 520 250 L 500 270 M 490 240 L 470 260" stroke="var(--blue)" stroke-width="5" stroke-linecap="round"/>
    </svg>`,

    description: "Play, learn, grow",

    children: [
      {
        text: "Prep-Math Games",

        icon: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 5h12"/>
          <path d="M6 12h12"/>
          <path d="M6 19h12"/>
          <circle cx="18" cy="6" r="2"/>
          <circle cx="18" cy="12" r="2"/>
          <circle cx="18" cy="18" r="2"/>
        </svg>`,

        description: "Math practice games",

        children: [
          {
            text: "Free Throw",
            href: "/prep-math/games/free-throw/index.html",
            description: "Aim, shoot, and score",
          },

          {
            text: "Snakes & Ladders",
            href: "/prep-math/games/snakes-ladders/index.html",
            description: "Roll, climb, and slide",
          },
        ],
      },

      {
        text: "Prep-Math Activities",

        icon: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4h16v16H4z"/>
          <path d="M8 4v16M16 4v16M4 8h16M4 16h16"/>
        </svg>`,

        description: "Hands-on math practice",

        children: [
          {
            text: "Equivalent Fractions",
            href: "/prep-math/activity/equivalent-fractions/index.html",
            description: "Visualize fraction equivalence",
          },
          {
            text: "Polygon Angles",
            href: "/prep-math/activity/polygon-angles/index.html",
            description: "Explore angle rules and sums",
          },
          {
            text: "Surface Area",
            href: "/prep-math/activity/surface-area/index.html",
            description: "Calculate area on 3D shapes",
          },
          {
            text: "Transversals",
            href: "/prep-math/activity/transversals/index.html",
            description: "Learn parallel lines and angles",
          },
        ],
      },

      {
        text: "Learning Tools",

        icon: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="13" r="8"/>
          <polyline points="12 9 12 13 14 15"/>
          <line x1="16" y1="5" x2="16" y2="5"/>
          <line x1="8" y1="5" x2="8" y2="5"/>
          <line x1="12" y1="3" x2="12" y2="5"/>
        </svg>`,

        description: "Smart study helpers",

        children: [
          {
            text: "Writing Evaluator",
            href: "/writing/index.html",
            description: "Grade essays with red pen feedback",
          },
          {
            text: "AI Flashcards",
            href: "#flashcards",
            description: "Remember everything fast",
          },
        ],
      },
    ],
  },
];

export default NAV_CONFIG;
