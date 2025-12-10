import { Player } from './player.js';
import { gerarDotsPorCamada, criarPlataformas, desenharPlataformas } from './ground.js';
import { estrelas, desenharEstrelas } from './stars.js';
import { initClouds, updateClouds } from './clouds.js';
import { initBirds, updateBirds } from './birds.js';

// Elementos do DOM
const playerElement = document.getElementById('player');
const gameWorld = document.getElementById('gameWorld');
const bg = document.getElementById('bg');
const mg = document.getElementById('mg');
const ground = document.querySelector('.ground');

// Cria o player (elefante)
const player = new Player(playerElement);

// Posição inicial do elefante (ajuste se precisar)
player.x = 430;
player.y = 600;  // quanto maior, mais alto ele começa

// Configurações do jogo
const speed = 6;
const worldWidth = gameWorld.offsetWidth;
const viewportWidth = window.innerWidth;
let cameraX = 0;

// Plataformas e chão
const groundRect = ground.getBoundingClientRect();
const groundHeight = groundRect.height;
let plataformas = criarPlataformas(worldWidth, groundHeight);

// Dots decorativos no chão
gerarDotsPorCamada(document.querySelector('.dirt-layer.top'),    ['#8d6e63', '#795548', '#6d4c41'], 105);
gerarDotsPorCamada(document.querySelector('.dirt-layer.middle'), ['#6d4c41', '#5d4037', '#4e342e'], 110);
gerarDotsPorCamada(document.querySelector('.dirt-layer.bottom'), ['#4e342e', '#3e2723', '#2e1f1b'], 115);

// Controle de teclas (sem bagunçar o CSS do elefante!)
const keys = {};

document.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  keys[k] = true;

  if (k === 'arrowright' || k === 'd') player.moveRight(speed);
  if (k === 'arrowleft'  || k === 'a') player.moveLeft(speed);
  if ((k === 'arrowup' || k === 'w' || k === ' ') && player.jumpCount < player.maxJumps) {
    player.jump();
    e.preventDefault(); // evita scroll da página com espaço
  }
});

document.addEventListener('keyup', (e) => {
  const k = e.key.toLowerCase();
  keys[k] = false;

  // Só para o movimento quando NENHUMA tecla horizontal estiver pressionada
  if (['arrowright', 'd', 'arrowleft', 'a'].includes(k)) {
    if (!keys.arrowright && !keys.d && !keys.arrowleft && !keys.a) {
      player.stop();
    }
  }
});

// clouds and birds moved to their own modules (clouds.js / birds.js)

// Colisão com estrelas (mantido igual)
function checarColisaoEstrela() {
  estrelas.forEach(e => {
    if (!e.coletada &&
          player.x + 120 > e.x && player.x < e.x + 40 &&
          player.y + 100 > e.y && player.y < e.y + 40) {
      e.coletada = true;

        const plataformasDoGrupo = Array.from(document.querySelectorAll(`.platform[data-grupo="${e.grupo}"]`));

      plataformasDoGrupo.forEach((platformDiv, i) => {
        setTimeout(() => {
          platformDiv.classList.add('tremor');
          setTimeout(() => platformDiv.classList.add('caindo'), 500);
          setTimeout(() => platformDiv.remove(), 1200);
        }, i * 300);
      });

      plataformas.forEach(p => { if (p.grupo === e.grupo) p.visivel = false; });

      const proximoGrupo = String.fromCharCode(e.grupo.charCodeAt(0) + 1);
      plataformas.forEach(p => { if (p.grupo === proximoGrupo) p.visivel = true; });

      // Expande a seção correspondente para revelar imagem e texto
      const sec = document.querySelector(`.section[data-grupo="${e.grupo}"]`);
      if (sec) {
        // fecha outras seções
        document.querySelectorAll('.section').forEach(s => s.classList.remove('expandida'));
        sec.classList.add('expandida');
      }

      setTimeout(() => desenharPlataformas(gameWorld, plataformas, gerarDotsPorCamada), 1300 + plataformasDoGrupo.length * 300);
      desenharEstrelas(gameWorld);
    }
  });
}

// Loop principal do jogo
function update() {
  player.update(worldWidth);

  // Colisão com plataformas
  plataformas.forEach(p => {
    if (!p.visivel) return;
    const playerLeft = player.x;
    const playerRight = player.x + 120;  // largura do elefante (coincide com player.js)
    const playerBottom = player.y;
    const playerPrevBottom = player.y - player.vy;

    if (player.vy <= 0 &&
        playerRight > p.x &&
        playerLeft < p.x + p.width &&
        playerPrevBottom >= p.y + p.height &&
        playerBottom <= p.y + p.height) {
      // Ajusta a posição final do jogador para aproximar os pés da plataforma
      // Usa `player.feetOffset` (se definido) para abaixar o sprite visualmente
      const offset = (player.feetOffset) ? player.feetOffset : 0;
      player.y = p.y + p.height + offset;
      player.vy = 0;
      player.jumpCount = 0;
    }
  });

  // Câmera suave seguindo o player
  const targetCameraX = Math.max(0, Math.min(player.x - viewportWidth / 2, worldWidth - viewportWidth));
  cameraX += (targetCameraX - cameraX) * 0.1;

  gameWorld.style.left = `-${cameraX}px`;
  bg.style.left = `-${cameraX * 0.5}px`;
  mg.style.left = `-${cameraX * 0.6}px`;
  ground.style.transform = `translateX(${-cameraX * 0.3}px)`;

  updateClouds();
  updateBirds();
  checarColisaoEstrela();

  requestAnimationFrame(update);
}

// Inicia tudo
initClouds(gameWorld);
initBirds(gameWorld);
desenharPlataformas(gameWorld, plataformas, gerarDotsPorCamada);
desenharEstrelas(gameWorld);
update();
