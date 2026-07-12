import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type AuthMode = 'login' | 'register';

type Props = {
  mode: AuthMode;
};

export function AuthForm({ mode }: Props) {
  const navigate = useNavigate();
  const { login, register, loading } = useAuth();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    telefone: '',
  });

  const isRegister = mode === 'register';

  useEffect(() => {
    setError('');
    setFormData({
      nome: '',
      email: '',
      password: '',
      telefone: '',
    });
  }, [mode]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register({
          nome: formData.nome,
          email: formData.email,
          password: formData.password,
          telefone: formData.telefone,
        });
      }

      navigate('/');
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Erro inesperado');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  return (
    <section style={styles.wrapper}>
      <div style={styles.card}>
        <p style={styles.eyebrow}>{mode === 'login' ? 'Entrar' : 'Registar'}</p>
        <h1 style={styles.title}>{mode === 'login' ? 'Aceder à tua conta' : 'Criar nova conta'}</h1>
        <p style={styles.subtitle}>
          {mode === 'login'
            ? 'Entre para gerir os teus agendamentos e dados.'
            : 'Cria a tua conta para começares a reservar.'}
        </p>

        {error ? <p style={styles.error}>{error}</p> : null}

        <form style={styles.form} onSubmit={handleSubmit} autoComplete="off">
          {isRegister ? (
            <label style={styles.field}>
              Nome
              <input name="nome" autoComplete="off" value={formData.nome} onChange={handleChange} style={styles.input} placeholder="O teu nome" />
            </label>
          ) : null}

          <label style={styles.field}>
            Email
            <input
              name={isRegister ? 'register-email' : 'login-email'}
              type="email"
              autoComplete={isRegister ? 'new-email' : 'email'}
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="teu@email.com"
            />
          </label>

          {isRegister ? (
            <label style={styles.field}>
              Telefone
              <input name="telefone" autoComplete="off" value={formData.telefone} onChange={handleChange} style={styles.input} placeholder="Opcional" />
            </label>
          ) : null}

          <label style={styles.field}>
            Password
            <input
              name={isRegister ? 'register-password' : 'login-password'}
              type="password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="••••••••"
            />
          </label>

          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <p style={styles.switchText}>
          {mode === 'login' ? 'Ainda não tens conta?' : 'Já tens conta?'}{' '}
          <Link to={mode === 'login' ? '/registar' : '/login'} style={styles.switchLink}>
            {mode === 'login' ? 'Regista-te' : 'Faz login'}
          </Link>
        </p>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: { minHeight: 'calc(100vh - 110px)', display: 'grid', placeItems: 'center', padding: '40px 20px' },
  card: { width: 'min(100%, 560px)', backgroundColor: 'var(--branco)', borderRadius: '28px', padding: '36px', boxShadow: '0 25px 60px rgba(0,0,0,0.12)' },
  eyebrow: { margin: 0, color: 'var(--roxo-intermedio)', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.78rem', fontWeight: 700 },
  title: { margin: '10px 0 0', color: 'var(--azul-principal)', fontFamily: 'serif', fontSize: '2.4rem' },
  subtitle: { margin: '12px 0 0', color: 'var(--roxo-intermedio)', lineHeight: 1.6 },
  error: { marginTop: '16px', color: '#9d2b3a', fontWeight: 700 },
  form: { display: 'grid', gap: '14px', marginTop: '22px' },
  field: { display: 'grid', gap: '8px', color: 'var(--azul-principal)', fontWeight: 700, fontSize: '0.95rem' },
  input: { border: '1px solid rgba(40, 55, 90, 0.18)', borderRadius: '14px', padding: '14px 16px', fontSize: '1rem', outline: 'none' },
  submitButton: { marginTop: '8px', border: 'none', borderRadius: '999px', padding: '14px 18px', backgroundColor: 'var(--roxo-moldura)', color: 'var(--branco)', fontWeight: 800, cursor: 'pointer', fontSize: '1rem' },
  switchText: { marginTop: '18px', color: 'var(--roxo-intermedio)' },
  switchLink: { color: 'var(--azul-principal)', fontWeight: 800, textDecoration: 'none' },
};