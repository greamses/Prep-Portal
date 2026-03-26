// TICKER
const tickerItems = [
  "Common Entrance", "Cambridge", "Grade 5 Spring", "WAEC",
  "TULIP Questions", "Scholastic Prep", "Grade 4 Spring",
  "Essay Writing", "Formal Letters", "Comprehension",
  "2026 Edition", "New Papers Added", "Interactive Quizzes"
];
const tickerTrack = document.getElementById('ticker-track');
[...tickerItems, ...tickerItems].forEach(t => {
  const s = document.createElement('span');
  s.className = 'ticker-item';
  s.innerHTML = t + '<span class="ticker-dot"></span>';
  tickerTrack.appendChild(s);
});

// EXAM DATA
const examData = [
  { id: "01", title: "Common Entrance", desc: "National baseline assessments for secondary transition.", link: "#", live: false },
  { id: "02", title: "Cambridge Exam", desc: "International standard papers for primary foundation learners.", link: "./Cambridge/index.html", live: true },
  { id: "03", title: "Grade 4 Spring", desc: "Second term revision modules for Year 4 students.", link: "./Grade-4-Exam/index.html", live: true },
  { id: "04", title: "Grade 5 Spring", desc: "Intensive preparatory sets for Year 5 promotional exams.", link: "./Grade-5-Exam/index.html", live: true },
  { id: "05", title: "TULIP Questions", desc: "Exclusive archive for TULIP scholarship entrance.", link: "#", live: false },
  { id: "06", title: "Scholastic Prep", desc: "Elite-level competition drills for academic decathlons.", link: "./Scholarstic/index.html", live: true },
  { id: "07", title: "WAEC", desc: "West African Senior School Certificate Examination past papers.", link: "./WAEC/index.html", live: true },
];

// FEATURED CARDS
const featuredCards = document.getElementById('featured-cards');
examData.filter(e => e.live).forEach(item => {
  const a = document.createElement('a');
  a.href = item.link;
  a.className = 'feat-card';
  a.innerHTML = `<div class="feat-card-inner"><span class="feat-badge">Live</span><h3>${item.title}</h3></div>`;
  featuredCards.appendChild(a);
});

// EXAM GRID
const grid = document.getElementById('exam-grid');
examData.forEach((item, i) => {
  const c = document.createElement('a');
  c.href = item.link;
  c.className = 'card';
  c.style.transitionDelay = `${0.4 + i * 0.08}s`;
  c.innerHTML = `
                <div class="card-inner">
                    <span class="card-num">${item.id}</span>
                    <h2>${item.title}</h2>
                    <p>${item.desc}</p>
                    <span class="card-arrow">→</span>
                </div>`;
  if (!item.live) c.style.opacity = '0.5';
  grid.appendChild(c);
});

// SPLIT TEXT ANIMATION
const splitText = el => {
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
};
splitText(document.getElementById('main-title'));

// REVEAL OBSERVER
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// INIT
window.onload = () => document.body.classList.add('active');

// NAV TOGGLE
const toggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
toggle.addEventListener('click', () => {
  toggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// NAV SHADOW ON SCROLL
window.addEventListener('scroll', () => {
  document.getElementById('site-nav').style.boxShadow =
    window.scrollY > 10 ? '0 4px 0 0 #0a0a0a' : 'none';
}, { passive: true });