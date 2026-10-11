"use client";

import { useId, useRef, type ReactNode } from "react";
import { MessageCircle, X } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/site-config";

type Props = {
  children: ReactNode;
  className?: string;
  service?: string;
  variant?: "primary" | "light" | "icon";
  "aria-label"?: string;
};

export function WhatsAppButton({ children, className = "", service, variant = "primary", "aria-label": ariaLabel }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousOverflow = useRef("");
  const titleId = useId();
  const url = getWhatsAppUrl(service);
  const classes = `whatsapp-button whatsapp-button--${variant} ${className}`;

  const openDialog = () => {
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.showModal();
  };
  const closeDialog = () => dialogRef.current?.close();

  if (url) {
    return <a className={classes} href={url} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>{children}</a>;
  }

  return (
    <>
      <button className={classes} type="button" onClick={openDialog} aria-label={ariaLabel}>{children}</button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => { document.body.style.overflow = previousOverflow.current; }}
        onClick={(event) => {
          const rect = dialogRef.current?.getBoundingClientRect();
          if (rect && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) closeDialog();
        }}
        className="m-auto w-[min(90vw,420px)] rounded-[28px] border border-[#e9ded3] bg-[#fbf8f4] p-8 text-center text-[#67533e] shadow-2xl backdrop:bg-[#382a20]/50"
      >
        <button type="button" onClick={closeDialog} aria-label="Fechar aviso" className="absolute right-4 top-4 rounded-full p-2 transition-colors hover:bg-[#eee4d9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#927555]"><X size={20} /></button>
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eee2d5]"><MessageCircle size={25} strokeWidth={1.5} /></div>
        <p className="mb-3 text-[10px] tracking-[0.28em] uppercase">Um momento só seu</p>
        <h2 id={titleId} className="mb-4 font-['Cormorant_Garamond'] text-4xl leading-tight">Vamos conversar em breve</h2>
        <p className="text-sm leading-7">Nosso canal de agendamento será disponibilizado em breve. Enquanto isso, conheça os cuidados e encontre a inspiração para a sua próxima visita.</p>
        <a href="#procedimentos" onClick={closeDialog} className="mt-6 inline-flex rounded-full bg-[#756044] px-6 py-3 text-xs tracking-wider text-white transition-colors hover:bg-[#645139] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#927555]">CONHECER OS SERVIÇOS</a>
      </dialog>
    </>
  );
}
