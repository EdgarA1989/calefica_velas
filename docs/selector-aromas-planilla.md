# Aromas disponibles desde el desplegable de Google Sheets

Cada producto ofrece en su detalle web todas las opciones configuradas en el
menú desplegable de su celda `aroma` (también se admite el encabezado `aromas`).
El cliente elige una en la web y esa variante queda guardada en el carrito.
El valor seleccionado dentro de la planilla no limita las opciones ofrecidas.

## Activar esta versión una sola vez

Copiar `google-apps-script/catalogo-productos.gs` actualizado a Apps Script.
Ir a Implementar → Gestionar implementaciones → Editar → Nueva versión → Implementar.
Conservar la misma implementación y URL.

## Administrar las opciones en la planilla

1. En `productos`, seleccionar las celdas de la columna `aroma`, sin el encabezado
   (en la plantilla original, `G2:G`).
2. Ir a Datos → Validación de datos y editar su regla.
3. Con Menú desplegable, agregar o quitar elementos de la lista y guardar.
   No es necesario activar selección múltiple ni marcar todos los aromas en la celda.
4. También se admite Menú desplegable (de un intervalo): la web toma todas las
   opciones no vacías de ese intervalo.
5. Esperar hasta 5 minutos por la caché y recargar la web.

Si la regla se aplica a toda la columna, todos esos productos ofrecen la misma lista.
Para ofrecer listas distintas, configurar una regla diferente en las celdas correspondientes.
Una celda vacía que tiene un desplegable sigue ofreciendo todas sus opciones.
Para dejar un producto sin opciones, quitarle la regla y vaciar el contenido de la celda.

## Colores y estado activo (opcional)

La pestaña `aromas` permite asignar metadatos a los nombres del desplegable:

| nombre | color | activo | orden | predeterminado | id |
|---|---|---|---|---|---|
| Lavanda | #B7A0D4 | SI | 1 | SI | lavanda |
| Vainilla | #E8D5A8 | SI | 2 | NO | vainilla |

Los nombres son ejemplos y deben reemplazarse por los aromas reales.
Esta pestaña agrega metadatos a las opciones del desplegable. Las opciones que aún
no tienen una fila allí se muestran con un círculo neutro; las deshabilitadas se excluyen.
Editar `color` cambia el color en la web; el color visual del chip de Sheets no se transmite.
`activo = NO` retira el aroma de la web, aunque siga estando en el desplegable.
`orden` define el orden web y `predeterminado = SI` la selección inicial.
Mantener `id` al renombrar un aroma y actualizar su nombre también en el desplegable.
Sin pestaña maestra, se muestran todas las opciones en el orden del desplegable y con
círculos neutros, sin inventar colores.

## Compatibilidad

Las celdas sin desplegable siguen aceptando el formato anterior de texto simple,
líneas `Nombre|#HEXCOLOR|activo|orden|predeterminado|id` o JSON.
Si existe una regla de desplegable, sus opciones tienen prioridad sobre el texto de la celda.

Referencia técnica: https://developers.google.com/apps-script/reference/spreadsheet/data-validation
