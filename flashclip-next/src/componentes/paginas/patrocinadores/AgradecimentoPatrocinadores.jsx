// =========================
// MENSAGEM DE GRATIDÃO
// =========================
//
// Seção institucional da página /patrocinadores/ (html/patrocinadores.html), 100% estática.
// Fala de colaboração sem presumir patrocínios confirmados.

const VALORES = ['Educação', 'Tecnologia', 'Inovação'];

export default function AgradecimentoPatrocinadores() {
  return (
    <section className="agradecimento" aria-labelledby="titulo-agradecimento">
      <div className="agradecimento-painel">
        <div className="agradecimento-conteudo">
          <div className="agradecimento-emblema" aria-hidden="true"></div>
          <span className="agradecimento-etiqueta">UMA MENSAGEM DE GRATIDÃO</span>
          <h2 id="titulo-agradecimento">Nosso muito obrigado a todos que acreditam nessa ideia.</h2>
          <p>
            Agradecemos a cada pessoa que acompanha o FlashClip, compartilha nossa proposta e incentiva a criação
            de espaços de aprendizado, troca de experiências e novas oportunidades. Cada palavra de apoio e cada
            gesto de incentivo nos motivam a continuar construindo uma iniciativa que aproxima pessoas por meio
            da educação, da tecnologia e da inovação.
          </p>

          <div className="agradecimento-apoiadores" aria-label="Valores que inspiram o FlashClip">
            {VALORES.map(valor => (
              <span key={valor}>{valor}</span>
            ))}
          </div>

          <p className="agradecimento-fecho">Obrigado por dedicar um momento para conhecer e apoiar a proposta do FlashClip.</p>
        </div>
      </div>
    </section>
  );
}
