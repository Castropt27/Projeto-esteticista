type ServiceCardProps = {
  title: string;
  description: string;
};

export function ServiceCard({ title, description }: ServiceCardProps) {
  return (
    <article style={styles.card}>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardText}>{description}</p>
    </article>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: { backgroundColor: 'var(--fundo)', padding: '40px', borderRadius: '16px', border: '1px solid var(--roxo-intermedio)', textAlign: 'center' },
  cardTitle: { fontSize: '1.6rem', color: 'var(--azul-principal)', marginBottom: '15px', fontFamily: 'serif' },
  cardText: { color: 'var(--roxo-intermedio)', fontSize: '1rem', lineHeight: '1.6' },
};