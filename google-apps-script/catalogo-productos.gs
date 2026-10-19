/**
 * Calefica - API publica de catalogo
 *
 * Instrucciones rapidas:
 * 1. Crear una Google Sheet con una hoja llamada "productos".
 * 2. Crear una carpeta en Drive para imagenes de productos.
 * 3. Pegar el ID de esa carpeta en IMAGE_FOLDER_ID.
 * 4. Publicar como Web App: Ejecutar como "Yo" y acceso "Cualquiera".
 * 5. Copiar la URL publica del deploy en PRODUCTS_API_URL del frontend.
 *
 * Columnas esperadas en la hoja "productos":
 * id | activo | orden | categoria | nombre | descripcion | aroma | precio
 * nombreImagen | whatsapp | stock | cantidadStock | destacado
 *
 * Logica de stock:
 * - activo = NO  → el producto no se incluye en la respuesta.
 * - stock = SI   → disponible para agregar al pedido.
 * - stock = NO   → visible como referencia, sin posibilidad de agregar al carrito.
 * - cantidadStock → campo interno del administrador, no se usa en el frontend.
 *
 * Venta: a demanda por WhatsApp. No se usan links de pago por producto.
 */

// Cambiar si la hoja tiene otro nombre.
const SHEET_NAME = "productos";
// Opcional: catálogo maestro para el desplegable múltiple de productos.aroma.
const AROMAS_SHEET_NAME = "aromas";

// CACHE_SECONDS define durante cuanto tiempo Apps Script reutiliza el JSON generado.
// Reducirlo si el cliente necesita ver cambios casi inmediatos.
const CACHE_SECONDS = 300;
const CACHE_KEY = "calefica_catalogo_productos_v3_selector_aromas";

// Si Apps Script no abre desde la planilla, crear el script desde script.google.com
// y pegar aca el ID de la Google Sheet. Si se deja vacio, usa la planilla activa.
const SPREADSHEET_ID = "1AvIPysHm531nCfZ0ynotGB2ZzZDGHHqf5ILwhtStq44";

// Pegar aca el ID de la carpeta "02 - Imagenes productos".
const IMAGE_FOLDER_ID = "1gXucIRT653zxXAn9TNO6TBCxnXEl08cP";

// Numero global usado cuando la fila no define whatsapp.
const DEFAULT_WHATSAPP_NUMBER = "549XXXXXXXXXX";

// Si esta en true, el script intenta dejar publicas las imagenes que encuentra.
// Esto evita que la landing muestre errores de permisos al cargar fotos desde Drive.
const AUTO_SHARE_IMAGES = true;

function doGet() {
  try {
    const cache = CacheService.getScriptCache();
    const cachedResponse = cache.get(CACHE_KEY);
    if (cachedResponse) {
      return jsonResponse(JSON.parse(cachedResponse));
    }

    const payload = buildProductsResponse();
    cache.put(CACHE_KEY, JSON.stringify(payload), CACHE_SECONDS);
    return jsonResponse(payload);
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error.message || "Error inesperado al cargar el catalogo.",
    });
  }
}

function buildProductsResponse() {
  const spreadsheet = getSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error(`No existe la hoja "${SHEET_NAME}".`);

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return { ok: true, total: 0, productos: [] };
  }

  const headers = values[0].map(normalizeHeader);
  const rawProducts = values
    .slice(1)
    .map(row => rowToRawProduct(row, headers))
    .filter(producto => normalizeYesNo(producto.activo) === "SI");

  // Se consulta Drive cuando al menos un producto tiene nombreImagen definido.
  const shouldReadDriveFolder = rawProducts.some(producto =>
    String(producto.nombreImagen || "").trim()
  );
  const imageMap = shouldReadDriveFolder ? getImageMap() : {};
  const aromaCatalog = readAromaCatalog(spreadsheet);

  const productos = rawProducts
    .map(producto => normalizeProduct(producto, imageMap, aromaCatalog))
    .sort((a, b) => Number(a.orden || 9999) - Number(b.orden || 9999));

  return {
    ok: true,
    total: productos.length,
    productos,
  };
}

function getSpreadsheet() {
  if (SPREADSHEET_ID && !SPREADSHEET_ID.includes("PEGAR_ID")) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }

  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!activeSpreadsheet) {
    throw new Error("No hay planilla activa. Pegá el ID de la Google Sheet en SPREADSHEET_ID.");
  }

  return activeSpreadsheet;
}

function rowToRawProduct(row, headers) {
  const item = {};
  headers.forEach((header, index) => {
    item[header] = row[index];
  });
  return item;
}

function readAromaCatalog(spreadsheet) {
  const sheet = spreadsheet.getSheetByName(AROMAS_SHEET_NAME);
  if (!sheet) return null;
  const values = sheet.getDataRange().getValues();
  if (!values.length || values[0].every(value => !String(value).trim())) return [];
  const headers = values[0].map(normalizeHeader);
  if (!headers.includes("nombre") || !headers.includes("color")) {
    throw new Error('La hoja "aromas" debe tener las columnas "nombre" y "color".');
  }
  const rows = values.slice(1).map(row => rowToRawProduct(row, headers));
  const names = new Set();
  const ids = new Set();
  rows.filter(row => String(row.nombre || "").trim()).forEach(row => {
    const name = String(row.nombre).trim();
    const nameKey = aromaLookupKey(name);
    const idKey = aromaLookupKey(row.id || name);
    if (/[,;\r\n|]/.test(name)) throw new Error('Los nombres de la hoja "aromas" no deben incluir comas, punto y coma, saltos de línea ni |.');
    if (names.has(nameKey) || ids.has(idKey)) throw new Error('Cada nombre e id de la hoja "aromas" debe ser único.');
    names.add(nameKey);
    ids.add(idKey);
  });
  return normalizeAromas(rows);
}

function aromaLookupKey(value) {
  return String(value || "").trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function resolveProductAromas(value, aromaCatalog) {
  const text = String(value || "").trim();
  // Conserva el formato anterior incluso cuando existe la hoja maestra.
  if (aromaCatalog == null || text.includes("|") || text.startsWith("[")) {
    return normalizeAromas(value);
  }
  const selected = new Set(text.split(/[,;\r\n]+/).map(aromaLookupKey).filter(Boolean));
  return aromaCatalog.filter(aroma => selected.has(aromaLookupKey(aroma.nombre)) || selected.has(aromaLookupKey(aroma.id)));
}

function normalizeProduct(item, imageMap, aromaCatalog = null) {
  const nombreImagen = String(item.nombreImagen || "").trim();
  const imagenUrl = nombreImagen && imageMap[nombreImagen] ? imageMap[nombreImagen] : "";
  const aromas = resolveProductAromas(item.aroma, aromaCatalog);

  return {
    id: String(item.id || "").trim(),
    activo: normalizeYesNo(item.activo),
    orden: Number(item.orden) || 9999,
    categoria: String(item.categoria || "").trim(),
    nombre: String(item.nombre || "").trim(),
    descripcion: String(item.descripcion || "").trim(),
    aroma: aromas.map(aroma => aroma.nombre).join(", "),
    aromas,
    precio: Number(item.precio) || 0,
    nombreImagen,
    imagenUrl,
    whatsapp: String(item.whatsapp || DEFAULT_WHATSAPP_NUMBER).trim(),
    stock: normalizeYesNo(item.stock),
    // cantidadStock es campo interno: se pasa al JSON pero el frontend no lo muestra.
    cantidadStock: String(item.cantidadStock || "").trim(),
    destacado: normalizeYesNo(item.destacado),
  };
}


function getImageMap() {
  if (!IMAGE_FOLDER_ID || IMAGE_FOLDER_ID.includes("PEGAR_ID")) return {};

  const folder = DriveApp.getFolderById(IMAGE_FOLDER_ID);
  const files = folder.getFiles();
  const map = {};

  while (files.hasNext()) {
    const file = files.next();
    const name = file.getName();
    const fileId = file.getId();

    if (AUTO_SHARE_IMAGES) {
      try {
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch (error) {
        // Si la cuenta/organizacion no permite compartir publico, igual devolvemos la URL.
      }
    }

    // URL estable para mostrar imagenes de Drive en sitios externos.
    // Si una imagen no se ve, revisar que el archivo permita "cualquiera con el enlace".
    map[name] = `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
  }

  return map;
}

function normalizeHeader(value) {
  return String(value || "").trim();
}

function normalizeYesNo(value) {
  const text = String(value || "NO").trim().toUpperCase();
  return text === "SI" || text === "SÍ" || text === "YES" || text === "TRUE" ? "SI" : "NO";
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

// El mismo normalizador se incluye en Apps Script para mantener ambos formatos compatibles.
function normalizeAromas(value) {
  const enabled = (value, fallback) => {
    if (value == null || value === "") return fallback;
    return ["SI", "TRUE", "YES", "1"].includes(String(value).trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase());
  };
  let rows = value;
  if (!Array.isArray(rows)) {
    const text = String(value || "").trim();
    if (!text) return [];
    if (text.startsWith("[")) {
      try { rows = JSON.parse(text); } catch { return []; }
      if (!Array.isArray(rows)) return [];
    } else if (text.includes("|")) {
      rows = text.split(/[;\r\n]+/).filter(row => row.trim()).map(row => {
        const [nombre, color, activo, orden, predeterminado, id] = row.split("|").map(cell => cell.trim());
        return { nombre, color, activo, orden, predeterminado, id };
      });
    } else {
      rows = [{ nombre: text }];
    }
  }
  const seen = new Set();
  return rows.map((row, index) => {
    const item = typeof row === "string" ? { nombre: row } : row || {};
    const nombre = String(item.nombre || "").trim();
    const id = String(item.id || nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()).trim();
    const color = String(item.color || "").trim();
    const order = item.orden == null || item.orden === "" ? index : Number(item.orden);
    return {
      id, nombre,
      color: /^#[0-9a-f]{6}$/i.test(color) ? color : null,
      activo: enabled(item.activo, true),
      orden: Number.isFinite(order) ? order : index,
      predeterminado: enabled(item.predeterminado, false),
    };
  }).filter(item => {
    if (!item.nombre || !item.activo || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  }).sort((a, b) => a.orden - b.orden);
}
