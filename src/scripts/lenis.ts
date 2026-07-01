import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

type WindowWithLenis = Window & {
  __siteLenis?: Lenis | null;
};

export function getLenis(): Lenis | null {
  return lenis;
}

export function initLenis() {
  if (lenis) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  if (reduceMotion || isTouch) {
    return;
  }

  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  (window as WindowWithLenis).__siteLenis = lenis;

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

export function destroyLenis() {
  lenis?.destroy();
  lenis = null;
  (window as WindowWithLenis).__siteLenis = null;
}
