// Patrocinadores e filtros da página /patrocinadores/ (cards de html/patrocinadores.html).
// Textos, endereços e rótulos copiados literalmente do original.
//
// Os logos ficam com a URL externa crua no src: o CSS arredonda o do posto pelo próprio endereço
// (.logo-patrocinador img[src*="posto-ipanema"]), então nada pode reescrever essa URL.

export const FILTROS = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'diamante', rotulo: 'Diamante' },
  { valor: 'prata', rotulo: 'Prata' },
  { valor: 'bronze', rotulo: 'Bronze' },
];

// `tipo` do link: 'site' (ícone de globo, texto "Site") ou 'instagram' (ícone e texto "Instagram").
export const PATROCINADORES = [
  {
    categoria: 'diamante',
    nivel: 'Diamante',
    nome: 'SUA Internet',
    logo: 'https://i.ibb.co/nqCT8t9f/Logo.png',
    descricao: 'Sua Internet é uma empresa de internet que oferece serviços de internet para residências e empresas.',
    links: [
      { tipo: 'site', href: 'https://suainternet.com.br/', rotulo: 'Site da SUA Internet' },
      { tipo: 'instagram', href: 'https://instagram.com/suainternet', rotulo: 'Instagram da SUA Internet' },
    ],
  },
  {
    categoria: 'prata',
    nivel: 'Prata',
    nome: 'Posto Ipanema',
    logo: 'https://i.ibb.co/RGxhcB04/posto-ipanema.png',
    descricao: 'Posto de combustível e serviços: troca de óleo, loja de conveniência e calibragem de pneus.',
    links: [
      { tipo: 'instagram', href: 'https://instagram.com/postoipanemapmw', rotulo: 'Instagram do Posto Ipanema' },
    ],
  },
  {
    categoria: 'bronze',
    nivel: 'Bronze',
    nome: 'CRP Tecnologia',
    logo: 'https://i.ibb.co/XZxvTy5y/CRP-TECNOLOGIA.png',
    descricao:
      'CRP Tecnologia, uma empresa de desenvolvimento de software com mais de 18 anos de experiência no mercado nacional e internacional.',
    links: [
      { tipo: 'site', href: 'https://crptecnologia.com.br/', rotulo: 'Site da CRP Tecnologia' },
      { tipo: 'instagram', href: 'https://instagram.com/crptecnologia', rotulo: 'Instagram da CRP Tecnologia' },
    ],
  },
];
