// =========================
// MAPA
// =========================
//
// Google Maps embutido da página /contato/ (html/contato.html). Igual ao original: carregamento
// preguiçoso e tela cheia permitida. O ">" solto que o original deixava dentro do <iframe> era só
// conteúdo de reserva (nunca aparecia) e foi descartado. Como no original, o mapa é carregado de
// novo a cada visita à página.

export default function MapaContato() {
  return (
    <div className="mapa">
      <iframe
        src="https://www.google.com/maps?q=-10.2787794,-48.3351651&z=17&output=embed"
        title="Engenharia de Software - ULBRA Palmas"
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
}
