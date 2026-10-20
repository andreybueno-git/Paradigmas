/**
 * Uma instância pequena e articulada do notebook Vereda, do autor (porte de notebooks/notebook-scene.js).
 * O controlador é dono do renderer, das geometrias do modelo-base, do ambiente e das texturas de logo.
 * Cada instância é dona do próprio material da tela, do logo da tampa e da sombra de contato.
 * Recebe o THREE já importado: este módulo não importa nada e não roda nada ao ser carregado.
 */
const enquadramentoPorModelo = new WeakMap();

export function criarCenaNotebook(THREE, cenaModeloGLTF, ambiente, texturaTela, texturaMarca = null) {
  const scene = new THREE.Scene();
  scene.environment = ambiente || null;
  scene.environmentIntensity = 0.8;

  const camera = new THREE.OrthographicCamera(-0.25, 0.25, 0.2, -0.2, 0.01, 4);
  const pivo = new THREE.Group();
  scene.add(pivo);

  const modelo = cenaModeloGLTF.clone(true);
  const notebook = modelo.getObjectByName('Notebook');
  const tampa = modelo.getObjectByName('Notebook_Lid');
  const tela = modelo.getObjectByName('Notebook_Screen');
  if (!notebook || !tampa || !tela) {
    throw new Error('O modelo do notebook não contém a tampa e a tela esperadas.');
  }
  pivo.add(modelo);
  const emblema = modelo.getObjectByName('Notebook_BackEmblem');
  if (emblema) emblema.visible = false;

  // A face externa da tampa no GLB é a face -Z local, em -0,0045 m. O logo de verdade fica preso
  // à dobradiça, logo acima dessa superfície de metal.
  const geometriaLogoTampa = texturaMarca ? new THREE.PlaneGeometry(0.13, 0.13 * 706 / 2049) : null;
  const materialLogoTampa = texturaMarca ? new THREE.MeshBasicMaterial({
    map: texturaMarca,
    transparent: true,
    alphaTest: 0.01,
    depthWrite: false,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
    side: THREE.FrontSide
  }) : null;
  if (texturaMarca) {
    const logoTampa = new THREE.Mesh(geometriaLogoTampa, materialLogoTampa);
    logoTampa.name = 'FlashClip_LidLogo';
    logoTampa.position.set(0, 0.113, -0.0047);
    // Uma imagem do TextureLoader mantém flipY=true. Este giro deixa o logo virado para fora, com o
    // texto da esquerda para a direita e o topo na direção da dobradiça quando fechado; com a tela
    // aberta ele fica escondido atrás dela, como deve.
    logoTampa.rotation.x = Math.PI;
    tampa.add(logoTampa);
  }

  // A textura continua sendo do controlador, para o filtro poder ser reaproveitado.
  const materialTela = new THREE.MeshBasicMaterial({
    map: texturaTela,
    color: 0x000000,
    toneMapped: false,
    side: THREE.FrontSide
  });
  tela.material = materialTela;

  scene.add(new THREE.HemisphereLight(0xfff3de, 0x21413c, 2.4));
  const principal = new THREE.DirectionalLight(0xffefd2, 3.4);
  principal.position.set(-0.5, 0.9, 0.75);
  scene.add(principal);
  const contorno = new THREE.DirectionalLight(0xb9dbdb, 2.1);
  contorno.position.set(0.7, 0.55, -0.6);
  scene.add(contorno);
  const preenchimento = new THREE.DirectionalLight(0xe6d6ae, 0.65);
  preenchimento.position.set(0.6, 0.18, 0.5);
  scene.add(preenchimento);

  // Uma sombra de textura dispensa shadow map por card e contexto WebGL extra.
  const canvasSombra = document.createElement('canvas');
  canvasSombra.width = canvasSombra.height = 128;
  const contexto = canvasSombra.getContext('2d');
  const gradiente = contexto.createRadialGradient(64, 64, 6, 64, 64, 62);
  gradiente.addColorStop(0, 'rgba(0, 8, 7, 0.46)');
  gradiente.addColorStop(0.45, 'rgba(0, 8, 7, 0.25)');
  gradiente.addColorStop(1, 'rgba(0, 8, 7, 0)');
  contexto.fillStyle = gradiente;
  contexto.fillRect(0, 0, 128, 128);
  const texturaSombra = new THREE.CanvasTexture(canvasSombra);
  const geometriaSombra = new THREE.PlaneGeometry(0.46, 0.34);
  const materialSombra = new THREE.MeshBasicMaterial({
    map: texturaSombra,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    opacity: 0.8
  });
  const sombra = new THREE.Mesh(geometriaSombra, materialSombra);
  sombra.rotation.x = -Math.PI / 2;
  sombra.position.set(0, -0.003, 0.004);
  scene.add(sombra);

  const limitar = valor => Math.max(0, Math.min(1, Number(valor) || 0));
  const limitarInclinacao = valor => Math.max(-1, Math.min(1, Number(valor) || 0));
  const anguloFechado = Math.PI / 2;
  const anguloAberto = -0.20943951;
  const giroBase = -0.035;
  let descartada = false;

  function abrir(progresso) {
    const quanto = limitar(progresso);
    tampa.rotation.x = anguloFechado + (anguloAberto - anguloFechado) * quanto;
    // A leve elevação impede a tela fechada de atravessar as teclas.
    tampa.position.y = 0.025 + 0.0085 * (1 - quanto);
  }

  function inclinar(x = 0, y = 0) {
    // As entradas são coordenadas normalizadas do ponteiro, não ângulos de Euler.
    pivo.rotation.set(-limitarInclinacao(y) * 0.035, giroBase + limitarInclinacao(x) * 0.09, 0);
  }

  function acenderTela(progresso) {
    // Sai do preto puro; a tela continua opaca para a moldura ficar sólida.
    materialTela.color.setScalar(limitar(progresso));
  }

  // Todos os cards usam o mesmo modelo. O enquadramento de todas as posições da tampa e da inclinação
  // é calculado só na primeira instância e reaproveitado depois, sem guardar aquela cena.
  // O renderer propaga as transformações de cada quadro na atualização normal.
  let enquadramento = enquadramentoPorModelo.get(cenaModeloGLTF);
  let limites;
  if (!enquadramento) {
    limites = new THREE.Box3();
    const limitesPose = new THREE.Box3();
    for (const abertura of [0, 0.25, 0.5, 0.75, 1]) {
      abrir(abertura);
      for (const [x, y] of [[0, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]]) {
        inclinar(x, y);
        pivo.updateMatrixWorld(true);
        limites.union(limitesPose.setFromObject(pivo));
      }
    }
  }
  abrir(0);
  inclinar(0, 0);
  acenderTela(0);

  const alvo = enquadramento ? new THREE.Vector3(...enquadramento.alvo) : limites.getCenter(new THREE.Vector3());
  const direcaoVista = new THREE.Vector3(0.35, 0.29, 0.84).normalize();
  camera.position.copy(alvo).add(direcaoVista);
  camera.lookAt(alvo);
  camera.updateMatrixWorld(true);

  if (!enquadramento) {
    const projetado = new THREE.Box3();
    for (const x of [limites.min.x, limites.max.x]) {
      for (const y of [limites.min.y, limites.max.y]) {
        for (const z of [limites.min.z, limites.max.z]) {
          projetado.expandByPoint(new THREE.Vector3(x, y, z).applyMatrix4(camera.matrixWorldInverse));
        }
      }
    }
    enquadramento = {
      alvo: alvo.toArray(),
      larguraConteudo: projetado.max.x - projetado.min.x,
      alturaConteudo: projetado.max.y - projetado.min.y
    };
    enquadramentoPorModelo.set(cenaModeloGLTF, enquadramento);
  }
  const { larguraConteudo, alturaConteudo } = enquadramento;

  function redimensionar(largura, altura) {
    const proporcao = Math.max(1, largura || 1) / Math.max(1, altura || 1);
    const vao = Math.max(alturaConteudo, larguraConteudo / proporcao) * 1.12;
    camera.left = -vao * proporcao / 2;
    camera.right = vao * proporcao / 2;
    camera.top = vao / 2;
    camera.bottom = -vao / 2;
    camera.updateProjectionMatrix();
  }
  redimensionar(400, 240);

  function descartar() {
    if (descartada) return;
    descartada = true;
    materialTela.dispose();
    geometriaLogoTampa?.dispose();
    materialLogoTampa?.dispose();
    materialSombra.dispose();
    geometriaSombra.dispose();
    texturaSombra.dispose();
    scene.clear();
    // O GLB compartilhado, o ambiente e as texturas de logo recebidas não são descartados aqui.
  }

  return { scene, camera, pivo, tampa, tela, abrir, inclinar, acenderTela, redimensionar, descartar };
}
