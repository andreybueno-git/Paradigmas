// =========================
// COMO FUNCIONAM OS CURSOS
// =========================
//
// Seção "Antes de se inscrever" da página /cursos/ (html/cursos.html), 100% estática.
// Os quatro passos ficam numa lista para o markup sair igual ao original: article.info-card com
// div.info-numero e um div com h3 + p.

const PASSOS = [
  {
    numero: '01',
    titulo: 'Escolha seu curso',
    texto: 'Confira a descrição, o período e as vagas disponíveis antes de realizar sua inscrição.',
  },
  {
    numero: '02',
    titulo: 'Faça sua inscrição',
    texto: 'Escolha o curso desejado e confirme sua inscrição através da plataforma.',
  },
  {
    numero: '03',
    titulo: 'Participe do evento',
    texto: 'Compareça ao evento no horário indicado e aproveite a experiência de aprendizado.',
  },
  {
    numero: '04',
    titulo: 'Receba seu certificado',
    texto: 'Após a participação, você receberá seu certificado digital.',
  },
];

export default function InformacoesCursos() {
  return (
    <section className="informacoes-cursos">
      <div className="informacoes-titulo">
        <span> ANTES DE SE INSCREVER </span>

        <h2>Como funcionam os cursos?</h2>

        <p>
          O FlashClip foi pensado para oferecer uma experiência rápida,
          prática e acessível para estudantes.
        </p>
      </div>

      <div className="lista-informacoes">
        {PASSOS.map(passo => (
          <article className="info-card" key={passo.numero}>
            <div className="info-numero">{passo.numero}</div>

            <div>
              <h3>{passo.titulo}</h3>

              <p>{passo.texto}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
