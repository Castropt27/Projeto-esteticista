import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Icon({ path, size = 18 }: { path: string; size?: number }) {
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
  edit: 'M12 20h9 M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z',
  logout: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9',
  plus: 'M12 5v14 M5 12h14',
  calendar: 'M4 5h16v16H4z M4 9h16 M8 3v4 M16 3v4',
  check: 'M20 6L9 17l-5-5',
};

type CardItem = {
  id: number;
  title: string;
  description: string;
};

type Marcacao = {
  id: number;
  title: string;
  data: string;
  estado: 'Confirmada' | 'Pendente';
};

type ProfileDetails = {
  id: number;
  nome: string;
  email: string;
  telefone?: string | null;
  role: string;
};

export function ProfilePage() {
  const { auth, logout } = useAuth();
  const [profile, setProfile] = useState<ProfileDetails | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [editNome, setEditNome] = useState('');
  const [editTelefone, setEditTelefone] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    const loadProfile = async () => {
      if (!auth?.token) {
        setLoadingProfile(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.user) {
          setProfile(data.user as ProfileDetails);
          setEditNome(data.user.nome ?? '');
          setEditTelefone(data.user.telefone ?? '');
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [auth?.token]);

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  const handleStartEdit = () => {
    setEditNome(profile?.nome ?? auth.user.nome);
    setEditTelefone(profile?.telefone ?? auth.user.telefone ?? '');
    setSaveStatus('idle');
    setEditMode(true);
  };

  const handleSaveEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveStatus('saving');
    try {
      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ nome: editNome, telefone: editTelefone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error('Falha ao guardar');
      if (data.user) setProfile(data.user as ProfileDetails);
      setSaveStatus('success');
      setEditMode(false);
    } catch {
      setSaveStatus('error');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const proximasMarcacoes: Marcacao[] = [
    { id: 1, title: 'Facial Premium', data: '18/07/2026 · 10:30', estado: 'Confirmada' },
    { id: 2, title: 'Massagem de Pedras Quentes', data: '25/07/2026 · 15:00', estado: 'Pendente' },
  ];

  const serviçosFeitos: CardItem[] = [
    { id: 1, title: 'Limpeza Facial Premium', description: 'Tratamento feito a 12/07/2026' },
    { id: 2, title: 'Massagem Relaxante', description: 'Tratamento feito a 01/07/2026' },
    { id: 3, title: 'Drenagem Corporal', description: 'Tratamento feito a 18/06/2026' },
  ];

  const produtosMostrados: CardItem[] = [
    { id: 1, title: 'Sérum Glow', description: 'Hidratação e brilho para pele sensível' },
    { id: 2, title: 'Creme Refirmante', description: 'Produto premium para firmeza e elasticidade' },
    { id: 3, title: 'Óleo Calmante', description: 'Relaxamento e nutrição profunda' },
  ];

  const nomeAtual = profile?.nome ?? auth.user.nome;
  const iniciais = nomeAtual
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join('');

  return (
    <section style={styles.page}>
      <style>{profileCss}</style>
      <div className="container" style={styles.container}>
        <div style={styles.headerRow}>
          <div style={styles.headerLeft}>
            <span style={styles.avatar}>{iniciais || '?'}</span>
            <div>
              <p style={styles.eyebrow}>Perfil</p>
              <h1 style={styles.title}>{loadingProfile ? 'A carregar...' : nomeAtual}</h1>
            </div>
          </div>
          <div style={styles.headerActions}>
            <Link to="/servicos" style={styles.btnPrimary} className="pp-btn">
              <Icon path={icons.plus} size={16} /> Marcar nova sessão
            </Link>
            <button type="button" onClick={handleLogout} style={styles.btnGhost} className="pp-btn-ghost">
              <Icon path={icons.logout} size={16} /> Terminar sessão
            </button>
          </div>
        </div>

        <p style={styles.subtitle}>Aqui podes gerir a tua conta, marcações e preferências.</p>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardHeaderTitle}>Dados pessoais</h2>
            {!editMode && (
              <button type="button" onClick={handleStartEdit} style={styles.editBtn} className="pp-link-btn">
                <Icon path={icons.edit} size={16} /> Editar dados
              </button>
            )}
          </div>

          {!editMode ? (
            <>
              <div style={styles.row}>
                <span style={styles.label}>Nome</span>
                <strong style={styles.value}>{loadingProfile ? 'A carregar...' : profile?.nome ?? auth.user.nome}</strong>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Email</span>
                <strong style={styles.value}>{loadingProfile ? 'A carregar...' : profile?.email ?? auth.user.email}</strong>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Número</span>
                <strong style={styles.value}>{loadingProfile ? 'A carregar...' : profile?.telefone ?? auth.user.telefone ?? 'Não preenchido'}</strong>
              </div>
              <div style={{ ...styles.row, borderBottom: 'none' }}>
                <span style={styles.label}>Perfil</span>
                <strong style={styles.value}>{loadingProfile ? 'A carregar...' : profile?.role ?? auth.user.role}</strong>
              </div>
            </>
          ) : (
            <form onSubmit={handleSaveEdit} style={styles.editForm}>
              <div style={styles.field}>
                <label htmlFor="edit-nome" style={styles.label}>Nome</label>
                <input id="edit-nome" value={editNome} onChange={(e) => setEditNome(e.target.value)} style={styles.input} className="pp-input" required />
              </div>
              <div style={styles.field}>
                <label htmlFor="edit-telefone" style={styles.label}>Número</label>
                <input id="edit-telefone" value={editTelefone} onChange={(e) => setEditTelefone(e.target.value)} style={styles.input} className="pp-input" placeholder="+351 000 000 000" />
              </div>
              <div style={styles.editActions}>
                <button type="submit" style={styles.btnPrimary} className="pp-btn" disabled={saveStatus === 'saving'}>
                  {saveStatus === 'saving' ? 'A guardar...' : 'Guardar'}
                </button>
                <button type="button" onClick={() => setEditMode(false)} style={styles.btnGhost} className="pp-btn-ghost">
                  Cancelar
                </button>
              </div>
              {saveStatus === 'error' && <p style={styles.errorMsg}>Não foi possível guardar. Tenta novamente.</p>}
            </form>
          )}
        </div>

        <section style={styles.carouselSection}>
          <h2 style={styles.carouselTitle}><Icon path={icons.calendar} size={20} /> Próximas marcações</h2>
          {proximasMarcacoes.length > 0 ? (
            <div style={styles.carousel}>
              {proximasMarcacoes.map((item) => (
                <article key={item.id} style={styles.carouselCard}>
                  <p style={styles.cardEyebrow}>{item.data}</p>
                  <h3 style={styles.cardTitle}>{item.title}</h3>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...(item.estado === 'Confirmada' ? styles.statusOk : styles.statusPending),
                    }}
                  >
                    {item.estado === 'Confirmada' && <Icon path={icons.check} size={12} />}
                    {item.estado}
                  </span>
                </article>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>Ainda não tens marcações agendadas.</p>
              <Link to="/servicos" style={styles.emptyCta} className="pp-link-btn">Marcar agora →</Link>
            </div>
          )}
        </section>

        <section style={styles.carouselSection}>
          <h2 style={styles.carouselTitle}>Histórico de tratamentos</h2>
          <div style={styles.carousel}>
            {serviçosFeitos.map((item) => (
              <article key={item.id} style={styles.carouselCard}>
                <p style={styles.cardEyebrow}>Concluído</p>
                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.cardText}>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section style={styles.carouselSection}>
          <h2 style={styles.carouselTitle}>Recomendado para ti</h2>
          <div style={styles.carousel}>
            {produtosMostrados.map((item) => (
              <article key={item.id} style={styles.carouselCard}>
                <p style={styles.cardEyebrow}>Produto</p>
                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.cardText}>{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '60px 20px 100px' },
  container: { width: 'min(960px, 100%)' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  avatar: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '58px', height: '58px', borderRadius: '50%', backgroundColor: 'var(--azul-principal)', color: 'var(--branco)', fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.4rem', fontWeight: 700 },
  eyebrow: { margin: 0, color: '#C9A66B', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.78rem', fontWeight: 700 },
  title: { margin: '4px 0 0', color: 'var(--azul-principal)', fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' },
  headerActions: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  subtitle: { margin: '18px 0 0', color: 'var(--roxo-intermedio)', fontSize: '1.05rem' },

  btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--azul-principal)', color: 'var(--branco)', padding: '12px 22px', borderRadius: '50px', fontWeight: 700, textDecoration: 'none', border: 'none', cursor: 'pointer', fontSize: '0.92rem' },
  btnGhost: { display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', color: 'var(--azul-principal)', padding: '12px 22px', borderRadius: '50px', fontWeight: 700, border: '1px solid rgba(40, 55, 90, 0.24)', cursor: 'pointer', fontSize: '0.92rem' },

  card: { marginTop: '32px', padding: '28px', borderRadius: '20px', backgroundColor: 'var(--branco)', border: '1px solid rgba(40, 55, 90, 0.12)', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', display: 'grid', gap: '14px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardHeaderTitle: { margin: 0, color: 'var(--azul-principal)', fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.4rem' },
  editBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#C9A66B', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', padding: 0 },
  row: { display: 'flex', justifyContent: 'space-between', gap: '16px', borderBottom: '1px solid rgba(40, 55, 90, 0.08)', paddingBottom: '12px' },
  label: { color: 'var(--roxo-intermedio)' },
  value: { color: 'var(--azul-principal)' },

  editForm: { display: 'grid', gap: '14px' },
  field: { display: 'grid', gap: '6px' },
  input: { padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(40, 55, 90, 0.18)', fontSize: '0.98rem', color: 'var(--azul-principal)', fontFamily: 'inherit', backgroundColor: 'var(--fundo)' },
  editActions: { display: 'flex', gap: '10px' },
  errorMsg: { color: '#b3413a', fontSize: '0.88rem', margin: 0 },

  carouselSection: { marginTop: '40px' },
  carouselTitle: { margin: '0 0 16px', color: 'var(--azul-principal)', fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.7rem', display: 'flex', alignItems: 'center', gap: '10px' },
  carousel: { display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(240px, 1fr)', gap: '16px', overflowX: 'auto', paddingBottom: '8px', scrollSnapType: 'x mandatory' },
  carouselCard: { scrollSnapAlign: 'start', minHeight: '160px', padding: '22px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.92)', border: '1px solid rgba(40, 55, 90, 0.10)', boxShadow: '0 16px 30px rgba(0,0,0,0.05)' },
  cardEyebrow: { margin: 0, color: 'var(--roxo-intermedio)', textTransform: 'uppercase', letterSpacing: '0.16em', fontSize: '0.72rem', fontWeight: 700 },
  cardTitle: { margin: '8px 0 0', color: 'var(--azul-principal)', fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.4rem' },
  cardText: { margin: '10px 0 0', color: 'var(--roxo-intermedio)', lineHeight: 1.6 },

  statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '12px', padding: '4px 10px', borderRadius: '50px', fontSize: '0.74rem', fontWeight: 700 },
  statusOk: { backgroundColor: 'rgba(46, 125, 79, 0.12)', color: '#2e7d4f' },
  statusPending: { backgroundColor: 'rgba(201, 166, 107, 0.18)', color: '#8a6a2b' },

  emptyState: { padding: '32px', borderRadius: '20px', border: '1px dashed rgba(40, 55, 90, 0.24)', textAlign: 'center' },
  emptyText: { margin: '0 0 10px', color: 'var(--roxo-intermedio)' },
  emptyCta: { color: '#C9A66B', fontWeight: 700, textDecoration: 'none' },
};

const profileCss = `
  .pp-btn, .pp-btn-ghost, .pp-link-btn { transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease; }
  .pp-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 22px rgba(40, 55, 90, 0.22); }
  .pp-btn-ghost:hover { background-color: rgba(40, 55, 90, 0.06); }
  .pp-link-btn:hover { opacity: 0.75; }
  .pp-input:focus { outline: none; border-color: #C9A66B; box-shadow: 0 0 0 3px rgba(201, 166, 107, 0.18); }
  .pp-btn:focus-visible, .pp-btn-ghost:focus-visible, .pp-link-btn:focus-visible {
    outline: 2px solid #C9A66B; outline-offset: 3px;
  }
  @media (prefers-reduced-motion: reduce) {
    .pp-btn:hover { transform: none; }
  }
`;
