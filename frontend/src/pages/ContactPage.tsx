import { useState } from 'react';

function Icon({ path, size = 20 }: { path: string; size?: number }) {
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
  mail: 'M4 5h16v14H4z M4 6l8 7 8-7',
  phone: 'M6 3h4l2 5-2.5 1.5a12 12 0 006 6L17 13l5 2v4a2 2 0 01-2 2C10.6 21 3 13.4 3 4a2 2 0 012-2z',
  pin: 'M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z M12 11a2 2 0 100-4 2 2 0 000 4z',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18z M12 7v5l3 3',
  instagram: 'M4 4h16v16H4z M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z M16.8 7.2h.01',
  facebook: 'M14 8h3V4h-3a4 4 0 00-4 4v2H8v4h2v6h4v-6h3l1-4h-4V9c0-.6.4-1 1-1z',
  check: 'M20 6L9 17l-5-5',
};

const horarios = [
  { dia: 'Segunda a Sexta', horas: '09:00 – 19:00' },
  { dia: 'Sábado', horas: '10:00 – 15:00' },
  { dia: 'Domingo', horas: 'Encerrado' },
];

const servicosOpcoes = ['Tratamento Facial', 'Tratamento Corporal', 'Bem-estar & Relaxamento', 'Ainda não sei'];

type FormState = {
  nome: string;
  email: string;
  telefone: string;
  servico: string;
  mensagem: string;
};

const estadoInicial: FormState = { nome: '', email: '', telefone: '', servico: servicosOpcoes[0], mensagem: '' };

export function ContactPage() {
  const [form, setForm] = useState<FormState>(estadoInicial);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (field: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('Falha ao enviar');
      setStatus('success');
      setForm(estadoInicial);
    } catch {
      setStatus('error');
    }
  };

  return (
    <section style={styles.page}>
      <style>{contactCss}</style>
      <div className="container" style={styles.container}>
        <p style={styles.eyebrow}>Estamos aqui para ajudar</p>
        <h1 style={styles.title}>Contacto</h1>
        <p style={styles.subtitle}>Fala connosco para marcações, informações ou apoio à conta.</p>

        <div style={styles.layout} className="cp-layout">
          <form onSubmit={handleSubmit} style={styles.form} className="cp-card">
            <div style={styles.fieldRow}>
              <div style={styles.field}>
                <label htmlFor="nome" style={styles.label}>Nome</label>
                <input id="nome" required value={form.nome} onChange={handleChange('nome')} style={styles.input} className="cp-input" placeholder="O teu nome" />
              </div>
              <div style={styles.field}>
                <label htmlFor="email" style={styles.label}>Email</label>
                <input id="email" type="email" required value={form.email} onChange={handleChange('email')} style={styles.input} className="cp-input" placeholder="email@exemplo.pt" />
              </div>
            </div>

            <div style={styles.fieldRow}>
              <div style={styles.field}>
                <label htmlFor="telefone" style={styles.label}>Telefone</label>
                <input id="telefone" value={form.telefone} onChange={handleChange('telefone')} style={styles.input} className="cp-input" placeholder="+351 000 000 000" />
              </div>
              <div style={styles.field}>
                <label htmlFor="servico" style={styles.label}>Serviço de interesse</label>
                <select id="servico" value={form.servico} onChange={handleChange('servico')} style={styles.input} className="cp-input">
                  {servicosOpcoes.map((opcao) => (
                    <option key={opcao} value={opcao}>{opcao}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.field}>
              <label htmlFor="mensagem" style={styles.label}>Mensagem</label>
              <textarea
                id="mensagem"
                required
                rows={5}
                value={form.mensagem}
                onChange={handleChange('mensagem')}
                style={{ ...styles.input, resize: 'vertical' }}
                className="cp-input"
                placeholder="Conta-nos o que procuras..."
              />
            </div>

            <button type="submit" style={styles.submitBtn} className="cp-btn" disabled={status === 'loading'}>
              {status === 'loading' ? 'A enviar...' : 'Enviar mensagem'}
            </button>

            {status === 'success' && (
              <p style={styles.msgOk}><Icon path={icons.check} size={16} /> Mensagem enviada! Respondemos brevemente.</p>
            )}
            {status === 'error' && (
              <p style={styles.msgErr}>Não foi possível enviar agora. Tenta novamente ou usa os contactos ao lado.</p>
            )}
          </form>

          <div style={styles.infoColumn}>
            <div style={styles.card} className="cp-card">
              <p style={styles.line}><Icon path={icons.mail} /> <a href="mailto:contacto@site-estetica.pt" style={styles.link}>contacto@site-estetica.pt</a></p>
              <p style={styles.line}><Icon path={icons.phone} /> <a href="tel:+351000000000" style={styles.link}>+351 000 000 000</a></p>
              <p style={styles.line}><Icon path={icons.pin} /> Rua da Estética, 1</p>
            </div>

            <div style={styles.card} className="cp-card">
              <h2 style={styles.cardTitle}><Icon path={icons.clock} /> Horário</h2>
              {horarios.map((item) => (
                <div key={item.dia} style={styles.hourRow}>
                  <span style={styles.hourDay}>{item.dia}</span>
                  <span style={styles.hourValue}>{item.horas}</span>
                </div>
              ))}
            </div>

            <div style={styles.card} className="cp-card">
              <h2 style={styles.cardTitle}>Segue-nos</h2>
              <div style={styles.socials}>
                <a href="#" aria-label="Instagram" style={styles.socialBtn} className="cp-social">
                  <Icon path={icons.instagram} />
                </a>
                <a href="#" aria-label="Facebook" style={styles.socialBtn} className="cp-social">
                  <Icon path={icons.facebook} />
                </a>
              </div>
              <p style={styles.socialNote}>Atualiza estes links para as tuas páginas reais.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '60px 20px 100px' },
  container: { width: 'min(1080px, 100%)' },
  eyebrow: { margin: 0, color: '#C9A66B', textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: '0.78rem', fontWeight: 700 },
  title: { margin: '10px 0 0', color: 'var(--azul-principal)', fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(2.4rem, 4vw, 4rem)' },
  subtitle: { margin: '12px 0 0', color: 'var(--roxo-intermedio)', fontSize: '1.05rem' },

  layout: { display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: '28px', marginTop: '40px', alignItems: 'start' },

  form: { padding: '32px', borderRadius: '20px', backgroundColor: 'var(--branco)', border: '1px solid rgba(40, 55, 90, 0.12)', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', display: 'grid', gap: '18px' },
  fieldRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' },
  field: { display: 'grid', gap: '6px' },
  label: { color: 'var(--azul-principal)', fontSize: '0.88rem', fontWeight: 700 },
  input: { padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(40, 55, 90, 0.18)', fontSize: '0.98rem', color: 'var(--azul-principal)', fontFamily: 'inherit', backgroundColor: 'var(--fundo)' },
  submitBtn: { justifySelf: 'start', padding: '14px 32px', borderRadius: '50px', backgroundColor: 'var(--azul-principal)', color: 'var(--branco)', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '1rem' },
  msgOk: { display: 'flex', alignItems: 'center', gap: '8px', color: '#2e7d4f', fontSize: '0.92rem', margin: 0 },
  msgErr: { color: '#b3413a', fontSize: '0.92rem', margin: 0 },

  infoColumn: { display: 'grid', gap: '20px' },
  card: { padding: '26px', borderRadius: '20px', backgroundColor: 'var(--branco)', border: '1px solid rgba(40, 55, 90, 0.12)', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' },
  line: { margin: '0 0 14px', color: 'var(--azul-principal)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px' },
  link: { color: 'var(--azul-principal)', textDecoration: 'none' },
  cardTitle: { margin: '0 0 16px', color: 'var(--azul-principal)', fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' },
  hourRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(40, 55, 90, 0.08)', fontSize: '0.92rem' },
  hourDay: { color: 'var(--roxo-intermedio)' },
  hourValue: { color: 'var(--azul-principal)', fontWeight: 600 },
  socials: { display: 'flex', gap: '12px' },
  socialBtn: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--fundo)', color: 'var(--azul-principal)', textDecoration: 'none' },
  socialNote: { margin: '14px 0 0', color: 'var(--roxo-intermedio)', fontSize: '0.82rem' },
};

const contactCss = `
  .cp-input { transition: border-color 0.2s ease, box-shadow 0.2s ease; border-color: transparent; }
  .cp-input:focus { outline: none; border-color: #C9A66B; box-shadow: 0 0 0 3px rgba(201, 166, 107, 0.18); }
  .cp-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .cp-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 26px rgba(40, 55, 90, 0.25); }
  .cp-social { transition: transform 0.2s ease, background-color 0.2s ease; }
  .cp-social:hover { transform: translateY(-2px); background-color: rgba(201, 166, 107, 0.18); }
  .cp-btn:focus-visible, .cp-social:focus-visible { outline: 2px solid #C9A66B; outline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) {
    .cp-btn:hover, .cp-social:hover { transform: none; }
  }
  @media (max-width: 840px) {
    .cp-layout { grid-template-columns: 1fr; }
  }
`;
