// Clouds generator module
let gameWorldRef = null;

export function initClouds(gameWorld) {
  gameWorldRef = gameWorld;
  criarNuvensIniciais();
  startCloudGenerator();
}

export function criarNuvensIniciais() {
  if (!gameWorldRef) return;
  const sections = document.querySelectorAll('.section');
  const segundaSection = sections[1];
  const sectionX = segundaSection.offsetLeft + 300;
  for (let i = 0; i < 12; i++) {
    const cloud = document.createElement('div');
    cloud.classList.add('cloud');
    cloud.style.top = `${Math.random() * 100 + 30}px`;
    cloud.style.left = `${sectionX + i * 160}px`;
    cloud.dataset.speed = 0.8;
    const img = document.createElement('img');
    img.src = `https://raw.githubusercontent.com/Saulo-Ferro-Maciel/Apresenta-aoInterativa/main/cloud${Math.floor(Math.random() * 3) + 1}.png`;
    img.style.width = img.style.height = '100%';
    img.style.objectFit = 'contain';
    img.style.opacity = '0.7';
    cloud.appendChild(img);
    gameWorldRef.appendChild(cloud);
  }
}

export function createCloud() {
  if (!gameWorldRef) return;
  const cloud = document.createElement('div');
  cloud.classList.add('cloud');
  cloud.style.top = `${Math.random() * 200 + 50}px`;
  cloud.style.left = `5100px`;
  cloud.dataset.speed = Math.random() * 0.5 + 0.5;
  const img = document.createElement('img');
  img.src = `https://raw.githubusercontent.com/Saulo-Ferro-Maciel/Apresenta-aoInterativa/main/cloud${Math.floor(Math.random() * 3) + 1}.png`;
  img.style.width = img.style.height = '100%';
  img.style.objectFit = 'contain';
  img.style.opacity = '0.7';
  cloud.appendChild(img);
  gameWorldRef.appendChild(cloud);
}

export function updateClouds() {
  document.querySelectorAll('.cloud').forEach(cloud => {
    let x = parseFloat(cloud.style.left);
    x -= parseFloat(cloud.dataset.speed);
    cloud.style.left = `${x}px`;
    if (x < -150) cloud.remove();
  });
}

let _cloudInterval = null;
function startCloudGenerator() {
  if (_cloudInterval) return;
  _cloudInterval = setInterval(() => {
    if (document.querySelectorAll('.cloud').length < 20) createCloud();
  }, 2000);
}
