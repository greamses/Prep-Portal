/* =========================================
   COMMUNITY NETWORK MODULE
   (55 nodes, hover scale 2.5, thinner hover border)
========================================= */

// ─── DiceBear avatar URL ──────────────────────────────────────────────────────
function avatarUrl(name, role) {
  const seed = encodeURIComponent(name.replace(/[^a-zA-Z0-9 ]/g, "").trim());
  const bg =
    role === "tutor" ? "bbf7d0" : role === "student" ? "bfdbfe" : "fde68a";
  return `https://api.dicebear.com/9.x/lorelei/svg?seed=${seed}&backgroundColor=${bg}&scale=120`;
}

const SKELETON_BG = { tutor: "#bbf7d0", student: "#bfdbfe", parent: "#fde68a" };

// ─── City → [lon, lat] Coordinates ─────────────────────────────────────────
const CITY_COORDS = {
  London: [-0.1276, 51.5074],
  Accra: [-0.1875, 5.6036],
  Lagos: [3.4064, 6.4654],
  Abuja: [7.4951, 9.0579],
  "Port Harcourt": [7.0061, 4.8156],
  Enugu: [7.5086, 6.4584],
  Paris: [2.3522, 48.8566],
  Berlin: [13.405, 52.52],
  "New York": [-74.006, 40.7128],
  "São Paulo": [-46.6333, -23.5505],
  Madrid: [-3.7038, 40.4168],
  Johannesburg: [28.0473, -26.2041],
  Toronto: [-79.3832, 43.6532],
  Sydney: [151.2093, -33.8688],
  Tokyo: [139.6917, 35.6895],
  Dubai: [55.2708, 25.2048],
  Amsterdam: [4.9041, 52.3676],
  Singapore: [103.8198, 1.3521],
  Mumbai: [72.8777, 19.076],
  "Mexico City": [-99.1332, 19.4326],
};

// ─── 35‑Person Roster ───────────────────────────────────────────────────────
const PEOPLE_DATA = [
  // Nigerian tutors (all teachers are Nigerian)
  {
    id: "t1",
    role: "tutor",
    name: "Dr. Chidi Okafor",
    detail: "Mathematics · 4.9★",
    city: "Lagos",
    size: 24,
    parentId: null,
    tutorId: null,
  },
  {
    id: "t2",
    role: "tutor",
    name: "Mrs. Amina Yusuf",
    detail: "Sciences · 4.8★",
    city: "Abuja",
    size: 22,
    parentId: null,
    tutorId: null,
  },
  {
    id: "t3",
    role: "tutor",
    name: "Mr. Emeka Nwosu",
    detail: "English · 5.0★",
    city: "Port Harcourt",
    size: 22,
    parentId: null,
    tutorId: null,
  },
  {
    id: "t4",
    role: "tutor",
    name: "Dr. Ngozi Eze",
    detail: "Further Maths · 4.9★",
    city: "Enugu",
    size: 24,
    parentId: null,
    tutorId: null,
  },

  // Nigerian parents & students
  {
    id: "p3",
    role: "parent",
    name: "Mrs. Nkechi Okonkwo",
    detail: "2 children",
    city: "Lagos",
    size: 12,
    parentId: null,
    tutorId: null,
  },
  {
    id: "s4",
    role: "student",
    name: "Chuka Okonkwo",
    detail: "Lagos",
    city: "Lagos",
    size: 16,
    parentId: "p3",
    tutorId: "t1",
  },
  {
    id: "s5",
    role: "student",
    name: "Adaeze Okonkwo",
    detail: "Lagos",
    city: "Lagos",
    size: 16,
    parentId: "p3",
    tutorId: "t1",
  },

  {
    id: "p4",
    role: "parent",
    name: "Mr. Ibrahim Bello",
    detail: "2 children",
    city: "Abuja",
    size: 12,
    parentId: null,
    tutorId: null,
  },
  {
    id: "s6",
    role: "student",
    name: "Fatima Bello",
    detail: "Abuja",
    city: "Abuja",
    size: 16,
    parentId: "p4",
    tutorId: "t2",
  },
  {
    id: "s7",
    role: "student",
    name: "Usman Bello",
    detail: "Abuja",
    city: "Abuja",
    size: 16,
    parentId: "p4",
    tutorId: "t2",
  },

  {
    id: "p5",
    role: "parent",
    name: "Chief Tamuno Briggs",
    detail: "2 children",
    city: "Port Harcourt",
    size: 12,
    parentId: null,
    tutorId: null,
  },
  {
    id: "s8",
    role: "student",
    name: "Tamunotonye Briggs",
    detail: "Port Harcourt",
    city: "Port Harcourt",
    size: 16,
    parentId: "p5",
    tutorId: "t3",
  },
  {
    id: "s9",
    role: "student",
    name: "Ibifiri Briggs",
    detail: "Port Harcourt",
    city: "Port Harcourt",
    size: 16,
    parentId: "p5",
    tutorId: "t3",
  },

  {
    id: "p6",
    role: "parent",
    name: "Mrs. Ifeoma Chukwu",
    detail: "1 child",
    city: "Enugu",
    size: 12,
    parentId: null,
    tutorId: null,
  },
  {
    id: "s10",
    role: "student",
    name: "Chidimma Chukwu",
    detail: "Enugu",
    city: "Enugu",
    size: 18,
    parentId: "p6",
    tutorId: "t4",
  },

  // Other African families (no local teachers)
  {
    id: "p7",
    role: "parent",
    name: "Mr. Kwame Boateng",
    detail: "2 children",
    city: "Accra",
    size: 14,
    parentId: null,
    tutorId: null,
  },
  {
    id: "s11",
    role: "student",
    name: "Akua Boateng",
    detail: "Accra",
    city: "Accra",
    size: 16,
    parentId: "p7",
    tutorId: null,
  },
  {
    id: "s12",
    role: "student",
    name: "Kofi Boateng",
    detail: "Accra",
    city: "Accra",
    size: 16,
    parentId: "p7",
    tutorId: null,
  },

  // International families with Nigerian tutors
  {
    id: "p1",
    role: "parent",
    name: "Mrs. Sarah Johnson",
    detail: "2 children",
    city: "London",
    size: 12,
    parentId: null,
    tutorId: null,
  },
  {
    id: "s1",
    role: "student",
    name: "Emily Johnson",
    detail: "London",
    city: "London",
    size: 16,
    parentId: "p1",
    tutorId: "t1",
  },
  {
    id: "s2",
    role: "student",
    name: "Oliver Johnson",
    detail: "London",
    city: "London",
    size: 16,
    parentId: "p1",
    tutorId: "t1",
  },
  {
    id: "p2",
    role: "parent",
    name: "Mr. Michael Brown",
    detail: "1 child",
    city: "London",
    size: 12,
    parentId: null,
    tutorId: null,
  },
  {
    id: "s3",
    role: "student",
    name: "Liam Brown",
    detail: "London",
    city: "London",
    size: 16,
    parentId: "p2",
    tutorId: "t2",
  },

  {
    id: "p9",
    role: "parent",
    name: "Mme. Claire Dubois",
    detail: "1 child",
    city: "Paris",
    size: 12,
    parentId: null,
    tutorId: null,
  },
  {
    id: "s16",
    role: "student",
    name: "Léa Dubois",
    detail: "Paris",
    city: "Paris",
    size: 18,
    parentId: "p9",
    tutorId: "t2",
  },

  {
    id: "p10",
    role: "parent",
    name: "Herr. Klaus Müller",
    detail: "1 child",
    city: "Berlin",
    size: 12,
    parentId: null,
    tutorId: null,
  },
  {
    id: "s17",
    role: "student",
    name: "Lukas Müller",
    detail: "Berlin",
    city: "Berlin",
    size: 16,
    parentId: "p10",
    tutorId: "t3",
  },

  {
    id: "p11",
    role: "parent",
    name: "Mrs. Jennifer Smith",
    detail: "1 child",
    city: "New York",
    size: 12,
    parentId: null,
    tutorId: null,
  },
  {
    id: "s18",
    role: "student",
    name: "Emma Smith",
    detail: "New York",
    city: "New York",
    size: 16,
    parentId: "p11",
    tutorId: "t1",
  },

  {
    id: "p12",
    role: "parent",
    name: "Sr. Carlos Silva",
    detail: "1 child",
    city: "São Paulo",
    size: 12,
    parentId: null,
    tutorId: null,
  },
  {
    id: "s19",
    role: "student",
    name: "Lucas Silva",
    detail: "São Paulo",
    city: "São Paulo",
    size: 16,
    parentId: "p12",
    tutorId: "t2",
  },

  {
    id: "p14",
    role: "parent",
    name: "Sra. María García",
    detail: "1 child",
    city: "Madrid",
    size: 12,
    parentId: null,
    tutorId: null,
  },
  {
    id: "s21",
    role: "student",
    name: "Juan García",
    detail: "Madrid",
    city: "Madrid",
    size: 16,
    parentId: "p14",
    tutorId: "t4",
  },

  {
    id: "p15",
    role: "parent",
    name: "Mrs. Naledi Mbeki",
    detail: "1 child",
    city: "Johannesburg",
    size: 12,
    parentId: null,
    tutorId: null,
  },
  {
    id: "s22",
    role: "student",
    name: "Thabo Mbeki",
    detail: "Johannesburg",
    city: "Johannesburg",
    size: 16,
    parentId: "p15",
    tutorId: "t3",
  },

  // New international families
  {
    id: "p16",
    role: "parent",
    name: "Mrs. Jennifer Lee",
    detail: "2 children",
    city: "Toronto",
    size: 12,
    parentId: null,
    tutorId: null,
  },
  {
    id: "s23",
    role: "student",
    name: "Sophie Lee",
    detail: "Toronto",
    city: "Toronto",
    size: 16,
    parentId: "p16",
    tutorId: "t1",
  },
  {
    id: "s24",
    role: "student",
    name: "Ethan Lee",
    detail: "Toronto",
    city: "Toronto",
    size: 16,
    parentId: "p16",
    tutorId: "t2",
  },

  {
    id: "p17",
    role: "parent",
    name: "Mr. James Wilson",
    detail: "1 child",
    city: "Sydney",
    size: 12,
    parentId: null,
    tutorId: null,
  },
  {
    id: "s25",
    role: "student",
    name: "Chloe Wilson",
    detail: "Sydney",
    city: "Sydney",
    size: 16,
    parentId: "p17",
    tutorId: "t3",
  },

  {
    id: "p18",
    role: "parent",
    name: "Ms. Yuki Tanaka",
    detail: "1 child",
    city: "Tokyo",
    size: 12,
    parentId: null,
    tutorId: null,
  },
  {
    id: "s26",
    role: "student",
    name: "Hana Tanaka",
    detail: "Tokyo",
    city: "Tokyo",
    size: 16,
    parentId: "p18",
    tutorId: "t4",
  },

  {
    id: "p19",
    role: "parent",
    name: "Mr. Omar Al-Hassan",
    detail: "1 child",
    city: "Dubai",
    size: 12,
    parentId: null,
    tutorId: null,
  },
  {
    id: "s27",
    role: "student",
    name: "Zara Al-Hassan",
    detail: "Dubai",
    city: "Dubai",
    size: 16,
    parentId: "p19",
    tutorId: "t1",
  },

  {
    id: "p20",
    role: "parent",
    name: "Mrs. Eva van der Berg",
    detail: "1 child",
    city: "Amsterdam",
    size: 12,
    parentId: null,
    tutorId: null,
  },
  {
    id: "s28",
    role: "student",
    name: "Lars van der Berg",
    detail: "Amsterdam",
    city: "Amsterdam",
    size: 16,
    parentId: "p20",
    tutorId: "t2",
  },

  {
    id: "p21",
    role: "parent",
    name: "Mr. Wei Chen",
    detail: "2 children",
    city: "Singapore",
    size: 12,
    parentId: null,
    tutorId: null,
  },
  {
    id: "s29",
    role: "student",
    name: "Mei Chen",
    detail: "Singapore",
    city: "Singapore",
    size: 16,
    parentId: "p21",
    tutorId: "t3",
  },
  {
    id: "s30",
    role: "student",
    name: "Jun Chen",
    detail: "Singapore",
    city: "Singapore",
    size: 16,
    parentId: "p21",
    tutorId: "t4",
  },

  {
    id: "p22",
    role: "parent",
    name: "Mrs. Priya Sharma",
    detail: "1 child",
    city: "Mumbai",
    size: 12,
    parentId: null,
    tutorId: null,
  },
  {
    id: "s31",
    role: "student",
    name: "Aryan Sharma",
    detail: "Mumbai",
    city: "Mumbai",
    size: 16,
    parentId: "p22",
    tutorId: "t1",
  },

  {
    id: "p23",
    role: "parent",
    name: "Sra. Isabel Morales",
    detail: "1 child",
    city: "Mexico City",
    size: 12,
    parentId: null,
    tutorId: null,
  },
  {
    id: "s32",
    role: "student",
    name: "Diego Morales",
    detail: "Mexico City",
    city: "Mexico City",
    size: 16,
    parentId: "p23",
    tutorId: "t2",
  },
];

// ─── Shared projection ──────────────────────────────────────────────────────
let _sharedProjection = null;
let _mapW = 0,
  _mapH = 0;

function projectCity(lon, lat) {
  if (!_sharedProjection) return [Math.random() * 600, Math.random() * 400];
  const [x, y] = _sharedProjection([lon, lat]);
  return [x, y];
}

function buildPeopleList() {
  const borderColors = {
    tutor: "#16a34a",
    student: "#2563eb",
    parent: "#d97706",
  };
  const tempPeople = PEOPLE_DATA.map((p) => ({
    id: p.id,
    role: p.role,
    name: p.name,
    detail: p.detail,
    size: p.size,
    borderColor: borderColors[p.role],
    bgColor: SKELETON_BG[p.role],
    avatarUrl: avatarUrl(p.name, p.role),
    city: p.city,
  }));

  const peopleByCity = {};
  tempPeople.forEach((p) => {
    if (!peopleByCity[p.city]) peopleByCity[p.city] = [];
    peopleByCity[p.city].push(p);
  });

  Object.entries(peopleByCity).forEach(([cityName, list]) => {
    const coords = CITY_COORDS[cityName];
    if (!coords) {
      list.forEach((p) => {
        const fallbackLon = 3.5 + Math.random() * 8.5;
        const fallbackLat = 5.5 + Math.random() * 7.5;
        const [projX, projY] = projectCity(fallbackLon, fallbackLat);
        p.position = { x: projX, y: projY };
      });
      return;
    }
    const [projX, projY] = projectCity(coords[0], coords[1]);
    list.forEach((p, index) => {
      if (index === 0) {
        p.position = { x: projX, y: projY };
      } else {
        const theta = index * 137.5 * (Math.PI / 180);
        const radius = 6 * Math.sqrt(index);
        p.position = {
          x: projX + radius * Math.cos(theta),
          y: projY + radius * Math.sin(theta),
        };
      }
    });
  });
  return tempPeople;
}

function generateLinks(people) {
  const links = [];
  PEOPLE_DATA.forEach((p) => {
    if (p.role === "student") {
      if (p.parentId)
        links.push({ source: p.id, target: p.parentId, type: "family" });
      if (p.tutorId)
        links.push({ source: p.id, target: p.tutorId, type: "study" });
    }
  });
  const studentsByCity = {};
  people
    .filter((p) => p.role === "student")
    .forEach((s) => {
      if (!studentsByCity[s.city]) studentsByCity[s.city] = [];
      studentsByCity[s.city].push(s);
    });
  Object.values(studentsByCity).forEach((students) => {
    for (let i = 0; i < students.length - 1; i++) {
      links.push({
        source: students[i].id,
        target: students[i + 1].id,
        type: "peer",
      });
    }
  });
  const tutors = people.filter((p) => p.role === "tutor");
  for (let i = 0; i < tutors.length - 1; i++) {
    links.push({
      source: tutors[i].id,
      target: tutors[i + 1].id,
      type: "colleague",
    });
  }
  return links;
}

const EDGE_COLORS = {
  study: "#60a5fa",
  family: "#fbbf24",
  peer: "#c4b5fd",
  colleague: "#4ade80",
};

function buildElements(people, links) {
  const nodes = people.map((p) => {
    const avatarLoaded = p.role === "tutor"; // skeleton for students + parents
    const node = {
      data: {
        id: p.id,
        name: p.name,
        role: p.role,
        detail: p.detail,
        borderColor: p.borderColor,
        size: p.size,
        bgColor: p.bgColor,
        avatar: p.avatarUrl,
        avatarLoaded,
      },
    };
    if (p.position) node.position = p.position;
    return node;
  });
  const edges = links.map((l, i) => ({
    data: {
      id: `e${i}`,
      source: l.source,
      target: l.target,
      type: l.type,
      color: EDGE_COLORS[l.type] || "#60a5fa",
    },
  }));
  return [...nodes, ...edges];
}

function buildStyle() {
  return [
    {
      selector: "node",
      style: {
        shape: "ellipse",
        width: "data(size)",
        height: "data(size)",
        "background-color": "data(bgColor)",
        "background-image": "data(avatar)",
        "background-width": "280%",
        "background-height": "280%",
        "background-position-x": "50%",
        "background-position-y": "38%",
        "background-clip": "node",
        "background-image-crossorigin": "anonymous",
        label: "",
        "border-width": 0.5,
        "border-color": "data(borderColor)",
        "transition-property": "width, height, border-width, opacity",
        "transition-duration": "180ms",
      },
    },
    {
      selector: 'node[role = "tutor"]',
      style: { "border-width": 0.8, "background-width": "220%", "background-height": "220%" },
    },
    {
      selector: 'node[role = "parent"]',
      style: { "background-width": "360%", "background-height": "360%" },
    },
    {
      selector: "edge",
      style: {
        width: 1,
        "line-color": "data(color)",
        opacity: 0.35,
        "curve-style": "bezier",
        "target-arrow-shape": "none",
        "transition-property": "opacity, width",
        "transition-duration": "180ms",
      },
    },
    // Hover highlight classes – thinner border on highlight
    { selector: "node.sn-hi", style: { "border-width": 1.5, opacity: 1 } },
    { selector: "node.sn-dim", style: { opacity: 0.07 } },
    { selector: "edge.sn-hi", style: { opacity: 0.9, width: 1.5 } },
    { selector: "edge.sn-dim", style: { opacity: 0.02 } },
    { selector: "node.sn-hover", style: { "z-index": 9999 } },
  ];
}

// ─── Hover scaling logic (now 2.5×) ─────────────────────────────────────────
function scaleUp(node) {
  const s = node.data("size");
  if (!s || isNaN(s)) return;
  node.stop(true, true);
  node.animate({ style: { width: s * 2.5, height: s * 2.5 } }, { duration: 200 });
}

function scaleDown(node) {
  const s = node.data("size");
  if (!s || isNaN(s)) return;
  node.stop(true, true);
  node.animate({ style: { width: s, height: s } }, { duration: 200 });
}

// ─── Tutor pulse animation ───────────────────────────────────────────────────
function startPulse(cy) {
  cy.nodes('[role = "tutor"]').forEach((node, i) => {
    function beat() {
      node
        .animate(
          { style: { "border-width": 1.6 } },
          { duration: 700, easing: "ease-in-out-sine" },
        )
        .animate(
          { style: { "border-width": 0.8 } },
          {
            duration: 700,
            easing: "ease-in-out-sine",
            complete: () => setTimeout(beat, 2400 + Math.random() * 1800),
          },
        );
    }
    setTimeout(beat, 500 + i * 350);
  });
}

// ─── World map background ────────────────────────────────────────────────────
async function drawWorldMap(container) {
  if (!window.d3 || !window.topojson) return { projection: null, w: 0, h: 0 };
  const d3 = window.d3,
    topojson = window.topojson;
  const rect = container.getBoundingClientRect();
  const w = rect.width || 960,
    h = rect.height || 520;
  const isDark = document.documentElement.dataset.theme === "dark";

  let world;
  try {
    world = await d3.json(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
    );
  } catch {
    return { projection: null, w, h };
  }

  const projection = d3.geoNaturalEarth1().fitSize([w, h], { type: "Sphere" });
  const path = d3.geoPath(projection);

  const svg = d3
    .create("svg")
    .attr("class", "world-map-bg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${w} ${h}`)
    .attr("preserveAspectRatio", "xMidYMid slice")
    .style("position", "absolute")
    .style("inset", "0")
    .style("pointer-events", "none")
    .style("transform-origin", "0 0");

  svg
    .append("rect")
    .attr("width", w)
    .attr("height", h)
    .attr("fill", isDark ? "#0d1b2a" : "#d6eaf8");
  svg
    .append("path")
    .datum({ type: "Sphere" })
    .attr("d", path)
    .attr("fill", isDark ? "#0d1b2a" : "#d6eaf8");
  svg
    .append("path")
    .datum(d3.geoGraticule()())
    .attr("d", path)
    .attr("fill", "none")
    .attr("stroke", isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)")
    .attr("stroke-width", 0.5);
  svg
    .append("path")
    .datum(topojson.feature(world, world.objects.countries))
    .attr("d", path)
    .attr("fill", isDark ? "#16291a" : "#c5dbb8")
    .attr("stroke", isDark ? "#1e3820" : "#9abf8a")
    .attr("stroke-width", 0.4);
  svg
    .append("path")
    .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
    .attr("d", path)
    .attr("fill", "none")
    .attr("stroke", isDark ? "#243d26" : "#7dab6d")
    .attr("stroke-width", 0.3);

  container.prepend(svg.node());
  return { projection, w, h };
}

// ─── Tooltip helpers ──────────────────────────────────────────────────────────
function showTooltip(tooltip, node, containerRect) {
  const pos = node.renderedPosition();
  const data = node.data();
  tooltip.querySelector(".nt-avatar").style.backgroundImage =
    `url("${data.avatar}")`;
  tooltip.querySelector(".nt-avatar").style.backgroundColor = data.bgColor;
  const roleEl = tooltip.querySelector(".nt-role");
  roleEl.textContent = data.role.charAt(0).toUpperCase() + data.role.slice(1);
  roleEl.className = `nt-role nt-role--${data.role}`;
  tooltip.querySelector(".nt-detail").textContent = data.detail || "";
  tooltip.hidden = false;
  positionTooltip(tooltip, pos, containerRect);

  const nameEl = tooltip.querySelector(".nt-name");
  if (data.avatarLoaded) {
    nameEl.classList.remove("nt-name--skeleton");
    nameEl.textContent = data.name;
  } else {
    nameEl.classList.add("nt-name--skeleton");
    nameEl.textContent = "";
  }
}

function positionTooltip(tooltip, pos, rect) {
  const tw = 220,
    th = 80;
  let x = rect.left + pos.x + 52;
  let y = rect.top + pos.y - 24;
  if (x + tw > window.innerWidth - 12) x = rect.left + pos.x - tw - 14;
  if (y + th > window.innerHeight - 12) y = window.innerHeight - th - 12;
  tooltip.style.left = Math.max(8, x) + "px";
  tooltip.style.top = Math.max(8, y) + "px";
}

// ─── Public API ───────────────────────────────────────────────────────────────
export function initSocialNetwork({
  containerId,
  tooltipId = "network-tooltip",
  people,
  links,
}) {
  const container = document.getElementById(containerId);
  if (!container || !window.cytoscape) return null;
  const tooltip = document.getElementById(tooltipId);
  let activeTooltipNode = null;

  drawWorldMap(container)
    .then(({ projection, w, h }) => {
      if (projection) {
        _sharedProjection = projection;
        _mapW = w;
        _mapH = h;
      }

      const resolvedPeople = people ?? buildPeopleList();
      const resolvedLinks = links ?? generateLinks(resolvedPeople);

      const cy = window.cytoscape({
        container,
        elements: buildElements(resolvedPeople, resolvedLinks),
        style: buildStyle(),
        layout: { name: "preset" },
        autoungrabify: true, // nodes cannot be dragged
        userZoomingEnabled: true,
        userPanningEnabled: true,
        boxSelectionEnabled: false,
        minZoom: 0.25,
        maxZoom: 3.5,
      });

      const svgEl = container.querySelector(".world-map-bg");
      if (svgEl) {
        const syncViewport = () => {
          const pan = cy.pan();
          const zoom = cy.zoom();
          svgEl.style.transform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;
        };
        cy.on("viewport", syncViewport);
        syncViewport();
      }

      cy.one("layoutstop", () => {
        cy.fit(undefined, 30);
        startPulse(cy);
      });

      // Hover: highlight neighbourhood + scale node (2.5×)
      cy.on("mouseover", "node", (e) => {
        const node = e.target;
        const nbhd = node.closedNeighborhood();
        cy.batch(() => {
          cy.elements().not(nbhd).addClass("sn-dim");
          nbhd.nodes().addClass("sn-hi");
          nbhd.edges().addClass("sn-hi");
          node.addClass("sn-hover");
        });
        scaleUp(node);
      });

      cy.on("mouseout", "node", (e) => {
        const node = e.target;
        cy.batch(() => cy.elements().removeClass("sn-dim sn-hi sn-hover"));
        scaleDown(node);
      });

      // Click: toggle tooltip for the clicked node
      cy.on("tap", "node", (e) => {
        const node = e.target;
        if (tooltip) {
          if (activeTooltipNode && activeTooltipNode.id() === node.id()) {
            tooltip.hidden = true;
            activeTooltipNode = null;
          } else {
            showTooltip(tooltip, node, container.getBoundingClientRect());
            activeTooltipNode = node;
          }
        }
        e.preventDefault();
      });

      // Click on background: hide tooltip, fit all nodes
      cy.on("tap", (e) => {
        if (e.target === cy) {
          if (tooltip) tooltip.hidden = true;
          activeTooltipNode = null;
          cy.animate(
            { fit: { eles: cy.nodes(), padding: 30 } },
            { duration: 400, easing: "ease-out-expo" },
          );
        }
      });

      // Double‑tap / double‑click for zoom to node
      cy.on("dbltap", "node", (e) => {
        cy.animate(
          { zoom: 2.2, center: { eles: e.target } },
          { duration: 400, easing: "ease-out-expo" },
        );
      });
    })
    .catch(() => {});
}
