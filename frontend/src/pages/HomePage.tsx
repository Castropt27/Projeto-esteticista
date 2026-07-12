import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Nota: substituí o <ServiceCard /> por um cartão desenhado dentro desta
// página, para poder mostrar um ícone por tratamento sem depender da
// interface interna desse componente (que não estava disponível aqui).

function Icon({ path, size = 24 }: { path: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

const icons = {
  leaf: 'M4 20c8 0 14-6 14-14 0-1 0-2-.2-3C9.8 3.5 4 9.3 4 18c0 .7 0 1.4.2 2z M4 20c3-3 6-6 10-9',
  drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  sparkle: 'M12 3c.6 3.4 2.3 5.1 5.7 5.7-3.4.6-5.1 2.3-5.7 5.7-.6-3.4-2.3-5.1-5.7-5.7C9.7 8.1 11.4 6.4 12 3z',
  shield: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z M9 12l2 2 4-4',
  heart: 'M12 20s-7-4.4-9.5-8.8C.8 8 2 4.5 5.5 4c2-.3 3.8.8 4.5 2.5C10.7 4.8 12.5 3.7 14.5 4c3.5.5 4.7 4 3 7.2C15 15.6 12 20 12 20z',
  select: 'M6 3l14 6-6 2-2 6-6-14z',
  calendar: 'M4 5h16v16H4z M4 9h16 M8 3v4 M16 3v4',
  sun: 'M12 6a6 6 0 100 12 6 6 0 000-12z M12 1v3 M12 20v3 M4.2 4.2l2.1 2.1 M17.7 17.7l2.1 2.1 M1 12h3 M20 12h3 M4.2 19.8l2.1-2.1 M17.7 6.3l2.1-2.1',
};

const tratamentosIniciais = [
  { id: 1, nome: 'Tratamentos Faciais', desc: 'Limpezas profundas avançadas e regeneração celular.', icon: icons.sparkle },
  { id: 2, nome: 'Tratamentos Corporais', desc: 'Drenagens de toxinas e massagens modeladoras corporais.', icon: icons.leaf },
  { id: 3, nome: 'Bem-estar & Mente', desc: 'Sessões calmas de relaxamento e aromaterapia purificada.', icon: icons.sun },
];

const beneficios = [
  { titulo: 'Especialistas Certificadas', desc: 'Equipa com formação contínua em técnicas avançadas de estética.', icon: icons.shield },
  { titulo: 'Produtos Premium', desc: 'Selecionamos marcas testadas dermatologicamente para peles sensíveis.', icon: icons.drop },
  { titulo: 'Ambiente Sereno', desc: 'Um espaço pensado para desacelerar, respirar e cuidar de ti.', icon: icons.heart },
  { titulo: 'Planos Personalizados', desc: 'Cada tratamento é adaptado ao teu tipo de pele e aos teus objetivos.', icon: icons.sparkle },
];

const passos = [
  { numero: '01', titulo: 'Escolhe o teu tratamento', desc: 'Explora os nossos serviços e encontra o que se adapta a ti.', icon: icons.select },
  { numero: '02', titulo: 'Marca o teu horário', desc: 'Reserva online em poucos minutos, sem complicações.', icon: icons.calendar },
  { numero: '03', titulo: 'Relaxa e desfruta', desc: 'Deixa-nos cuidar de ti num ambiente pensado para o teu bem-estar.', icon: icons.sun },
];

const testemunhos = [
  { nome: 'Marta S.', texto: 'Desde que comecei os tratamentos faciais aqui, a minha pele nunca esteve tão saudável e equilibrada.' },
  { nome: 'Inês R.', texto: 'O ambiente é tão calmo que qualquer sessão parece um pequeno dia de férias no meio da semana.' },
  { nome: 'Beatriz A.', texto: 'Sinto-me sempre ouvida. Cada plano é mesmo pensado à minha medida, não é um tratamento genérico.' },
];

const estatisticas = [
  { valor: '+10', label: 'anos a cuidar de peles' },
  { valor: '+500', label: 'clientes fiéis' },
  { valor: '4.9/5', label: 'avaliação média' },
];

export function HomePage() {
  const { auth } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleNewsletter = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error('Falha ao subscrever');
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <style>{homeCss}</style>

      <section id="inicio" style={styles.hero} className="hp-hero">
        <div className="hp-orb hp-orb-a" aria-hidden="true" />
        <div className="hp-orb hp-orb-b" aria-hidden="true" />

        <div style={styles.heroOverlay}>
          <p style={styles.eyebrow}>Estética &amp; Bem-estar</p>
          <h1 style={styles.heroTitle}>Sinta a sua beleza natural</h1>
          <svg className="hp-divider" width="110" height="24" viewBox="0 0 110 24" aria-hidden="true">
            <path d="M2 12 Q 27 2, 55 12 T 108 12" stroke="#C9A66B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <circle cx="55" cy="12" r="3" fill="#C9A66B" />
          </svg>
          <p style={styles.heroSubtitle}>Um portal limpo e tipado sob a filosofia do luxo silencioso.</p>
          <div style={styles.heroActions}>
            {auth ? (
              <Link to="/perfil" style={styles.btnPrimary} className="hp-btn">Ir para o perfil</Link>
            ) : (
              <Link to="/registar" style={styles.btnPrimary} className="hp-btn">Criar conta</Link>
            )}
            <Link to="/servicos" style={styles.btnSecondary} className="hp-btn-outline">Ver serviços</Link>
          </div>

          <div style={styles.statsRow}>
            {estatisticas.map((stat) => (
              <div key={stat.label} style={styles.statItem}>
                <strong style={styles.statValue}>{stat.valor}</strong>
                <span style={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <a href="#porque" className="hp-scroll-cue" aria-label="Ver mais">
          <Icon path="M6 9l6 6 6-6" size={20} />
        </a>
      </section>

      <section id="porque" style={styles.section}>
        <div className="container">
          <p style={styles.eyebrowDark}>Porque escolher-nos</p>
          <h2 style={styles.sectionTitle}>Cuidado pensado ao pormenor</h2>
          <div style={styles.benefitsGrid}>
            {beneficios.map((item) => (
              <article key={item.titulo} style={styles.benefitCard} className="hp-card">
                <span style={styles.benefitIcon}><Icon path={item.icon} /></span>
                <h3 style={styles.benefitTitle}>{item.titulo}</h3>
                <p style={styles.benefitText}>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="servicos" style={styles.servicesSection}>
        <div className="container">
          <p style={styles.eyebrowDark}>Tratamentos</p>
          <h2 style={styles.sectionTitle}>Nossos Tratamentos Dedicados</h2>
          <div style={styles.grid}>
            {tratamentosIniciais.map((item) => (
              <article key={item.id} style={styles.serviceCard} className="hp-card">
                <span style={styles.serviceIcon}><Icon path={item.icon} /></span>
                <h3 style={styles.serviceTitle}>{item.nome}</h3>
                <p style={styles.serviceText}>{item.desc}</p>
                <Link to="/servicos" style={styles.serviceLink} className="hp-link">Saber mais →</Link>
              </article>
            ))}
          </div>
          <div style={styles.centerCta}>
            <Link to="/servicos" style={styles.btnSecondary} className="hp-btn-outline">Ver todos os serviços</Link>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div className="container">
          <p style={styles.eyebrowDark}>Como funciona</p>
          <h2 style={styles.sectionTitle}>Do primeiro clique à tua sessão</h2>
          <div style={styles.stepsGrid}>
            {passos.map((passo) => (
              <div key={passo.numero} style={styles.stepCard}>
                <span style={styles.stepNumber}>{passo.numero}</span>
                <span style={styles.stepIcon}><Icon path={passo.icon} /></span>
                <h3 style={styles.stepTitle}>{passo.titulo}</h3>
                <p style={styles.stepText}>{passo.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.testimonialsSection}>
        <div className="container">
          <p style={styles.eyebrow}>O que dizem de nós</p>
          <h2 style={styles.sectionTitleLight}>Histórias de quem confia em nós</h2>
          <div style={styles.testimonialsGrid}>
            {testemunhos.map((item) => (
              <figure key={item.nome} style={styles.testimonialCard} className="hp-card">
                <Icon path={icons.sparkle} size={20} />
                <blockquote style={styles.testimonialText}>&ldquo;{item.texto}&rdquo;</blockquote>
                <figcaption style={styles.testimonialName}>{item.nome}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.newsletterSection}>
        <div className="container" style={styles.newsletterInner}>
          <div>
            <h2 style={styles.newsletterTitle}>Fica a par das novidades</h2>
            <p style={styles.newsletterText}>Dicas de cuidado de pele e promoções exclusivas, direto na tua caixa de entrada.</p>
          </div>
          <form onSubmit={handleNewsletter} style={styles.newsletterForm}>
            <label htmlFor="newsletter-email" style={styles.srOnly}>Email</label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="o-teu-email@exemplo.pt"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={styles.newsletterInput}
              className="hp-input"
            />
            <button type="submit" style={styles.btnPrimary} className="hp-btn" disabled={status === 'loading'}>
              {status === 'loading' ? 'A subscrever...' : 'Subscrever'}
            </button>
          </form>
          {status === 'success' && <p style={styles.newsletterMsgOk}>Obrigado! Verifica o teu email para confirmar.</p>}
          {status === 'error' && <p style={styles.newsletterMsgErr}>Não foi possível subscrever agora. Tenta novamente.</p>}
        </div>
      </section>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  hero: { position: 'relative', overflow: 'hidden', minHeight: 'calc(100vh - 110px)', background: 'linear-gradient(135deg, var(--azul-muito-claro) 0%, var(--fundo) 100%)', display: 'grid', placeItems: 'center', textAlign: 'center', padding: '40px 20px' },
  heroOverlay: { position: 'relative', zIndex: 1, maxWidth: '800px' },
  eyebrow: { margin: '0 0 10px', color: '#C9A66B', textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: '0.78rem', fontWeight: 700 },
  eyebrowDark: { margin: '0 0 10px', color: '#C9A66B', textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: '0.78rem', fontWeight: 700, textAlign: 'center' },
  heroTitle: { fontSize: 'clamp(3rem, 7vw, 5rem)', color: 'var(--azul-principal)', margin: 0, fontFamily: '"Cormorant Garamond", Georgia, serif', lineHeight: 1.02 },
  heroSubtitle: { fontSize: '1.2rem', color: 'var(--roxo-intermedio)', margin: '4px 0 32px' },
  heroActions: { display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' },
  btnPrimary: { backgroundColor: 'var(--azul-principal)', color: 'var(--branco)', padding: '16px 32px', borderRadius: '50px', fontWeight: 700, textDecoration: 'none', display: 'inline-block', border: 'none', cursor: 'pointer', fontSize: '1rem' },
  btnSecondary: { backgroundColor: 'transparent', color: 'var(--azul-principal)', padding: '16px 32px', borderRadius: '50px', fontWeight: 700, textDecoration: 'none', display: 'inline-block', border: '1px solid var(--azul-principal)' },
  statsRow: { display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '52px', flexWrap: 'wrap' },
  statItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  statValue: { fontSize: '1.8rem', color: 'var(--azul-principal)', fontFamily: '"Cormorant Garamond", Georgia, serif' },
  statLabel: { fontSize: '0.85rem', color: 'var(--roxo-intermedio)' },

  section: { padding: '96px 0' },
  servicesSection: { padding: '96px 0', backgroundColor: 'var(--branco)' },
  sectionTitle: { fontSize: '2.5rem', margin: '0 0 60px', color: 'var(--azul-principal)', textAlign: 'center', fontFamily: '"Cormorant Garamond", Georgia, serif' },
  sectionTitleLight: { fontSize: '2.5rem', margin: '0 0 60px', color: 'var(--branco)', textAlign: 'center', fontFamily: '"Cormorant Garamond", Georgia, serif' },

  benefitsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '24px' },
  benefitCard: { padding: '30px 24px', borderRadius: '18px', backgroundColor: 'var(--branco)', border: '1px solid rgba(40, 55, 90, 0.10)', textAlign: 'left' },
  benefitIcon: { display: 'inline-flex', color: '#C9A66B', marginBottom: '14px' },
  benefitTitle: { margin: '0 0 8px', color: 'var(--azul-principal)', fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.35rem' },
  benefitText: { margin: 0, color: 'var(--roxo-intermedio)', lineHeight: 1.6, fontSize: '0.95rem' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' },
  serviceCard: { padding: '32px 28px', borderRadius: '20px', backgroundColor: 'var(--fundo)', border: '1px solid rgba(40, 55, 90, 0.08)', display: 'flex', flexDirection: 'column', gap: '10px' },
  serviceIcon: { display: 'inline-flex', color: 'var(--azul-principal)', marginBottom: '4px' },
  serviceTitle: { margin: 0, color: 'var(--azul-principal)', fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.5rem' },
  serviceText: { margin: 0, color: 'var(--roxo-intermedio)', lineHeight: 1.6 },
  serviceLink: { marginTop: '8px', color: '#C9A66B', fontWeight: 700, textDecoration: 'none', fontSize: '0.92rem' },
  centerCta: { display: 'flex', justifyContent: 'center', marginTop: '52px' },

  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '28px' },
  stepCard: { position: 'relative', padding: '30px 24px', borderRadius: '18px', border: '1px dashed rgba(40, 55, 90, 0.2)' },
  stepNumber: { position: 'absolute', top: '18px', right: '22px', fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '2.2rem', color: 'rgba(40, 55, 90, 0.12)' },
  stepIcon: { display: 'inline-flex', color: '#C9A66B', marginBottom: '14px' },
  stepTitle: { margin: '0 0 8px', color: 'var(--azul-principal)', fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.3rem' },
  stepText: { margin: 0, color: 'var(--roxo-intermedio)', lineHeight: 1.6, fontSize: '0.95rem' },

  testimonialsSection: { padding: '96px 0', background: 'linear-gradient(135deg, var(--azul-principal) 0%, #1c2947 100%)' },
  testimonialsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' },
  testimonialCard: { padding: '28px', borderRadius: '18px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', color: '#C9A66B' },
  testimonialText: { margin: '14px 0 18px', color: 'var(--branco)', fontStyle: 'italic', lineHeight: 1.7, fontSize: '1.02rem' },
  testimonialName: { color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 700 },

  newsletterSection: { padding: '72px 0', backgroundColor: 'var(--branco)' },
  newsletterInner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '32px', flexWrap: 'wrap', padding: '40px', borderRadius: '24px', backgroundColor: 'var(--fundo)' },
  newsletterTitle: { margin: 0, color: 'var(--azul-principal)', fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.9rem' },
  newsletterText: { margin: '8px 0 0', color: 'var(--roxo-intermedio)', maxWidth: '380px' },
  newsletterForm: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  newsletterInput: { padding: '14px 18px', borderRadius: '50px', border: '1px solid rgba(40, 55, 90, 0.18)', minWidth: '240px', fontSize: '1rem', color: 'var(--azul-principal)' },
  newsletterMsgOk: { width: '100%', margin: '14px 0 0', color: '#2e7d4f', fontSize: '0.92rem' },
  newsletterMsgErr: { width: '100%', margin: '14px 0 0', color: '#b3413a', fontSize: '0.92rem' },
  srOnly: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' },
};

const homeCss = `
  .hp-hero { }
  .hp-orb { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.5; pointer-events: none; }
  .hp-orb-a { width: 380px; height: 380px; background: #C9A66B; top: -120px; right: -80px; opacity: 0.18; }
  .hp-orb-b { width: 300px; height: 300px; background: var(--azul-principal); bottom: -100px; left: -60px; opacity: 0.12; }
  .hp-divider { display: block; margin: 18px auto; }
  .hp-btn, .hp-btn-outline { transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .hp-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(40, 55, 90, 0.25); }
  .hp-btn-outline:hover { transform: translateY(-2px); background-color: rgba(40, 55, 90, 0.06); }
  .hp-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
  .hp-card:hover { transform: translateY(-4px); box-shadow: 0 20px 34px rgba(0,0,0,0.08); }
  .hp-link { transition: opacity 0.2s ease; }
  .hp-link:hover { opacity: 0.7; }
  .hp-input:focus-visible, .hp-btn:focus-visible, .hp-btn-outline:focus-visible, .hp-link:focus-visible {
    outline: 2px solid #C9A66B; outline-offset: 3px;
  }
  .hp-scroll-cue {
    position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
    color: var(--azul-principal); opacity: 0.6; animation: hp-bounce 2.2s ease-in-out infinite;
    display: inline-flex; text-decoration: none;
  }
  @keyframes hp-bounce {
    0%, 100% { transform: translate(-50%, 0); }
    50% { transform: translate(-50%, 8px); }
  }
  @media (prefers-reduced-motion: reduce) {
    .hp-scroll-cue { animation: none; }
    .hp-card:hover, .hp-btn:hover, .hp-btn-outline:hover { transform: none; }
  }
  @media (max-width: 640px) {
    .hp-orb { display: none; }
  }
`;
