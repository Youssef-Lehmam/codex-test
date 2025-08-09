class StorageWrapper {
    constructor(key) {
        this.key = key;
    }
    save(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    }
    load(defaultValue) {
        const raw = localStorage.getItem(this.key);
        return raw ? JSON.parse(raw) : defaultValue;
    }
}
class Navbar {
    constructor(menuBtnId, navMenuId) {
        this.menuBtn = document.getElementById(menuBtnId);
        this.navMenu = document.getElementById(navMenuId);
        this.menuBtn.addEventListener("click", () => this.toggleMenu());
        window.addEventListener("resize", () => this.onResize());
    }
    setupNav(items) {
        this.navMenu.innerHTML = items
            .map((i) => `<a href="#${i.id}">${i.label}</a>`)
            .join("");
    }
    toggleMenu() {
        this.navMenu.classList.toggle("open");
    }
    onResize() {
        if (window.innerWidth > 768) {
            this.navMenu.classList.remove("open");
        }
    }
}
class ThemeManager {
    constructor(toggleId) {
        this.storage = new StorageWrapper("theme");
        this.btn = document.getElementById(toggleId);
        this.btn.addEventListener("click", () => this.toggle());
        const saved = this.storage.load("light");
        if (saved === "dark") {
            document.body.classList.add("dark");
        }
    }
    toggle() {
        document.body.classList.toggle("dark");
        const theme = document.body.classList.contains("dark")
            ? "dark"
            : "light";
        this.storage.save(theme);
    }
}
class ScrollAnimator {
    constructor() {
        this.observer = new IntersectionObserver(this.onIntersect.bind(this), {
            threshold: 0.2,
        });
    }
    observe(selector) {
        document.querySelectorAll(selector).forEach((el) => this.observer.observe(el));
    }
    onIntersect(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }
}
class ServiceManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }
    render(services) {
        this.container.innerHTML = "";
        services.forEach((s) => {
            const card = document.createElement("div");
            card.className = "service-card";
            card.innerHTML = `<h3>${s.title}</h3><p>${s.description}</p><div class="details" hidden>${s.details}</div>`;
            card.addEventListener("click", () => {
                card.classList.toggle("expanded");
                const details = card.querySelector(".details");
                details.hidden = !details.hidden;
            });
            this.container.appendChild(card);
        });
    }
}
class TestimonialManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }
    render(testimonials) {
        this.container.innerHTML = testimonials
            .map((t) => `<article class="testimonial"><p>${t.quote}</p><h4>${t.name}</h4><small>${t.company}</small></article>`)
            .join("");
    }
}
class ContactForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.form.addEventListener("submit", (e) => this.onSubmit(e));
    }
    validate() {
        let valid = true;
        const controls = [
            { id: "name", message: "Name is required" },
            {
                id: "email",
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Valid email is required",
            },
            { id: "message", message: "Message is required" },
        ];
        controls.forEach((c) => {
            const input = this.form.querySelector(`#${c.id}`);
            const error = this.form.querySelector(`[data-for='${c.id}']`);
            if (!input.value || (c.pattern && !c.pattern.test(input.value))) {
                error.textContent = c.message;
                valid = false;
            }
            else {
                error.textContent = "";
            }
        });
        return valid;
    }
    onSubmit(e) {
        e.preventDefault();
        if (!this.validate())
            return;
        const success = this.form.querySelector(".form-success");
        success.hidden = false;
        this.form.reset();
        setTimeout(() => (success.hidden = true), 4000);
    }
}
function initializeFooterYear() {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear().toString();
    }
}
// Data definitions
const navItems = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "testimonials", label: "Testimonials" },
    { id: "contact", label: "Contact" },
];
const services = [
    {
        title: "Cloud Solutions",
        description: "Scalable and secure cloud infrastructure tailored to your needs.",
        details: "We design and manage cloud architectures on AWS, Azure, and GCP, ensuring availability and cost efficiency.",
    },
    {
        title: "DevOps Automation",
        description: "Streamline your deployment pipeline with automation and CI/CD.",
        details: "Our DevOps experts integrate tools like Docker, Kubernetes, and Jenkins to accelerate your releases.",
    },
    {
        title: "AI Insights",
        description: "Unlock data-driven decisions with machine learning and analytics.",
        details: "We build predictive models and dashboards to turn raw data into actionable intelligence.",
    },
    {
        title: "Cybersecurity",
        description: "Protect your assets with proactive security strategies.",
        details: "From penetration testing to SOC operations, we fortify your business against cyber threats.",
    },
];
const testimonials = [
    {
        name: "Amina R.",
        company: "Atlas Bank",
        quote: "Zenvex transformed our infrastructure, cutting deployment times by 70% while improving security.",
    },
    {
        name: "Karim L.",
        company: "Sahara Retail",
        quote: "Their AI insights gave us a competitive edge with real-time analytics that our team relies on daily.",
    },
    {
        name: "Nadia S.",
        company: "Casablanca Health",
        quote: "We sleep better at night knowing Zenvex monitors our systems around the clock.",
    },
];
function init() {
    const navbar = new Navbar("menu-btn", "nav-menu");
    navbar.setupNav(navItems);
    new ThemeManager("theme-toggle");
    const animator = new ScrollAnimator();
    animator.observe(".section");
    const serviceManager = new ServiceManager("service-list");
    serviceManager.render(services);
    const testimonialManager = new TestimonialManager("testimonial-grid");
    testimonialManager.render(testimonials);
    new ContactForm("contact-form");
    initializeFooterYear();
}
document.addEventListener("DOMContentLoaded", init);
export {};
//# sourceMappingURL=main.js.map