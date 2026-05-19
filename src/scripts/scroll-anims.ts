import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function initScrollProgress() {
  const bar = document.querySelector<HTMLElement>("[data-scroll-progress]");
  if (!bar) return;
  gsap.to(bar, {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  });
}

function initHeroPin() {
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  const title = document.querySelector<HTMLElement>("[data-hero-title]");
  if (!hero || !title) return;

  ScrollTrigger.create({
    trigger: hero,
    start: "top top",
    end: "+=70%",
    pin: true,
    pinSpacing: true,
    scrub: 0.5,
    onUpdate: (self) => {
      const p = self.progress;
      title.style.setProperty("--fill-progress", String(p));
      if (p > 0.4) {
        title.classList.add("heading-fill");
      } else {
        title.classList.remove("heading-fill");
      }
    },
  });
}

function initMarquees() {
  document.querySelectorAll<HTMLElement>("[data-marquee]").forEach((track) => {
    const direction = track.dataset.marqueeDir === "right" ? 1 : -1;
    const baseSpeed = Number(track.dataset.marqueeSpeed ?? 60);
    const inner = track.firstElementChild as HTMLElement | null;
    if (!inner) return;

    let velocity = 0;
    let position = 0;
    let lastT = performance.now();
    let scrollVel = 0;

    ScrollTrigger.create({
      trigger: track,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        scrollVel = self.getVelocity() / 200;
      },
    });

    function tick(now: number) {
      const dt = (now - lastT) / 1000;
      lastT = now;
      const targetVel = baseSpeed * direction - scrollVel * direction;
      velocity += (targetVel - velocity) * 0.08;
      position += velocity * dt;
      const w = inner!.scrollWidth / 2;
      if (w > 0) {
        position = ((position % w) + w) % w;
      }
      inner!.style.transform = `translate3d(${-position * direction}px, 0, 0)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

function initRevealCards() {
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el, i) => {
    const dir = i % 2 === 0 ? -1 : 1;
    gsap.from(el, {
      x: 60 * dir,
      y: 30,
      rotate: dir * 1.5,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });
}

function initStaggerGrid() {
  document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((container) => {
    const items = container.querySelectorAll<HTMLElement>("[data-stagger-item]");
    if (items.length === 0) return;
    gsap.from(items, {
      y: 40,
      opacity: 0,
      rotate: () => (Math.random() - 0.5) * 6,
      duration: 0.55,
      ease: "back.out(1.7)",
      stagger: 0.08,
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  });
}

function initReadingProgress() {
  const bar = document.querySelector<HTMLElement>("[data-reading-progress]");
  const article = document.querySelector<HTMLElement>("[data-article]");
  if (!bar || !article) return;
  gsap.to(bar, {
    scaleY: 1,
    ease: "none",
    scrollTrigger: {
      trigger: article,
      start: "top center",
      end: "bottom center",
      scrub: true,
    },
  });
}

function initHeadingUnderlines() {
  document.querySelectorAll<HTMLElement>("[data-underline]").forEach((el) => {
    gsap.from(el, {
      "--underline-progress": 0,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });
  });
}

function initHorizontalScroll() {
  const narrow = window.matchMedia("(max-width: 720px)").matches;
  if (narrow) return;

  document.querySelectorAll<HTMLElement>("[data-h-scroll]").forEach((section) => {
    const track = section.querySelector<HTMLElement>("[data-h-track]");
    const progress = section.querySelector<HTMLElement>("[data-h-progress]");
    if (!track) return;

    const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    gsap.to(track, {
      x: () => -getDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${getDistance()}`,
        pin: true,
        scrub: 0.5,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (progress) progress.style.transform = `scaleX(${self.progress})`;
        },
      },
    });
  });
}

export function initScrollAnimations() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  initScrollProgress();
  initHeroPin();
  initMarquees();
  initRevealCards();
  initStaggerGrid();
  initHorizontalScroll();
  initReadingProgress();
  initHeadingUnderlines();

  ScrollTrigger.refresh();
}
