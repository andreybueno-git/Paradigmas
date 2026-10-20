// =========================
// CHAMADA FINAL (CTA)
// =========================
//
// "Ainda está em dúvida?" no fim da página /cursos/ (html/cursos.html). Os botões levam ao FAQ e ao
// contato com navegação no cliente (a música continua), no lugar de ./faq.html e ./contato.html.
import Link from 'next/link';

export default function ChamadaCursos() {
  return (
    <section className="cta">
      <span> FLASHCLIP </span>

      <h2>Ainda está em dúvida?</h2>

      <p>
        Confira as perguntas frequentes ou entre em contato com nossa equipe.
      </p>

      <div className="cta-botoes">
        <Link href="/faq/" className="botao-secundario">
          Ver perguntas frequentes
        </Link>

        <Link href="/contato/" className="botao-principal">
          Entre em contato
        </Link>
      </div>
    </section>
  );
}
