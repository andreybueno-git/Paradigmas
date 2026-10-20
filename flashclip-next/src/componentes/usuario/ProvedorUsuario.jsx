'use client';
// Liga a escuta da sessão do Supabase uma vez, no layout, para o site todo (o js/auth.js rodava
// em cada página). As páginas e o cabeçalho leem o usuário com useUsuario() de ./estado.
//
// useLayoutEffect: a primeira verificação começa logo no fim da hidratação, antes da pintura e
// antes dos useEffect das páginas (num useEffect comum, os filhos rodariam primeiro, inclusive o
// trabalho pesado da home). O auth.js do original também verificava a sessão assim que carregava.
import { useLayoutEffect } from 'react';
import { iniciarUsuario } from './estado';

export default function ProvedorUsuario({ children }) {
  useLayoutEffect(() => iniciarUsuario(), []);
  return children;
}
