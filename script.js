/* Small enhancements only. The content and project details work without JS.
   1. Footer year   2. Mobile menu   3. Résumé printing
   4. Scroll entrance effects     5. Current-section navigation */

// 1. Keep the footer year current automatically.
document.querySelector("#year").textContent = new Date().getFullYear();

// 2. Mobile menu. On wide screens the links are always visible.
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-nav");
const mobileLayout = window.matchMedia("(max-width: 1000px)");

function setMenuOpen(isOpen) {
  menuButton.setAttribute("aria-expanded", String(isOpen));
  navigation.classList.toggle("is-open", isOpen);
}

menuButton.addEventListener("click", () => {
  setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
});

navigation.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link || !mobileLayout.matches) return;
  setMenuOpen(false);
  // Move focus to the destination instead of leaving it inside a hidden menu.
  const href = link.getAttribute("href");
  // Project pages also have links to other files; only query local anchors.
  const destination = href.startsWith("#")
    ? document.querySelector(href)
    : null;
  if (destination) {
    destination.setAttribute("tabindex", "-1");
    destination.focus({ preventScroll: true });
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuButton.getAttribute("aria-expanded") === "true"
  ) {
    setMenuOpen(false);
    menuButton.focus();
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) setMenuOpen(false);
});

mobileLayout.addEventListener("change", () => setMenuOpen(false));
// Enable collapsing only after its event handlers have been installed.
menuButton.hidden = false;
document.documentElement.classList.add("menu-enabled");

// 3. The browser can print the résumé or save it as a PDF.
const printButton = document.querySelector("#print-resume");
if (printButton) {
  printButton.addEventListener("click", () => window.print());
  printButton.hidden = false;
}

// 4. Animate each card/role once as it enters view. Never hide content by default.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("reveal-in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  document
    .querySelectorAll(".project-card, .timeline-entry, .education-block")
    .forEach((element) => {
      revealObserver.observe(element);
    });
}

// 5. Mark the section currently nearest the top of the page.
const sectionLinks = [...navigation.querySelectorAll('a[href^="#"]')];
const linkedSections = sectionLinks.map((link) =>
  document.querySelector(link.getAttribute("href")),
);
let updateScheduled = false;

function updateActiveSection() {
  let activeSection = null;
  linkedSections.forEach((section) => {
    if (section && section.getBoundingClientRect().top <= 160)
      activeSection = section;
  });
  sectionLinks.forEach((link) => {
    if (activeSection && link.getAttribute("href") === `#${activeSection.id}`) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
  updateScheduled = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (updateScheduled) return;
    updateScheduled = true;
    window.requestAnimationFrame(updateActiveSection);
  },
  { passive: true },
);

window.addEventListener("resize", updateActiveSection);
updateActiveSection();
