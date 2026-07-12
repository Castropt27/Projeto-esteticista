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
      <header style={styles.header}>
        <div className="container" style={styles.headerContent}>
          <Link to="/" style={styles.brand}>
            <img src="/logo.png" alt="Logo Clínica" style={styles.logo} />
          </Link>

          <nav style={styles.navLinks}>
            <NavLink to="/" style={styles.link}>Início</NavLink>
            <NavLink to="/servicos" style={styles.link}>Serviços</NavLink>
            <NavLink to="/contacto" style={styles.link}>Contacto</NavLink>
          </nav>

          <div style={styles.authActions}>
            {auth ? (
              <>
                <NavLink to="/perfil" style={styles.btnSecondaryLink}>Perfil</NavLink>
                <button style={styles.btnSecondary} onClick={handleLogout}>Sair</button>
              </>
            ) : (
              <>
                <NavLink to="/login" style={styles.btnSecondaryLink}>Entrar</NavLink>
                <NavLink to="/registar" style={styles.btnHeaderLink}>Registar</NavLink>
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

const styles: Record<string, React.CSSProperties> = {
  header: { width: '100%', position: 'sticky', top: 0, zIndex: 10, padding: '18px 0', backdropFilter: 'blur(14px)', backgroundColor: 'rgba(247, 241, 235, 0.72)' },
  headerContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' },
  brand: { display: 'inline-flex', alignItems: 'center' },
  logo: { height: '58px', objectFit: 'contain' },
  navLinks: { display: 'flex', gap: '28px', alignItems: 'center' },
  link: { color: 'var(--azul-principal)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.88rem', textDecoration: 'none' },
  authActions: { display: 'flex', gap: '12px', alignItems: 'center' },
  btnHeaderLink: { backgroundColor: 'var(--roxo-moldura)', color: 'var(--branco)', padding: '12px 24px', borderRadius: '50px', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' },
  btnSecondaryLink: { backgroundColor: 'transparent', color: 'var(--azul-principal)', padding: '12px 20px', borderRadius: '50px', fontWeight: 700, border: '1px solid var(--azul-principal)', textDecoration: 'none', fontSize: '0.9rem' },
  btnSecondary: { backgroundColor: 'transparent', color: 'var(--azul-principal)', padding: '12px 20px', borderRadius: '50px', fontWeight: 700, border: '1px solid var(--azul-principal)', cursor: 'pointer', fontSize: '0.9rem' },
};