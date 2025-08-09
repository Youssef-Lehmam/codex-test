interface NavItem {
  id: string;
  label: string;
}

interface Service {
  title: string;
  description: string;
  details: string;
}

interface Testimonial {
  name: string;
  company: string;
  quote: string;
}

class StorageWrapper<T> {
  constructor(private key: string) {}
  save(data: T): void {
    localStorage.setItem(this.key, JSON.stringify(data));
  }
  load(defaultValue: T): T {
    const raw = localStorage.getItem(this.key);
    return raw ? (JSON.parse(raw) as T) : defaultValue;
  }
}

class Navbar {
  private menuBtn: HTMLElement;
  private navMenu: HTMLElement;
  constructor(menuBtnId: string, navMenuId: string) {
    this.menuBtn = document.getElementById(menuBtnId)!;
    this.navMenu = document.getElementById(navMenuId)!;
    this.menuBtn.addEventListener("click", () => this.toggleMenu());
    window.addEventListener("resize", () => this.onResize());
  }

  setupNav(items: NavItem[]): void {
    this.navMenu.innerHTML = items
      .map((i) => `<a href="#${i.id}">${i.label}</a>`)
      .join("");
  }

  toggleMenu(): void {
    this.navMenu.classList.toggle("open");
  }

  onResize(): void {
    if (window.innerWidth > 768) {
      this.navMenu.classList.remove("open");
    }
  }
}

class ThemeManager {
  private btn: HTMLElement;
  private storage = new StorageWrapper<string>("theme");
  constructor(toggleId: string) {
    this.btn = document.getElementById(toggleId)!;
    this.btn.addEventListener("click", () => this.toggle());
    const saved = this.storage.load("light");
    if (saved === "dark") {
      document.body.classList.add("dark");
    }
  }

  toggle(): void {
    document.body.classList.toggle("dark");
    const theme = document.body.classList.contains("dark")
      ? "dark"
      : "light";
    this.storage.save(theme);
  }
}

class ScrollAnimator {
  private observer: IntersectionObserver;
  constructor() {
    this.observer = new IntersectionObserver(this.onIntersect.bind(this), {
      threshold: 0.2,
    });
  }

  observe(selector: string): void {
    document.querySelectorAll(selector).forEach((el) => this.observer.observe(el));
  }

  private onIntersect(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }
}

class ServiceManager {
  private container: HTMLElement;
  constructor(containerId: string) {
    this.container = document.getElementById(containerId)!;
  }

  render(services: Service[]): void {
    this.container.innerHTML = "";
    services.forEach((s) => {
      const card = document.createElement("div");
      card.className = "service-card";
      card.innerHTML = `<h3>${s.title}</h3><p>${s.description}</p><div class="details" hidden>${s.details}</div>`;
      card.addEventListener("click", () => {
        card.classList.toggle("expanded");
        const details = card.querySelector<HTMLDivElement>(".details")!;
        details.hidden = !details.hidden;
      });
      this.container.appendChild(card);
    });
  }
}

class TestimonialManager {
  private container: HTMLElement;
  constructor(containerId: string) {
    this.container = document.getElementById(containerId)!;
  }

  render(testimonials: Testimonial[]): void {
    this.container.innerHTML = testimonials
      .map(
        (t) =>
          `<article class="testimonial"><p>${t.quote}</p><h4>${t.name}</h4><small>${t.company}</small></article>`
      )
      .join("");
  }
}

class ContactForm {
  private form: HTMLFormElement;
  constructor(formId: string) {
    this.form = document.getElementById(formId) as HTMLFormElement;
    this.form.addEventListener("submit", (e) => this.onSubmit(e));
  }

  private validate(): boolean {
    let valid = true;
    const controls: { id: string; pattern?: RegExp; message: string }[] = [
      { id: "name", message: "Name is required" },
      {
        id: "email",
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Valid email is required",
      },
      { id: "message", message: "Message is required" },
    ];
    controls.forEach((c) => {
      const input = this.form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${c.id}`)!;
      const error = this.form.querySelector<HTMLSpanElement>(`[data-for='${c.id}']`)!;
      if (!input.value || (c.pattern && !c.pattern.test(input.value))) {
        error.textContent = c.message;
        valid = false;
      } else {
        error.textContent = "";
      }
    });
    return valid;
  }

  private onSubmit(e: Event): void {
    e.preventDefault();
    if (!this.validate()) return;
    const success = this.form.querySelector<HTMLParagraphElement>(".form-success")!;
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
const navItems: NavItem[] = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
];

const services: Service[] = [
  {
    title: "Cloud Solutions",
    description: "Scalable and secure cloud infrastructure tailored to your needs.",
    details:
      "We design and manage cloud architectures on AWS, Azure, and GCP, ensuring availability and cost efficiency.",
  },
  {
    title: "DevOps Automation",
    description: "Streamline your deployment pipeline with automation and CI/CD.",
    details:
      "Our DevOps experts integrate tools like Docker, Kubernetes, and Jenkins to accelerate your releases.",
  },
  {
    title: "AI Insights",
    description: "Unlock data-driven decisions with machine learning and analytics.",
    details:
      "We build predictive models and dashboards to turn raw data into actionable intelligence.",
  },
  {
    title: "Cybersecurity",
    description: "Protect your assets with proactive security strategies.",
    details:
      "From penetration testing to SOC operations, we fortify your business against cyber threats.",
  },
];

const testimonials: Testimonial[] = [
  {
    name: "Amina R.",
    company: "Atlas Bank",
    quote:
      "Zenvex transformed our infrastructure, cutting deployment times by 70% while improving security.",
  },
  {
    name: "Karim L.",
    company: "Sahara Retail",
    quote:
      "Their AI insights gave us a competitive edge with real-time analytics that our team relies on daily.",
  },
  {
    name: "Nadia S.",
    company: "Casablanca Health",
    quote:
      "We sleep better at night knowing Zenvex monitors our systems around the clock.",
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
