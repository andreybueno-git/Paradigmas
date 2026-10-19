// Cada CSS em src/estilos/escopo/<nome>.css só vale dentro de [data-estilos~="<nome>"].
// doBody: classes e atributos que o site original colocava no <body>.
import escopoPorArquivo from './postcss/escopo-por-arquivo.cjs';

export default {
  plugins: [
    escopoPorArquivo({ doBody: ['.natal-theme', '[data-lights', '.fc-entry-active', '[data-audio'] }),
  ],
};
