# Selector de aromas en Google Sheets

Este formato permite administrar una lista maestra de aromas y elegir varios por
producto mediante un desplegable. El modal mantiene su selección de un solo aroma
para el pedido del cliente.

## 1. Actualizar Apps Script una vez

Copiar `google-apps-script/catalogo-productos.gs` al proyecto de Apps Script.
Ir a **Implementar → Gestionar implementaciones → Editar → Nueva versión → Implementar**.
Mantener la misma implementación para conservar la URL configurada en la web.
La versión anterior que solo leía aromas dentro de una celda no interpreta este desplegable.

## 2. Crear la pestaña aromas

En la misma planilla que contiene `productos`, crear una pestaña llamada exactamente
`aromas`. Pegar estos encabezados en A1 (separados por tabulaciones):

```text
nombre	color	activo	orden	predeterminado	id
```

Completar una fila por aroma real. Ejemplos ilustrativos:

| nombre | color | activo | orden | predeterminado | id |
|---|---|---|---|---|---|
| Lavanda | #B7A0D4 | SI | 1 | SI | lavanda |
| Vainilla | #E8D5A8 | SI | 2 | NO | vainilla |

Los nombres e identificadores deben ser únicos. Mantener el `id` al cambiar un nombre;
no incluir comas, punto y coma, saltos de línea ni `|` en los nombres.
`predeterminado = SI` define la selección inicial del modal cuando ese aroma está
asociado al producto. Si ninguno tiene SI, se usa el primero según `orden`.
El color hexadecimal de esta columna es el que utiliza la web; el color visual de las
etiquetas de Google Sheets no se transmite al catálogo.

## 3. Configurar el desplegable de productos

1. En `productos`, seleccionar las celdas de la columna `aroma`, desde la fila 2.
   En la plantilla actual es `G2:G`; comprobar el encabezado si se movieron columnas.
2. Abrir **Datos → Validación de datos → Añadir regla**.
3. Elegir **Menú desplegable (de un intervalo)**.
4. Usar el intervalo `aromas!A2:A`, incluyendo filas futuras.
5. Seleccionar el estilo de visualización **Chip** (etiqueta).
6. Activar **Permitir varias selecciones** y guardar la regla.

No incluir la fila de encabezados en el intervalo. Mantener las celdas actuales hasta
revisarlas: los valores antiguos con `|` siguen siendo compatibles con el script,
aunque Google Sheets puede marcarlos como fuera del desplegable. Reemplazarlos
progresivamente eligiendo las opciones del nuevo selector.

## 4. Agregar y quitar

- **Ofrecer un aroma en un producto:** abrir su desplegable y seleccionarlo.
- **Quitar un aroma de un producto:** volver a abrir el desplegable y desmarcarlo.
  Los demás productos mantienen sus selecciones.
- **Agregar un aroma nuevo a la lista:** agregar una fila a `aromas`, con nombre,
  color y `activo = SI`. El intervalo abierto `A2:A` lo incorpora al desplegable.
- **Deshabilitarlo en toda la web:** cambiar `activo` a `NO` en `aromas`. Puede seguir
  figurando en el desplegable de administración, pero no se envía al catálogo.
- **Eliminarlo definitivamente:** borrar su fila en `aromas` y quitarlo de las celdas
  de productos que lo tenían seleccionado. El script ignora nombres que ya no existen.
- **Cambiar el color o el orden:** editar su fila; se aplica a los productos asociados.
- **Renombrarlo:** editar `nombre`, mantener `id` y volver a seleccionar el nombre nuevo
  en los productos que lo usaban. Sheets no reemplaza automáticamente el texto viejo
  guardado en las celdas de productos.

No hace falta publicar el script después de cada edición. Esperar hasta 5 minutos
por la caché y recargar la web. Una celda `aroma` vacía oculta el selector del producto.
Cuando existe la hoja maestra, los nombres simples deben estar incluidos en ella.
Los formatos antiguos con `|` o JSON siguen leyéndose directamente desde la celda.

La selección múltiple de Sheets debe administrarse desde una computadora: actualmente
no permite seleccionar varias opciones desde el móvil, aunque la regla esté activada.

Referencia: [Ayuda oficial de Google Sheets](https://support.google.com/docs/answer/186103?hl=es).
