// Arquivos de public/ (imagens, modelos 3D) precisam do basePath do GitHub Pages ("/Paradigmas").
// Use asset('/models/x.glb') em vez de '/models/x.glb'.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function asset(caminho) {
  return `${BASE}${caminho.startsWith('/') ? caminho : `/${caminho}`}`;
}
