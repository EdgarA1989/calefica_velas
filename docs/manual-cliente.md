# Manual cliente - Catalogo Calefica

## Estructura en Google Drive

Crear una carpeta principal llamada `Cliente - Velas de Soja` con:

- `01 - Catalogo`: Google Sheet `productos_velas_soja`.
- `02 - Imagenes productos`: fotos de productos.
- `03 - Imagenes web`: imagenes generales de la landing.
- `04 - Manual cliente`: este instructivo.

## Hoja productos

La Google Sheet debe tener una hoja llamada `productos` con estas columnas:

`id`, `activo`, `orden`, `categoria`, `nombre`, `descripcion`, `aroma`, `precio`, `imagenId`, `imagenUrl`, `nombreImagen`, `linkMercadoPago`, `linkQR`, `whatsapp`, `stock`, `destacado`

## Como editar productos

- Para mostrar un producto, poner `SI` en `activo`.
- Para ocultarlo, poner `NO` en `activo`.
- Para cambiar el orden, editar la columna `orden`.
- Para marcar sin stock, poner `NO` en `stock`.
- Para destacar un producto, poner `SI` en `destacado`.
- Para que cargue mas rapido, copiar el ID del archivo de Drive en `imagenId`.
- Si no se usa `imagenId`, se puede pegar una URL directa en `imagenUrl`.
- Si no se usa ninguna de las dos opciones anteriores, subir una imagen a `02 - Imagenes productos` y escribir el nombre exacto en `nombreImagen`.
- Si `linkMercadoPago` esta vacio, la web usa `linkQR`.
- Si ambos links estan vacios, el boton Comprar abre WhatsApp.

## Importante para imagenes

Las imagenes de productos deben estar compartidas de forma publica o visible para cualquier persona con el enlace. Si no, la web no podra mostrarlas.

Prioridad de imagen:

1. `imagenId`: opcion recomendada porque evita busquedas en Drive.
2. `imagenUrl`: util si la imagen ya esta publicada en otra URL.
3. `nombreImagen`: busca el archivo dentro de la carpeta de Drive.

## Cache y velocidad

- Apps Script guarda el catalogo generado durante 5 minutos.
- La web guarda el ultimo catalogo valido en el navegador para mostrarlo al instante.
- Si se cambia un producto en la planilla, puede tardar hasta 5 minutos en verse por el cache.

## Configuracion tecnica

En `google-apps-script/catalogo-productos.gs` cambiar:

- `IMAGE_FOLDER_ID`: ID de la carpeta `02 - Imagenes productos`.
- `DEFAULT_WHATSAPP_NUMBER`: numero general de WhatsApp.
- `CACHE_SECONDS`: duracion del cache del catalogo en Apps Script.

En `js/main.js` cambiar:

- `PRODUCTS_API_URL`: URL publica del deploy de Google Apps Script.
- `CATALOG_STORAGE_KEY`: clave de localStorage usada para cachear productos en el navegador.
- `DEFAULT_WHATSAPP_NUMBER` o `BRAND_CONFIG.whatsappNumber`: numero de WhatsApp global.
