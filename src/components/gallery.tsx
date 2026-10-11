"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

const images = [
  {
    src: "/images/portfolio-nude.png",
    title: "Nude delicado",
    alt: "Imagem conceitual de unhas alongadas com acabamento nude delicado, criada com inteligência artificial.",
  },
  {
    src: "/images/portfolio-french.png",
    title: "Francesinha contemporânea",
    alt: "Imagem conceitual de unhas femininas com francesinha elegante, criada com inteligência artificial.",
  },
  {
    src: "/images/portfolio-art.png",
    title: "Nail art sutil",
    alt: "Imagem conceitual de unhas com nail art delicada, criada com inteligência artificial.",
  },
];

const buttonStyle =
  "flex size-10 items-center justify-center rounded-full border border-[#e7ded5] bg-white/70 text-[#8f765c] transition hover:border-[#b39778] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8f765c] motion-reduce:transition-none";

export function Gallery() {
  const [active, setActive] = useState(0);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const modalRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const isOpen = modalIndex !== null;

  function scrollToImage(index: number) {
    const track = trackRef.current;
    const item = itemRefs.current[index];
    if (!track || !item) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const offset = item.getBoundingClientRect().left - track.getBoundingClientRect().left;

    track.scrollTo({
      left: track.scrollLeft + offset,
      behavior: reducedMotion ? "instant" : "smooth",
    });
  }

  function updateActiveImage() {
    const track = trackRef.current;
    if (!track) return;

    const trackBounds = track.getBoundingClientRect();
    const center = trackBounds.left + trackBounds.width / 2;
    let closest = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    itemRefs.current.forEach((item, index) => {
      if (!item) return;
      const bounds = item.getBoundingClientRect();
      const distance = Math.abs(bounds.left + bounds.width / 2 - center);
      if (distance < closestDistance) {
        closest = index;
        closestDistance = distance;
      }
    });

    setActive(closest);
  }

  useEffect(() => {
    if (!isOpen) return;

    const dialog = modalRef.current;
    if (!dialog) return;

    const bodyOverflow = document.body.style.overflow;
    const restoreFocus = triggerRef.current;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    const focusFrame = requestAnimationFrame(() => closeRef.current?.focus());

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const direction = event.key === "ArrowLeft" ? -1 : 1;
        setModalIndex((index) =>
          index === null ? null : (index + direction + images.length) % images.length,
        );
      } else if (event.key === "Tab") {
        const controls = modalRef.current?.querySelectorAll<HTMLButtonElement>(
          "button:not([disabled])",
        );
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        const focused = document.activeElement;

        if (event.shiftKey && (focused === first || !modalRef.current?.contains(focused))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (focused === last || !modalRef.current?.contains(focused))) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      if (dialog.open) dialog.close();
      document.body.style.overflow = bodyOverflow;
      if (restoreFocus?.isConnected) restoreFocus.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const modalImage = modalIndex !== null ? images[modalIndex] : null;

  return (
    <div className="portfolio-gallery mx-auto w-full max-w-[350px] lg:max-w-none">
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="galeria"
        aria-label="Inspirações de unhas"
        onScroll={updateActiveImage}
        className="portfolio-track relative flex snap-x snap-mandatory gap-4 overflow-x-auto rounded-[22px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 lg:snap-none lg:gap-6 lg:overflow-visible"
      >
        {images.map((photo, index) => (
          <button
            key={photo.src}
            ref={(element) => { itemRefs.current[index] = element; }}
            type="button"
            aria-label={`Ampliar ${photo.title}, imagem ${index + 1} de ${images.length}`}
            onClick={(event) => {
              triggerRef.current = event.currentTarget;
              setModalIndex(index);
            }}
            className="portfolio-card group relative aspect-[350/310] w-full shrink-0 snap-center overflow-hidden rounded-[22px] bg-[#e8dfd5] text-left focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white lg:min-w-0"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={350}
              height={310}
              sizes="(min-width: 1440px) 400px, (min-width: 1024px) calc((100vw - 160px) / 3), (max-width: 420px) calc(100vw - 64px), 350px"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <span className="absolute bottom-5 left-5 right-10 text-[11px] leading-5 font-medium tracking-[0.18em] text-white uppercase">
              {photo.title}
            </span>
            <span className="absolute right-4 bottom-5 text-white/80" aria-hidden="true">
              <Expand size={16} strokeWidth={1.5} />
            </span>
          </button>
        ))}
      </div>

      <div className="portfolio-controls mt-5 flex items-center justify-between gap-4 lg:hidden">
        <button
          type="button"
          aria-label="Inspiração anterior"
          className={buttonStyle}
          onClick={() => scrollToImage((active - 1 + images.length) % images.length)}
        >
          <ArrowLeft size={17} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <div className="flex items-center gap-1" aria-label="Selecionar inspiração">
          {images.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              aria-label={`Ver ${photo.title}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => scrollToImage(index)}
              className="flex size-9 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8f765c]"
            >
              <span
                aria-hidden="true"
                className={`block h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${index === active ? "w-5 bg-[#756452]" : "w-1.5 bg-[#8f765c]"}`}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Próxima inspiração"
          className={buttonStyle}
          onClick={() => scrollToImage((active + 1) % images.length)}
        >
          <ArrowRight size={17} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
      <p className="portfolio-hint mt-3 text-center text-[10px] tracking-[0.25em] text-[#756452] uppercase lg:hidden">
        Arraste para explorar
      </p>
      <p className="mt-5 text-center text-[11px] leading-[1.7] text-[#756452]">
        Imagens conceituais criadas com IA para inspirar seu próximo cuidado.
      </p>

      {modalImage && createPortal(
        <dialog
          ref={modalRef}
          aria-labelledby="gallery-dialog-title"
          aria-describedby="gallery-dialog-description"
          className="fixed inset-0 m-auto max-h-[calc(100dvh_-_40px)] w-[calc(100%_-_40px)] max-w-[480px] overflow-y-auto rounded-[24px] border-0 bg-[#f7f4ef] p-0 shadow-2xl backdrop:bg-[#29221c]/80 backdrop:backdrop-blur-sm"
          onCancel={(event) => {
            event.preventDefault();
            setModalIndex(null);
          }}
          onClick={(event) => {
            if (event.target !== event.currentTarget) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < bounds.left || event.clientX > bounds.right ||
              event.clientY < bounds.top || event.clientY > bounds.bottom
            ) setModalIndex(null);
          }}
        >
          <div className="relative">
            <button
              ref={closeRef}
              type="button"
              aria-label="Fechar imagem ampliada"
              onClick={() => setModalIndex(null)}
              className="absolute top-3 right-3 z-10 flex size-11 items-center justify-center rounded-full bg-white/95 text-[#6e5844] shadow-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8f765c] motion-reduce:transition-none"
            >
              <X size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <Image
              src={modalImage.src}
              alt={modalImage.alt}
              width={750}
              height={900}
              sizes="(max-width: 520px) calc(100vw - 40px), 480px"
              className="max-h-[62dvh] w-full bg-[#e8dfd5] object-contain"
            />
            <div className="px-6 pt-5 pb-6">
              <h3 id="gallery-dialog-title" className="font-serif text-[25px] text-[#6e5844]">
                {modalImage.title}
              </h3>
              <p id="gallery-dialog-description" className="mt-1 text-xs leading-5 text-[#756452]">
                Inspiração visual criada com inteligência artificial.
              </p>
              <div className="mt-5 flex items-center justify-between">
                <button
                  type="button"
                  aria-label="Ampliar inspiração anterior"
                  className={buttonStyle}
                  onClick={() => setModalIndex((index) => index === null ? null : (index - 1 + images.length) % images.length)}
                >
                  <ArrowLeft size={17} strokeWidth={1.5} aria-hidden="true" />
                </button>
                <p aria-live="polite" className="text-xs tracking-[0.15em] text-[#756452]">
                  {(modalIndex ?? 0) + 1} / {images.length}
                </p>
                <button
                  type="button"
                  aria-label="Ampliar próxima inspiração"
                  className={buttonStyle}
                  onClick={() => setModalIndex((index) => index === null ? null : (index + 1) % images.length)}
                >
                  <ArrowRight size={17} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </dialog>,
        document.body,
      )}
    </div>
  );
}
