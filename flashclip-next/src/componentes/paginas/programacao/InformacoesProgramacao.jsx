// =========================
// INFORMAÇÕES IMPORTANTES
// =========================
//
// Card "Antes de participar" no fim da página /programacao/ (html/programacao.html), 100% estático.

const AVISOS = [
  'Chegue com pelo menos 15 minutos de antecedência.',
  'Coffee-break e materiais inclusos na inscrição.',
];

export default function InformacoesProgramacao() {
  return (
    <section className="informacoes">
      <div className="informacoes-titulo">
        <span> INFORMAÇÕES IMPORTANTES </span>

        <h2>Antes de participar</h2>
      </div>

      <div className="lista-informacoes">
        {AVISOS.map(aviso => (
          <div key={aviso}>
            <span>›</span>

            <p>{aviso}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
