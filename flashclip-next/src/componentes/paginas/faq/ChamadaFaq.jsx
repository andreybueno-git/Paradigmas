// =========================
// CHAMADA FINAL (CTA)
// =========================
//
// "Ainda tem dúvidas?" da página /faq/ (html/faq.html). No FAQ ela fica FORA do <main>, entre ele
// e o rodapé, como no original. O botão leva ao contato com navegação no cliente (a música
// continua), no lugar de ./contato.html.
import Link from 'next/link';

export default function ChamadaFaq() {
  return (
    <section className="cta">
      <span> AINDA TEM DÚVIDAS? </span>

      <h2>Nossa equipe está pronta para ajudar você</h2>

      <p>Não encontrou a resposta que procurava? Entre em contato conosco.</p>

      <Link href="/contato/" className="botao-contato"> Entre em Contato </Link>
    </section>
  );
}
