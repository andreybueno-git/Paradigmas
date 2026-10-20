// =========================
// PAINEL ADMINISTRATIVO: MODAL "ALTERAR STATUS"
// =========================
//
// Mesmo #modalStatus do admin.html, sempre montado dentro do <main> (fora do wrapper da página ele
// perderia o estilo). Aberto = classe "ativo". Como no original, não fecha com Esc nem com clique
// no fundo: só pelos botões. Enquanto a alteração corre, "Confirmar" fica desabilitado e mostra
// "Alterando...". Os ids dos botões ficam: o admin.css pinta os dois por id.
//

export default function ModalStatus({ aberto, alterando, aoCancelar, aoConfirmar }) {
  return (
    <div id="modalStatus" className={aberto ? 'modal ativo' : 'modal'}>
      <div className="modal-conteudo">
        <h3>Alterar status</h3>

        <p>Deseja marcar esta matrícula como atendida?</p>

        <div className="modal-botoes">
          <button id="botaoCancelarModal" type="button" onClick={aoCancelar}>
            Cancelar
          </button>

          <button id="botaoConfirmarStatus" type="button" disabled={alterando} onClick={aoConfirmar}>
            {alterando ? 'Alterando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
