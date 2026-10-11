"use client";

import { useEffect } from "react";

export function SiteInteractions() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    let observer: IntersectionObserver | undefined;
    if (!reducedMotion.matches && "IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          }
        }
      }, { threshold: 0.08 });
      elements.forEach((element) => {
        if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add("reveal-pending");
        observer?.observe(element);
      });
    }
    const closeMenus = (event: Event) => {
      if (!(event.target instanceof Element)) return;
      if ((event.type === "click" && event.target.closest("a[href^='#']")) || (event instanceof KeyboardEvent && event.key === "Escape")) {
        document.querySelectorAll<HTMLDetailsElement>("[data-mobile-menu][open]").forEach((menu) => {
          menu.open = false;
          if (event instanceof KeyboardEvent) menu.querySelector<HTMLElement>("summary")?.focus();
        });
      }
    };
    const closeOutside = (event: Event) => {
      if (!(event.target instanceof Element)) return;
      document.querySelectorAll<HTMLDetailsElement>("[data-mobile-menu][open]").forEach((menu) => {
        if (!menu.contains(event.target as Node)) menu.open = false;
      });
    };
    document.addEventListener("click", closeMenus);
    document.addEventListener("click", closeOutside);
    document.addEventListener("keydown", closeMenus);
    return () => {
      observer?.disconnect();
      document.removeEventListener("click", closeMenus);
      document.removeEventListener("click", closeOutside);
      document.removeEventListener("keydown", closeMenus);
    };
  }, []);
  return null;
}
