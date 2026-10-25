import { academy, routeMetadata } from "./config.js";

const app = document.querySelector("#app");
const path = normalizePath(window.location.pathname);
const navigation = [
  ["/", "Home"],
  ["/about/", "About"],
  ["/classes/", "Classes"],
  ["/achievements/", "Achievements"],
  ["/gallery/", "Gallery"],
  ["/contact/", "Contact"]
];

function normalizePath(value) {
  if (!value || value === "/") return "/";
  return `/${value.replace(/^\/+|\/+$/g, "")}/`;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function header() {
  const links = navigation.map(([href, label]) =>
    `<a class="nav-link${path === href ? " is-active" : ""}" href="${href}"${path === href ? ' aria-current="page"' : ""}>${label}</a>`
  ).join("");
  const programmes = academy.programmes.map((programme) =>
    `<a href="/programmes/${programme.slug}/">${programme.name}</a>`
  ).join("");
  return `
    <header class="site-header">
      <a class="brand" href="/" aria-label="MAD United Academy home">
        <img src="${academy.logo}" alt="" width="48" height="53">
        <span class="brand-name">MAD <span>UNITED ACADEMY</span></span>
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation">
        <span class="menu-toggle-label">Menu</span><span class="menu-icon" aria-hidden="true"><i></i><i></i></span>
      </button>
      <nav class="primary-navigation" id="primary-navigation" aria-label="Primary navigation">
        ${links}
        <details class="programme-menu">
          <summary>Programmes <span aria-hidden="true">⌄</span></summary>
          <div class="programme-menu-panel">${programmes}</div>
        </details>
        <a class="button button-small button-green nav-join" href="/contact/">Join a class <span aria-hidden="true">↗</span></a>
      </nav>
    </header>`;
}

function footer() {
  const programmeLinks = academy.programmes.map((programme) =>
    `<li><a href="/programmes/${programme.slug}/">${programme.name}</a></li>`
  ).join("");
  const configuredContact = academy.contact.email
    ? `<a href="mailto:${escapeHtml(academy.contact.email)}">${escapeHtml(academy.contact.email)}</a>`
    : `<a href="/contact/">Send an enquiry</a>`;
  return `
    <footer class="site-footer">
      <div class="footer-main">
        <div class="footer-brand">
          <img src="${academy.logo}" alt="MAD United Academy official logo" width="90" height="98" loading="lazy">
          <p class="eyebrow">MINDSET. ARTS. DISCIPLINE.</p>
          <p>Four disciplines. One united spirit. A place to build confidence, movement and personal growth.</p>
          <span class="footer-location">${academy.location}</span>
        </div>
        <div><h2>Explore</h2><ul>${programmeLinks}<li><a href="/classes/">Classes</a></li></ul></div>
        <div><h2>Academy</h2><ul><li><a href="/about/">About MAD</a></li><li><a href="/instructors/">Instructors</a></li><li><a href="/achievements/">Achievements</a></li><li><a href="/gallery/">Gallery</a></li></ul></div>
        <div><h2>Get in touch</h2><ul><li>${configuredContact}</li><li><a href="/contact/">Contact and join</a></li></ul></div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} MAD United Academy</span>
        <div><a href="/privacy/">Privacy notice</a><a href="/terms/">Terms</a></div>
        <span>Mindset. Arts. Discipline.</span>
      </div>
    </footer>`;
}

function pageIntro(eyebrow, title, description, image = "") {
  return `
    <section class="page-intro${image ? " page-intro-image" : ""}" ${image ? `style="--intro-image: url('${escapeHtml(image)}')"` : ""}>
      <div class="page-intro-inner">
        <p class="eyebrow">${eyebrow}</p>
        <h1>${title}</h1>
        <p class="page-intro-copy">${description}</p>
      </div>
    </section>`;
}

function programmeCard(programme, featured = false) {
  const visual = programme.image
    ? `<img src="${programme.image}" alt="${escapeHtml(programme.imageAlt)}" ${featured ? 'fetchpriority="high"' : 'loading="lazy"'} width="900" height="700">`
    : `<div class="visual-placeholder karate-art" role="img" aria-label="MAD United Academy Karate programme graphic"><span class="art-label">MAD / KARATE</span><span class="art-monogram" aria-hidden="true">K</span><span class="art-caption" aria-hidden="true">FOCUS · FORM · DISCIPLINE</span></div>`;
  return `
    <article class="programme-card ${programme.tone}${featured ? " programme-card-featured" : ""}">
      <a class="programme-card-image" href="/programmes/${programme.slug}/" aria-label="Explore ${programme.name}">
        ${visual}
        <span class="card-index">${String(academy.programmes.indexOf(programme) + 1).padStart(2, "0")}</span>
      </a>
      <div class="programme-card-content">
        <p class="eyebrow">${programme.kicker}</p>
        <h3><a href="/programmes/${programme.slug}/">${programme.name}</a></h3>
        <p>${programme.shortDescription}</p>
        <a class="text-link" href="/programmes/${programme.slug}/">Explore programme <span aria-hidden="true">↗</span></a>
      </div>
    </article>`;
}

function pillars() {
  return `
    <section class="section section-ivory pillars-section">
      <div class="section-heading">
        <div><p class="eyebrow">The MAD philosophy</p><h2>More than a skill.<br><em>A way to grow.</em></h2></div>
        <p>MAD is the foundation of every discipline we bring together: a thoughtful approach to learning, expression and personal growth.</p>
      </div>
      <div class="pillar-grid">
        <article class="pillar"><span class="pillar-letter">M</span><p class="eyebrow">Mindset</p><h3>Build from within.</h3><p>Confidence, focus, resilience and a willingness to learn—one practice at a time.</p></article>
        <article class="pillar"><span class="pillar-letter">A</span><p class="eyebrow">Arts</p><h3>Find your expression.</h3><p>Explore discipline, creativity, rhythm, movement and the stories carried by different art forms.</p></article>
        <article class="pillar"><span class="pillar-letter">D</span><p class="eyebrow">Discipline</p><h3>Grow through practice.</h3><p>Develop consistency, respect, commitment, self-control and responsibility.</p></article>
      </div>
    </section>`;
}

function enquiryCta() {
  return `
    <section class="join-section">
      <div class="join-copy">
        <p class="eyebrow">Start where you are</p>
        <h2>Your journey starts<br><em>with one step.</em></h2>
        <p>Explore a discipline that inspires you, ask about suitable classes, and take the first step towards learning with MAD United Academy.</p>
        <div class="button-row">
          <a class="button button-ivory" href="/contact/?programme=karate">Enquire about Karate <span aria-hidden="true">↗</span></a>
          <a class="button button-outline-light" href="/contact/">Contact the academy</a>
        </div>
      </div>
      <div class="join-mark" aria-hidden="true"><span>M</span><span>A</span><span>D</span></div>
    </section>`;
}

function locationSection() {
  return `
    <section class="location-section section section-ivory">
      <div><p class="eyebrow">Find your community</p><h2>Come be part of<br><em>the MAD community.</em></h2></div>
      <div class="location-detail"><span class="location-pin" aria-hidden="true">↗</span><p class="eyebrow">Our location</p><h3>${academy.location}</h3><p>Exact venue and class locations are shared once confirmed.</p><a class="text-link" href="/contact/">Ask about locations <span aria-hidden="true">↗</span></a></div>
    </section>`;
}

function timetablePreview() {
  const classes = academy.classes.filter((item) => item.published === true);
  if (!classes.length) {
    return `<div class="empty-state"><span class="empty-mark" aria-hidden="true">M</span><h3>Timetable details are being confirmed.</h3><p>We don't publish unverified class times or availability. Enquire for the latest schedule, suitable age groups and current options.</p><a class="text-link" href="/contact/">Ask about classes <span aria-hidden="true">↗</span></a></div>`;
  }
  const rows = classes.map((item) =>
    `<tr><td>${escapeHtml(item.day)}</td><td>${escapeHtml(item.time)}</td><td>${escapeHtml(item.programme)}</td><td>${escapeHtml(item.group ?? "Please enquire")}</td></tr>`
  ).join("");
  return `<div class="table-wrap"><table><thead><tr><th>Day</th><th>Time</th><th>Programme</th><th>Group</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function homePage() {
  const karate = academy.programmes[0];
  const karateVisual = `<div class="visual-placeholder karate-art" role="img" aria-label="MAD United Academy Karate programme graphic"><span class="art-label">MAD / KARATE</span><span class="art-monogram" aria-hidden="true">K</span><span class="art-caption" aria-hidden="true">FOCUS · FORM · DISCIPLINE</span></div>`;
  return `
    <main id="main">
      <section class="hero">
        <div class="hero-content">
          <p class="eyebrow"><span class="eyebrow-line"></span> Mindset. Arts. Discipline.</p>
          <h1>Build character.<br><em>Master your art.</em></h1>
          <p class="hero-welcome">Welcome to MAD United Academy.</p>
          <p class="hero-description">A place where discipline meets creativity. Discover karate, Bharatanatyam, Western dance and yoga in an environment designed to nurture confidence, movement, focus and personal growth.</p>
          <div class="button-row">
            <a class="button button-green" href="/programmes/karate/">Explore Karate <span aria-hidden="true">↗</span></a>
            <a class="button button-outline-light" href="#programmes">Discover all programmes</a>
          </div>
          <a class="hero-small-link" href="/contact/">Ready to begin? <span>Join a class ↗</span></a>
        </div>
        <div class="hero-visual">
          ${karate.image ? `<img src="${karate.image}" alt="${escapeHtml(karate.imageAlt)}" width="1200" height="1400" fetchpriority="high">` : karateVisual}
          <div class="hero-image-caption"><span>01 / 04</span><span>Focus in every movement</span></div>
          <div class="hero-vertical-label">KARATE — THE FLAGSHIP DISCIPLINE</div>
        </div>
        <div class="hero-bottom"><span>BANGALORE, KARNATAKA</span><span>ONE ACADEMY · FOUR DISCIPLINES</span></div>
      </section>
      ${pillars()}
      <section class="karate-feature">
        <div class="karate-feature-image">${karate.image ? `<img src="${karate.image}" alt="${escapeHtml(karate.imageAlt)}" loading="lazy" width="1200" height="900">` : karateVisual}</div>
        <div class="karate-feature-content"><p class="eyebrow">The flagship discipline</p><h2>Strength in every stance.<br><em>Character in every step.</em></h2><p>${karate.description}</p><ul class="check-list">${karate.benefits.slice(0, 3).map((benefit) => `<li>${benefit}</li>`).join("")}</ul><div class="button-row"><a class="button button-green" href="/programmes/karate/">Explore Karate <span aria-hidden="true">↗</span></a><a class="text-link text-link-light" href="/contact/?programme=karate">Ask about classes <span aria-hidden="true">↗</span></a></div></div>
      </section>
      <section class="section section-white programme-section" id="programmes">
        <div class="section-heading"><div><p class="eyebrow">Find your discipline</p><h2>Four disciplines.<br><em>One united spirit.</em></h2></div><p>Different ways to move, create and grow. Find the practice that speaks to you.</p></div>
        <div class="programme-grid">${programmeCard(karate, true)}<div class="programme-grid-secondary">${academy.programmes.slice(1).map((programme) => programmeCard(programme)).join("")}</div></div>
      </section>
      <section class="section section-ivory benefits-section">
        <div class="section-heading"><div><p class="eyebrow">The MAD difference</p><h2>A stronger you<br><em>starts here.</em></h2></div><p>Thoughtful learning is about more than technique. It's how a practice can support growth—in class and beyond.</p></div>
        <div class="benefit-list"><span>Structured learning</span><span>Confidence and focus</span><span>Fitness and movement</span><span>Respect and discipline</span><span>Creative expression</span><span>A welcoming environment</span><span>Progress at your own pace</span></div>
      </section>
      <section class="pathway-section">
        <div class="pathway-title"><p class="eyebrow">A path of your own</p><h2>Every journey<br><em>begins somewhere.</em></h2><p>Ask us about suitable options for your age, experience and interests. Availability is confirmed by the academy.</p><a class="text-link text-link-light" href="/contact/">Find your starting point <span aria-hidden="true">↗</span></a></div>
        <ol class="pathway-list"><li><span>01</span><div><h3>Begin with fundamentals</h3><p>Discover the foundations of movement and practice.</p></div></li><li><span>02</span><div><h3>Build with consistency</h3><p>Develop control, confidence and a deeper understanding.</p></div></li><li><span>03</span><div><h3>Explore what’s next</h3><p>Continue learning at a pace suited to your own journey.</p></div></li></ol>
      </section>
      <section class="section section-white timetable-section"><div class="section-heading"><div><p class="eyebrow">Classes and timetable</p><h2>Find your time<br><em>to train.</em></h2></div><p>Class times, groups and availability are shared by the academy once confirmed.</p></div>${timetablePreview()}<div class="section-end-link"><a class="text-link" href="/classes/">View class information <span aria-hidden="true">↗</span></a></div></section>
      <section class="section section-ivory progress-preview"><div><p class="eyebrow">Progress, recognised</p><h2>Every milestone<br><em>matters.</em></h2><p>Celebrate dedication and growth. Public achievements are shared only after academy approval and appropriate consent.</p><a class="text-link" href="/achievements/">Explore achievements <span aria-hidden="true">↗</span></a></div><div class="empty-state empty-state-compact"><span class="empty-mark" aria-hidden="true">✳</span><h3>Good things take practice.</h3><p>Verified student milestones will appear here when approved for publication.</p></div></section>
      <section class="section section-white home-gallery"><div class="section-heading"><div><p class="eyebrow">Moments in motion</p><h2>The journey<br><em>in motion.</em></h2></div><p>We share academy photographs only when they are approved for publication.</p></div><div class="gallery-empty"><span class="gallery-empty-index">MAD / 01</span><p>Academy gallery coming soon</p><a class="text-link" href="/gallery/">Visit the gallery <span aria-hidden="true">↗</span></a></div></section>
      ${academy.testimonials.length ? testimonialSection() : ""}
      ${enquiryCta()}
      ${locationSection()}
    </main>`;
}

function testimonialSection() {
  const approved = academy.testimonials.filter((item) => item.approved === true);
  if (!approved.length) return "";
  return `<section class="section section-ivory"><div class="section-heading"><div><p class="eyebrow">In their own words</p><h2>Growth that goes<br><em>beyond the class.</em></h2></div></div><div class="testimonial-grid">${approved.map((item) => `<figure class="testimonial"><blockquote>“${escapeHtml(item.quote)}”</blockquote><figcaption>${escapeHtml(item.displayName)}${item.relationship ? ` · ${escapeHtml(item.relationship)}` : ""}</figcaption></figure>`).join("")}</div></section>`;
}

function aboutPage() {
  return `
    <main id="main">
      ${pageIntro("The meaning behind MAD", "Mindset. Arts.<br><em>Discipline.</em>", "A shared philosophy across four disciplines—each offering a different way to learn, express and grow.")}
      <section class="section section-ivory about-intro"><div class="about-statement"><span class="quote-mark">“</span><h2>Different disciplines.<br><em>One shared spirit.</em></h2></div><div class="about-copy"><p>MAD United Academy brings together karate, Bharatanatyam, Western dance and yoga. We believe that every practice can offer more than a skill: a chance to develop focus, creativity, confidence and care for others.</p><p>Rooted in Bangalore, the academy is a place for people to explore movement and learning through disciplines that are distinct in form, yet connected by commitment and curiosity.</p><p class="detail-note">Academy history, founder's message, mission and vision will be added when verified details are provided.</p></div></section>
      ${pillars()}
      <section class="section section-white values-section"><div class="section-heading"><div><p class="eyebrow">What guides us</p><h2>Values that shape<br><em>the practice.</em></h2></div><p>Our values are the way we hope to learn together—not promises of a particular outcome.</p></div><div class="value-grid">${["Respect", "Consistency", "Discipline", "Confidence", "Creativity", "Inclusivity", "Personal growth", "Community"].map((value, i) => `<div class="value-item"><span>${String(i + 1).padStart(2, "0")}</span><h3>${value}</h3></div>`).join("")}</div></section>
      ${enquiryCta()}
    </main>`;
}

function programmePage(programme) {
  const faq = programme.faqs.map(([question, answer]) => `<details class="faq-item"><summary>${question}<span aria-hidden="true">+</span></summary><p>${answer}</p></details>`).join("");
  const more = academy.programmes.filter((item) => item.slug !== programme.slug);
  const visual = programme.image
    ? `<img src="${programme.image}" alt="${escapeHtml(programme.imageAlt)}" width="1200" height="1300" fetchpriority="high"><span class="image-note">Illustrative stock photography</span>`
    : `<div class="visual-placeholder karate-art" role="img" aria-label="MAD United Academy Karate programme graphic"><span class="art-label">MAD / KARATE</span><span class="art-monogram" aria-hidden="true">K</span><span class="art-caption" aria-hidden="true">FOCUS · FORM · DISCIPLINE</span></div>`;
  const karateFocus = programme.slug === "karate" ? `
      <section class="section section-ivory karate-focus">
        <div class="section-heading"><div><p class="eyebrow">A practice with many dimensions</p><h2>More than<br><em>one kind of progress.</em></h2></div><p>Training may support different areas of development. Participation, progression and competition options depend on the academy's actual programme.</p></div>
        <div class="karate-focus-grid"><article><span>01 / TECHNIQUE</span><h3>Learn with precision.</h3><p>Explore fundamental stances, blocks, punches and kicks, and movement patterns as confirmed by the academy syllabus.</p></article><article><span>02 / MOVEMENT</span><h3>Build physical skills.</h3><p>Practice can involve coordination, balance, agility and fitness, paced to the learner and the class.</p></article><article><span>03 / CHARACTER</span><h3>Grow through discipline.</h3><p>Focus, respect, confidence and self-control are values nurtured through consistent practice—not guaranteed outcomes.</p></article><article><span>04 / COMPETITION</span><h3>Ask about opportunities.</h3><p>Competition preparation or participation may be available only when offered by the academy; no event or result is promised.</p></article></div>
      </section>` : "";
  return `
    <main id="main">
      <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/#programmes">Programmes</a><span aria-hidden="true">/</span><span aria-current="page">${programme.name}</span></nav>
      <section class="programme-hero ${programme.tone}">
        <div class="programme-hero-copy"><p class="eyebrow">${programme.kicker}</p><h1>${programme.name}<br><em>${programme.slug === "karate" ? "with purpose." : "in every movement."}</em></h1><p>${programme.description}</p><div class="button-row"><a class="button button-green" href="/contact/?programme=${programme.slug}">Enquire about ${programme.name} <span aria-hidden="true">↗</span></a><a class="text-link" href="/classes/">Ask about classes</a></div></div>
        <div class="programme-hero-image">${visual}</div>
      </section>
      <section class="section section-ivory programme-detail"><div><p class="eyebrow">The practice</p><h2>${programme.slug === "karate" ? "Strength and skill.<br><em>Character and care.</em>" : "Learn with curiosity.<br><em>Grow through practice.</em>"}</h2></div><div><p>${programme.description}</p><p>Programme details, suitable age groups, instructor profiles and current class availability are confirmed directly by the academy. No belt schedule, qualification pathway, event or outcome is implied.</p></div></section>
      <section class="section section-white benefits-section"><div class="section-heading"><div><p class="eyebrow">What you can explore</p><h2>Practice with<br><em>purpose.</em></h2></div><p>Learning is shaped by the programme, the student and the academy's current offering.</p></div><ul class="programme-benefits">${programme.benefits.map((benefit, i) => `<li><span>${String(i + 1).padStart(2, "0")}</span><p>${benefit}</p></li>`).join("")}</ul></section>
      ${karateFocus}
      <section class="section section-ivory pathway-section programme-pathway"><div><p class="eyebrow">Your learning pathway</p><h2>Progress, one<br><em>practice at a time.</em></h2><p>Explore an appropriate starting point and next steps with the academy. Class levels and age groups are subject to confirmation.</p></div><div class="pathway-steps"><div><span>01</span><h3>Start with the basics</h3><p>Build familiarity with the foundations of your chosen practice.</p></div><div><span>02</span><h3>Deepen your practice</h3><p>Develop technique, awareness and confidence through learning.</p></div><div><span>03</span><h3>Keep discovering</h3><p>Ask about continuing options as your interests grow.</p></div></div></section>
      <section class="section section-white programme-faq"><div><p class="eyebrow">Good to know</p><h2>Frequently<br><em>asked questions.</em></h2><p>Have another question? We're happy to help you find out more.</p><a class="text-link" href="/contact/">Ask the academy <span aria-hidden="true">↗</span></a></div><div class="faq-list">${faq}</div></section>
      <section class="section section-ivory more-programmes"><div class="section-heading"><div><p class="eyebrow">More ways to move</p><h2>Explore another<br><em>discipline.</em></h2></div></div><div class="mini-programme-grid">${more.map((item) => programmeCard(item)).join("")}</div></section>
      ${enquiryCta()}
    </main>`;
}

function classesPage() {
  const classes = academy.classes.filter((item) => item.published === true);
  const options = (values) => values.map((value) => `<option>${escapeHtml(value)}</option>`).join("");
  return `<main id="main">${pageIntro("Find your rhythm", "Classes and<br><em>timetable.</em>", "Find out about current class schedules, age groups and suitable starting points. Details are confirmed by the academy.")}<section class="section section-white class-search"><div class="section-heading"><div><p class="eyebrow">The current schedule</p><h2>Find your time<br><em>to train.</em></h2></div><p>We don't publish unverified times, fees, instructor assignments or availability. Please enquire for current information.</p></div>${classes.length ? `<div class="filter-row"><label>Programme <select id="class-filter"><option value="">All programmes</option>${options(academy.programmes.map((item) => item.name), "")}</select></label><label>Day <select id="day-filter"><option value="">Any day</option>${options([...new Set(classes.map((item) => item.day).filter(Boolean))], "")}</select></label><label>Age group <select id="age-filter"><option value="">Any age group</option>${options([...new Set(classes.map((item) => item.ageGroup).filter(Boolean))], "")}</select></label><label>Level <select id="level-filter"><option value="">Any level</option>${options([...new Set(classes.map((item) => item.level).filter(Boolean))], "")}</select></label></div><div class="table-wrap"><table><thead><tr><th>Day</th><th>Time</th><th>Programme</th><th>Age group</th><th>Level</th></tr></thead><tbody id="class-results">${classes.map((item) => `<tr data-programme="${escapeHtml(item.programme)}" data-day="${escapeHtml(item.day)}" data-age="${escapeHtml(item.ageGroup ?? "")}" data-level="${escapeHtml(item.level ?? "")}"><td>${escapeHtml(item.day)}</td><td>${escapeHtml(item.time)}</td><td>${escapeHtml(item.programme)}</td><td>${escapeHtml(item.ageGroup ?? "Please enquire")}</td><td>${escapeHtml(item.level ?? "Please enquire")}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty-state"><span class="empty-mark" aria-hidden="true">↗</span><h3>Timetable details are being confirmed.</h3><p>Choose a programme to ask about class days, time, age group and level. We'll share information once it's verified.</p><a class="button button-green" href="/contact/">Enquire about classes</a></div>`}</section><section class="section section-ivory audience-section"><p class="eyebrow">Possible learning groups</p><h2>Find a fitting<br><em>starting point.</em></h2><p class="audience-disclaimer">These are enquiry categories only. Age groups and class availability must be confirmed by the academy.</p><div class="audience-list"><span>Children and beginners</span><span>Young learners</span><span>Teenagers</span><span>Adults</span><span>Continuing learners</span></div></section>${enquiryCta()}</main>`;
}

function instructorsPage() {
  const approved = academy.instructors.filter((item) => item.approved === true && item.name && item.programme);
  const content = approved.length
    ? `<div class="instructor-grid">${approved.map((person) => `<article class="instructor-card">${person.portrait ? `<img src="${escapeHtml(person.portrait)}" alt="${escapeHtml(person.name)}" loading="lazy">` : `<div class="instructor-placeholder" aria-hidden="true">MAD</div>`}<div><p class="eyebrow">${escapeHtml(person.programme)}</p><h2>${escapeHtml(person.name)}</h2>${person.role ? `<p>${escapeHtml(person.role)}</p>` : ""}${person.qualification ? `<p>${escapeHtml(person.qualification)}</p>` : ""}${person.biography ? `<p>${escapeHtml(person.biography)}</p>` : ""}</div></article>`).join("")}</div>`
    : `<div class="empty-state"><span class="empty-mark">M</span><h2>Meet the people behind the practice.</h2><p>Instructor profiles will be published when names, roles, qualifications and biographies have been verified by the academy.</p></div>`;
  return `<main id="main">${pageIntro("Guidance through practice", "Meet our<br><em>instructors.</em>", "Learn from the people who guide each discipline. We share profiles only when academy details are verified.")}<section class="section section-ivory">${content}</section>${enquiryCta()}</main>`;
}

function achievementsPage() {
  const approved = academy.achievements.filter((item) => item.approvalStatus === "approved" && item.published === true);
  const content = approved.length
    ? `<div class="achievement-grid">${approved.map((item) => `<article class="achievement-card">${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt ?? item.title)}" loading="lazy">` : ""}<p class="eyebrow">${escapeHtml(item.programme)}${item.date ? ` · ${escapeHtml(item.date)}` : ""}</p><h2>${escapeHtml(item.title)}</h2>${item.event ? `<p>${escapeHtml(item.event)}</p>` : ""}${item.result ? `<p class="achievement-result">${escapeHtml(item.result)}</p>` : ""}${item.displayName ? `<p>${escapeHtml(item.displayName)}</p>` : ""}${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}</article>`).join("")}</div>`
    : `<div class="empty-state"><span class="empty-mark" aria-hidden="true">✳</span><h2>Every milestone matters.</h2><p>Approved student achievements will be shared here when verified and cleared for publication. We do not display unreviewed submissions or unapproved student information.</p></div>`;
  return `<main id="main">${pageIntro("A journey worth celebrating", "Every milestone<br><em>matters.</em>", "We recognise the effort, dedication and progress behind every step. Public achievements require academy approval and appropriate consent.")}<section class="section section-white">${content}</section>${enquiryCta()}</main>`;
}

function galleryPage() {
  const items = academy.gallery.filter((item) => item.approved === true && item.consentConfirmed === true);
  const content = items.length
    ? `<div class="gallery-filters" role="group" aria-label="Filter gallery by programme"><button class="filter-button is-selected" type="button" data-gallery-filter="all" aria-pressed="true">All</button>${academy.programmes.map((item) => `<button class="filter-button" type="button" data-gallery-filter="${item.slug}" aria-pressed="false">${item.name}</button>`).join("")}</div><div class="gallery-grid">${items.map((item) => `<figure class="gallery-item" data-programme="${escapeHtml(item.programmeSlug ?? "all")}"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt)}" loading="lazy"><figcaption><span>${escapeHtml(item.programme ?? "Academy")}</span>${item.caption ? ` · ${escapeHtml(item.caption)}` : ""}</figcaption></figure>`).join("")}</div>`
    : `<div class="empty-state"><span class="empty-mark" aria-hidden="true">MAD</span><h2>Moments in motion.</h2><p>Academy photographs will appear here only when approved for publication. Images of minors require appropriate parent or guardian consent.</p></div>`;
  return `<main id="main">${pageIntro("The academy, through its lens", "The journey<br><em>in motion.</em>", "A thoughtful look at practice, performance and the moments that bring a community together.")}<section class="section section-ivory">${content}</section>${enquiryCta()}</main>`;
}

function enquiryForm() {
  return `
    <form class="enquiry-form" id="enquiry-form" novalidate>
      <div class="form-intro"><p class="eyebrow">Tell us a little</p><h2>Let's start<br><em>a conversation.</em></h2><p>Share only the information needed for us to respond. Please don't include sensitive personal or medical details.</p></div>
      <div class="form-fields">
        <div class="form-field"><label for="name">Parent or student's name <span>*</span></label><input id="name" name="name" autocomplete="name" required maxlength="100" aria-describedby="name-error"><span class="field-error" id="name-error"></span></div>
        <div class="form-field"><label for="phone">Contact number <span>*</span></label><input id="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+91" pattern="^\\+?[0-9\\s()\\-]{8,20}$" required aria-describedby="phone-hint phone-error"><small id="phone-hint">India country code is supported (for example, +91).</small><span class="field-error" id="phone-error"></span></div>
        <div class="form-field"><label for="email">Email address <span class="optional">(optional)</span></label><input id="email" name="email" type="email" autocomplete="email" maxlength="160" aria-describedby="email-error"><span class="field-error" id="email-error"></span></div>
        <div class="form-field"><label for="age">Student age or age group <span>*</span></label><input id="age" name="age" placeholder="For example, 10 years or adult" required maxlength="40" aria-describedby="age-error"><span class="field-error" id="age-error"></span></div>
        <div class="form-field"><label for="programme">Programme of interest <span>*</span></label><select id="programme" name="programme" required aria-describedby="programme-error"><option value="">Choose a programme</option>${academy.programmes.map((item) => `<option value="${item.slug}">${item.name}</option>`).join("")}<option value="unsure">Not sure yet</option></select><span class="field-error" id="programme-error"></span></div>
        <div class="form-field"><label for="experience">Previous experience <span class="optional">(optional)</span></label><input id="experience" name="experience" maxlength="120" aria-describedby="experience-error"><span class="field-error" id="experience-error"></span></div>
        <div class="form-field form-field-wide"><label for="timing">Preferred class timing <span class="optional">(optional)</span></label><input id="timing" name="timing" maxlength="120" aria-describedby="timing-error"><span class="field-error" id="timing-error"></span></div>
        <div class="form-field form-field-wide"><label for="message">Message <span class="optional">(optional)</span></label><textarea id="message" name="message" rows="4" maxlength="1200" aria-describedby="message-error"></textarea><span class="field-error" id="message-error"></span></div>
        <div class="form-field honeypot" aria-hidden="true"><label for="website">Leave this field empty</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div>
        <div class="form-field form-field-wide consent-field"><label class="checkbox-label"><input id="consent" name="consent" type="checkbox" required aria-describedby="consent-error"><span>I agree that MAD United Academy may use the information I provide to respond to this enquiry. <a href="/privacy/">Read the privacy notice</a>. <b>*</b></span></label><span class="field-error" id="consent-error"></span></div>
        <div class="form-field form-field-wide form-submit"><button class="button button-green" type="submit">Send enquiry <span aria-hidden="true">↗</span></button><p class="form-status" id="form-status" role="status" aria-live="polite"></p><p class="form-delivery-note">Enquiry delivery is not configured yet. The form will not claim success unless a real endpoint accepts your message.</p></div>
      </div>
    </form>`;
}

function contactPage() {
  return `<main id="main">${pageIntro("A first step", "Your journey<br><em>starts here.</em>", "Ask about a programme, current classes or the right place to begin. We’ll share the latest details once confirmed.")}<section class="contact-section section section-ivory"><div class="contact-details"><p class="eyebrow">MAD United Academy</p><h2>Let's find your<br><em>starting point.</em></h2><div class="contact-block"><span>01 / LOCATION</span><p>${academy.location}</p><small>Exact venue details are shared once confirmed.</small></div><div class="contact-block"><span>02 / CONTACT</span><p>${academy.contact.email ? `<a href="mailto:${escapeHtml(academy.contact.email)}">${escapeHtml(academy.contact.email)}</a>` : "Contact details are being confirmed."}</p><small>Use the enquiry form to ask about classes.</small></div><div class="contact-block"><span>03 / ENQUIRY</span><p>Karate · Bharatanatyam<br>Western Dance · Yoga</p></div></div>${enquiryForm()}</section></main>`;
}

function privacyPage() {
  return `<main id="main">${pageIntro("Your information matters", "Privacy<br><em>notice.</em>", "A starter privacy notice for this website. It must be reviewed and updated to reflect the academy's actual systems and practices before launch.")}<section class="legal-copy section section-white"><p class="legal-warning">Draft for review — this page is not legal advice and does not claim regulatory compliance. Update it before collecting enquiries or enabling third-party services.</p><h2>Information you choose to share</h2><p>The enquiry form requests a name, contact number, student age or age group and programme interest. Email, experience, timing and message are optional. Do not include sensitive personal or medical information.</p><h2>How information is used</h2><p>Information should be used only to review and respond to your enquiry. Online delivery is not configured at present; this website does not claim that a submitted form has been received or stored.</p><h2>Children and consent</h2><p>A parent or guardian should provide contact details and consent when making an enquiry for a child. Photographs or identifying details of minors must not be published without appropriate consent.</p><h2>Retention, sharing and your choices</h2><p>The academy must document its actual storage, service providers, retention periods, security measures and process for privacy requests before enabling a real enquiry backend. Contact the academy through the contact page to ask about this notice.</p><h2>Updates</h2><p>This draft should be revised whenever the academy's data practices change. Applicable Indian privacy and child-protection requirements should be checked with qualified counsel.</p></section></main>`;
}

function termsPage() {
  return `<main id="main">${pageIntro("Using this website", "Terms and<br><em>conditions.</em>", "A straightforward starting point for website use. Confirm and adapt these terms for the academy before launch.")}<section class="legal-copy section section-white"><p class="legal-warning">Draft for review — these terms have not been reviewed by a lawyer and do not describe enrolment, fees or class policies that have not been supplied.</p><h2>Website information</h2><p>This website introduces MAD United Academy and its programmes. Class times, age groups, instructor details, fees, availability and venue information are subject to confirmation by the academy.</p><h2>No guarantee of outcomes</h2><p>Descriptions of potential learning areas are informational. Individual progress varies; no qualification, fitness result, competition result or other outcome is promised.</p><h2>Images and content</h2><p>Illustrative stock photographs are not photographs of academy students or instructors. Academy imagery must be approved for publication and used with appropriate consent.</p><h2>Contact</h2><p>Use the contact page to ask questions. The enquiry form is not a functioning submission channel until a secure delivery endpoint is configured.</p></section></main>`;
}

function render() {
  let content;
  if (path === "/") content = homePage();
  else if (path === "/about/") content = aboutPage();
  else if (path === "/classes/") content = classesPage();
  else if (path === "/instructors/") content = instructorsPage();
  else if (path === "/achievements/") content = achievementsPage();
  else if (path === "/gallery/") content = galleryPage();
  else if (path === "/contact/") content = contactPage();
  else if (path === "/privacy/") content = privacyPage();
  else if (path === "/terms/") content = termsPage();
  else {
    const programme = academy.programmes.find((item) => path === `/programmes/${item.slug}/`);
    content = programme ? programmePage(programme) : `<main id="main">${pageIntro("404", "Page not<br><em>found.</em>", "This page may have moved. Explore the academy or contact us to find what you need.")}<section class="section section-white"><a class="button button-green" href="/">Return home</a></section></main>`;
  }
  app.innerHTML = `${header()}${content}${footer()}`;
  document.body.classList.toggle("page-home", path === "/");
  setupMobileMenu();
  setupEnquiryForm();
  setupGalleryFilters();
  setupClassFilters();
  setSelectedProgramme();
  setupRevealAnimations();
  document.title = routeMetadata[path]?.[0] ?? "MAD United Academy";
}

function setupMobileMenu() {
  const button = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-navigation");
  if (!button || !nav) return;
  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
    button.querySelector(".menu-toggle-label").textContent = isOpen ? "Menu" : "Close";
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      button.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      button.querySelector(".menu-toggle-label").textContent = "Menu";
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      button.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      button.querySelector(".menu-toggle-label").textContent = "Menu";
      button.focus();
    }
  });
}

function setSelectedProgramme() {
  const selected = new URLSearchParams(window.location.search).get("programme");
  const field = document.querySelector("#programme");
  if (field && selected && [...field.options].some((option) => option.value === selected)) field.value = selected;
}

function setupEnquiryForm() {
  const form = document.querySelector("#enquiry-form");
  if (!form) return;
  const status = document.querySelector("#form-status");
  const button = form.querySelector('button[type="submit"]');
  const endpoint = document.querySelector('meta[name="enquiry-endpoint"]')?.content.trim();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "";
    form.querySelectorAll(".field-error").forEach((error) => { error.textContent = ""; });
    form.querySelectorAll("[aria-invalid='true']").forEach((field) => field.removeAttribute("aria-invalid"));
    const invalidFields = [...form.elements].filter((field) => field.willValidate && !field.checkValidity());
    if (invalidFields.length) {
      invalidFields.forEach((field) => {
        const error = document.querySelector(`#${field.id}-error`);
        field.setAttribute("aria-invalid", "true");
        if (error) error.textContent = field.validity.valueMissing ? "This field is required." : "Please enter a valid value.";
      });
      invalidFields[0].focus();
      status.textContent = "Please review the highlighted fields.";
      return;
    }
    if (form.elements.website.value) {
      status.textContent = "This enquiry could not be sent. Please contact the academy directly.";
      status.className = "form-status is-error";
      return;
    }
    if (!endpoint) {
      status.textContent = "Not sent: enquiry delivery is not configured. The academy has not received your message. Please contact the academy through a verified channel.";
      status.className = "form-status is-error";
      return;
    }
    form.querySelectorAll("[aria-invalid='true']").forEach((field) => field.removeAttribute("aria-invalid"));
    button.disabled = true;
    button.textContent = "Sending…";
    status.textContent = "Sending your enquiry…";
    status.className = "form-status";
    try {
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      delete payload.website;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`Enquiry endpoint returned ${response.status}`);
      form.reset();
      status.textContent = "Your enquiry was accepted. The academy will follow up using the contact details you provided.";
      status.className = "form-status is-success";
    } catch (error) {
      console.error("Enquiry delivery failed.", error);
      status.textContent = "We couldn't send your enquiry. Nothing has been confirmed as received. Please try again later or contact the academy through a verified channel.";
      status.className = "form-status is-error";
    } finally {
      button.disabled = false;
      button.innerHTML = 'Send enquiry <span aria-hidden="true">↗</span>';
    }
  });
}

function setupGalleryFilters() {
  const buttons = document.querySelectorAll("[data-gallery-filter]");
  if (!buttons.length) return;
  buttons.forEach((button) => button.addEventListener("click", () => {
    const selected = button.dataset.galleryFilter;
    buttons.forEach((candidate) => {
      const active = candidate === button;
      candidate.classList.toggle("is-selected", active);
      candidate.setAttribute("aria-pressed", String(active));
    });
    document.querySelectorAll(".gallery-item").forEach((item) => {
      item.hidden = selected !== "all" && item.dataset.programme !== selected;
    });
  }));
}

function setupClassFilters() {
  const filters = [
    ["#class-filter", "programme"],
    ["#day-filter", "day"],
    ["#age-filter", "age"],
    ["#level-filter", "level"]
  ].map(([selector, key]) => [document.querySelector(selector), key]).filter(([field]) => field);
  if (!filters.length) return;
  const filter = () => {
    document.querySelectorAll("#class-results tr").forEach((row) => {
      row.hidden = filters.some(([field, key]) => field.value && row.dataset[key] !== field.value);
    });
  };
  filters.forEach(([field]) => field.addEventListener("change", filter));
}

function setupRevealAnimations() {
  const elements = document.querySelectorAll(
    ".section-heading, .pillar, .programme-card, .benefit-list span, .pathway-list li, .empty-state, .value-item, .karate-focus-grid article, .programme-detail > *, .pathway-steps > div, .faq-item, .achievement-card, .instructor-card, .gallery-item"
  );
  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("reveal-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
        activeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });
  elements.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 75}ms`);
    observer.observe(element);
  });
}

render();
