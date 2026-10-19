// Layout raiz: fica montado durante toda a navegação. Por isso a música, a barra de controles
// e os efeitos dos botões vivem aqui, e cada página só troca o conteúdo.
import '@/estilos/global/base.css';
import '@/estilos/global/experiencia.css';
import Experiencia from '@/componentes/Experiencia';
import { ControleAudio } from '@/componentes/Audio';

export const metadata = {
  title: 'FlashClip',
  description: 'FlashClip · Edição especial de Natal',
};

export const viewport = {
  themeColor: '#030508',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>
        {children}
        <ControleAudio />
        <Experiencia />
      </body>
    </html>
  );
}
