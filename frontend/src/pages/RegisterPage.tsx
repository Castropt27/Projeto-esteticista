import { Link } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';

// Nota: mantive o <AuthForm mode="register" /> tal como estava, só
// adicionei o "enquadramento" da página à sua volta. Se o AuthForm já
// mostrar um link do tipo "Já tens conta?", podes remover o equivalente
// aqui em baixo para não ficar duplicado.

function Icon({ path, size = 18 }: { path: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const icons = {
  check: 'M20 6L9 17l-5-5',
  arrowLeft: 'M19 12H5 M12 19l-7-7 7-7',
};

const vantagens = [
  'Marcações online, sem chamadas nem esperas',
  'Histórico de tratamentos sempre à mão',
  'Ofertas exclusivas para membros',
];

export function RegisterPage() {
  return (
    <section style={styles.page}>
      <style>{authCss}</style>
      <div style={styles.layout} className="auth-layout">
        <div style={styles.brandPanel} className="auth-brand">
          <Link to="/" style={styles.backLink} className="auth-back">
            <Icon path={icons.arrowLeft} size={16} /> Voltar ao início
          </Link>
          <div>
            <p style={styles.eyebrow}>Junta-te a nós</p>
            <h1 style={styles.brandTitle}>Começa a tua rotina de cuidado</h1>
            <p style={styles.brandSubtitle}>Cria a tua conta em menos de um minuto e começa a marcar os teus tratamentos favoritos.</p>
            <ul style={styles.list}>
              {vantagens.map((item) => (
                <li key={item} style={styles.listItem}>
                  <Icon path={icons.check} size={16} /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={styles.formPanel}>
          <div style={styles.formCard} className="auth-card">
            <AuthForm mode="register" />
            <p style={styles.switchText}>
              Já tens conta?{' '}
              <Link to="/login" style={styles.switchLink}>Entrar</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: 'calc(100vh - 110px)', display: 'flex' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%' },
  brandPanel: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '40px', padding: '52px', background: 'linear-gradient(150deg, var(--azul-principal) 0%, #1c2947 100%)', color: 'var(--branco)' },
  backLink: { display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '0.9rem', width: 'fit-content' },
  eyebrow: { margin: '0 0 8px', color: '#C9A66B', textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: '0.75rem', fontWeight: 700 },
  brandTitle: { margin: '0 0 14px', fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(2rem, 3vw, 2.8rem)', lineHeight: 1.15 },
  brandSubtitle: { margin: '0 0 28px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, maxWidth: '380px' },
  list: { listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '14px' },
  listItem: { display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' },

  formPanel: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', backgroundColor: 'var(--fundo)' },
  formCard: { width: 'min(420px, 100%)', backgroundColor: 'var(--branco)', borderRadius: '20px', padding: '36px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', border: '1px solid rgba(40, 55, 90, 0.10)' },
  switchText: { marginTop: '20px', textAlign: 'center', color: 'var(--roxo-intermedio)', fontSize: '0.92rem' },
  switchLink: { color: '#C9A66B', fontWeight: 700, textDecoration: 'none' },
};

const authCss = `
  .auth-back { transition: opacity 0.2s ease; }
  .auth-back:hover { opacity: 0.75; }
  .auth-back:focus-visible { outline: 2px solid #C9A66B; outline-offset: 3px; }
  @media (max-width: 880px) {
    .auth-layout { grid-template-columns: 1fr; }
    .auth-brand { display: none; }
  }
`;
