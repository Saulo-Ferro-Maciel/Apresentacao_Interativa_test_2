export class Player {
  constructor(element) {
    this.el = element;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.gravity = -1;
    this.jumpStrength = 20;
    this.maxJumps = 2;
    this.jumpCount = 0;
    this.groundY = 0;
    
    // Base visual do bottom (em px) usado ao posicionar o elemento
    // O script principal pode sobrescrever esse valor com a altura real do ground
    this.baseBottom = 150;
    // Ajuste fino para reduzir o vão entre os pés do sprite e as plataformas
    this.feetOffset = 0;

    // Animação
    this.isWalking = false;
    this.facingRight = true;
    this.currentFrame = 0;
    this.animationInterval = null;

    this.setupVisual();
    this.setPosition(this.x, this.y);
  }

  setupVisual() {
    // Limpa qualquer coisa da bola antiga
    this.el.textContent = "";
    this.el.style.background = "transparent";
    this.el.style.borderRadius = "0";
    this.el.style.overflow = "hidden";

    // Tamanho do elefante
    this.el.style.width = "120px";   // aumentei um pouco, fica mais visível
    this.el.style.height = "100px";
    this.el.style.backgroundSize = "contain";
    this.el.style.backgroundRepeat = "no-repeat";
    // Ancorar a imagem ao fundo para que os pés do sprite coincidam com o bottom do elemento
    this.el.style.backgroundPosition = "bottom center";
    this.el.style.position = "absolute";
    this.el.style.left = "0px";
    this.el.style.bottom = `${this.baseBottom + this.y - this.feetOffset}px`;   // posição inicial (vai ser sobrescrita)
    this.el.style.pointerEvents = "none";
    this.el.style.zIndex = "15";
    this.el.style.userSelect = "none";

    // Imagem inicial (sentado/parado)
    this.setFrame('sit');
  }

  setFrame(frame) {
    this.currentFrame = frame;

    // Caminhos das imagens (relativos à pasta do projeto)
    const imgWalk1 = "elefante-andando-1.png";
    const imgWalk2 = "elefante-andando-2.png";
    const imgSit = "elefante-sentado.png";

    let url = imgWalk1;
    if (frame === 1) url = imgWalk2;
    if (frame === 'sit') url = imgSit;

    this.el.style.backgroundImage = `url("${url}")`;

    // Vira o elefante para esquerda/direita
    this.el.style.transform = this.facingRight ? "scaleX(1)" : "scaleX(-1)";
  }

  startWalkingAnimation() {
    if (this.animationInterval) return;

    this.isWalking = true;
    // Se havia timeout para sentar, cancelar para continuar andando
    if (this.sitTimeout) { clearTimeout(this.sitTimeout); this.sitTimeout = null; }
    this.animationInterval = setInterval(() => {
      if (this.isWalking) {
        this.setFrame(this.currentFrame === 0 ? 1 : 0);
      }
    }, 160); // velocidade boa da pata
  }

  stopWalkingAnimation() {
    this.isWalking = false;
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
    // Aguarda 100ms antes de usar frame sentado (permite transições rápidas)
    if (this.sitTimeout) clearTimeout(this.sitTimeout);
    this.sitTimeout = setTimeout(() => {
      this.setFrame('sit'); // usa frame sentado quando parado
      this.sitTimeout = null;
    }, 350);
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.el.style.left = `${x}px`;
    this.el.style.bottom = `${this.baseBottom + y - this.feetOffset}px`;
  }

  update(worldWidth) {
    this.x += this.vx;
    this.vy += this.gravity;
    this.y += this.vy;

    // Limites da tela
    if (this.x < 0) this.x = 0;
    if (this.x > worldWidth - 120) this.x = worldWidth - 120;

    // Chão principal
    if (this.y <= this.groundY) {
      this.y = this.groundY;
      this.vy = 0;
      this.jumpCount = 0;
    }

    this.setPosition(this.x, this.y);
  }

  jump() {
    if (this.jumpCount < this.maxJumps) {
      this.vy = this.jumpStrength;
      this.jumpCount++;
      this.stopWalkingAnimation(); // não anima caminhada no ar
      // sentar com pequeno atraso para suavizar (100ms)
      if (this.sitTimeout) clearTimeout(this.sitTimeout);
      this.sitTimeout = setTimeout(() => { this.setFrame('sit'); this.sitTimeout = null; }, 300);
    }
  }

  moveLeft(speed) {
    this.vx = -speed;
    this.facingRight = false;
    this.startWalkingAnimation();
  }

  moveRight(speed) {
    this.vx = speed;
    this.facingRight = true;
    this.startWalkingAnimation();
  }

  stop() {
    this.vx = 0;
    this.stopWalkingAnimation();
  }
}