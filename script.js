// Text rotation effect for hero subtitle
class TxtRotate {
  constructor(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
  }
  
  tick() {
    const i = this.loopNum % this.toRotate.length;
    const fullTxt = this.toRotate[i];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

    let delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }

    setTimeout(() => {
      this.tick();
    }, delta);
  }
}

// Navbar scroll effect
function handleScroll() {
  const navbar = document.querySelector('.navbar');
  const backToTop = document.getElementById('back-to-top');
  
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  // Show back-to-top button after scrolling down 300px
  if (window.scrollY > 300) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

// Handle back to top button click
function setupBackToTop() {
  const backToTop = document.getElementById('back-to-top');
  
  if (backToTop) {
    backToTop.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Mobile menu toggle
function setupMobileMenu() {
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('open');
      navLinks.classList.toggle('active');
    });
    
    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('open');
        navLinks.classList.remove('active');
      });
    });
  }
}

// Create animated gradient mesh background
class GradientAnimation {
  constructor() {
    this.canvas = document.getElementById('gradient-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.colors = [
      { r: 14, g: 22, b: 41 },  // Dark blue (background)
      { r: 94, g: 234, b: 212 }, // Teal (accent-primary)
      { r: 139, g: 92, b: 246 }, // Purple (accent-secondary)
      { r: 45, g: 212, b: 191 }  // Darker teal (accent-tertiary)
    ];
    this.points = [];
    this.triangles = [];
    this.mouse = { x: 0, y: 0 };
    this.isRunning = true;
    
    this.init();
  }
  
  init() {
    this.resize();
    this.createPoints();
    this.triangulate();
    this.setupEvents();
    this.render();
  }
  
  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  
  createPoints() {
    // Create a grid of points
    const gridSize = Math.max(12, Math.floor(this.width / 100));
    const cellWidth = this.width / gridSize;
    const cellHeight = this.height / gridSize;
    
    // Create points with some randomness
    for (let y = 0; y <= gridSize; y++) {
      for (let x = 0; x <= gridSize; x++) {
        const randomX = x === 0 || x === gridSize ? 0 : (Math.random() - 0.5) * cellWidth * 0.5;
        const randomY = y === 0 || y === gridSize ? 0 : (Math.random() - 0.5) * cellHeight * 0.5;
        
        this.points.push({
          x: x * cellWidth + randomX,
          y: y * cellHeight + randomY,
          originX: x * cellWidth,
          originY: y * cellHeight,
          color: this.getRandomColor(),
          velocity: { x: Math.random() * 0.2 - 0.1, y: Math.random() * 0.2 - 0.1 }
        });
      }
    }
  }
  
  triangulate() {
    // Create triangles by connecting points
    const gridSize = Math.sqrt(this.points.length) - 1;
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const i = y * (gridSize + 1) + x;
        
        // Create two triangles for each cell
        this.triangles.push([
          this.points[i],
          this.points[i + 1],
          this.points[i + gridSize + 1]
        ]);
        
        this.triangles.push([
          this.points[i + 1],
          this.points[i + gridSize + 1],
          this.points[i + gridSize + 2]
        ]);
      }
    }
  }
  
  getRandomColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }
  
  setupEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.points = [];
      this.triangles = [];
      this.createPoints();
      this.triangulate();
    });
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    
    // Pause animation when tab is not visible to save resources
    document.addEventListener('visibilitychange', () => {
      this.isRunning = document.visibilityState === 'visible';
      if (this.isRunning) this.render();
    });
  }
  
  updatePoints() {
    this.points.forEach(point => {
      // Subtle animation
      point.x += point.velocity.x;
      point.y += point.velocity.y;
      
      // Keep points within bounds and bounce
      if (point.x < 0 || point.x > this.width) {
        point.velocity.x *= -1;
      }
      
      if (point.y < 0 || point.y > this.height) {
        point.velocity.y *= -1;
      }
      
      // Subtle mouse interaction - points move away from mouse
      const dx = this.mouse.x - point.x;
      const dy = this.mouse.y - point.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 200) {
        const force = (200 - distance) / 5000;
        point.x -= dx * force;
        point.y -= dy * force;
      }
      
      // Gently attract points back to their original positions
      point.x += (point.originX - point.x) * 0.01;
      point.y += (point.originY - point.y) * 0.01;
    });
  }
  
  drawTriangles() {
    this.triangles.forEach(triangle => {
      const [p1, p2, p3] = triangle;
      
      // Calculate the center of the triangle for gradient
      const centerX = (p1.x + p2.x + p3.x) / 3;
      const centerY = (p1.y + p2.y + p3.y) / 3;
      
      // Create gradient
      const gradient = this.ctx.createLinearGradient(p1.x, p1.y, p3.x, p3.y);
      gradient.addColorStop(0, `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, 0.3)`);
      gradient.addColorStop(1, `rgba(${p3.color.r}, ${p3.color.g}, ${p3.color.b}, 0.3)`);
      
      // Draw triangle
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.lineTo(p3.x, p3.y);
      this.ctx.closePath();
      
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      
      // Optional: Draw subtle edges
      this.ctx.strokeStyle = `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, 0.1)`;
      this.ctx.lineWidth = 0.5;
      this.ctx.stroke();
    });
  }
  
  render() {
    if (!this.isRunning) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Update point positions
    this.updatePoints();
    
    // Draw triangles
    this.drawTriangles();
    
    // Request next frame
    requestAnimationFrame(() => this.render());
  }
}

// Initialize all animations and interactions
document.addEventListener('DOMContentLoaded', function() {
  // Text rotation
  const elements = document.getElementsByClassName('txt-rotate');
  for (let i = 0; i < elements.length; i++) {
    const toRotate = elements[i].getAttribute('data-rotate');
    const period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
  
  // CSS injection for text rotation cursor
  const css = document.createElement('style');
  css.innerHTML = '.txt-rotate > .wrap { border-right: 0.08em solid var(--accent-primary); padding-right: 5px; }';
  document.body.appendChild(css);
  
  // Setup mobile menu toggle
  setupMobileMenu();
  
  // Initialize gradient background
  new GradientAnimation();
  
  // Scroll effect for navbar
  window.addEventListener('scroll', handleScroll);
  
  // Setup back-to-top button
  setupBackToTop();
  
  // Handle smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });
}); 