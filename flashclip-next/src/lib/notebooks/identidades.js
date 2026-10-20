// Linguagem de cada curso -> logo, cor e nome mostrados no notebook (porte de notebooks/course-identities.js).
// O nome do notebook é o canônico ("JAVA" no banco vira "Java" na tela); o h3 do card mostra o nome cru.
// Os logos ficam em public/notebooks/logos (Devicon, MIT: ver public/notebooks/logos/provenance.json).
import { asset } from '@/lib/caminho';

const linguagens = {
  'c#': ['csharp', '#a66bdd', 'C#'],
  javascript: ['javascript', '#f7df1e', 'JavaScript'],
  java: ['java', '#ef8d43', 'Java'],
  python: ['python', '#6cb1dc', 'Python'],
  'c++': ['cplusplus', '#6a9fdd', 'C++'],
  php: ['php', '#a0a9dc', 'PHP'],
  prolog: ['prolog', '#ef9c6b', 'Prolog'],
  elixir: ['elixir', '#b29ad3', 'Elixir'],
  clojure: ['clojure', '#87bf72', 'Clojure'],
  ruby: ['ruby', '#e76661', 'Ruby'],
  minikanren: [null, '#e6c88c', 'miniKanren'],
};

export function identidadeCurso(valor) {
  const cru = String(valor ?? '').trim();
  const [slug, cor, nome] = linguagens[cru.toLowerCase()] || [null, '#e6c88c', cru || 'Curso'];
  return {
    nome, slug, cor,
    logo: slug ? asset(`/notebooks/logos/${slug}.svg`) : null,
    rotuloLogo: slug === 'prolog' ? 'Símbolo do SWI-Prolog' : `Logo de ${nome}`,
  };
}

// Logo da FlashClip: tampa do notebook 3D e desenho do notebook fechado na versão leve.
export const LOGO_MARCA = '/imagens/logoFlash.webp';

// Modelo do notebook (compressão meshopt).
export const MODELO_NOTEBOOK = '/notebooks/models/notebook.glb';
