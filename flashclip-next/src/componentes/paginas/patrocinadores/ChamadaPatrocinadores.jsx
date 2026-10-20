// =========================
// CHAMADA FINAL (CTA)
// =========================
//
// "Quer fazer parte dessa história?" no fim da página /patrocinadores/ (html/patrocinadores.html).
// "Fale Conosco" leva ao contato com navegação no cliente (a música continua), no lugar de
// ../html/contato.html.
import Link from 'next/link';

export default function ChamadaPatrocinadores() {
  return (
    <section className="cta">
      <span>SEJA UM APOIADOR</span>
      <h2>Quer fazer parte dessa história?</h2>
      <p>Entre em contato e descubra como sua empresa pode apoiar as próximas edições do FlashClip.</p>
      <Link href="/contato/" className="botao-contato">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 8.7 8.7 0 0 1-4-.9L3 21l1.9-4.5A8.3 8.3 0 0 1 3 12a8.5 8.5 0 0 1 9-8.5 8.5 8.5 0 0 1 9 8.5Z" />
        </svg>
        Fale Conosco
      </Link>
    </section>
  );
}
