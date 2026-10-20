// =========================
// INFORMAÇÕES DE CONTATO
// =========================
//
// Card "Fale com a gente" da página /contato/ (html/contato.html), 100% estático: e-mail e telefone
// são links mailto:/tel: e horário e endereço são texto. Não existe formulário no original.
// Markup igual ao original: div.item-contato com div.icone > svg e um div com span (rótulo) +
// a|strong (valor). O CSS depende de `.item-contato > div:last-child` e de `.item-contato:last-child`.
// Os `d` que estavam quebrados em várias linhas foram juntados numa linha só (desenho igual).

function ItemContato({ rotulo, icone, children }) {
  return (
    <div className="item-contato">
      <div className="icone">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {icone}
        </svg>
      </div>

      <div>
        <span>{rotulo}</span>

        {children}
      </div>
    </div>
  );
}

export default function InformacoesContato() {
  return (
    <div className="informacoes">
      <div className="titulo-contato">
        <span> INFORMAÇÕES DE CONTATO </span>

        <h2>Fale com a gente</h2>
      </div>

      {/* E-MAIL */}
      <ItemContato
        rotulo="E-mail"
        icone={
          <>
            <rect x="3" y="5" width="18" height="14" rx="2" />

            <path d="m3 7 9 6 9-6" />
          </>
        }
      >
        <a href="mailto:contato.flashclip@gmail.com"> contato.flashclip@gmail.com </a>
      </ItemContato>

      {/* TELEFONE */}
      <ItemContato
        rotulo="Telefone"
        icone={
          <path d="M6.5 3.5h3l1.5 4-2 1.5 a15 15 0 0 0 6 6l1.5-2 4 1.5v3c0 1-1 2-2 2 C10.5 19.5 4.5 13.5 4.5 6.5 c0-2 1-3 2-3Z" />
        }
      >
        <a href="tel:+5563984210122"> +55 (63) 98421-0122 </a>
      </ItemContato>

      {/* HORÁRIO */}
      <ItemContato
        rotulo="Horário de Atendimento"
        icone={
          <>
            <circle cx="12" cy="12" r="9" />

            <path d="M12 7v5l3 2" />
          </>
        }
      >
        <strong> Segunda a Sexta, 9h–18h </strong>
      </ItemContato>

      {/* ENDEREÇO */}
      <ItemContato
        rotulo="Endereço"
        icone={
          <>
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10 a8 8 0 1 1 16 0Z" />

            <circle cx="12" cy="10" r="2.5" />
          </>
        }
      >
        <strong> Ulbra Palmas — Palmas, TO </strong>
      </ItemContato>
    </div>
  );
}
