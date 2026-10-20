// =========================
// PERGUNTAS FREQUENTES
// =========================
//
// As 12 perguntas da página /faq/ (html/faq.html). O acordeão é o <details>/<summary> nativo do
// navegador, como no original, sem JS: todos começam fechados, vários podem ficar abertos ao mesmo
// tempo (sem `name`) e teclado e leitor de tela funcionam sozinhos. Por isso o <details> é
// renderizado SEM a prop `open`: o React não controla o atributo e não briga com o clique.
//
// O "+" do span.icone fica no markup, como no original: o CSS o esconde (font-size: 0) e desenha
// o ícone com ::before/::after, que gira para "−" em `.faq-item[open]`.

const PERGUNTAS = [
  {
    numero: '01',
    pergunta: 'Preciso ter conhecimento prévio em programação?',
    resposta:
      'Não! Todos os cursos do FlashClip são voltados para iniciantes. Começamos do zero e construímos o conhecimento passo a passo. A única exigência é sua curiosidade e vontade de aprender.',
  },
  {
    numero: '02',
    pergunta: 'Quanto custa a inscrição?',
    resposta:
      'As inscrições para o FlashClip são completamente gratuitas! Queremos tornar a educação em programação acessível a todos os estudantes.',
  },
  {
    numero: '03',
    pergunta: 'Preciso levar meu próprio notebook?',
    resposta:
      'Recomendamos trazer seu notebook para uma melhor experiência. No entanto, disponibilizamos computadores nos laboratórios para quem não puder levar.',
  },
  {
    numero: '04',
    pergunta: 'Quanto tempo dura o evento?',
    resposta:
      'O FlashClip acontece em um único dia, das 14h às 17h30, incluindo coffee-break. Cada curso tem duração total de 3 horas divididas em dois módulos.',
  },
  {
    numero: '05',
    pergunta: 'Receberei certificado?',
    resposta:
      'Sim! Todos os participantes que completarem o curso receberão um certificado digital por e-mail em até 7 dias após o evento.',
  },
  {
    numero: '06',
    pergunta: 'Posso fazer mais de um curso?',
    resposta:
      'Cada participante pode se inscrever em apenas um curso por edição do evento. Isso garante melhor aproveitamento e mais vagas para outros estudantes.',
  },
  {
    numero: '07',
    pergunta: 'Como funciona o coffee-break?',
    resposta:
      'Haverá um intervalo de 20 minutos durante o evento com café, lanches e bebidas. É uma ótima oportunidade para networking com outros participantes e instrutores.',
  },
  {
    numero: '08',
    pergunta: 'E se eu tiver que cancelar minha inscrição?',
    resposta:
      'Você pode cancelar sua inscrição até 24 horas antes do evento através do e-mail de confirmação. Assim liberamos a vaga para outro estudante na lista de espera.',
  },
  {
    numero: '09',
    pergunta: 'Há vagas limitadas?',
    resposta:
      'Sim, as vagas são limitadas para garantir qualidade no ensino e uma experiência mais personalizada. Recomendamos se inscrever o quanto antes.',
  },
  {
    numero: '10',
    pergunta: 'Posso trazer um amigo que não é aluno da Ulbra?',
    resposta:
      'O evento é aberto a todos os estudantes universitários, não apenas da Ulbra. Convidamos seu amigo a fazer a inscrição oficial para garantir sua vaga.',
  },
  {
    numero: '11',
    pergunta: 'Como escolho qual curso fazer?',
    resposta:
      'Na página de Cursos você encontra descrições detalhadas de cada opção. Se ainda tiver dúvidas, entre em contato conosco que te ajudaremos a escolher o melhor curso para você.',
  },
  {
    numero: '12',
    pergunta: 'Haverá outras edições do FlashClip?',
    resposta:
      'Sim! Planejamos realizar o FlashClip regularmente. Siga nossas redes sociais para não perder as próximas edições.',
  },
];

export default function PerguntasFaq() {
  return (
    <div className="lista-faq">
      {PERGUNTAS.map(item => (
        <details className="faq-item" key={item.numero}>
          <summary>
            <span className="numero">{item.numero}</span>

            <span className="pergunta">{item.pergunta}</span>

            <span className="icone">+</span>
          </summary>

          <div className="resposta">
            <p>{item.resposta}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
