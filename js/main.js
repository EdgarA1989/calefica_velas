const BRAND_CONFIG = {
  whatsappNumber: "549XXXXXXXXXX",
  instagramUrl: "https://www.instagram.com/",
  email: "hola@calefica.com",
};

// Pegá acá la URL pública del deploy de Google Apps Script.
const PRODUCTS_API_URL = "https://script.google.com/macros/s/AKfycbxfWGJ1Is0XOMVcJRRflDdT2aGN4i_zBh5m5vkcdj2wppS1UePgivDzNc5xhzJfj_kK/exec";
const DEFAULT_WHATSAPP_NUMBER = BRAND_CONFIG.whatsappNumber;
const PLACEHOLDER_IMAGE = "";

const CATALOG_STORAGE_KEY = "calefica-products-cache-v1";

const LEGACY_CATEGORY_LABELS = {
  clasicas: "Velas clasicas",
  aromaticas: "Velas aromaticas",
  decorativas: "Velas decorativas",
  combos: "Combos / regalos",
  extras: "Difusores y extras",
};

let products = [
  {
    id: "ambar-nude",
    nombre: "Vela Ambar Nude",
    categoria: "clasicas",
    descripcion: "Vela minimalista en tono nude, ideal para crear una luz suave y calida.",
    aroma: "Ambar suave",
    precio: 8500,
    imagen: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=900&q=82",
    paymentLinks: {
      mercadoPago: "https://www.mercadopago.com.ar/",
      qr: "",
    },
    whatsappText: "Hola, quiero consultar por la Vela Ambar Nude.",
  },
  {
    id: "crema-natural",
    nombre: "Vela Crema Natural",
    categoria: "clasicas",
    descripcion: "Una vela simple y elegante para mesas de luz, livings y pequenos rituales.",
    aroma: "Algodon y almizcle",
    precio: 7900,
    imagen: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=82",
    paymentLinks: { mercadoPago: "https://www.mercadopago.com.ar/", qr: "" },
    whatsappText: "Hola, quiero consultar por la Vela Crema Natural.",
  },
  {
    id: "arena-suave",
    nombre: "Vela Arena Suave",
    categoria: "clasicas",
    descripcion: "Envase neutro, cera de soja y terminacion delicada para uso diario.",
    aroma: "Te blanco",
    precio: 8200,
    imagen: "https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?auto=format&fit=crop&w=900&q=82",
    paymentLinks: { mercadoPago: "https://www.mercadopago.com.ar/", qr: "" },
    whatsappText: "Hola, quiero consultar por la Vela Arena Suave.",
  },
  {
    id: "nude-cotidiana",
    nombre: "Vela Nude Cotidiana",
    categoria: "clasicas",
    descripcion: "Un clasico calido para acompanar tardes tranquilas y espacios armoniosos.",
    aroma: "Madera clara",
    precio: 8700,
    imagen: "https://images.unsplash.com/photo-1602910344008-22f323cc1817?auto=format&fit=crop&w=900&q=82",
    paymentLinks: { mercadoPago: "https://www.mercadopago.com.ar/", qr: "" },
    whatsappText: "Hola, quiero consultar por la Vela Nude Cotidiana.",
  },
  {
    id: "lavanda-soft",
    nombre: "Vela Lavanda Soft",
    categoria: "aromaticas",
    descripcion: "Fragancia relajante y delicada para dormitorios, lectura o rituales de descanso.",
    aroma: "Lavanda y vainilla",
    precio: 9200,
    imagen: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=800&q=82",
    paymentLinks: {
      mercadoPago: "https://www.mercadopago.com.ar/",
      qr: "",
    },
    whatsappText: "Hola, quiero consultar por la Vela Lavanda Soft.",
  },
  {
    id: "vainilla-calida",
    nombre: "Vela Vainilla Calida",
    categoria: "aromaticas",
    descripcion: "Una vela dulce y envolvente, perfecta para ambientes acogedores.",
    aroma: "Vainilla cremosa",
    precio: 9200,
    imagen: "https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?auto=format&fit=crop&w=800&q=82",
    paymentLinks: {
      mercadoPago: "https://www.mercadopago.com.ar/",
      qr: "",
    },
    whatsappText: "Hola, quiero consultar por la Vela Vainilla Calida.",
  },
  {
    id: "jazmin-sereno",
    nombre: "Vela Jazmin Sereno",
    categoria: "aromaticas",
    descripcion: "Aroma floral suave, femenino y limpio para perfumar con elegancia.",
    aroma: "Jazmin y peonia",
    precio: 9400,
    imagen: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=82",
    paymentLinks: { mercadoPago: "https://www.mercadopago.com.ar/", qr: "" },
    whatsappText: "Hola, quiero consultar por la Vela Jazmin Sereno.",
  },
  {
    id: "cedro-dulce",
    nombre: "Vela Cedro Dulce",
    categoria: "aromaticas",
    descripcion: "Notas amaderadas y cremosas para una experiencia calida y envolvente.",
    aroma: "Cedro y tonka",
    precio: 9600,
    imagen: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=82",
    paymentLinks: { mercadoPago: "https://www.mercadopago.com.ar/", qr: "" },
    whatsappText: "Hola, quiero consultar por la Vela Cedro Dulce.",
  },
  {
    id: "rosa-mosqueta",
    nombre: "Vela Rosa Mosqueta",
    categoria: "decorativas",
    descripcion: "Diseno delicado con inspiracion floral para regalar o decorar espacios especiales.",
    aroma: "Rosa mosqueta",
    precio: 9800,
    imagen: "https://images.unsplash.com/photo-1602910344008-22f323cc1817?auto=format&fit=crop&w=800&q=82",
    paymentLinks: {
      mercadoPago: "https://www.mercadopago.com.ar/",
      qr: "",
    },
    whatsappText: "Hola, quiero consultar por la Vela Rosa Mosqueta.",
  },
  {
    id: "flor-seca",
    nombre: "Vela Flor Seca",
    categoria: "decorativas",
    descripcion: "Terminacion artesanal con detalle botanico y paleta romantica.",
    aroma: "Rosas y madera",
    precio: 10500,
    imagen: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=900&q=82",
    paymentLinks: { mercadoPago: "https://www.mercadopago.com.ar/", qr: "" },
    whatsappText: "Hola, quiero consultar por la Vela Flor Seca.",
  },
  {
    id: "copa-dorada",
    nombre: "Vela Copa Dorada",
    categoria: "decorativas",
    descripcion: "Un detalle sofisticado para mesas, rincones especiales y regalos.",
    aroma: "Ambar y vainilla",
    precio: 11200,
    imagen: "https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?auto=format&fit=crop&w=900&q=82",
    paymentLinks: { mercadoPago: "https://www.mercadopago.com.ar/", qr: "" },
    whatsappText: "Hola, quiero consultar por la Vela Copa Dorada.",
  },
  {
    id: "botanica-nude",
    nombre: "Vela Botanica Nude",
    categoria: "decorativas",
    descripcion: "Pieza decorativa con inspiracion natural y presencia boutique.",
    aroma: "Verbena suave",
    precio: 10800,
    imagen: "https://images.unsplash.com/photo-1602910344008-22f323cc1817?auto=format&fit=crop&w=900&q=82",
    paymentLinks: { mercadoPago: "https://www.mercadopago.com.ar/", qr: "" },
    whatsappText: "Hola, quiero consultar por la Vela Botanica Nude.",
  },
  {
    id: "combo-relax",
    nombre: "Combo Relax",
    categoria: "combos",
    descripcion: "Box con vela, detalle aromático y tarjeta. Pensado para regalar calma.",
    aroma: "Mix relajante",
    precio: 16800,
    imagen: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=82",
    paymentLinks: {
      mercadoPago: "https://www.mercadopago.com.ar/",
      qr: "",
    },
    whatsappText: "Hola, quiero consultar por el Combo Relax.",
  },
  {
    id: "box-regalo-aromatico",
    nombre: "Box Regalo Aromatico",
    categoria: "combos",
    descripcion: "Presentacion boutique para cumpleanos, agradecimientos o fechas especiales.",
    aroma: "A eleccion",
    precio: 20500,
    imagen: "https://images.unsplash.com/photo-1513745405825-efaf9a49315f?auto=format&fit=crop&w=800&q=82",
    paymentLinks: {
      mercadoPago: "https://www.mercadopago.com.ar/",
      qr: "",
    },
    whatsappText: "Hola, quiero consultar por el Box Regalo Aromatico.",
  },
  {
    id: "combo-madera",
    nombre: "Combo Madera Clara",
    categoria: "combos",
    descripcion: "Vela, fosforera y detalle en madera cruda para un regalo natural.",
    aroma: "Cedro suave",
    precio: 18500,
    imagen: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=82",
    paymentLinks: { mercadoPago: "https://www.mercadopago.com.ar/", qr: "" },
    whatsappText: "Hola, quiero consultar por el Combo Madera Clara.",
  },
  {
    id: "box-rosa",
    nombre: "Box Rosa Viejo",
    categoria: "combos",
    descripcion: "Presentacion delicada con vela, tarjeta y envoltorio en tonos rosados.",
    aroma: "Rosa y vainilla",
    precio: 19800,
    imagen: "https://images.unsplash.com/photo-1513745405825-efaf9a49315f?auto=format&fit=crop&w=900&q=82",
    paymentLinks: { mercadoPago: "https://www.mercadopago.com.ar/", qr: "" },
    whatsappText: "Hola, quiero consultar por el Box Rosa Viejo.",
  },
  {
    id: "difusor-nude",
    nombre: "Difusor Nude",
    categoria: "extras",
    descripcion: "Difusor aromatico de varillas para perfumar espacios de forma constante.",
    aroma: "Bambu y lima",
    precio: 9900,
    imagen: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=82",
    paymentLinks: { mercadoPago: "https://www.mercadopago.com.ar/", qr: "" },
    whatsappText: "Hola, quiero consultar por el Difusor Nude.",
  },
  {
    id: "spray-textil",
    nombre: "Spray Textil",
    categoria: "extras",
    descripcion: "Bruma suave para telas, cortinas y ropa de cama.",
    aroma: "Lavanda limpia",
    precio: 7200,
    imagen: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=900&q=82",
    paymentLinks: { mercadoPago: "https://www.mercadopago.com.ar/", qr: "" },
    whatsappText: "Hola, quiero consultar por el Spray Textil.",
  },
  {
    id: "fosforera-ceramica",
    nombre: "Fosforera Ceramica",
    categoria: "extras",
    descripcion: "Accesorio delicado para acompanar tus velas y completar el ritual.",
    aroma: "Sin aroma",
    precio: 4600,
    imagen: "https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?auto=format&fit=crop&w=900&q=82",
    paymentLinks: { mercadoPago: "https://www.mercadopago.com.ar/", qr: "" },
    whatsappText: "Hola, quiero consultar por la Fosforera Ceramica.",
  },
  {
    id: "tableta-aromatica",
    nombre: "Tableta Aromatica",
    categoria: "extras",
    descripcion: "Tableta de cera perfumada para cajones, placares o pequenos rincones.",
    aroma: "Vainilla y flores",
    precio: 5200,
    imagen: "https://images.unsplash.com/photo-1602910344008-22f323cc1817?auto=format&fit=crop&w=900&q=82",
    paymentLinks: { mercadoPago: "https://www.mercadopago.com.ar/", qr: "" },
    whatsappText: "Hola, quiero consultar por la Tableta Aromatica.",
  },
];

let categories = [{ id: "todos", label: "Todos" }];
let activeCategory = "todos";
let currentSlide = 0;
let quantities = new Map(products.map(product => [product.id, 1]));
let activeModalProductId = null;

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMenu();
  initContactLinks();
  initCatalog();
  initCatalogHoldScroll();
  initCarouselControls();
  initProductModal();
  initContactForm();
  initReveal();
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
    imagenId: product.imagenId || "",
    nombreImagen: product.nombreImagen || "",
    imagen: product.imagenUrl || product.imagen || "",
    linkMercadoPago: product.linkMercadoPago || product.paymentLinks?.mercadoPago || "",
    linkQR: product.linkQR || product.paymentLinks?.qr || "",
    whatsapp: product.whatsapp || DEFAULT_WHATSAPP_NUMBER,
    stock,
    destacado,
  };
}

function normalizeYesNo(value, fallback = "NO") {
  const normalized = String(value || fallback).trim().toUpperCase();
  return normalized === "SI" || normalized === "SÍ" || normalized === "YES" || normalized === "TRUE" ? "SI" : "NO";
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
    window.open(buildPaymentUrl(product, quantity), "_blank", "noopener,noreferrer");
  });

  document.getElementById("modal-product-consult")?.addEventListener("click", () => {
    const product = getActiveModalProduct();
    if (!product) return;

    const quantity = quantities.get(product.id) || 1;
    window.open(getProductWhatsappUrl(product, quantity), "_blank", "noopener,noreferrer");
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeProductModal();
    }
  });
}

function openProductModal(product) {
  const modal = document.getElementById("product-modal");
  if (!modal) return;

  activeModalProductId = product.id;
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

  if (buyButton) {
    buyButton.disabled = product.stock === "NO";
    buyButton.textContent = product.stock === "NO" ? "Sin stock" : "Comprar";
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector(".product-modal__close")?.focus();
}

function closeProductModal() {
  const modal = document.getElementById("product-modal");
  if (!modal) return;

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  activeModalProductId = null;
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

function initCatalogHoldScroll() {
  const track = document.getElementById("products-track");
  if (!track) return;

  const mobileQuery = window.matchMedia("(max-width: 760px)");
  let unlockTimer = 0;
  let startX = 0;
  let startY = 0;

  const lockScroll = () => {
    window.clearTimeout(unlockTimer);
    track.classList.remove("is-scroll-unlocked");
  };

  track.addEventListener("pointerdown", event => {
    if (!mobileQuery.matches || event.pointerType === "mouse") return;

    startX = event.clientX;
    startY = event.clientY;
    unlockTimer = window.setTimeout(() => {
      unlockTimer = 0;
      track.classList.add("is-scroll-unlocked");
    }, 260);
  });

  track.addEventListener("pointermove", event => {
    if (!unlockTimer) return;

    const movement = Math.hypot(event.clientX - startX, event.clientY - startY);
    if (movement > 10) {
      lockScroll();
    }
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach(eventName => {
    track.addEventListener(eventName, lockScroll);
  });
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
  const baseUrl = product.linkMercadoPago || product.linkQR;
  if (!baseUrl) return getProductBuyWhatsappUrl(product, quantity);

  try {
    const url = new URL(baseUrl);
    url.searchParams.set("cantidad", String(quantity));
    url.searchParams.set("producto", product.id);
    return url.toString();
  } catch {
    return baseUrl;
  }
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
