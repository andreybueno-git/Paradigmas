// =========================
// CHAMADA FINAL (CTA)
// =========================
//
// "Pronto para começar sua jornada?" no fim da página /sobre/ (html/sobre.html). Fica dentro de
// main.sobre, como no original. Os botões navegam no cliente (a música continua): "Inscreva-se
// Agora" vai para Minhas inscrições (no lugar de ./inscricoes.html) e "Ver Cursos" para a seção
// #cursos da home (no lugar de ../index.html#cursos).
import Link from 'next/link';

export default function ChamadaSobre() {
  return (
    <section className="cta">
      <span> PARTICIPE DO FLASHCLIP </span>

      <h2>Pronto para começar sua jornada?</h2>

      <p>
        Venha aprender, experimentar e descobrir novas possibilidades através
        da tecnologia.
      </p>

      <div className="cta-botoes">
        <Link href="/inscricoes/" className="botao-principal">
          Inscreva-se Agora
        </Link>

        <Link href="/#cursos" className="botao-secundario">
          Ver Cursos
        </Link>
      </div>
    </section>
  );
}
