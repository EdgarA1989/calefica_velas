# Manual cliente — Catálogo Calefica

## Estructura en Google Drive

Crear una carpeta principal llamada `Cliente - Velas de Soja` con:

- `01 - Catálogo`: Google Sheet `productos_velas_soja`.
- `02 - Imagenes productos`: fotos de productos (subir aquí las imágenes).
- `03 - Imagenes web`: imágenes generales de la landing.
- `04 - Manual cliente`: este instructivo.

---

## Hoja productos

La Google Sheet debe tener una hoja llamada **`productos`** con estas columnas en la fila 1:

```
id | activo | orden | categoria | nombre | descripcion | aroma | precio | nombreImagen | whatsapp | stock | cantidadStock | destacado
```

> **Importante:** no cambiar el nombre de las columnas ni el nombre de la hoja. El sistema las lee exactamente como están escritas.

---

## Descripción de cada columna

| Columna | Descripción |
|---|---|
| `id` | Identificador interno del producto. No modificar salvo indicación. |
| `activo` | `SI` = el producto aparece en la web. `NO` = el producto se oculta completamente. |
| `orden` | Define el orden de aparición en el catálogo. Números menores aparecen primero. |
| `categoria` | Agrupa los productos en el menú de categorías. |
| `nombre` | Nombre visible del producto en la web. |
| `descripcion` | Descripción visible del producto. |
| `aroma` | Aroma o variante del producto. |
| `precio` | Precio visible en la web. Escribir solo el número, sin `$` ni puntos. Ejemplo: `22000`. |
| `nombreImagen` | Nombre exacto del archivo de imagen subido en la carpeta `02 - Imagenes productos`. Ejemplo: `vela-lavanda-soft.jpg`. |
| `whatsapp` | Número que recibirá el pedido o consulta. Formato: `549XXXXXXXXXX` (código de país + código de área sin 0 + número sin 15). |
| `stock` | `SI` = producto disponible para agregar al pedido. `NO` = se muestra en gris con etiqueta "Sin stock", sin posibilidad de agregar al carrito. |
| `cantidadStock` | Campo interno para control del administrador. **No se muestra en la web.** Puede completarse libremente para seguimiento propio. |
| `destacado` | `SI` = muestra etiqueta "Destacado" sobre el producto. `NO` = producto sin etiqueta especial. |

---

## Lógica de stock

### stock = SI
- El producto se muestra normalmente.
- Se puede agregar al pedido/carrito.
- No se muestra ningún texto de disponibilidad.

### stock = NO
- El producto **sigue visible** si `activo = SI`.
- Aparece con menor opacidad o en gris, con etiqueta **"Sin stock"**.
- No se puede agregar al carrito ni enviar como pedido.
- Queda visible solo como referencia para la clienta.

### activo = NO
- El producto **no aparece** en la web bajo ninguna circunstancia.

---

## Cómo gestionar productos

**Para mostrar un producto:**
Poner `SI` en `activo`.

**Para ocultarlo completamente:**
Poner `NO` en `activo`.

**Para marcarlo como agotado (visible pero sin venta):**
Poner `NO` en `stock`.

**Para volver a habilitarlo:**
Poner `SI` en `stock`.

**Para destacarlo:**
Poner `SI` en `destacado`.

**Para cambiar el orden:**
Editar el número en `orden`. El menor número aparece primero.

---

## Imágenes de productos

1. Subir la imagen a la carpeta `02 - Imagenes productos` en Google Drive.
2. Escribir el nombre exacto del archivo (con extensión) en la columna `nombreImagen`.
3. Asegurarse de que el archivo esté compartido como "Cualquiera con el enlace puede ver".

**Formatos recomendados:** `.jpg`, `.png`, `.webp`
**Tamaño recomendado:** 800×800 px o más, fondo neutro.

---

## Forma de venta

Los pedidos se gestionan **a demanda por WhatsApp**. La clienta arma su selección en la web y envía el pedido directamente a la vendedora. No se usa Mercado Pago ni QR por producto en esta etapa.

---

## Reglas importantes

- No borrar la fila 1 (cabecera de columnas).
- No cambiar el nombre de las columnas.
- No cambiar el nombre de la hoja `productos`.
- No usar símbolos en `precio` (sin `$`, sin `.`).
- Usar siempre `SI` o `NO` en mayúsculas. No usar "sí", "sii", "ok", "disponible" ni variantes.
- El campo `cantidadStock` es opcional e interno — no afecta la web.

---

## Validaciones recomendadas en Google Sheets

Para evitar errores, aplicar validación de datos en las siguientes columnas:

| Columna | Valores permitidos | Color sugerido |
|---|---|---|
| `activo` | SI / NO | Verde suave = SI / Rojo suave = NO |
| `stock` | SI / NO | Verde suave = SI / Gris = NO |
| `destacado` | SI / NO | Verde suave = SI / Sin color = NO |
| `cantidadStock` | Número | Amarillo suave (campo interno) |

---

## Caché y velocidad

- Apps Script guarda el catálogo generado durante **5 minutos**.
- La web guarda el último catálogo válido en el navegador para mostrarlo al instante aunque no haya conexión.
- Si se cambia un producto en la planilla, puede tardar hasta 5 minutos en reflejarse en la web.

---

## Configuración técnica

En `google-apps-script/catalogo-productos.gs` cambiar:

- `SPREADSHEET_ID`: ID de la Google Sheet de productos.
- `IMAGE_FOLDER_ID`: ID de la carpeta `02 - Imagenes productos`.
- `DEFAULT_WHATSAPP_NUMBER`: número de WhatsApp general.
- `CACHE_SECONDS`: duración del caché del catálogo en Apps Script.

En `js/main.js` cambiar:

- `PRODUCTS_API_URL`: URL pública del deploy de Google Apps Script.
- `BRAND_CONFIG.whatsappNumber`: número de WhatsApp global de la marca.
