# Manual cliente - Catalogo Calefica

## Estructura en Google Drive

Crear una carpeta principal llamada `Cliente - Velas de Soja` con:

- `01 - Catalogo`: Google Sheet `productos_velas_soja`.
- `02 - Imagenes productos`: fotos de productos.
- `03 - Imagenes web`: imagenes generales de la landing.
- `04 - Manual cliente`: este instructivo.

## Hoja productos

La Google Sheet debe tener una hoja llamada `productos` con estas columnas:

`id`, `activo`, `orden`, `categoria`, `nombre`, `descripcion`, `aroma`, `precio`, `nombreImagen`, `linkMercadoPago`, `linkQR`, `whatsapp`, `stock`, `destacado`

## Como editar productos

- Para mostrar un producto, poner `SI` en `activo`.
- Para ocultarlo, poner `NO` en `activo`.
- Para cambiar el orden, editar la columna `orden`.
- Para marcar sin stock, poner `NO` en `stock`.
- Para destacar un producto, poner `SI` en `destacado`.
- Para cambiar la foto, subir una imagen a `02 - Imagenes productos` y escribir el nombre exacto en `nombreImagen`.
- Si `linkMercadoPago` esta vacio, la web usa `linkQR`.
- Si ambos links estan vacios, el boton Comprar abre WhatsApp.

## Importante para imagenes

Las imagenes de productos deben estar compartidas de forma publica o visible para cualquier persona con el enlace. Si no, la web no podra mostrarlas.

## Configuracion tecnica

En `google-apps-script/catalogo-productos.gs` cambiar:

- `IMAGE_FOLDER_ID`: ID de la carpeta `02 - Imagenes productos`.
- `DEFAULT_WHATSAPP_NUMBER`: numero general de WhatsApp.

En `js/main.js` cambiar:

- `PRODUCTS_API_URL`: URL publica del deploy de Google Apps Script.
- `DEFAULT_WHATSAPP_NUMBER` o `BRAND_CONFIG.whatsappNumber`: numero de WhatsApp global.
