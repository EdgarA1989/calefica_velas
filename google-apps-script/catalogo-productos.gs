/**
 * Calefica - API publica de catalogo
 *
 * Instrucciones rapidas:
 * 1. Crear una Google Sheet con una hoja llamada "productos".
 * 2. Crear una carpeta en Drive para imagenes de productos.
 * 3. Pegar el ID de esa carpeta en IMAGE_FOLDER_ID.
 * 4. Publicar como Web App: Ejecutar como "Yo" y acceso "Cualquiera".
 * 5. Copiar la URL publica del deploy en PRODUCTS_API_URL del frontend.
 */

// Cambiar si la hoja tiene otro nombre.
const SHEET_NAME = "productos";

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
    const spreadsheet = getSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error(`No existe la hoja "${SHEET_NAME}".`);

    const values = sheet.getDataRange().getValues();
    if (values.length < 2) {
      return jsonResponse({ ok: true, total: 0, productos: [] });
    }

    const headers = values[0].map(normalizeHeader);
    const imageMap = getImageMap();

    const productos = values
      .slice(1)
      .map(row => rowToProduct(row, headers, imageMap))
      .filter(producto => normalizeYesNo(producto.activo) === "SI")
      .sort((a, b) => Number(a.orden || 9999) - Number(b.orden || 9999));

    return jsonResponse({
      ok: true,
      total: productos.length,
      productos,
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error.message || "Error inesperado al cargar el catalogo.",
    });
  }
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

function rowToProduct(row, headers, imageMap) {
  const item = {};
  headers.forEach((header, index) => {
    item[header] = row[index];
  });

  const nombreImagen = String(item.nombreImagen || "").trim();
  const imagenUrl = nombreImagen && imageMap[nombreImagen]
    ? imageMap[nombreImagen]
    : "";

  return {
    id: String(item.id || "").trim(),
    activo: normalizeYesNo(item.activo),
    orden: Number(item.orden) || 9999,
    categoria: String(item.categoria || "").trim(),
    nombre: String(item.nombre || "").trim(),
    descripcion: String(item.descripcion || "").trim(),
    aroma: String(item.aroma || "").trim(),
    precio: Number(item.precio) || 0,
    nombreImagen,
    imagenUrl,
    linkMercadoPago: String(item.linkMercadoPago || "").trim(),
    linkQR: String(item.linkQR || "").trim(),
    whatsapp: String(item.whatsapp || DEFAULT_WHATSAPP_NUMBER).trim(),
    stock: normalizeYesNo(item.stock),
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
    map[name] = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
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
