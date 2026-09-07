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

  function initMusicPlayer() {
    const audio = document.getElementById('musicAudio');
    const toggle = document.getElementById('musicToggle');
    const progress = document.getElementById('musicProgress');
    const time = document.getElementById('musicTime');
    const player = document.querySelector('.music-player');
    if (!audio || !toggle || !progress || !time || !player) return;

    const formatTime = seconds => {
      if (!Number.isFinite(seconds)) return '0:00';
      const minutes = Math.floor(seconds / 60);
      const remainder = Math.floor(seconds % 60).toString().padStart(2, '0');
      return `${minutes}:${remainder}`;
    };

    const updateButton = () => {
      const playing = !audio.paused;
      toggle.setAttribute('aria-label', playing ? '停止音乐' : '播放音乐');
      toggle.title = playing ? '停止音乐' : '播放音乐';
      toggle.querySelector('.player-icon').textContent = playing ? '❚❚' : '▶';
      player.classList.toggle('is-playing', playing);
    };

    toggle.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch(() => updateButton());
      } else {
        audio.pause();
      }
    });

    audio.addEventListener('loadedmetadata', () => {
      progress.max = audio.duration;
      time.textContent = `0:00 / ${formatTime(audio.duration)}`;
    });

    audio.addEventListener('timeupdate', () => {
      progress.value = audio.currentTime;
      time.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    });

    audio.addEventListener('play', updateButton);
    audio.addEventListener('pause', updateButton);
    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      updateButton();
    });
    progress.addEventListener('input', () => {
      audio.currentTime = Number(progress.value);
    });
    updateButton();
  }

  function initInteractiveButtons() {
    document.querySelectorAll('.interactive-button, .main-nav a, .post-link').forEach(element => {
      element.addEventListener('pointermove', event => {
        const bounds = element.getBoundingClientRect();
        element.style.setProperty('--mx', `${event.clientX - bounds.left}px`);
        element.style.setProperty('--my', `${event.clientY - bounds.top}px`);
      });
    });
  }

  async function navigateWithoutReload(url, replace = false) {
    const response = await fetch(url, { headers: { 'X-Requested-With': 'fetch' } });
    if (!response.ok) throw new Error(`Navigation failed: ${response.status}`);

    const page = new DOMParser().parseFromString(await response.text(), 'text/html');
    const nextContent = page.querySelector('.page-content');
    const currentContent = document.querySelector('.page-content');
    if (!nextContent || !currentContent) throw new Error('Page content not found');

    currentContent.replaceWith(nextContent);
    document.title = page.title;
    if (replace) {
      history.replaceState({}, '', url);
    } else {
      history.pushState({}, '', url);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function initPersistentNavigation() {
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href]');
      if (!link || event.defaultPrevented || event.button !== 0) return;
      if (link.target === '_blank' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.hash) return;

      event.preventDefault();
      navigateWithoutReload(url.href).catch(() => {
        window.location.href = url.href;
      });
    });

    window.addEventListener('popstate', () => {
      navigateWithoutReload(window.location.href, true).catch(() => {
        window.location.reload();
      });
    });
  }

  // 事件监听
  window.addEventListener('resize', resize);

  // 启动
  window.addEventListener('DOMContentLoaded', () => {
    initDrops();
    animate();
    initMusicPlayer();
    initInteractiveButtons();
    initPersistentNavigation();
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
