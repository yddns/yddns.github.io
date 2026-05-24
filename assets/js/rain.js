/**
 * 白色雨特效
 * 在随机风景背景上叠加白色雨滴动画
 */
(function() {
  'use strict';

  const canvas = document.getElementById('rainCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let drops = [];
  let animationId = null;

  // 从全局配置读取雨滴数量
  const DROP_COUNT = (window.siteConfig && window.siteConfig.rain_intensity) || 120;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class RainDrop {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      // 初始时随机分布在屏幕上，后续从顶部落下
      this.y = initial ? Math.random() * height : -30;
      this.speed = 4 + Math.random() * 8;
      this.length = 12 + Math.random() * 25;
      this.opacity = 0.08 + Math.random() * 0.35;
      this.width = 0.6 + Math.random() * 1.8;
      this.angle = (Math.random() - 0.5) * 0.1; // 轻微倾斜
    }

    update() {
      this.y += this.speed;
      this.x += this.angle * this.speed;

      // 超出屏幕底部或两侧太远时重置
      if (this.y > height + 30 || this.x < -50 || this.x > width + 50) {
        this.reset();
      }
    }

    draw() {
      const endX = this.x + this.angle * this.length;
      const endY = this.y + this.length;

      // 雨滴主体
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.lineWidth = this.width;
      ctx.lineCap = 'round';
      ctx.stroke();

      // 雨滴头部高光
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.width * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 1.5})`;
      ctx.fill();
    }
  }

  function initDrops() {
    resize();
    drops = [];
    for (let i = 0; i < DROP_COUNT; i++) {
      drops.push(new RainDrop());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    drops.forEach(drop => {
      drop.update();
      drop.draw();
    });
    animationId = requestAnimationFrame(animate);
  }

  // 背景图管理
  const BackgroundManager = {
    currentIndex: 0,
    images: [],
    preloadCount: 3,

    init() {
      this.bgLayer = document.getElementById('bgLayer');
      if (!this.bgLayer) return;

      // 预加载几张风景图
      for (let i = 0; i < this.preloadCount; i++) {
        this.loadImage(i);
      }

      // 设置初始背景
      this.setBackground(0);

      // 每 45 秒切换一次背景
      setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.preloadCount;
        this.setBackground(this.currentIndex);
      }, 45000);
    },

    loadImage(index) {
      const img = new Image();
      // 使用 picsum.photos 随机风景图（不同 seed 确保不同图片）
      const seed = Date.now() + index * 1000;
      img.src = `https://picsum.photos/seed/${seed}/1920/1080`;
      this.images[index] = img;
    },

    setBackground(index) {
      if (!this.bgLayer) return;
      const seed = Date.now() + index * 9999;
      const url = `https://picsum.photos/seed/${seed}/1920/1080`;

      // 先加载再切换，避免白屏
      const tempImg = new Image();
      tempImg.onload = () => {
        this.bgLayer.style.opacity = '0';
        setTimeout(() => {
          this.bgLayer.style.backgroundImage = `url(${url})`;
          this.bgLayer.style.opacity = '1';
        }, 200);
      };
      tempImg.src = url;
    }
  };

  // 顶栏背景图更新
  function updateHeaderBg() {
    const headerBg = document.getElementById('headerBg');
    if (!headerBg) return;
    const seed = Date.now();
    // 使用轻量级随机图作为顶栏微纹理
    headerBg.style.setProperty('--header-img', `url(https://picsum.photos/seed/${seed}/1920/64)`);
  }

  // 事件监听
  window.addEventListener('resize', resize);

  // 启动
  window.addEventListener('DOMContentLoaded', () => {
    initDrops();
    animate();
    BackgroundManager.init();
    updateHeaderBg();
  });

  // 页面可见性控制（后台暂停动画节省资源）
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animationId) cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
})();
