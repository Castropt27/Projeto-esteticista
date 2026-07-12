import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

// Nota: tal como na HomePage, os cartões de serviço são desenhados aqui
// diretamente (ícone, preço, duração, categoria) em vez de usar
// <ServiceCard />, porque esse componente não estava disponível para eu
// confirmar que props aceita.

function Icon({ path, size = 22 }: { path: string; size?: number }) {
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
  sparkle: 'M12 3c.6 3.4 2.3 5.1 5.7 5.7-3.4.6-5.1 2.3-5.7 5.7-.6-3.4-2.3-5.1-5.7-5.7C9.7 8.1 11.4 6.4 12 3z',
  leaf: 'M4 20c8 0 14-6 14-14 0-1 0-2-.2-3C9.8 3.5 4 9.3 4 18c0 .7 0 1.4.2 2z M4 20c3-3 6-6 10-9',
  sun: 'M12 6a6 6 0 100 12 6 6 0 000-12z M12 1v3 M12 20v3 M4.2 4.2l2.1 2.1 M17.7 17.7l2.1 2.1 M1 12h3 M20 12h3 M4.2 19.8l2.1-2.1 M17.7 6.3l2.1-2.1',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18z M12 7v5l3 3',
  tag: 'M20 12l-8 8-9-9V4h7l10 8z M7 7h.01',
};

type Categoria = 'Facial' | 'Corporal' | 'Bem-estar';

type Servico = {
  id: number;
  nome: string;
  desc: string;
  categoria: Categoria;
  duracao: string;
  preco: string;
  popular?: boolean;
  icon: string;
};

const categorias: { label: Categoria | 'Todos'; icon?: string }[] = [
  { label: 'Todos' },
  { label: 'Facial', icon: icons.sparkle },
  { label: 'Corporal', icon: icons.leaf },
  { label: 'Bem-estar', icon: icons.sun },
];

const services: Servico[] = [
  { id: 1, nome: 'Facial Premium', desc: 'Limpeza profunda, hidratação e recuperação da pele.', categoria: 'Facial', duracao: '60 min', preco: '45€', popular: true, icon: icons.sparkle },
  { id: 2, nome: 'Peeling Renovador', desc: 'Renovação celular suave para uniformizar o tom da pele.', categoria: 'Facial', duracao: '45 min', preco: '55€', icon: icons.sparkle },
  { id: 3, nome: 'Rotina Anti-idade', desc: 'Protocolo com ativos específicos para firmeza e luminosidade.', categoria: 'Facial', duracao: '75 min', preco: '65€', icon: icons.sparkle },
  { id: 4, nome: 'Drenagem Corporal', desc: 'Massagem modeladora com foco em bem-estar e circulação.', categoria: 'Corporal', duracao: '50 min', preco: '40€', popular: true, icon: icons.leaf },
  { id: 5, nome: 'Esfoliação Corporal', desc: 'Renovação da pele do corpo com texturas naturais.', categoria: 'Corporal', duracao: '40 min', preco: '35€', icon: icons.leaf },
  { id: 6, nome: 'Modelação Localizada', desc: 'Trabalho direcionado em zonas específicas do corpo.', categoria: 'Corporal', duracao: '55 min', preco: '48€', icon: icons.leaf },
  { id: 7, nome: 'Relaxamento Total', desc: 'Tratamento de pausa e serenidade com aromaterapia.', categoria: 'Bem-estar', duracao: '60 min', preco: '42€', icon: icons.sun },
  { id: 8, nome: 'Massagem de Pedras Quentes', desc: 'Calor e pressão para libertar tensão profunda.', categoria: 'Bem-estar', duracao: '70 min', preco: '58€', popular: true, icon: icons.sun },
];

export function ServicesPage() {
  const [filtro, setFiltro] = useState<Categoria | 'Todos'>('Todos');

  const filtrados = useMemo(
    () => (filtro === 'Todos' ? services : services.filter((s) => s.categoria === filtro)),
    [filtro]
  );

  return (
    <section style={styles.page}>
      <style>{servicesCss}</style>
      <div className="container" style={styles.container}>
        <p style={styles.eyebrow}>O que oferecemos</p>
        <h1 style={styles.title}>Serviços</h1>
        <p style={styles.subtitle}>Escolhe o tratamento que melhor se adapta ao teu momento.</p>

        <div style={styles.filters} role="tablist" aria-label="Filtrar por categoria">
          {categorias.map((cat) => (
            <button
              key={cat.label}
              role="tab"
              aria-selected={filtro === cat.label}
              onClick={() => setFiltro(cat.label as Categoria | 'Todos')}
              style={{
                ...styles.filterBtn,
                ...(filtro === cat.label ? styles.filterBtnActive : {}),
              }}
              className="sp-filter"
            >
              {cat.icon && <Icon path={cat.icon} size={16} />}
              {cat.label}
            </button>
          ))}
        </div>

        <div style={styles.grid}>
          {filtrados.map((item) => (
            <article key={item.id} style={styles.card} className="sp-card">
              {item.popular && <span style={styles.badge}>Mais popular</span>}
              <span style={styles.cardIcon}><Icon path={item.icon} /></span>
              <h2 style={styles.cardTitle}>{item.nome}</h2>
              <p style={styles.cardDesc}>{item.desc}</p>
              <div style={styles.cardMeta}>
                <span style={styles.metaItem}><Icon path={icons.clock} size={16} /> {item.duracao}</span>
                <span style={styles.metaItem}><Icon path={icons.tag} size={16} /> {item.preco}</span>
              </div>
              <Link to="/contacto" style={styles.cardCta} className="sp-cta">Marcar consulta</Link>
            </article>
          ))}
        </div>

        {filtrados.length === 0 && (
          <p style={styles.empty}>Ainda não há tratamentos nesta categoria.</p>
        )}

        <div style={styles.noteBox}>
          <h3 style={styles.noteTitle}>Não sabes qual escolher?</h3>
          <p style={styles.noteText}>Fala connosco e ajudamos-te a montar um plano à tua medida, sem compromisso.</p>
          <Link to="/contacto" style={styles.noteCta} className="sp-cta-outline">Pedir aconselhamento</Link>
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '60px 20px 100px' },
  container: { width: 'min(1120px, 100%)' },
  eyebrow: { margin: 0, color: '#C9A66B', textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: '0.78rem', fontWeight: 700 },
  title: { margin: '10px 0 0', color: 'var(--azul-principal)', fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(2.4rem, 4vw, 4rem)' },
  subtitle: { margin: '12px 0 0', color: 'var(--roxo-intermedio)', fontSize: '1.05rem' },

  filters: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '36px' },
  filterBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '50px', border: '1px solid rgba(40, 55, 90, 0.18)', backgroundColor: 'transparent', color: 'var(--azul-principal)', fontSize: '0.92rem', fontWeight: 600, cursor: 'pointer' },
  filterBtnActive: { backgroundColor: 'var(--azul-principal)', color: 'var(--branco)', border: '1px solid var(--azul-principal)' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', marginTop: '36px' },
  card: { position: 'relative', padding: '30px 26px', borderRadius: '20px', backgroundColor: 'var(--branco)', border: '1px solid rgba(40, 55, 90, 0.10)', boxShadow: '0 16px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '10px' },
  badge: { position: 'absolute', top: '18px', right: '18px', backgroundColor: '#C9A66B', color: 'var(--branco)', fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '0.06em' },
  cardIcon: { display: 'inline-flex', color: 'var(--azul-principal)' },
  cardTitle: { margin: 0, color: 'var(--azul-principal)', fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.5rem' },
  cardDesc: { margin: 0, color: 'var(--roxo-intermedio)', lineHeight: 1.6, flexGrow: 1 },
  cardMeta: { display: 'flex', gap: '18px', color: 'var(--roxo-intermedio)', fontSize: '0.9rem', paddingTop: '8px', borderTop: '1px solid rgba(40, 55, 90, 0.08)' },
  metaItem: { display: 'inline-flex', alignItems: 'center', gap: '6px' },
  cardCta: { marginTop: '6px', textAlign: 'center', padding: '12px 20px', borderRadius: '50px', backgroundColor: 'var(--azul-principal)', color: 'var(--branco)', fontWeight: 700, textDecoration: 'none', fontSize: '0.92rem' },

  empty: { marginTop: '40px', color: 'var(--roxo-intermedio)', textAlign: 'center' },

  noteBox: { marginTop: '64px', padding: '36px', borderRadius: '22px', background: 'linear-gradient(135deg, var(--azul-muito-claro) 0%, var(--fundo) 100%)', textAlign: 'center' },
  noteTitle: { margin: 0, color: 'var(--azul-principal)', fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.6rem' },
  noteText: { margin: '10px auto 20px', color: 'var(--roxo-intermedio)', maxWidth: '480px' },
  noteCta: { display: 'inline-block', padding: '14px 28px', borderRadius: '50px', border: '1px solid var(--azul-principal)', color: 'var(--azul-principal)', fontWeight: 700, textDecoration: 'none' },
};

const servicesCss = `
  .sp-filter { transition: background-color 0.2s ease, color 0.2s ease, transform 0.15s ease; }
  .sp-filter:hover { transform: translateY(-1px); }
  .sp-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
  .sp-card:hover { transform: translateY(-4px); box-shadow: 0 22px 36px rgba(0,0,0,0.08); }
  .sp-cta, .sp-cta-outline { transition: opacity 0.2s ease, transform 0.2s ease; }
  .sp-cta:hover, .sp-cta-outline:hover { opacity: 0.85; transform: translateY(-1px); }
  .sp-filter:focus-visible, .sp-cta:focus-visible, .sp-cta-outline:focus-visible {
    outline: 2px solid #C9A66B; outline-offset: 3px;
  }
  @media (prefers-reduced-motion: reduce) {
    .sp-card:hover, .sp-filter:hover, .sp-cta:hover, .sp-cta-outline:hover { transform: none; }
  }
`;
