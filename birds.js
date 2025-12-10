// Birds generator module
let gameWorldRef = null;

export function initBirds(gameWorld) {
  gameWorldRef = gameWorld;
  criarPassarosIniciais();
  startBirdGenerator();
}

export function criarPassarosIniciais() {
  if (!gameWorldRef) return;
  const sections = document.querySelectorAll('.section');
  const segundaSection = sections[1];
  const sectionX = segundaSection.offsetLeft + 300;
  for (let i = 0; i < 8; i++) {
    const bird = document.createElement('div');
    bird.classList.add('bird');
    bird.style.top = `${Math.random() * 150 + 50}px`;
    bird.style.left = `${sectionX + i * 200}px`;
    bird.dataset.speed = Math.random() * 0.5 + 0.5;
    bird.dataset.frame = 1;
    bird.style.transform = 'scaleX(-1)';
    const img = document.createElement('img');
    img.src = 'passaro-voando-1.png';
    img.style.width = img.style.height = '100%';
    img.style.objectFit = 'contain';
    bird.appendChild(img);
    gameWorldRef.appendChild(bird);
  }
}

export function createBirdTrio() {
  if (!gameWorldRef) return;
  const speeds = [0.4, 0.6, 0.8];
  speeds.forEach(speed => {
    const bird = document.createElement('div');
    bird.classList.add('bird');
    bird.style.top = `${Math.random() * 150 + 50}px`;
    bird.style.left = `5100px`;
    bird.dataset.speed = speed;
    bird.dataset.frame = 1;
    bird.style.transform = 'scaleX(-1)';
    const img = document.createElement('img');
    img.src = 'passaro-voando-1.png';
    img.style.width = img.style.height = '100%';
    img.style.objectFit = 'contain';
    bird.appendChild(img);
    gameWorldRef.appendChild(bird);
  });
}

export function updateBirds() {
  document.querySelectorAll('.bird').forEach(bird => {
    let x = parseFloat(bird.style.left);
    x -= parseFloat(bird.dataset.speed);
    bird.style.left = `${x}px`;
    if (x < -100) bird.remove();
    // Moderately slow animation
    bird.dataset.animFrame = (parseInt(bird.dataset.animFrame || 0) + 1) % 24;
    const img = bird.querySelector('img');
    if (img) {
      img.src = bird.dataset.animFrame < 12 ? 'passaro-voando-1.png' : 'passaro-voando-2.png';
    }
  });
}

let _birdInterval = null;
function startBirdGenerator() {
  if (_birdInterval) return;
  _birdInterval = setInterval(() => {
    if (document.querySelectorAll('.bird').length < 15) createBirdTrio();
  }, 2000);
}
