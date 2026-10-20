// Layout raiz do site e das telas de conta: fica montado durante toda a navegação.
// Por isso a música, a barra de controles e os efeitos dos botões vivem aqui, e cada página
// só troca o próprio conteúdo (com o seu wrapper data-fc-page e o seu CSS gerado).
// O admin tem outro layout raiz, sem música (src/app/(admin)/layout.jsx).
import '@/estilos/global/experiencia.css';
import Experiencia from '@/componentes/Experiencia';
import { ControleAudio } from '@/componentes/Audio';
import ProvedorUsuario from '@/componentes/usuario/ProvedorUsuario';
import RolagemDeRota from '@/componentes/RolagemDeRota';

export const metadata = {
  title: 'FlashClip',
};

export const viewport = {
  themeColor: '#030508',
};

export default function LayoutSite({ children }) {
  // suppressHydrationWarning: na carga direta da home, o script inline da tela de carregamento marca
  // o <html> (fc-loading/fc-loaded-before, data-load-state) antes da hidratação. Só vale para os
  // atributos do próprio <html>.
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <RolagemDeRota />
        <ProvedorUsuario>{children}</ProvedorUsuario>
        <ControleAudio />
        <Experiencia />
      </body>
    </html>
  );
}
