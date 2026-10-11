import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  Flower2,
  Heart,
  ImageIcon,
  MapPin,
  Menu,
  MessageCircle,
  Plus,
  Sparkles,
  Sprout,
} from "lucide-react";
import { Gallery } from "@/components/gallery";
import { InstagramIcon } from "@/components/instagram-icon";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { SERVICES } from "@/lib/services";
import { getSafeExternalUrl, SITE_CONFIG } from "@/lib/site-config";

const shortcuts = [
  {
    href: "#agendamento",
    icon: CalendarDays,
    title: "Agendamento",
    description: "Um momento de cuidado só seu",
  },
  {
    href: "#procedimentos",
    icon: Sparkles,
    title: "Procedimentos",
    description: "Encontre o cuidado que combina com você",
  },
  {
    href: "#inspiracoes",
    icon: ImageIcon,
    title: "Inspirações",
    description: "Detalhes para inspirar o seu próximo estilo",
  },
  {
    href: "#o-estudio",
    icon: Flower2,
    title: "O estúdio",
    description: "Conheça a essência do nosso cuidado",
  },
  {
    href: "#contato",
    icon: MessageCircle,
    title: "Fale conosco",
    description: "Vamos conversar sobre o seu próximo momento",
  },
];

const differentials = [
  {
    icon: Heart,
    title: "Um olhar para você",
    description:
      "Suas preferências, sua rotina e o seu estilo no centro de cada escolha.",
  },
  {
    icon: Sparkles,
    title: "Beleza nos detalhes",
    description:
      "Do formato à cor, cada detalhe faz parte de um resultado com a sua essência.",
  },
  {
    icon: Sprout,
    title: "Cuidado com leveza",
    description:
      "Um convite para desacelerar e dedicar um tempo ao seu autocuidado.",
  },
];

const questions = [
  {
    question: "Como posso solicitar um horário?",
    answer:
      "Toque em “Solicitar horário” para iniciar uma conversa pelo WhatsApp. Conte qual procedimento deseja e suas preferências de dia e horário. O agendamento é concluído após a confirmação pelo atendimento.",
  },
  {
    question: "Qual procedimento é ideal para mim?",
    answer:
      "A escolha depende das suas unhas, da sua rotina e do resultado que você procura. Envie uma mensagem com suas dúvidas para conversar sobre as opções antes de agendar.",
  },
  {
    question: "Posso enviar uma inspiração de nail art?",
    answer:
      "Sim. Compartilhe uma referência na conversa pelo WhatsApp para consultar as possibilidades de cores, formas e detalhes para o seu atendimento.",
  },
  {
    question: "Como consultar os valores e a duração?",
    answer:
      "Os detalhes variam conforme o procedimento e o estilo escolhido. Consulte os valores e o tempo estimado pelo WhatsApp antes da confirmação do seu horário.",
  },
];

function SocialLinks({ className = "" }: { className?: string }) {
  const instagramUrl = getSafeExternalUrl(SITE_CONFIG.instagramUrl);
  const mapsUrl = getSafeExternalUrl(SITE_CONFIG.mapsUrl);
  return (
    <div className={`social-links ${className}`}>
      {instagramUrl && (
        <a
          className="social-button"
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Instagram de ${SITE_CONFIG.name} (abre em nova aba)`}
        >
          <InstagramIcon size={19} strokeWidth={1.4} aria-hidden="true" />
        </a>
      )}
      <WhatsAppButton variant="icon" className="social-button">
        <MessageCircle size={19} strokeWidth={1.4} aria-hidden="true" />
        <span className="sr-only">Entrar em contato pelo WhatsApp</span>
      </WhatsAppButton>
      {mapsUrl && (
        <a
          className="social-button"
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ver localização do estúdio (abre em nova aba)"
        >
          <MapPin size={19} strokeWidth={1.4} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Ir para o conteúdo
      </a>
      <div className="site-shell">
        <header className="site-header">
          <a href="#inicio" className="header-brand" aria-label="Voltar ao início">
            <Flower2 size={21} strokeWidth={1.15} aria-hidden="true" />
            <span className="brand-mobile">Beleza & cuidado</span>
            <span className="brand-desktop">{SITE_CONFIG.name}</span>
          </a>
          <nav className="desktop-navigation" aria-label="Navegação desktop">
            <a href="#procedimentos">Procedimentos</a>
            <a href="#o-estudio">O estúdio</a>
            <a href="#inspiracoes">Inspirações</a>
            <a href="#duvidas">Dúvidas</a>
          </nav>
          <WhatsAppButton className="header-cta">
            <MessageCircle size={16} strokeWidth={1.4} aria-hidden="true" />
            Agendar horário
          </WhatsAppButton>
          <details className="site-navigation" data-mobile-menu>
            <summary>
              <span>Menu</span>
              <Menu size={19} strokeWidth={1.35} aria-hidden="true" />
            </summary>
            <nav aria-label="Navegação principal" className="navigation-panel">
              {shortcuts.map(({ href, title }) => (
                <a key={href} href={href}>
                  {title}
                  <ChevronRight size={15} aria-hidden="true" />
                </a>
              ))}
            </nav>
          </details>
        </header>

        <main id="conteudo">
          <section className="hero section-pad" id="inicio" aria-labelledby="hero-title">
            <div className="hero-portrait">
              <span className="portrait-dot portrait-dot--one" aria-hidden="true" />
              <span className="portrait-dot portrait-dot--two" aria-hidden="true" />
              <span className="portrait-dot portrait-dot--three" aria-hidden="true" />
              <div className="portrait-frame">
                <Image
                  src="/images/hero-nails.png"
                  alt="Composição delicada de unhas em tons naturais"
                  width={640}
                  height={640}
                  preload
                  sizes="(min-width: 1024px) 500px, 640px"
                  className="portrait-image"
                />
              </div>
              <span className="portrait-flower" aria-hidden="true">
                <Flower2 size={26} strokeWidth={1} />
              </span>
            </div>
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow">Seu momento de autocuidado</p>
              <h1 className="hero-title" id="hero-title">
                {SITE_CONFIG.name}
              </h1>
              <p className="hero-tagline">{SITE_CONFIG.tagline}</p>
              <div className="tiny-divider" aria-hidden="true">
                <span />
                <Flower2 size={14} strokeWidth={1.1} />
                <span />
              </div>
              <p className="hero-description">{SITE_CONFIG.description}</p>
              <WhatsAppButton className="hero-primary-cta">
                <MessageCircle size={18} strokeWidth={1.4} aria-hidden="true" />
                Agendar pelo WhatsApp
                <ArrowUpRight size={17} strokeWidth={1.3} aria-hidden="true" />
              </WhatsAppButton>
              <SocialLinks />
              <a href="#descubra" className="discover-link">
                <span>Descubra o seu próximo cuidado</span>
                <ArrowDown size={14} strokeWidth={1.3} aria-hidden="true" />
              </a>
            </div>
          </section>

          <div className="service-ribbon" aria-label="Nossos procedimentos">
            <p>Alongamento <span>·</span> Banho de gel <span>·</span> Blindagem</p>
            <p>Esmaltação em gel <span>·</span> Manicure <span>·</span> Nail art</p>
          </div>

          <section className="qualities section-pad" aria-label="A essência do cuidado">
            <div><Heart size={24} strokeWidth={1.1} aria-hidden="true" /><span>Cuidado<br />individual</span></div>
            <div><Sparkles size={24} strokeWidth={1.1} aria-hidden="true" /><span>Detalhes<br />delicados</span></div>
            <div><Flower2 size={24} strokeWidth={1.1} aria-hidden="true" /><span>Seu estilo<br />em foco</span></div>
          </section>

          <nav className="shortcut-list section-pad" id="descubra" aria-label="Explore o estúdio">
            {shortcuts.map(({ href, icon: Icon, title, description }) => (
              <a className="shortcut-card" href={href} key={href}>
                <span className="shortcut-icon"><Icon size={23} strokeWidth={1.1} aria-hidden="true" /></span>
                <span className="shortcut-copy">
                  <span className="shortcut-title">{title}</span>
                  <span className="shortcut-description">{description}</span>
                </span>
                <ChevronRight className="shortcut-arrow" size={20} strokeWidth={1.15} aria-hidden="true" />
              </a>
            ))}
          </nav>

          <section className="content-section section-pad" id="o-estudio" aria-labelledby="studio-title" data-reveal>
            <div className="section-heading">
              <p className="eyebrow">A essência do estúdio</p>
              <h2 id="studio-title">Um ritual de<br /><em>cuidado e beleza.</em></h2>
              <p>Mais que uma cor nova, um momento para se sentir bem com você.</p>
            </div>
            <div className="experience-layout">
              <div className="experience-visual">
                <div className="experience-image">
                  <Image
                    src="/images/studio-experience.png"
                    alt="Inspiração de um ambiente acolhedor para o cuidado das unhas"
                    width={900}
                    height={720}
                    sizes="(max-width: 540px) 90vw, (max-width: 767px) 468px, (max-width: 1023px) 620px, 560px"
                  />
                  <div className="experience-overlay">
                    <span className="image-eyebrow">Uma pausa no seu dia</span>
                    <p>O cuidado começa<br /><em>nos pequenos detalhes.</em></p>
                  </div>
                </div>
                <p className="concept-note">Imagem conceitual do ambiente. Gerada com IA.</p>
              </div>
              <div className="differential-list">
                {differentials.map(({ icon: Icon, title, description }) => (
                  <div className="differential-card" key={title}>
                    <span className="differential-icon"><Icon size={22} strokeWidth={1.15} aria-hidden="true" /></span>
                    <div>
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="content-section section-pad procedures-section" id="procedimentos" aria-labelledby="procedures-title" data-reveal>
            <div className="section-heading">
              <p className="eyebrow">Procedimentos</p>
              <h2 id="procedures-title">Beleza que expressa<br /><em>o seu estilo.</em></h2>
              <p>Conheça as possibilidades e encontre o cuidado para o seu próximo momento.</p>
            </div>
            <div className="procedure-list">
              {SERVICES.map((service, index) => (
                <details className="procedure-item" key={service.id}>
                  <summary>
                    <span className="procedure-number">0{index + 1}</span>
                    <span>{service.name}</span>
                    <Plus className="details-plus" size={18} strokeWidth={1.2} aria-hidden="true" />
                  </summary>
                  <div className="procedure-content">
                    <p>{service.description}</p>
                    <WhatsAppButton className="procedure-cta" service={service.name}>
                      Consultar este procedimento
                      <ArrowUpRight size={15} strokeWidth={1.3} aria-hidden="true" />
                    </WhatsAppButton>
                  </div>
                </details>
              ))}
            </div>
            <p className="section-footnote">Valores e disponibilidade são informados durante o atendimento.</p>
          </section>

          <section className="content-section section-pad gallery-section" id="inspiracoes" aria-labelledby="gallery-title" data-reveal>
            <div className="section-heading">
              <p className="eyebrow">Inspirações</p>
              <h2 id="gallery-title">Delicadeza em<br /><em>cada detalhe.</em></h2>
              <p>Cores, texturas e formas para inspirar a sua próxima escolha.</p>
            </div>
            <Gallery />
          </section>

          <section className="content-section section-pad stories-section" aria-labelledby="stories-title" data-reveal>
            <div className="section-heading">
              <p className="eyebrow">Experiências</p>
              <h2 id="stories-title">
                {SITE_CONFIG.testimonials.length > 0 ? <>Cuidado que deixa<br /><em>boas lembranças.</em></> : <>Histórias que ainda<br /><em>vamos viver.</em></>}
              </h2>
            </div>
            {SITE_CONFIG.testimonials.length > 0 ? (
              <div className="testimonial-list">
                {SITE_CONFIG.testimonials.map((testimonial) => (
                  <figure className="testimonial-card" key={`${testimonial.name}-${testimonial.service}`}>
                    <blockquote>{testimonial.quote}</blockquote>
                    <figcaption><span>{testimonial.name}</span><span>{testimonial.service}</span></figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="stories-placeholder">
                <Flower2 size={25} strokeWidth={1} aria-hidden="true" />
                <p>Este espaço será dedicado a relatos reais de quem viveu um momento de cuidado por aqui.</p>
                <span>Novas histórias, em breve.</span>
              </div>
            )}
          </section>

          <section className="content-section section-pad faq-section" id="duvidas" aria-labelledby="faq-title" data-reveal>
            <div className="section-heading">
              <p className="eyebrow">Tire suas dúvidas</p>
              <h2 id="faq-title">Antes do seu<br /><em>momento de cuidado.</em></h2>
            </div>
            <div className="faq-list">
              {questions.map(({ question, answer }) => (
                <details className="faq-item" key={question}>
                  <summary><span>{question}</span><Plus className="details-plus" size={18} strokeWidth={1.2} aria-hidden="true" /></summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="booking-section section-pad" id="agendamento" aria-labelledby="booking-title" data-reveal>
            <div className="booking-panel">
              <span className="booking-circle booking-circle--one" aria-hidden="true" />
              <span className="booking-circle booking-circle--two" aria-hidden="true" />
              <div className="booking-copy">
                <Flower2 className="booking-flower" size={28} strokeWidth={1} aria-hidden="true" />
                <p className="eyebrow">Um convite ao autocuidado</p>
                <h2 id="booking-title">Reserve um momento<br /><em>só seu.</em></h2>
                <p className="booking-description">Vamos conversar sobre o cuidado que combina com você?</p>
              </div>
              <div className="booking-actions">
                <WhatsAppButton variant="light" className="booking-cta">
                  <MessageCircle size={18} strokeWidth={1.4} aria-hidden="true" />
                  Solicitar horário
                  <ArrowUpRight size={17} strokeWidth={1.3} aria-hidden="true" />
                </WhatsAppButton>
                <p className="booking-note"><Check size={12} aria-hidden="true" /> Horário sujeito à confirmação no atendimento</p>
              </div>
            </div>
          </section>
        </main>

        <footer className="site-footer section-pad" id="contato">
          <div className="footer-grid">
            <div className="footer-brand">
              <p className="eyebrow">Vamos nos conectar</p>
              <p className="footer-name">{SITE_CONFIG.name}</p>
              <p className="footer-description">A beleza floresce nos detalhes.</p>
              <SocialLinks />
            </div>
            <nav className="footer-navigation" aria-label="Navegação do rodapé">
              <p className="eyebrow">Explore o estúdio</p>
              <a href="#procedimentos">Procedimentos</a>
              <a href="#o-estudio">O estúdio</a>
              <a href="#inspiracoes">Inspirações</a>
              <a href="#duvidas">Dúvidas frequentes</a>
              <a href="#agendamento">Agendamento</a>
            </nav>
            {(SITE_CONFIG.address || SITE_CONFIG.businessHours) && (
              <div className="footer-information">
                {SITE_CONFIG.address && <p>{SITE_CONFIG.address}</p>}
                {SITE_CONFIG.businessHours && <p>{SITE_CONFIG.businessHours}</p>}
              </div>
            )}
          </div>
          <div className="footer-bottom">
            <div className="footer-divider" />
            <p className="copyright">© 2026 {SITE_CONFIG.name}. Todos os direitos reservados.</p>
            <a href="#inicio" className="back-to-top">Voltar ao início <ArrowUpRight size={12} aria-hidden="true" /></a>
          </div>
        </footer>
      </div>
    </>
  );
}
