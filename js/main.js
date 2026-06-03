const BRAND_CONFIG = {
  whatsappNumber: "549XXXXXXXXXX",
  instagramUrl: "https://www.instagram.com/",
  email: "hola@calefica.com",
};

// Pegá acá la URL pública del deploy de Google Apps Script.
const PRODUCTS_API_URL = "https://script.google.com/macros/s/AKfycbxfWGJ1Is0XOMVcJRRflDdT2aGN4i_zBh5m5vkcdj2wppS1UePgivDzNc5xhzJfj_kK/exec";
const DEFAULT_WHATSAPP_NUMBER = BRAND_CONFIG.whatsappNumber;
const PLACEHOLDER_IMAGE = "";

const CATALOG_STORAGE_KEY = "calefica_productos_v3";
const CART_STORAGE_KEY = "calefica_cart_v1";

const LEGACY_CATEGORY_LABELS = {
  clasicas: "Velas clasicas",
  aromaticas: "Velas aromaticas",
  decorativas: "Velas decorativas",
  combos: "Combos / regalos",
  extras: "Difusores y extras",
};

const IMG = "assets/img/imagenes-productos-calefica/02 - Imagenes productos/";

let products = [
  { id: "vela-lavanda-soft",   activo: "SI", orden: 1, categoria: "Velas aromáticas",  nombre: "Vela Lavanda Soft",    descripcion: "Vela de soja artesanal con aroma suave a lavanda, ideal para crear un ambiente relajante y cálido.",                                              aroma: "Lavanda",         precio: 22000, imagen: IMG + "vela-lavanda-soft.jpg",   whatsapp: DEFAULT_WHATSAPP_NUMBER, stock: "SI", cantidadStock: "", destacado: "SI" },
  { id: "vela-vainilla-calida",activo: "SI", orden: 2, categoria: "Velas aromáticas",  nombre: "Vela Vainilla Cálida", descripcion: "Aroma dulce y envolvente de vainilla, perfecta para acompañar momentos de descanso en casa.",                                              aroma: "Vainilla",        precio: 15000, imagen: IMG + "vela-vainilla-calida.jpg",whatsapp: DEFAULT_WHATSAPP_NUMBER, stock: "SI", cantidadStock: "", destacado: "SI" },
  { id: "vela-rosa-mosqueta",  activo: "SI", orden: 3, categoria: "Velas aromáticas",  nombre: "Vela Rosa Mosqueta",   descripcion: "Una fragancia delicada, floral y elegante para perfumar espacios con una sensación suave y femenina.",                                      aroma: "Rosa mosqueta",   precio:  9000, imagen: IMG + "vela-rosa-mosqueta.jpg",  whatsapp: DEFAULT_WHATSAPP_NUMBER, stock: "SI", cantidadStock: "", destacado: "SI" },
  { id: "vela-coco-beige",     activo: "SI", orden: 4, categoria: "Velas aromáticas",  nombre: "Vela Coco Beige",      descripcion: "Vela artesanal con notas suaves de coco, pensada para ambientes frescos, cálidos y naturales.",                                            aroma: "Coco",            precio: 17500, imagen: IMG + "vela-coco-beige.jpg",     whatsapp: DEFAULT_WHATSAPP_NUMBER, stock: "SI", cantidadStock: "", destacado: "NO" },
  { id: "vela-nude-clasica",   activo: "SI", orden: 5, categoria: "Velas clásicas",    nombre: "Vela Nude Clásica",    descripcion: "Diseño simple, natural y elegante. Ideal para decorar mesas, rincones o regalar.",                                                          aroma: "Sin aroma",       precio:  7000, imagen: IMG + "vela-nude-clasica.jpg",   whatsapp: DEFAULT_WHATSAPP_NUMBER, stock: "SI", cantidadStock: "", destacado: "NO" },
  { id: "vela-deco-flores",    activo: "SI", orden: 6, categoria: "Velas decorativas", nombre: "Vela Deco Flores",     descripcion: "Vela de soja decorativa con detalles delicados, pensada para regalar o decorar espacios especiales.",                                       aroma: "Floral suave",    precio: 11000, imagen: IMG + "vela-deco-flores.jpg",    whatsapp: DEFAULT_WHATSAPP_NUMBER, stock: "SI", cantidadStock: "", destacado: "SI" },
  { id: "combo-relax",         activo: "SI", orden: 7, categoria: "Combos y regalos",  nombre: "Combo Relax",          descripcion: "Combo artesanal con vela aromática, detalles decorativos y presentación especial para regalar.",                                            aroma: "Lavanda + Vainilla", precio: 18000, imagen: IMG + "combo-relax.jpg",      whatsapp: DEFAULT_WHATSAPP_NUMBER, stock: "SI", cantidadStock: "", destacado: "SI" },
  { id: "box-aromatico",       activo: "SI", orden: 8, categoria: "Combos y regalos",  nombre: "Box Aromático",        descripcion: "Box de regalo con selección de velas y aromas delicados. Ideal para cumpleaños, agradecimientos o fechas especiales.",                      aroma: "A elección",      precio: 22000, imagen: IMG + "box-aromatico.jpg",       whatsapp: DEFAULT_WHATSAPP_NUMBER, stock: "SI", cantidadStock: "", destacado: "NO" },
];

let categories = [{ id: "todos", label: "Todos" }];
let activeCategory = "todos";
let currentSlide = 0;
let mobileCatalogPage = 0;
let quantities = new Map(products.map(product => [product.id, 1]));
let activeModalProductId = null;
let modalHistoryActive = false;
let modalScrollY = 0;
const MOBILE_CATALOG_PAGE_SIZE = 4;

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMenu();
  initHomeLinks();
  initContactLinks();
  initCatalog();
  initCarouselControls();
  initMobileCatalogControls();
  initProductModal();
  initContactForm();
  initReveal();
  initCart();
  document.getElementById("year").textContent = new Date().getFullYear();
});

function initTheme() {
  const toggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("calefica-theme") || "light";
  applyTheme(savedTheme);

  toggle?.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
    const animationClass = nextTheme === "dark" ? "is-blowing" : "is-lighting";
    const applyDelay = nextTheme === "dark" ? 650 : 120;

    toggle.classList.remove("is-blowing", "is-lighting");
    toggle.classList.add(animationClass);

    window.setTimeout(() => {
      localStorage.setItem("calefica-theme", nextTheme);
      applyTheme(nextTheme);
    }, applyDelay);

    window.setTimeout(() => {
      toggle.classList.remove(animationClass);
    }, 1050);
  });

  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark", isDark);
    toggle?.setAttribute("aria-pressed", String(isDark));
    toggle?.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
  }
}

function initMenu() {
  const toggle = document.getElementById("menu-toggle");
  const panel = document.getElementById("nav-panel");
  if (!toggle || !panel) return;

  const closeMenu = () => {
    panel.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = panel.classList.toggle("is-open");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  panel.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });
}

function initHomeLinks() {
  const closeMenu = () => {
    document.getElementById("nav-panel")?.classList.remove("is-open");
    document.getElementById("menu-toggle")?.classList.remove("is-open");
    document.getElementById("menu-toggle")?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  document.querySelectorAll('a[href="#inicio"]').forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      closeMenu();
      history.replaceState(null, "", "#inicio");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function initContactLinks() {
  const message = "Hola, quiero consultar por las velas de soja artesanales.";
  const whatsappUrl = getWhatsappUrl(message);
  document.getElementById("hero-whatsapp").href = whatsappUrl;
  document.getElementById("contact-whatsapp").href = whatsappUrl;
  document.getElementById("instagram-link").href = BRAND_CONFIG.instagramUrl;
  document.getElementById("email-link").href = `mailto:${BRAND_CONFIG.email}`;
}

function initCatalog() {
  products = products.map(normalizeProduct);
  const cachedProducts = readProductsCache();

  if (cachedProducts?.length) {
    refreshCatalogData(cachedProducts);
    renderCategories();
    renderProducts();
  } else {
    refreshCatalogData(products);
    renderCatalogState("loading");
  }

  loadProductsFromApi({ hasCachedProducts: Boolean(cachedProducts?.length) });
}

async function loadProductsFromApi({ hasCachedProducts = false } = {}) {
  if (!isProductsApiConfigured()) {
    renderCategories();
    renderProducts();
    return;
  }

  try {
    const response = await fetch(PRODUCTS_API_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("La API no respondio correctamente.");

    const data = await response.json();
    if (!data.ok || !Array.isArray(data.productos)) {
      throw new Error(data.error || "La respuesta del catalogo no es valida.");
    }

    const normalizedProducts = data.productos.map(normalizeProduct);
    saveProductsCache(normalizedProducts);
    refreshCatalogData(normalizedProducts);
    renderCategories();
    renderProducts();
  } catch (error) {
    console.error(error);
    if (hasCachedProducts) return;

    products = [];
    refreshCatalogData(products);
    renderCategories();
    renderCatalogState("error");
  }
}

function readProductsCache() {
  try {
    const rawCache = localStorage.getItem(CATALOG_STORAGE_KEY);
    if (!rawCache) return null;

    const parsedCache = JSON.parse(rawCache);
    if (!Array.isArray(parsedCache.productos)) return null;

    return parsedCache.productos.map(normalizeProduct);
  } catch (error) {
    console.warn("No se pudo leer el catalogo guardado.", error);
    localStorage.removeItem(CATALOG_STORAGE_KEY);
    return null;
  }
}

function saveProductsCache(nextProducts) {
  try {
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify({
      cachedAt: new Date().toISOString(),
      productos: nextProducts,
    }));
  } catch (error) {
    console.warn("No se pudo guardar el catalogo local.", error);
  }
}

function isProductsApiConfigured() {
  return PRODUCTS_API_URL && !PRODUCTS_API_URL.includes("PEGAR_URL_PUBLICA");
}

function refreshCatalogData(nextProducts) {
  products = nextProducts
    .filter(product => product.activo !== false)
    .sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre));
  quantities = new Map(products.map(product => [product.id, quantities.get(product.id) || 1]));
  categories = buildCategories(products);
  if (!categories.some(category => category.id === activeCategory)) {
    activeCategory = "todos";
  }
  currentSlide = 0;
  syncCartWithProducts(products);
}

function buildCategories(productList) {
  const uniqueCategories = [...new Set(productList.map(product => product.categoria).filter(Boolean))];
  return [
    { id: "todos", label: "Todos" },
    ...uniqueCategories.map(category => ({ id: slugify(category), label: category })),
  ];
}

function normalizeProduct(product) {
  const rawCategory = LEGACY_CATEGORY_LABELS[product.categoria] || product.categoria || "Sin categoria";
  const stock = normalizeYesNo(product.stock, "SI");
  const destacado = normalizeYesNo(product.destacado, "NO");
  return {
    id: String(product.id || slugify(product.nombre || `producto-${Date.now()}`)).trim(),
    activo: normalizeYesNo(product.activo, "SI") === "SI",
    orden: Number(product.orden) || 9999,
    categoria: rawCategory,
    categoriaId: slugify(rawCategory),
    nombre: product.nombre || "Producto sin nombre",
    descripcion: product.descripcion || "Producto artesanal de Calefica.",
    aroma: product.aroma || "A eleccion",
    precio: Number(product.precio) || 0,
    nombreImagen: product.nombreImagen || "",
    imagen: product.imagenUrl || product.imagen || "",
    whatsapp: product.whatsapp || DEFAULT_WHATSAPP_NUMBER,
    stock,
    cantidadStock: String(product.cantidadStock || "").trim(),
    destacado,
  };
}

function normalizeYesNo(value, fallback = "NO") {
  return normalizeSiNo(value, fallback);
}

function normalizeSiNo(value, fallback = "NO") {
  const text = String(value == null ? fallback : value)
    .trim()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase();
  return text === "SI" || text === "YES" || text === "TRUE" ? "SI" : "NO";
}

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "categoria";
}

function renderCategories() {
  const list = document.getElementById("category-list");
  if (!list) return;

  list.innerHTML = categories.map(category => `
    <button class="category-btn${category.id === activeCategory ? " is-active" : ""}" type="button" data-category="${category.id}">
      ${category.label}
    </button>
  `).join("");

  list.querySelectorAll("[data-category]").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      currentSlide = 0;
      mobileCatalogPage = 0;
      renderCategories();
      renderProducts();
    });
  });
}

function renderProducts() {
  const track = document.getElementById("products-track");
  const title = document.getElementById("catalog-title");
  const count = document.getElementById("catalog-count");
  const dots = document.getElementById("carousel-dots");
  if (!track || !title || !count || !dots) return;

  const category = categories.find(item => item.id === activeCategory);
  const visibleProducts = activeCategory === "todos"
    ? products
    : products.filter(product => product.categoriaId === activeCategory);

  title.textContent = category?.label || "Catalogo";
  count.textContent = `${visibleProducts.length} producto${visibleProducts.length === 1 ? "" : "s"}`;

  if (!products.length) {
    renderCatalogState("empty");
    return;
  }

  if (!visibleProducts.length) {
    renderCatalogState("empty-category");
    return;
  }

  track.innerHTML = visibleProducts.map(product => renderProductCard(product)).join("");
  currentSlide = clampCarouselIndex(track, currentSlide);
  renderCarouselDots(dots, track);

  bindProductActions(track);
  bindDots(dots, track);
  updateMobileCatalogPager();
  scrollToSlide(track, currentSlide);
}

function renderProductCard(product) {
  const isOutOfStock = product.stock === "NO";
  const imageStyle = product.imagen
    ? `style="background-image: url('${product.imagen}')"`
    : "";
  return `
    <article class="product-card${isOutOfStock ? " is-out-of-stock" : ""}" data-product-id="${product.id}">
      <div class="product-image${product.imagen ? "" : " product-image--placeholder"}" ${imageStyle}>
        <div class="product-badges">
          ${product.destacado === "SI" ? `<span class="product-badge">Destacado</span>` : ""}
          ${isOutOfStock ? `<span class="product-badge product-badge--stock">Sin stock</span>` : ""}
        </div>
      </div>
      <div class="product-body">
        <h4>${product.nombre}</h4>
        <div class="product-meta">
          <span>Aroma: <strong>${product.aroma}</strong></span>
          <span class="price">${formatPrice(product.precio)}</span>
        </div>
        <div class="product-actions">
          <button class="btn btn--primary" type="button" data-open-detail>Ver detalle</button>
        </div>
      </div>
    </article>
  `;
}

function renderCatalogState(state) {
  const track = document.getElementById("products-track");
  const dots = document.getElementById("carousel-dots");
  const count = document.getElementById("catalog-count");
  const title = document.getElementById("catalog-title");
  if (!track || !dots) return;

  const states = {
    loading: {
      title: "Catalogo",
      count: "Cargando",
      message: "Cargando productos...",
    },
    error: {
      title: "Catalogo",
      count: "Sin conexion",
      message: "No pudimos cargar los productos en este momento. Intenta nuevamente mas tarde.",
    },
    empty: {
      title: "Catalogo",
      count: "0 productos",
      message: "No hay productos disponibles.",
    },
    "empty-category": {
      title: title?.textContent || "Catalogo",
      count: "0 productos",
      message: "No hay productos disponibles en esta categoria.",
    },
  };

  const current = states[state];
  if (!current) return;
  if (title) title.textContent = current.title;
  if (count) count.textContent = current.count;
  track.innerHTML = state === "loading"
    ? renderCatalogSkeleton(current.message)
    : `<div class="catalog-state">${current.message}</div>`;
  dots.innerHTML = "";
  updateMobileCatalogPager();
}

function renderCatalogSkeleton(message) {
  return Array.from({ length: 3 }, (_, index) => `
    <article class="product-card product-card--skeleton" aria-hidden="${index > 0}">
      <div class="product-image skeleton-shimmer"></div>
      <div class="product-body">
        <span class="skeleton-line skeleton-line--title"></span>
        <span class="skeleton-line"></span>
        <span class="skeleton-line skeleton-line--short"></span>
        <div class="product-actions">
          <span class="skeleton-button"></span>
        </div>
      </div>
      ${index === 0 ? `<span class="catalog-loading-text">${message}</span>` : ""}
    </article>
  `).join("");
}

function bindProductActions(track) {
  track.querySelectorAll(".product-card").forEach(card => {
    const product = products.find(item => item.id === card.dataset.productId);
    if (!product) return;

    card.querySelector("[data-open-detail]")?.addEventListener("click", () => {
      openProductModal(product);
    });
  });
}

function initProductModal() {
  const modal = document.getElementById("product-modal");
  if (!modal) return;

  modal.querySelectorAll("[data-close-product-modal]").forEach(button => {
    button.addEventListener("click", closeProductModal);
  });

  modal.querySelectorAll("[data-modal-qty]").forEach(button => {
    button.addEventListener("click", () => {
      const product = getActiveModalProduct();
      if (!product) return;

      const current = quantities.get(product.id) || 1;
      const next = button.dataset.modalQty === "increase"
        ? current + 1
        : Math.max(1, current - 1);
      quantities.set(product.id, next);
      updateModalQuantity(next);
    });
  });

  document.getElementById("modal-product-buy")?.addEventListener("click", () => {
    const product = getActiveModalProduct();
    if (!product || product.stock === "NO") return;

    const quantity = quantities.get(product.id) || 1;
    addToCart(product, quantity);
    quantities.set(product.id, 1);
    closeProductModal();
  });

  document.getElementById("modal-product-consult")?.addEventListener("click", () => {
    const product = getActiveModalProduct();
    if (!product || product.stock === "NO") return;

    const quantity = quantities.get(product.id) || 1;
    window.open(getProductWhatsappUrl(product, quantity), "_blank", "noopener,noreferrer");
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeProductModal();
    }
  });

  window.addEventListener("popstate", () => {
    if (modal.classList.contains("is-open")) {
      closeProductModal({ fromHistory: true });
    }
  });
}

function openProductModal(product) {
  const modal = document.getElementById("product-modal");
  if (!modal) return;

  const wasOpen = modal.classList.contains("is-open");
  activeModalProductId = product.id;
  modalScrollY = window.scrollY;
  const quantity = quantities.get(product.id) || 1;
  const image = document.getElementById("modal-product-image");
  const buyButton = document.getElementById("modal-product-buy");

  if (image) {
    image.classList.toggle("product-modal__image--placeholder", !product.imagen);
    image.style.backgroundImage = product.imagen ? `url('${product.imagen}')` : "";
  }

  document.getElementById("modal-product-title").textContent = product.nombre;
  document.getElementById("modal-product-description").textContent = product.descripcion;
  document.getElementById("modal-product-aroma").textContent = product.aroma;
  document.getElementById("modal-product-price").textContent = formatPrice(product.precio);
  updateModalQuantity(quantity);

  const isOutOfStock = product.stock === "NO";

  if (buyButton) {
    buyButton.disabled = isOutOfStock;
    buyButton.textContent = isOutOfStock ? "Sin stock" : "Agregar al pedido";
  }

  const consultButton = document.getElementById("modal-product-consult");
  if (consultButton) {
    consultButton.disabled = isOutOfStock;
  }

  const qtyWrap = document.querySelector(".product-modal__quantity");
  if (qtyWrap) {
    qtyWrap.style.display = isOutOfStock ? "none" : "";
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (!wasOpen && !modalHistoryActive) {
    history.pushState({ caleficaProductModal: true }, "", window.location.href);
    modalHistoryActive = true;
  }

  modal.querySelector(".product-modal__close")?.focus();
}

function closeProductModal({ fromHistory = false } = {}) {
  const modal = document.getElementById("product-modal");
  if (!modal) return;

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  activeModalProductId = null;

  if (modalScrollY) {
    window.scrollTo({ top: modalScrollY, behavior: "auto" });
  }

  if (modalHistoryActive) {
    modalHistoryActive = false;
    if (!fromHistory) history.back();
  }
}

function getActiveModalProduct() {
  return products.find(product => product.id === activeModalProductId);
}

function updateModalQuantity(quantity) {
  const quantityValue = document.getElementById("modal-product-quantity");
  if (quantityValue) quantityValue.textContent = String(quantity);
}

function initCarouselControls() {
  document.getElementById("prev-product")?.addEventListener("click", () => moveCarousel(-1));
  document.getElementById("next-product")?.addEventListener("click", () => moveCarousel(1));
}

function initMobileCatalogControls() {
  document.getElementById("mobile-catalog-prev")?.addEventListener("click", () => moveMobileCatalogPage(-1));
  document.getElementById("mobile-catalog-next")?.addEventListener("click", () => moveMobileCatalogPage(1));
  window.addEventListener("resize", updateMobileCatalogPager);
}

function moveMobileCatalogPage(direction) {
  mobileCatalogPage += direction;
  updateMobileCatalogPager();
}

function updateMobileCatalogPager() {
  const track = document.getElementById("products-track");
  const controls = document.getElementById("mobile-catalog-controls");
  const prevButton = document.getElementById("mobile-catalog-prev");
  const nextButton = document.getElementById("mobile-catalog-next");
  if (!track || !controls || !prevButton || !nextButton) return;

  const isMobile = window.matchMedia("(max-width: 760px)").matches;
  const cards = [...track.querySelectorAll(".product-card:not(.product-card--skeleton)")];
  const maxPage = Math.max(0, Math.ceil(cards.length / MOBILE_CATALOG_PAGE_SIZE) - 1);

  if (!isMobile || cards.length <= MOBILE_CATALOG_PAGE_SIZE) {
    controls.hidden = true;
    cards.forEach(card => card.classList.remove("is-mobile-hidden"));
    return;
  }

  mobileCatalogPage = Math.min(Math.max(mobileCatalogPage, 0), maxPage);
  const start = mobileCatalogPage * MOBILE_CATALOG_PAGE_SIZE;
  const end = start + MOBILE_CATALOG_PAGE_SIZE;

  cards.forEach((card, index) => {
    card.classList.toggle("is-mobile-hidden", index < start || index >= end);
  });

  controls.hidden = false;
  prevButton.disabled = mobileCatalogPage === 0;
  nextButton.disabled = mobileCatalogPage === maxPage;
}

function moveCarousel(direction) {
  const track = document.getElementById("products-track");
  if (!track || !track.children.length) return;

  const { maxStart } = getCarouselMetrics(track);
  if (direction > 0) {
    currentSlide = currentSlide >= maxStart ? 0 : currentSlide + 1;
  } else {
    currentSlide = currentSlide <= 0 ? maxStart : currentSlide - 1;
  }
  scrollToSlide(track, currentSlide);
  updateDots();
}

function bindDots(dots, track) {
  dots.querySelectorAll("[data-slide]").forEach(button => {
    button.addEventListener("click", () => {
      currentSlide = Number(button.dataset.slide);
      scrollToSlide(track, currentSlide);
      updateDots();
    });
  });
}

function scrollToSlide(track, index) {
  const safeIndex = clampCarouselIndex(track, index);
  const card = track.children[safeIndex];
  if (!card) return;
  currentSlide = safeIndex;
  track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
}

function updateDots() {
  document.querySelectorAll(".dot").forEach((dot, index) => {
    dot.classList.toggle("is-active", index === currentSlide);
  });
}

function renderCarouselDots(dots, track) {
  const { maxStart } = getCarouselMetrics(track);
  dots.innerHTML = Array.from({ length: maxStart + 1 }, (_, index) => `
    <button class="dot${index === currentSlide ? " is-active" : ""}" type="button" aria-label="Ver grupo ${index + 1}" data-slide="${index}"></button>
  `).join("");
}

function clampCarouselIndex(track, index) {
  const { maxStart } = getCarouselMetrics(track);
  return Math.min(Math.max(Number(index) || 0, 0), maxStart);
}

function getCarouselMetrics(track) {
  const totalCards = track.children.length;
  const firstCard = track.children[0];
  if (!totalCards || !firstCard) {
    return { visibleCards: 1, maxStart: 0 };
  }

  const trackWidth = track.clientWidth || firstCard.getBoundingClientRect().width;
  const cardWidth = firstCard.getBoundingClientRect().width || trackWidth;
  const visibleCards = Math.max(1, Math.round(trackWidth / cardWidth));

  return {
    visibleCards,
    maxStart: Math.max(0, totalCards - visibleCards),
  };
}

function buildPaymentUrl(product, quantity) {
  return getProductBuyWhatsappUrl(product, quantity);
}

function getProductWhatsappUrl(product, quantity) {
  const message = `Hola, quiero consultar por ${quantity} unidad/es de ${product.nombre}. Precio publicado: ${formatPrice(product.precio)}.`;
  return getWhatsappUrl(message, product.whatsapp);
}

function getProductBuyWhatsappUrl(product, quantity) {
  const message = `Hola, quiero comprar ${quantity} unidad/es de ${product.nombre}. Precio publicado: ${formatPrice(product.precio)}. ¿Esta disponible?`;
  return getWhatsappUrl(message, product.whatsapp);
}

function getWhatsappUrl(message, phone = DEFAULT_WHATSAPP_NUMBER) {
  return `https://wa.me/${phone || DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function formatPrice(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  form.addEventListener("submit", event => {
    event.preventDefault();
    const name = document.getElementById("contact-name").value.trim();
    const message = document.getElementById("contact-message").value.trim();
    if (!name || !message) {
      status.textContent = "Completá tu nombre y mensaje para enviar la consulta.";
      return;
    }

    window.open(getWhatsappUrl(`Hola, soy ${name}. ${message}`), "_blank", "noopener,noreferrer");
    status.textContent = "Abrimos WhatsApp con tu consulta lista para enviar.";
    form.reset();
  });
}

function initReveal() {
  const sections = document.querySelectorAll(".section-reveal");
  if (!sections.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    sections.forEach(section => section.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: .14 });

  sections.forEach(section => observer.observe(section));
}

// ── Carrito ──────────────────────────────────────────────────────────────────

function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.warn("No se pudo guardar el carrito.", error);
  }
}

function addToCart(product, quantity) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.cantidad += quantity;
    existing.nombre = product.nombre;
    existing.aroma = product.aroma;
    existing.precio = product.precio;
    existing.imagenUrl = product.imagen;
  } else {
    cart.push({
      id: product.id,
      nombre: product.nombre,
      aroma: product.aroma,
      precio: product.precio,
      imagenUrl: product.imagen,
      cantidad: quantity,
    });
  }
  saveCart(cart);
  updateCartCounter();
  renderCart();
}

function removeFromCart(productId) {
  saveCart(getCart().filter(item => item.id !== productId));
  updateCartCounter();
  renderCart();
}

function increaseCartItem(productId) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) item.cantidad += 1;
  saveCart(cart);
  updateCartCounter();
  renderCart();
}

function decreaseCartItem(productId) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  if (item.cantidad <= 1) {
    removeFromCart(productId);
    return;
  }
  item.cantidad -= 1;
  saveCart(cart);
  updateCartCounter();
  renderCart();
}

function clearCart() {
  saveCart([]);
  updateCartCounter();
  renderCart();
}

function calculateCartTotal() {
  return getCart().reduce((sum, item) => sum + item.precio * item.cantidad, 0);
}

function updateCartCounter() {
  const total = getCart().reduce((sum, item) => sum + item.cantidad, 0);
  [
    document.getElementById("cart-counter"),
    document.getElementById("cart-floating-counter"),
  ].forEach(el => {
    if (!el) return;
    el.textContent = String(total);
    el.hidden = total === 0;
  });
}

function openCart() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (!drawer) return;
  renderCart();
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  overlay?.classList.add("is-visible");
  document.body.classList.add("cart-open");
  drawer.querySelector(".cart-close")?.focus();
}

function closeCart() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (!drawer) return;
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  overlay?.classList.remove("is-visible");
  document.body.classList.remove("cart-open");
}

function renderCart() {
  const itemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total-value");
  const checkoutBtn = document.getElementById("cart-checkout");
  const clearBtn = document.getElementById("cart-clear");
  if (!itemsEl) return;

  const cart = getCart();

  if (!cart.length) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <p class="cart-empty__title">Tu pedido está vacío</p>
        <p class="cart-empty__text">Agregá tus velas favoritas para armar tu pedido.</p>
      </div>
    `;
    if (totalEl) totalEl.textContent = formatPrice(0);
    if (checkoutBtn) checkoutBtn.disabled = true;
    if (clearBtn) clearBtn.hidden = true;
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item" data-item-id="${item.id}">
      <div class="cart-item__image${item.imagenUrl ? "" : " cart-item__image--placeholder"}"
           ${item.imagenUrl ? `style="background-image:url('${item.imagenUrl}')"` : ""}></div>
      <div class="cart-item__info">
        <p class="cart-item__name">${item.nombre}</p>
        ${item.aroma && item.aroma !== "Sin aroma" ? `<p class="cart-item__aroma">${item.aroma}</p>` : ""}
        <p class="cart-item__price">${formatPrice(item.precio)}</p>
      </div>
      <div class="cart-item__controls">
        <div class="quantity-control">
          <button class="qty-btn" type="button" data-cart-decrease="${item.id}" aria-label="Disminuir cantidad de ${item.nombre}">−</button>
          <span class="quantity-value">${item.cantidad}</span>
          <button class="qty-btn" type="button" data-cart-increase="${item.id}" aria-label="Aumentar cantidad de ${item.nombre}">+</button>
        </div>
        <div class="cart-item__bottom">
          <p class="cart-item__subtotal">${formatPrice(item.precio * item.cantidad)}</p>
          <button class="cart-item__remove" type="button" data-cart-remove="${item.id}" aria-label="Eliminar ${item.nombre}">&times;</button>
        </div>
      </div>
    </div>
  `).join("");

  if (totalEl) totalEl.textContent = formatPrice(calculateCartTotal());
  if (checkoutBtn) checkoutBtn.disabled = false;
  if (clearBtn) clearBtn.hidden = false;

  itemsEl.querySelectorAll("[data-cart-increase]").forEach(btn => {
    btn.addEventListener("click", () => increaseCartItem(btn.dataset.cartIncrease));
  });
  itemsEl.querySelectorAll("[data-cart-decrease]").forEach(btn => {
    btn.addEventListener("click", () => decreaseCartItem(btn.dataset.cartDecrease));
  });
  itemsEl.querySelectorAll("[data-cart-remove]").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.cartRemove));
  });
}

function syncCartWithProducts(activeProducts) {
  const cart = getCart();
  if (!cart.length) return;

  const synced = cart
    .filter(item => {
      const product = activeProducts.find(p => p.id === item.id);
      return product && product.activo !== false && product.stock === "SI";
    })
    .map(item => {
      const product = activeProducts.find(p => p.id === item.id);
      return {
        ...item,
        nombre: product.nombre,
        aroma: product.aroma,
        precio: product.precio,
        imagenUrl: product.imagen,
      };
    });

  saveCart(synced);
  updateCartCounter();
  if (document.getElementById("cart-drawer")?.classList.contains("is-open")) {
    renderCart();
  }
}

function showAddFeedback(card) {
  const btn = card.querySelector("[data-add-to-cart]");
  if (!btn || btn.classList.contains("btn--added")) return;
  const original = btn.textContent;
  btn.textContent = "¡Listo!";
  btn.classList.add("btn--added");
  btn.disabled = true;
  window.setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove("btn--added");
    btn.disabled = false;
  }, 1100);
}

function initCart() {
  document.getElementById("cart-button")?.addEventListener("click", openCart);
  document.getElementById("cart-floating")?.addEventListener("click", openCart);
  document.getElementById("cart-close")?.addEventListener("click", closeCart);
  document.getElementById("cart-overlay")?.addEventListener("click", closeCart);

  document.getElementById("cart-clear")?.addEventListener("click", () => {
    if (getCart().length) clearCart();
  });

  document.getElementById("cart-checkout")?.addEventListener("click", () => {
    // Placeholder — el envío por WhatsApp se implementa en el próximo paso.
    const statusEl = document.getElementById("cart-checkout-status");
    if (statusEl) {
      statusEl.textContent = "El envío por WhatsApp se implementará en el próximo paso.";
      window.setTimeout(() => { statusEl.textContent = ""; }, 3000);
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && document.getElementById("cart-drawer")?.classList.contains("is-open")) {
      closeCart();
    }
  });

  updateCartCounter();
  renderCart();
}
