// ============================================
// UNIFIED CONTENT INJECTOR - Using innerHTML
// ============================================

// Helper function
function createElement(tag, className, content = null) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content !== null) el.innerHTML = content;
    return el;
}

// Inject navigation
function injectNavigation() {
    const navLinks = document.getElementById('nav-links');
    if (!navLinks) return;
    
    const navItems = siteData.navigation.map(item =>
        `<li><a href="${item.href}">${item.text}</a></li>`
    ).join('');
    
    navLinks.innerHTML = navItems + `
        <li>
            <a href="${siteData.ctaButton.href}" class="nav-cta">${siteData.ctaButton.text}</a>
        </li>
    `;
}

// Inject ticker
function injectTicker() {
    const tickerTrack = document.getElementById('ticker-track');
    if (!tickerTrack) return;
    
    const items = [...siteData.tickerItems, ...siteData.tickerItems];
    tickerTrack.innerHTML = items.map(item =>
        `<span class="ticker-item">${item}<span class="ticker-dot"></span></span>`
    ).join('');
}

// Inject hero stats
function injectHeroStats() {
    const heroStats = document.getElementById('hero-stats');
    if (!heroStats) return;
    
    heroStats.innerHTML = siteData.hero.stats.map(stat =>
        `<div class="stat"><strong>${stat.value}</strong><span>${stat.label}</span></div>`
    ).join('');
    
    // Update hero tagline
    const tagline = document.getElementById('hero-tagline');
    if (tagline) tagline.textContent = siteData.hero.tagline;
}

// Inject section headers
function injectSectionHeaders() {
    const examsTitle = document.getElementById('exams-title');
    const examsSubtitle = document.getElementById('exams-subtitle');
    if (examsTitle) examsTitle.textContent = siteData.sections.exams.title;
    if (examsSubtitle) examsSubtitle.textContent = siteData.sections.exams.subtitle;
    
    const subjectsEyebrow = document.getElementById('subjects-eyebrow');
    const subjectsTitle = document.getElementById('subjects-title');
    const subjectsDesc = document.getElementById('subjects-description');
    const subjectsTag = document.getElementById('subjects-tag');
    if (subjectsEyebrow) subjectsEyebrow.textContent = siteData.sections.subjects.eyebrow;
    if (subjectsTitle) subjectsTitle.textContent = siteData.sections.subjects.title;
    if (subjectsDesc) subjectsDesc.textContent = siteData.sections.subjects.description;
    if (subjectsTag) subjectsTag.textContent = siteData.sections.subjects.tag;
    
    const drillEyebrow = document.getElementById('drill-eyebrow');
    const drillTitle = document.getElementById('drill-title');
    const drillDesc = document.getElementById('drill-description');
    const drillTag = document.getElementById('drill-tag');
    if (drillEyebrow) drillEyebrow.textContent = siteData.sections.theory.eyebrow;
    if (drillTitle) drillTitle.textContent = siteData.sections.theory.title;
    if (drillDesc) drillDesc.textContent = siteData.sections.theory.description;
    if (drillTag) drillTag.textContent = siteData.sections.theory.tag;
}

// Inject exam categories
function injectExamCategories() {
    const container = document.getElementById('category-grid');
    if (!container) return;
    
    container.innerHTML = siteData.examCategories.map(category => `
        <div class="card category-card">
            <div class="card-inner">
                <h3>${category.title}</h3>
                <p>${category.description}</p>
                <div class="item-list">
                    ${category.items.map(item => `
                        <a href="${item.link}" class="list-item" ${!item.live ? 'style="opacity:0.6"' : ''}>
                            <span>${item.name}</span>
                            <span class="status ${item.live ? 'live' : ''}">${item.status}</span>
                        </a>
                    `).join('')}
                </div>
                <a href="${category.link}"><span class="badge">${category.badge}</span></a>
            </div>
        </div>
    `).join('');
}

// Inject subject cards
function injectSubjectCards() {
    const container = document.getElementById('subject-grid');
    if (!container) return;
    
    container.innerHTML = siteData.subjects.map(subject => `
        <a href="${subject.link}" class="subject-card ${subject.color} section-link">
            <div class="subject-card-inner">
                <h3>${subject.name}</h3>
                <p>${subject.description}</p>
                <span class="badge">${subject.badge}</span>
                <div class="card-arrow">→ ${subject.cta}</div>
            </div>
        </a>
    `).join('');
}

// Inject drill cards
function injectDrillCards() {
    const container = document.getElementById('drill-grid');
    if (!container) return;
    
    container.innerHTML = siteData.drills.map(drill => `
        <a href="${drill.link}" class="subject-card ${drill.color} section-link">
            <div class="subject-card-inner">
                <h3>${drill.name}</h3>
                <p>${drill.description}</p>
                <span class="badge">${drill.badge}</span>
                <div class="card-arrow">→ ${drill.cta}</div>
            </div>
        </a>
    `).join('');
}

// Inject info strip
function injectInfoStrip() {
    const container = document.getElementById('info-strip');
    if (!container) return;
    
    container.innerHTML = siteData.infoStrip.map((item, index) => `
        <div class="info-cell reveal" style="${index > 0 ? `transition-delay: ${0.15 * index}s` : ''}">
            <div class="info-label">${item.label}</div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
        </div>
    `).join('');
}

// Inject CTA band
function injectCTABand() {
    const ctaTitle = document.getElementById('cta-title');
    const ctaBtn = document.getElementById('cta-btn');
    if (ctaTitle) ctaTitle.innerHTML = siteData.ctaBand.title;
    if (ctaBtn) {
        ctaBtn.textContent = siteData.ctaBand.buttonText;
        ctaBtn.href = siteData.ctaBand.buttonLink;
    }
}

// Inject footer
function injectFooter() {
    const footerDesc = document.getElementById('footer-description');
    const copyright = document.getElementById('copyright');
    if (footerDesc) footerDesc.textContent = siteData.footer.description;
    if (copyright) copyright.innerHTML = siteData.footer.copyright;
    
    const footerTop = document.querySelector('.footer-top');
    if (footerTop) {
        const brand = footerTop.querySelector('.footer-brand');
        footerTop.innerHTML = '';
        if (brand) footerTop.appendChild(brand);
        
        footerTop.innerHTML += siteData.footer.sections.map(section => `
            <div class="footer-col">
                <h4>${section.title}</h4>
                <ul>
                    ${section.links.map(link => `
                        <li><a href="${link.href}">${link.text}</a></li>
                    `).join('')}
                </ul>
            </div>
        `).join('');
    }
    
    const footerLinks = document.getElementById('footer-links');
    if (footerLinks) {
        footerLinks.innerHTML = siteData.footer.bottomLinks.map(link =>
            `<a href="${link.href}">${link.text}</a>`
        ).join('');
    }
}

// Animations
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

function initNavigation() {
    const toggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('open');
            navLinks.classList.toggle('open');
        });
    }
    const siteNav = document.querySelector('.site-nav');
    if (siteNav) {
        window.addEventListener('scroll', () => {
            siteNav.style.boxShadow = window.scrollY > 10 ? '0 4px 0 0 #0a0a0a' : 'none';
        }, { passive: true });
    }
}

// Initialize everything
function init() {
    injectNavigation();
    injectTicker();
    injectHeroStats();
    injectSectionHeaders();
    injectExamCategories();
    injectSubjectCards();
    injectDrillCards();
    injectInfoStrip();
    injectCTABand();
    injectFooter();
    
    splitText(document.getElementById('main-title'));
    initRevealObserver();
    initNavigation();
    
    window.onload = () => document.body.classList.add('active');
}

document.addEventListener('DOMContentLoaded', init);