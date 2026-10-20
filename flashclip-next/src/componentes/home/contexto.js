'use client';
// Contexto da home: o que os componentes cliente de dentro da página precisam do <HomeRaiz>
// (hoje, só avisar a tela de carregamento que os cursos terminaram).
import { createContext } from 'react';

export const ContextoHome = createContext(null);
