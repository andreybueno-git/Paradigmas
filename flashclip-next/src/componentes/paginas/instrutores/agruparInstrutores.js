// Agrupa os ministrantes pelo nome do curso (porte da parte de dados de js/instrutores.js).
// Função pura, sem React e sem Supabase: recebe a lista de carregarDadosInstrutores().
import { asset } from '@/lib/caminho';

// Foto usada quando o ministrante não tem referenciaFoto ou quando a foto não carrega.
// O original usava "../imagens/usuario-padrao.png"; aqui com o basePath (mesmo arquivo).
export const FOTO_PADRAO = asset('/imagens/usuario-padrao.png');

/*
 * Mesma regra do original:
 * - o grupo é o nome do curso ("Curso" se faltar); cursos com o mesmo nome viram um grupo só;
 * - o nome é o do usuário ("Instrutor" se faltar);
 * - a foto é a referenciaFoto crua, como estava no banco (o original não normalizava esse valor;
 *   como as rotas terminam em "/", um caminho relativo "../imagens/x.png" continua apontando para
 *   a mesma pasta de imagens).
 *
 * Os grupos saem na ordem de um objeto JavaScript, como no Object.entries do original.
 * O objeto não tem protótipo, para um curso chamado "__proto__" não quebrar a lista.
 */
export function agruparInstrutores(ministrantes) {
  const cursos = Object.create(null);

  ministrantes.forEach(function (ministrante) {
    const curso = ministrante.cursos?.nome || 'Curso';

    const nome = ministrante.usuarios?.nome || 'Instrutor';

    const foto = ministrante.referenciaFoto || FOTO_PADRAO;

    if (!cursos[curso]) {
      cursos[curso] = [];
    }

    cursos[curso].push({
      nome: nome,
      foto: foto,
    });
  });

  return Object.entries(cursos).map(function ([curso, instrutores]) {
    return { curso, instrutores };
  });
}
