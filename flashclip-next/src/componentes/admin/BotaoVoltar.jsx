'use client';
// =========================
// PAINEL ADMINISTRATIVO: VOLTAR AO INÍCIO
// =========================
//
// O admin tem o próprio layout raiz (sem música), então voltar para o site é uma carga completa
// da home, como o window.location.href = "../index.html" do original. Continua sendo um <button>
// (e não um link) porque o admin.css estiliza os botões da página pela tag. O asset() acrescenta o
// basePath do GitHub Pages.
//
import { asset } from '@/lib/caminho';

export default function BotaoVoltar() {
  return (
    <button
      id="botaoVoltar"
      onClick={function () {
        window.location.href = asset('/');
      }}
    >
      Voltar ao início
    </button>
  );
}
