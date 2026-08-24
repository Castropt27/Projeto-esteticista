import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <style>{layoutStyles}</style>
      <header style={styles.header}>
        <div className="container" style={styles.headerContent}>
          <Link to="/" style={styles.brand}>
            {/* Recorte fixo: mostra só o ícone do logo (assume que fica no
                topo do ficheiro vertical). Ajusta objectPosition se não for o caso,
                ou substitui por um logo horizontal se tiveres um exportado. */}
            <span style={styles.logoCrop}>
              <img src="/logo.png" alt="Logo Clínica" style={styles.logoImg} />
            </span>
            {/* Placeholder: troca "Sua Clínica" pelo nome real da marca */}
            <span style={styles.brandName}>Sua Clínica</span>
          </Link>

          <nav style={styles.navLinks}>
            <NavLink to="/" className="lay-link" style={styles.link} end>
              Início
            </NavLink>
            <NavLink to="/servicos" className="lay-link" style={styles.link}>
              Serviços
            </NavLink>
            <NavLink to="/contacto" className="lay-link" style={styles.link}>
              Contacto
            </NavLink>
          </nav>

          <div style={styles.authActions}>
            {auth ? (
              <>
                <NavLink to="/perfil" className="lay-ghost" style={styles.btnGhost}>
                  Perfil
                </NavLink>
                <button className="lay-text" style={styles.btnText} onClick={handleLogout}>
                  Sair
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="lay-ghost" style={styles.btnGhost}>
                  Entrar
                </NavLink>
                <NavLink to="/registar" className="lay-gold" style={styles.btnGold}>
                  Registar
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

const layoutStyles = `
.lay-link { position: relative; padding-bottom: 6px; }
.lay-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 1px;
  background: #C9A66B;
  transition: width 0.25s ease;
}
.lay-link:hover::after,
.lay-link.active::after {
  width: 100%;
}
.lay-ghost:hover {
  background: rgba(31, 58, 92, 0.06);
}
.lay-gold:hover {
  filter: brightness(0.94);
}
.lay-text:hover {
  color: var(--azul-principal);
}
`;

const styles: Record<string, React.CSSProperties> = {
  header: {
    width: '100%',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    padding: '22px 0',
    backdropFilter: 'blur(14px)',
    backgroundColor: 'rgba(247, 241, 235, 0.82)',
    borderBottom: '1px solid rgba(201, 166, 107, 0.28)',
  },
  headerContent: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    gap: '20px',
  },
  brand: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    justifySelf: 'start',
    textDecoration: 'none',
  },
  logoCrop: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'inline-flex',
    flexShrink: 0,
    backgroundColor: 'var(--branco)',
  },
  logoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'top',
  },
  brandName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 600,
    fontSize: '1.25rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--azul-principal)',
    whiteSpace: 'nowrap',
  },
  navLinks: {
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
    justifySelf: 'center',
  },
  link: {
    color: 'var(--azul-principal)',
    fontWeight: 700,
    textTransform: 'uppercase',
    fontSize: '0.82rem',
    letterSpacing: '0.05em',
    textDecoration: 'none',
  },
  authActions: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    justifySelf: 'end',
  },
  btnGold: {
    backgroundColor: '#C9A66B',
    color: 'var(--azul-principal)',
    padding: '12px 26px',
    borderRadius: '50px',
    fontWeight: 700,
    textDecoration: 'none',
    fontSize: '0.88rem',
  },
  btnGhost: {
    backgroundColor: 'transparent',
    color: 'var(--azul-principal)',
    padding: '12px 22px',
    borderRadius: '50px',
    fontWeight: 700,
    border: '1px solid var(--azul-principal)',
    textDecoration: 'none',
    fontSize: '0.88rem',
  },
  btnText: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--roxo-intermedio)',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '0.88rem',
    padding: '12px 6px',
  },
};
