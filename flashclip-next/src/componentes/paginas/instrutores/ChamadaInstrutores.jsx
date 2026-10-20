// =========================
// CHAMADA FINAL (CTA)
// =========================
//
// "Quer participar?" no fim da página /instrutores/ (html/instrutores.html). Os botões levam aos
// cursos e a Minhas inscrições com navegação no cliente (a música continua), no lugar de
// ./cursos.html e ./inscricoes.html.
import Link from 'next/link';

export default function ChamadaInstrutores() {
  return (
    <section className="cta">
      <span> FLASHCLIP </span>

      <h2>Quer participar?</h2>

      <p>Confira os cursos disponíveis e faça sua inscrição.</p>

      <div className="cta-botoes">
        <Link href="/cursos/" className="botao-secundario">
          Ver cursos
        </Link>

        <Link href="/inscricoes/" className="botao-principal">
          Minhas inscrições
        </Link>
      </div>
    </section>
  );
}
