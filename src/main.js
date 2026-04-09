import './style.css'
import './cart-and-product.css'

// 1. Sticky Header
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    if(header) header.classList.add('scrolled');
  } else {
    if(header) header.classList.remove('scrolled');
  }
});

// 2. Intersection Observer for Scroll Animations (Fade-up)
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

const fadeElements = document.querySelectorAll('.fade-up');
fadeElements.forEach(el => observer.observe(el));

// 3. Parallax Effect for Hero Image
const heroImage = document.querySelector('.hero-image-wrapper img');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  if (heroImage) {
    heroImage.style.transform = `translateY(${scrolled * 0.1}px) scale(1.05)`;
  }
});

// ==== E-COMMERCE CART LOGIC ====
let cart = JSON.parse(localStorage.getItem('nuage_cart')) || [];

const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');
const cartToggle = document.getElementById('cartToggle');
const closeCartBtn = document.getElementById('closeCart');
const cartBadge = document.getElementById('cartBadge');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalPrice = document.getElementById('cartTotalPrice');

// UI Elements & State
function saveCart() {
  localStorage.setItem('nuage_cart', JSON.stringify(cart));
}

function renderCart() {
  if(!cartItemsContainer) return;
  cartItemsContainer.innerHTML = '';
  
  let total = 0;
  let totalItems = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="empty-cart-msg">장바구니가 비어있습니다.</div>';
    cartTotalPrice.innerHTML = `₩ 0`;
    cartBadge.innerText = '0';
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    totalItems += item.quantity;

    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">₩ ${item.price.toLocaleString()}</div>
        <div class="cart-qty-ctrl">
          <button onclick="changeQty(${index}, -1)">-</button>
          <input type="text" value="${item.quantity}" readonly>
          <button onclick="changeQty(${index}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeCartItem(${index})">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
      </button>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  cartTotalPrice.innerHTML = `₩ ${total.toLocaleString()}`;
  cartBadge.innerText = totalItems.toString();
}

function openCart() {
  if(cartSidebar) cartSidebar.classList.add('active');
  if(cartOverlay) cartOverlay.classList.add('active');
  renderCart();
}

function closeCart() {
  if(cartSidebar) cartSidebar.classList.remove('active');
  if(cartOverlay) cartOverlay.classList.remove('active');
}

// Ensure global access for element inline onclick handlers in renderCart
window.changeQty = (index, delta) => {
  if (cart[index].quantity + delta > 0) {
    cart[index].quantity += delta;
  } else {
    cart.splice(index, 1);
  }
  saveCart();
  renderCart();
};

window.removeCartItem = (index) => {
  cart.splice(index, 1);
  saveCart();
  renderCart();
};

function addToCart(id, name, price, img, quantity = 1) {
  const existingIndex = cart.findIndex(item => item.id === id);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ id, name, price, img, quantity });
  }
  
  saveCart();
  renderCart();
  openCart();
  
  // Badge bump animation
  if(cartBadge) {
    cartBadge.classList.add('bump');
    setTimeout(() => cartBadge.classList.remove('bump'), 300);
  }
}

// Init Event Listeners
if (cartToggle) cartToggle.addEventListener('click', openCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

// "Add to cart" buttons on Homepage
const addButtons = document.querySelectorAll('.add-to-cart, .add-to-cart-large');
addButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    const id = btn.getAttribute('data-id');
    const name = btn.getAttribute('data-name');
    const price = parseInt(btn.getAttribute('data-price'));
    const img = btn.getAttribute('data-img');
    
    // Check if there is a quantity input associated
    let qty = 1;
    const qtyInput = document.getElementById('qtyInput');
    if(qtyInput && btn.classList.contains('add-to-cart-large')) {
       qty = parseInt(qtyInput.value) || 1;
    }
    
    addToCart(id, name, price, img, qty);
  });
});

// Init on load
renderCart();

// PDP Specific Quantity Selector
const qtyMinus = document.getElementById('qtyMinus');
const qtyPlus = document.getElementById('qtyPlus');
const qtyInput = document.getElementById('qtyInput');

if (qtyMinus && qtyPlus && qtyInput) {
  qtyMinus.addEventListener('click', () => {
    let val = parseInt(qtyInput.value);
    if (val > 1) qtyInput.value = val - 1;
  });
  qtyPlus.addEventListener('click', () => {
    let val = parseInt(qtyInput.value);
    if (val < 10) qtyInput.value = val + 1;
  });
}

// ============ ENHANCEMENT FEATURES ============

// --- Toast Notification System ---
function showToast(title, desc = '', icon = '✓') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      ${desc ? `<div class="toast-desc">${desc}</div>` : ''}
    </div>
    <div class="toast-progress"></div>
  `;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// --- Fly-To Cart Animation ---
function flyToCart(imgElement) {
  const cartIcon = document.getElementById('cartToggle');
  if (!imgElement || !cartIcon) return;

  const imgRect = imgElement.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  const flyEl = document.createElement('img');
  flyEl.src = imgElement.src;
  flyEl.className = 'fly-to-cart';
  flyEl.style.left = imgRect.left + 'px';
  flyEl.style.top = imgRect.top + 'px';
  flyEl.style.width = Math.min(imgRect.width, 120) + 'px';
  flyEl.style.height = Math.min(imgRect.height, 120) + 'px';
  document.body.appendChild(flyEl);

  requestAnimationFrame(() => {
    flyEl.style.left = (cartRect.left + cartRect.width / 2 - 15) + 'px';
    flyEl.style.top = (cartRect.top + cartRect.height / 2 - 15) + 'px';
    flyEl.style.width = '30px';
    flyEl.style.height = '30px';
    flyEl.style.opacity = '0.2';
    flyEl.style.borderRadius = '50%';
  });

  setTimeout(() => {
    flyEl.remove();
    cartIcon.classList.add('cart-bounce');
    setTimeout(() => cartIcon.classList.remove('cart-bounce'), 500);
  }, 650);
}

// Override addToCart to include fly-to animation and toast
const originalAddToCart = addToCart;
window._addToCartWithEffects = function(id, name, price, img, quantity, triggerEl) {
  // Find the image for fly animation
  let imgEl = null;
  if (triggerEl) {
    const card = triggerEl.closest('.product-card') || triggerEl.closest('.quickview-modal');
    if (card) imgEl = card.querySelector('img');
  }
  if (imgEl) flyToCart(imgEl);

  // Add to cart (but don't auto-open sidebar, show toast instead)
  const existingIndex = cart.findIndex(item => item.id === id);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ id, name, price, img, quantity });
  }
  saveCart();
  renderCart();

  if(cartBadge) {
    cartBadge.classList.add('bump');
    setTimeout(() => cartBadge.classList.remove('bump'), 300);
  }

  showToast('장바구니에 추가되었습니다', name, '🛒');
};

// Re-bind add-to-cart buttons to use new effects
document.querySelectorAll('.add-to-cart').forEach(btn => {
  // Remove old listeners by cloning
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  newBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const id = newBtn.getAttribute('data-id');
    const name = newBtn.getAttribute('data-name');
    const price = parseInt(newBtn.getAttribute('data-price'));
    const img = newBtn.getAttribute('data-img');
    window._addToCartWithEffects(id, name, price, img, 1, newBtn);
  });
});

// Also re-bind large add-to-cart (PDP)
document.querySelectorAll('.add-to-cart-large').forEach(btn => {
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  newBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const id = newBtn.getAttribute('data-id');
    const name = newBtn.getAttribute('data-name');
    const price = parseInt(newBtn.getAttribute('data-price'));
    const img = newBtn.getAttribute('data-img');
    const qtyEl = document.getElementById('qtyInput');
    const qty = qtyEl ? parseInt(qtyEl.value) || 1 : 1;
    window._addToCartWithEffects(id, name, price, img, qty, newBtn);
  });
});

// --- Wishlist System ---
let wishlist = JSON.parse(localStorage.getItem('nuage_wishlist')) || [];

function toggleWishlist(id) {
  const idx = wishlist.indexOf(id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
  } else {
    wishlist.push(id);
  }
  localStorage.setItem('nuage_wishlist', JSON.stringify(wishlist));
  renderWishlistButtons();
}

function renderWishlistButtons() {
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const id = btn.getAttribute('data-id');
    if (wishlist.includes(id)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

document.querySelectorAll('.wishlist-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const id = btn.getAttribute('data-id');
    toggleWishlist(id);
    btn.classList.add('pop');
    setTimeout(() => btn.classList.remove('pop'), 350);
    const isNowActive = wishlist.includes(id);
    showToast(
      isNowActive ? '위시리스트에 추가' : '위시리스트에서 제거',
      '', isNowActive ? '❤️' : '🤍'
    );
  });
});
renderWishlistButtons();

// --- Quick View Modal ---
const qvOverlay = document.getElementById('quickviewOverlay');
const qvModal = document.getElementById('quickviewModal');
const qvClose = document.getElementById('quickviewClose');
const qvImage = document.getElementById('qvImage');
const qvTitle = document.getElementById('qvTitle');
const qvPrice = document.getElementById('qvPrice');
const qvDesc = document.getElementById('qvDesc');
const qvAddCart = document.getElementById('qvAddCart');
const qvDetail = document.getElementById('qvDetail');

let currentQvData = null;

function openQuickView(data) {
  currentQvData = data;
  if (qvImage) qvImage.src = data.img;
  if (qvImage) qvImage.alt = data.name;
  if (qvTitle) qvTitle.textContent = data.name;
  if (qvPrice) qvPrice.textContent = '₩ ' + parseInt(data.price).toLocaleString();
  if (qvDesc) qvDesc.textContent = data.desc;
  if (qvDetail) qvDetail.href = '/product.html';
  if (qvOverlay) qvOverlay.classList.add('active');
  if (qvModal) qvModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  if (qvOverlay) qvOverlay.classList.remove('active');
  if (qvModal) qvModal.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('.quick-view-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView({
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: btn.dataset.price,
      img: btn.dataset.img,
      desc: btn.dataset.desc,
    });
  });
});

if (qvClose) qvClose.addEventListener('click', closeQuickView);
if (qvOverlay) qvOverlay.addEventListener('click', closeQuickView);
if (qvAddCart) {
  qvAddCart.addEventListener('click', () => {
    if (!currentQvData) return;
    window._addToCartWithEffects(
      currentQvData.id, currentQvData.name,
      parseInt(currentQvData.price), currentQvData.img, 1, qvAddCart
    );
    closeQuickView();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeQuickView();
});

// --- Mobile Menu ---
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileMenuClose = document.getElementById('mobileMenuClose');

function openMobileMenu() {
  if (mobileMenu) mobileMenu.classList.add('active');
  if (mobileMenuOverlay) mobileMenuOverlay.classList.add('active');
}
function closeMobileMenu() {
  if (mobileMenu) mobileMenu.classList.remove('active');
  if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);
// Close on link click
document.querySelectorAll('.mobile-menu-links a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// --- Accordion Toggle ---
document.querySelectorAll('.accordion-item').forEach(item => {
  const title = item.querySelector('.accordion-title');
  // Create content div if not exists
  let content = item.querySelector('.accordion-content');
  if (!content) {
    content = document.createElement('div');
    content.className = 'accordion-content';
    // Add default content based on title text
    const titleText = title?.textContent || '';
    if (titleText.includes('배송')) {
      content.innerHTML = '무료 배송 (7~14 영업일 소요)<br>도서산간 지역 추가 비용 없음<br>원하시면 조립 서비스도 이용 가능합니다 (+₩50,000)';
    } else if (titleText.includes('교환') || titleText.includes('반품')) {
      content.innerHTML = '수령 후 14일 이내 교환/반품 가능<br>단, 조립 완료된 제품은 교환/반품이 어렵습니다.<br>고객센터: 1588-0000';
    } else {
      content.innerHTML = '상세 내용은 고객센터로 문의해주세요.';
    }
    item.appendChild(content);
  }

  if (title) {
    title.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all other items
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  }
});

// --- Stagger Observer for Product Cards ---
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.product-card');
      cards.forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), i * 150);
      });
      staggerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

const productsGrid = document.querySelector('.products-grid');
if (productsGrid) staggerObserver.observe(productsGrid);

// --- Text Reveal Animation ---
function initTextReveal() {
  document.querySelectorAll('.section-header h2, .hero-content h1').forEach(el => {
    if (el.dataset.revealed) return;
    el.dataset.revealed = 'true';
    const text = el.innerHTML;
    // Split by <br> first, then by words
    const lines = text.split(/<br\s*\/?>/);
    el.innerHTML = lines.map(line => {
      const words = line.trim().split(/\s+/);
      return words.map((word, i) =>
        `<span class="reveal-word" style="transition-delay: ${i * 80}ms">${word}</span>`
      ).join(' ');
    }).join('<br>');
  });
}
initTextReveal();

// Observe text reveal triggers
const textRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      textRevealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.section-header h2, .hero-content h1').forEach(el => {
  textRevealObserver.observe(el.parentElement || el);
});

// --- Stats Counter Animation ---
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.target);
        if (!target) return;
        const start = performance.now();
        const duration = 2000;
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target).toLocaleString() + (target >= 100 ? '+' : '');
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) statsObserver.observe(statsSection);

// --- Scroll Progress Bar ---
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  if (!scrollProgress) return;
  const scrolled = window.scrollY;
  const total = document.body.scrollHeight - window.innerHeight;
  const pct = total > 0 ? (scrolled / total) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}, { passive: true });

// --- Back to Top Button ---
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (!backToTop) return;
  if (window.scrollY > 600) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}, { passive: true });
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// --- Image Zoom on PDP ---
const mainProdImage = document.getElementById('mainProdImage');
if (mainProdImage) {
  const container = mainProdImage.closest('.main-image');
  if (container) {
    container.classList.add('image-zoom-container');
    const lens = document.createElement('div');
    lens.className = 'image-zoom-lens';
    container.appendChild(lens);

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = (x / rect.width) * 100;
      const yPct = (y / rect.height) * 100;

      lens.style.left = (x - 90) + 'px';
      lens.style.top = (y - 90) + 'px';
      lens.style.backgroundImage = `url(${mainProdImage.src})`;
      lens.style.backgroundSize = `${rect.width * 2.5}px ${rect.height * 2.5}px`;
      lens.style.backgroundPosition = `${xPct}% ${yPct}%`;
    });
  }
}
