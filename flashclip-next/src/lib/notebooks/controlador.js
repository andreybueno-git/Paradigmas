/*
 * Notebooks 3D dos cards de curso (porte de notebooks/course-computers.js).
 *
 * Um único WebGLRenderer por lista, cujo <canvas> nunca entra no DOM: cada card tem só um <canvas> 2D
 * e recebe uma cópia (drawImage) do quadro da sua cena. Assim N notebooks usam 1 contexto WebGL.
 * O Three.js, o modelo e o ambiente só são baixados quando o primeiro card chega perto da tela.
 *
 * Uso (feito por <ListaCursos>):
 *   const notebooks = iniciarNotebooks(lista);              // lista = div#listaCursos
 *   const desfazer = notebooks.registrar(details, identidade, aoRenderer);
 *   notebooks.destruir();                                    // no unmount: libera tudo, inclusive o contexto
 *
 * aoRenderer('pending' | 'webgl' | 'fallback') avisa o componente; quem escreve data-renderer,
 * aria-busy e os rótulos de abrir/fechar é o React. Aqui só ficam as escritas que o React nunca
 * renderiza (tamanho do canvas e data-open-progress).
 * Nada roda ao importar este módulo, e ele não procura nada no documento: recebe a lista.
 */
import { asset } from '@/lib/caminho';
import { LOGO_MARCA, MODELO_NOTEBOOK } from './identidades';

const suave = valor => valor * valor * (3 - 2 * valor);

function descartarModelo(cena) {
  const geometrias = new Set(), materiais = new Set();
  cena?.traverse(objeto => {
    if (objeto.geometry) geometrias.add(objeto.geometry);
    for (const material of (Array.isArray(objeto.material) ? objeto.material : [objeto.material])) if (material) materiais.add(material);
  });
  for (const geometria of geometrias) geometria.dispose();
  for (const material of materiais) material.dispose();
}

// renderer.dispose() não devolve o contexto na hora; forceContextLoss() devolve. O ouvinte de
// contexto perdido sai antes, senão a própria liberação derrubaria os cards para a versão leve.
function liberarRenderer(renderer, perdeuContexto, contextoJaPerdido) {
  renderer.domElement.removeEventListener('webglcontextlost', perdeuContexto);
  renderer.dispose();
  if (!contextoJaPerdido()) {
    try { renderer.forceContextLoss(); } catch {}
  }
}

export function iniciarNotebooks(lista, opcoes = {}) {
  const estados = new Map();
  const calmo = matchMedia('(prefers-reduced-motion: reduce)');
  // O botão "Pausar movimento" da home marca o wrapper da página (no site original era o <body>).
  const pagina = opcoes.pagina || lista.closest('[data-fc-page]');
  let promessaMotor, motor = null, quadro = 0, parado = false, indisponivel = false, contextoPerdido = false;
  let rolando = false, timerRolagem = 0, larguraRenderer = 0, alturaRenderer = 0;
  let timerMotor = 0, limpezaPendente = null;
  const esperandoQuieto = new Set();
  // Callbacks de ociosidade agendados e o jeito de cancelar cada um (para o destruir()).
  const ociosos = new Map();
  // Logos ainda carregando: destruir() termina cada um na hora.
  const logosPendentes = new Set();
  const movimentoParado = () => calmo.matches || !!pagina?.classList.contains('fc-paused');
  const jaPerdeuContexto = () => contextoPerdido;

  function mostrar(estado, renderer) {
    if (estado.renderer === renderer) return;
    estado.renderer = renderer;
    if (!estado.removido) estado.aoRenderer(renderer);
  }
  function falharCard(estado) {
    estado.falhou = true;
    estado.graficos?.descartar(); estado.textura?.dispose();
    estado.graficos = null; estado.textura = null;
    mostrar(estado, 'fallback');
  }
  function retomarEsperas() {
    const esperando = [...esperandoQuieto]; esperandoQuieto.clear();
    for (const retomar of esperando) retomar();
  }

  // Montar o modelo e subir dados para a GPU esperam o gesto de rolagem do usuário terminar.
  function quandoQuieto() {
    return new Promise(resolve => {
      if (parado) { resolve(); return; }
      const verificar = () => {
        ociosos.delete(verificar);
        if (parado || indisponivel || !rolando) resolve();
        else esperandoQuieto.add(verificar);
      };
      if ('requestIdleCallback' in window) {
        const id = requestIdleCallback(verificar, { timeout: 350 });
        ociosos.set(verificar, () => cancelIdleCallback(id));
      } else {
        const id = setTimeout(verificar, 0);
        ociosos.set(verificar, () => clearTimeout(id));
      }
    });
  }

  async function carregarMotor() {
    if (promessaMotor) return promessaMotor;
    timerMotor = setTimeout(cairTodos, 20000);
    promessaMotor = (async () => {
      // Os modelos usam compressão meshopt (EXT_meshopt_compression), lida pelo MeshoptDecoder.
      const [THREE, { GLTFLoader }, { MeshoptDecoder }, { RoomEnvironment }, { criarCenaNotebook }] = await Promise.all([
        import('three'), import('three/examples/jsm/loaders/GLTFLoader.js'), import('three/examples/jsm/libs/meshopt_decoder.module.js'),
        import('three/examples/jsm/environments/RoomEnvironment.js'), import('./cena'),
      ]);
      await quandoQuieto();
      if (parado || indisponivel) return null;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
      renderer.setClearColor(0x000000, 0);
      const perdeuContexto = evento => {
        evento.preventDefault(); contextoPerdido = true; cairTodos();
      };
      renderer.domElement.addEventListener('webglcontextlost', perdeuContexto);
      const sala = new RoomEnvironment();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const alvoAmbiente = pmrem.fromScene(sala, .04);
      sala.dispose(); pmrem.dispose();
      let modelo;
      limpezaPendente = () => { descartarModelo(modelo?.scene); alvoAmbiente.dispose(); liberarRenderer(renderer, perdeuContexto, jaPerdeuContexto); };
      try {
        modelo = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(asset(MODELO_NOTEBOOK));
        if (indisponivel || parado) { descartarModelo(modelo.scene); return null; }
        const texturaMarca = await new THREE.TextureLoader().loadAsync(asset(LOGO_MARCA));
        if (indisponivel || parado) { texturaMarca.dispose(); return null; }
        texturaMarca.colorSpace = THREE.SRGBColorSpace;
        texturaMarca.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
        motor = { THREE, renderer, perdeuContexto, modelo: modelo.scene, alvoAmbiente, texturaMarca, criarCenaNotebook };
        limpezaPendente = null;
        return motor;
      } catch (erro) {
        limpezaPendente?.(); limpezaPendente = null; throw erro;
      }
    })().catch(erro => {
      cairTodos();
      if (!parado) console.warn('Os notebooks continuam disponíveis na versão leve.', erro);
      return null;
    }).finally(() => clearTimeout(timerMotor));
    return promessaMotor;
  }

  function cairTodos() {
    indisponivel = true;
    clearTimeout(timerMotor);
    limpezaPendente?.(); limpezaPendente = null;
    cancelAnimationFrame(quadro); quadro = 0;
    for (const estado of estados.values()) falharCard(estado);
    retomarEsperas();
  }

  async function texturaLogo(runtime, identidade) {
    const { THREE, renderer } = runtime;
    let imagem;
    if (identidade.logo) {
      imagem = await new Promise(resolve => {
        const item = new Image();
        let terminou = false;
        const terminar = valor => {
          if (terminou) return;
          terminou = true; clearTimeout(timer); item.onload = item.onerror = null; logosPendentes.delete(terminar); resolve(valor);
        };
        const timer = setTimeout(() => terminar(null), 5000);
        item.onload = () => terminar(item); item.onerror = () => terminar(null);
        logosPendentes.add(terminar);
        item.src = identidade.logo;
      });
    }
    // Cada versão pode trocar a tela pela própria paleta via variáveis CSS (ficam no <html>).
    const estilos = getComputedStyle(document.documentElement);
    const tom = (nome, reserva) => estilos.getPropertyValue(nome).trim() || reserva;
    const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = 400;
    const contexto = canvas.getContext('2d');
    const gradiente = contexto.createRadialGradient(320, 185, 10, 320, 185, 370);
    gradiente.addColorStop(0, tom('--fc-screen-glow', '#183b30')); gradiente.addColorStop(1, tom('--fc-screen-base', '#061610'));
    contexto.fillStyle = gradiente; contexto.fillRect(0, 0, 640, 400);
    contexto.fillStyle = tom('--fc-screen-muted', '#aebfb1'); contexto.textAlign = 'left'; contexto.font = '500 13px Arial';
    contexto.fillText('FLASHCLIP  /  APRENDA NA PRÁTICA', 36, 37);
    contexto.strokeStyle = tom('--fc-screen-rule', '#d5c08c35'); contexto.beginPath(); contexto.moveTo(36, 57); contexto.lineTo(604, 57); contexto.stroke();
    if (imagem) {
      const escala = Math.min(152 / imagem.naturalWidth, 152 / imagem.naturalHeight);
      const w = imagem.naturalWidth * escala, h = imagem.naturalHeight * escala;
      contexto.drawImage(imagem, 320 - w / 2, 183 - h / 2, w, h);
    }
    contexto.textAlign = 'center'; contexto.fillStyle = tom('--fc-screen-text', '#f3eedf');
    contexto.font = `600 ${identidade.nome.length > 10 ? 36 : 44}px Arial`;
    contexto.fillText(identidade.nome, 320, imagem ? 317 : 220, 560);
    contexto.fillStyle = identidade.cor; contexto.fillRect(300, 351, 40, 3);
    const textura = new THREE.CanvasTexture(canvas);
    textura.flipY = false; textura.colorSpace = THREE.SRGBColorSpace;
    textura.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    return textura;
  }

  async function preparar(estado) {
    if (estado.preparando || estado.falhou || estado.graficos || !estado.contexto || estado.removido || indisponivel || parado || rolando || !estado.perto) return;
    estado.preparando = true;
    try {
      const runtime = await carregarMotor();
      if (!runtime || indisponivel || estado.falhou || estado.removido || parado) return;
      const textura = await texturaLogo(runtime, estado.identidade);
      await quandoQuieto();
      if (estado.removido || !estado.elemento.isConnected || parado || indisponivel || estado.falhou || !estado.perto) { textura.dispose(); return; }
      estado.textura = textura;
      estado.graficos = runtime.criarCenaNotebook(runtime.THREE, runtime.modelo, runtime.alvoAmbiente.texture, textura, runtime.texturaMarca);
      estado.progresso = estado.alvo;
      estado.sujo = true;
      enfileirar();
    } catch (erro) {
      falharCard(estado);
      console.warn('Prévia leve do notebook:', erro);
    } finally {
      estado.preparando = false;
    }
  }

  function avancar(estado, agora) {
    if (movimentoParado()) { estado.progresso = estado.alvo; estado.inclinacaoX = estado.inclinacaoY = estado.alvoX = estado.alvoY = 0; return; }
    const tempo = Math.min(1, Math.max(0, (agora - estado.inicio) / estado.duracao));
    estado.progresso = estado.de + (estado.alvo - estado.de) * suave(tempo);
    estado.inclinacaoX += (estado.alvoX - estado.inclinacaoX) * .18;
    estado.inclinacaoY += (estado.alvoY - estado.inclinacaoY) * .18;
  }

  function emMovimento(estado) {
    return Math.abs(estado.progresso - estado.alvo) > .0001 || Math.abs(estado.inclinacaoX - estado.alvoX) + Math.abs(estado.inclinacaoY - estado.alvoY) > .001;
  }

  // Quadros só sob demanda: nada roda com a aba escondida, durante a rolagem ou sem nada se mexendo.
  function enfileirar() {
    if (!quadro && !rolando && !document.hidden && !parado && !indisponivel) quadro = requestAnimationFrame(desenhar);
  }

  function desenhar(agora) {
    quadro = 0;
    if (parado || indisponivel || document.hidden || rolando || !motor) return;
    let denovo = false;
    for (const estado of estados.values()) {
      if (!estado.visivel || !estado.graficos || (!estado.sujo && !emMovimento(estado))) continue;
      const { largura, altura } = estado;
      if (largura < 1 || altura < 1) continue;
      avancar(estado, agora);
      const { renderer } = motor;
      const razao = renderer.getPixelRatio();
      const larguraPixels = Math.round(largura * razao), alturaPixels = Math.round(altura * razao);
      if (estado.canvas.width !== larguraPixels || estado.canvas.height !== alturaPixels) {
        estado.canvas.width = larguraPixels; estado.canvas.height = alturaPixels;
      }
      if (estado.larguraDesenho !== largura || estado.alturaDesenho !== altura) {
        estado.graficos.redimensionar(largura, altura);
        estado.larguraDesenho = largura; estado.alturaDesenho = altura;
      }
      estado.graficos.abrir(estado.progresso);
      estado.graficos.inclinar(estado.inclinacaoX, estado.inclinacaoY);
      estado.graficos.acenderTela(suave(Math.max(0, Math.min(1, (estado.progresso - .35) / .5))));
      if (larguraRenderer !== largura || alturaRenderer !== altura) {
        renderer.setSize(largura, altura, false);
        larguraRenderer = largura; alturaRenderer = altura;
      }
      try {
        renderer.render(estado.graficos.scene, estado.graficos.camera);
        if (indisponivel) return;
        estado.contexto.clearRect(0, 0, larguraPixels, alturaPixels);
        estado.contexto.drawImage(renderer.domElement, 0, 0, larguraPixels, alturaPixels);
      } catch (erro) {
        falharCard(estado);
        console.warn('Prévia leve do notebook:', erro);
        continue;
      }
      // Só revela depois que o primeiro quadro do modelo de verdade chegou a este canvas.
      mostrar(estado, 'webgl');
      estado.elemento.dataset.openProgress = estado.progresso.toFixed(3);
      estado.sujo = false;
      denovo ||= emMovimento(estado);
    }
    if (denovo) enfileirar();
  }

  const perto = new IntersectionObserver(entradas => {
    for (const entrada of entradas) {
      const estado = estados.get(entrada.target.closest('.fc-course-computer'));
      if (!estado) continue;
      estado.perto = entrada.isIntersecting;
      if (estado.perto) { estado.sujo = true; preparar(estado); }
    }
    enfileirar();
  }, { rootMargin: '140px 0px' });
  // Um segundo observador separa a distância de pré-carga da visibilidade de verdade.
  const visivel = new IntersectionObserver(entradas => {
    for (const entrada of entradas) {
      const estado = estados.get(entrada.target.closest('.fc-course-computer'));
      if (estado) estado.visivel = entrada.isIntersecting;
    }
    enfileirar();
  });
  const tamanho = new ResizeObserver(entradas => {
    for (const entrada of entradas) {
      const estado = estados.get(entrada.target.closest('.fc-course-computer'));
      if (estado) {
        estado.largura = Math.round(entrada.contentRect.width);
        estado.altura = Math.round(entrada.contentRect.height);
        estado.sujo = true;
      }
    }
    enfileirar();
  });

  // Cada <details> do card entra aqui no useEffect do componente; o retorno desfaz o registro.
  function registrar(elemento, identidade, aoRenderer) {
    if (parado) return () => {};
    const gatilho = elemento.querySelector('summary');
    const canvas = elemento.querySelector('canvas');
    const contexto = canvas.getContext('2d');
    const estado = {
      elemento, gatilho, canvas, contexto, identidade, aoRenderer, renderer: null,
      perto: false, visivel: false, largura: 0, altura: 0, preparando: false, falhou: false, removido: false,
      graficos: null, textura: null, progresso: elemento.open ? 1 : 0, alvo: elemento.open ? 1 : 0,
      de: 0, inicio: 0, duracao: 1, inclinacaoX: 0, inclinacaoY: 0, alvoX: 0, alvoY: 0, sujo: true,
    };
    // Os rótulos "Abrir/Fechar notebook" são do React; aqui o toggle nativo só anima a tampa.
    const alternar = () => {
      avancar(estado, performance.now());
      estado.de = estado.progresso; estado.alvo = elemento.open ? 1 : 0;
      estado.inicio = performance.now(); estado.duracao = Math.max(180, 1000 * Math.abs(estado.alvo - estado.de));
      estado.sujo = true;
      if (estado.perto) preparar(estado);
      enfileirar();
    };
    const ponteiro = evento => {
      if (evento.pointerType !== 'mouse' || rolando || movimentoParado()) return;
      const caixa = gatilho.getBoundingClientRect();
      estado.alvoX = Math.max(-1, Math.min(1, (evento.clientX - caixa.left) / caixa.width * 2 - 1));
      estado.alvoY = Math.max(-1, Math.min(1, (evento.clientY - caixa.top) / caixa.height * 2 - 1));
      estado.sujo = true; enfileirar();
    };
    const sair = () => { estado.alvoX = estado.alvoY = 0; estado.sujo = true; enfileirar(); };
    elemento.addEventListener('toggle', alternar);
    gatilho.addEventListener('pointermove', ponteiro); gatilho.addEventListener('pointerleave', sair);
    estado.descartar = () => {
      if (estado.removido) return;
      estado.removido = true;
      perto.unobserve(gatilho); visivel.unobserve(gatilho); tamanho.unobserve(gatilho);
      elemento.removeEventListener('toggle', alternar); gatilho.removeEventListener('pointermove', ponteiro); gatilho.removeEventListener('pointerleave', sair);
      estado.graficos?.descartar(); estado.textura?.dispose();
      estado.graficos = null; estado.textura = null;
    };
    estados.set(elemento, estado); perto.observe(gatilho); visivel.observe(gatilho); tamanho.observe(gatilho);
    mostrar(estado, indisponivel || !contexto ? 'fallback' : 'pending');
    return () => {
      if (estados.get(elemento) === estado) estados.delete(elemento);
      estado.descartar();
    };
  }

  const mudouMovimento = () => { for (const estado of estados.values()) estado.sujo = true; enfileirar(); };
  const mudancasPagina = new MutationObserver(mudouMovimento);
  if (pagina) mudancasPagina.observe(pagina, { attributes: true, attributeFilter: ['class'] });
  calmo.addEventListener('change', mudouMovimento);
  const rolar = () => {
    if (!rolando) {
      rolando = true;
      cancelAnimationFrame(quadro); quadro = 0;
      for (const estado of estados.values()) estado.alvoX = estado.alvoY = 0;
    }
    clearTimeout(timerRolagem);
    timerRolagem = setTimeout(() => {
      rolando = false;
      retomarEsperas();
      for (const estado of estados.values()) if (estado.perto) preparar(estado);
      enfileirar();
    }, 140);
  };
  const mudouVisibilidade = () => {
    cancelAnimationFrame(quadro); quadro = 0;
    if (!document.hidden) mudouMovimento();
  };
  const escondeuPagina = evento => {
    cancelAnimationFrame(quadro); quadro = 0;
    if (!evento.persisted) destruir();
  };
  window.addEventListener('scroll', rolar, { passive: true });
  document.addEventListener('visibilitychange', mudouVisibilidade);
  window.addEventListener('pageshow', mudouMovimento);
  window.addEventListener('pagehide', escondeuPagina);

  // Idempotente: o Strict Mode do next dev monta, desmonta e monta de novo.
  function destruir() {
    if (parado) return;
    parado = true;
    cancelAnimationFrame(quadro); quadro = 0;
    perto.disconnect(); visivel.disconnect(); tamanho.disconnect(); mudancasPagina.disconnect();
    calmo.removeEventListener('change', mudouMovimento);
    window.removeEventListener('scroll', rolar); clearTimeout(timerRolagem);
    document.removeEventListener('visibilitychange', mudouVisibilidade);
    window.removeEventListener('pageshow', mudouMovimento);
    window.removeEventListener('pagehide', escondeuPagina);
    clearTimeout(timerMotor); limpezaPendente?.(); limpezaPendente = null;
    for (const terminar of [...logosPendentes]) terminar(null);
    for (const [verificar, cancelar] of [...ociosos]) { cancelar(); verificar(); }
    retomarEsperas();
    for (const estado of estados.values()) estado.descartar();
    estados.clear();
    if (motor) {
      descartarModelo(motor.modelo); motor.alvoAmbiente.dispose(); motor.texturaMarca.dispose();
      liberarRenderer(motor.renderer, motor.perdeuContexto, jaPerdeuContexto);
      motor = null;
    }
  }

  return { registrar, destruir };
}
