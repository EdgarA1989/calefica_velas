const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

function app() {
  const data = new Map();
  const context = vm.createContext({
    console, Intl, encodeURIComponent,
    document: { addEventListener() {}, getElementById() { return null; } },
    localStorage: { getItem: key => data.get(key) || null, setItem: (key, value) => data.set(key, value) },
  });
  vm.runInContext(read('js/aromas.js') + '\n' + read('js/main.js'), context);
  return { context, run: code => vm.runInContext(code, context), data };
}

const aromas = 'Floral|#B7A0D4|SI|2|NO|floral;Cítrico|#E5CB72|SI|1|SI|citrico;Retirado|#FFFFFF|NO|0';

test('planilla: orden, activo, predeterminado, edición y compatibilidad', () => {
  const { context, run } = app();
  context.raw = aromas;
  assert.equal(run('normalizeAromas(raw).map(a => a.nombre).join(",")'), 'Cítrico,Floral');
  assert.equal(run('getDefaultAroma(normalizeProduct({ aroma: raw })).id'), 'citrico');
  assert.equal(run('normalizeAromas("Lavanda")[0].nombre'), 'Lavanda');
  assert.equal(run('normalizeAromas("Lavanda")[0].color'), null);
  assert.equal(run('normalizeAromas("").length'), 0);
  assert.equal(run('normalizeAromas("[{malformado]").length'), 0);
  assert.equal(run('normalizeAromas("Nuevo|#123456|SI|3")[0].color'), '#123456');
  assert.equal(run('normalizeAromas("Nuevo|red;Otra|#123456").length'), 2);
  assert.equal(run('normalizeAromas("Nuevo|red")[0].color'), null);
  assert.equal(run('normalizeProduct({ aroma: "Anterior", aromas: [] }).aromas.length'), 0);
  assert.equal(run('normalizeAromas("Floral|#B7A0D4|NO|1").length'), 0);
  assert.equal(run('normalizeAromas("Floral|#112233|SI|1")[0].color'), '#112233');
  assert.equal(run('normalizeAromas("Floral|#112233|SI|1;Nuevo|#445566|SI|2").length'), 2);
});

test('Apps Script y frontend interpretan exactamente los mismos datos', () => {
  const { run, context } = app();
  const backend = vm.createContext({});
  vm.runInContext(read('google-apps-script/catalogo-productos.gs'), backend);
  for (const raw of [aromas, '', 'Lavanda', 'Otro|#123456|SI|0', '[{"nombre":"Floral","color":"#B7A0D4"}]']) {
    context.raw = raw;
    backend.raw = raw;
    assert.equal(run('JSON.stringify(normalizeAromas(raw))'), vm.runInContext('JSON.stringify(normalizeAromas(raw))', backend));
  }
  backend.raw = aromas;
  const payload = JSON.parse(vm.runInContext('JSON.stringify(normalizeProduct({ id: "vela", aroma: raw }, {}))', backend));
  context.payload = payload;
  assert.equal(run('normalizeProduct(payload).aromas.length'), 2);
});

test('carrito: variantes separadas, agrupación, controles y mensajes', () => {
  const { run, context } = app();
  context.raw = aromas;
  run('const p = normalizeProduct({id:"vela", nombre:"Vela", precio:100, aroma:raw, stock:"SI"}); addToCart(p,2,p.aromas[0]); addToCart(p,3,p.aromas[1]); addToCart(p,1,p.aromas[0]);');
  assert.equal(run('getCart().length'), 2);
  assert.equal(run('getCart()[0].cantidad'), 3);
  assert.equal(run('calculateCartTotal()'), 600);
  run('increaseCartItem(getCart()[1].cartKey); decreaseCartItem(getCart()[0].cartKey)');
  assert.equal(run('getCart()[0].cantidad'), 2);
  assert.equal(run('getCart()[1].cantidad'), 4);
  assert.match(run('buildWhatsAppOrderMessage(getCart())'), /Aroma\/variante: Cítrico/);
  assert.match(run('buildWhatsAppOrderMessage(getCart())'), /Aroma\/variante: Floral/);
  assert.match(decodeURIComponent(run('getProductWhatsappUrl(p,1,p.aromas[1])')), /Aroma: Floral/);
  run('removeFromCart(getCart()[0].cartKey)');
  assert.equal(run('getCart().length'), 1);
  assert.equal(run('getCart()[0].aroma'), 'Floral');
});

test('desplegable de planilla: catálogo maestro, selección múltiple y bajas', () => {
  const backend = vm.createContext({});
  vm.runInContext(read('google-apps-script/catalogo-productos.gs'), backend);
  const run = code => vm.runInContext(code, backend);
  backend.grid = [
    ['nombre', 'color', 'activo', 'orden', 'predeterminado', 'id'],
    ['Floral', '#B7A0D4', 'SI', 2, 'NO', 'floral'],
    ['Cítrico', '#E5CB72', 'SI', 1, 'SI', 'citrico'],
    ['Retirado', '#FFFFFF', 'NO', 3, 'NO', 'retirado'],
  ];
  run('const spreadsheet = { getSheetByName() { return { getDataRange() { return { getValues() { return grid; } }; } }; } }; const master = readAromaCatalog(spreadsheet);');
  assert.equal(run('normalizeProduct({aroma:"Floral, Cítrico, Retirado, Eliminado"}, {}, master).aromas.map(a => a.nombre).join(",")'), 'Cítrico,Floral');
  assert.equal(run('resolveProductAromas("floral, citrico", master).length'), 2);
  assert.equal(run('resolveProductAromas("", master).length'), 0);
  assert.equal(run('resolveProductAromas("Eliminado", master).length'), 0);
  assert.equal(run('resolveProductAromas("Floral|#123456|SI|1", master)[0].color'), '#123456');
  assert.equal(run('resolveProductAromas("Texto anterior", null)[0].nombre'), 'Texto anterior');
  assert.equal(run('readAromaCatalog({getSheetByName(){return null;}})'), null);
  backend.grid[1][0] = 'Nombre nuevo';
  backend.grid[1][1] = '#123456';
  run('const renamed = readAromaCatalog(spreadsheet)');
  assert.equal(run('resolveProductAromas("Nombre nuevo", renamed)[0].id'), 'floral');
  assert.equal(run('resolveProductAromas("Nombre nuevo", renamed)[0].color'), '#123456');
  backend.grid.push(['Nuevo', '#223344', 'SI', 4, 'NO', 'nuevo']);
  assert.equal(run('resolveProductAromas("Nuevo", readAromaCatalog(spreadsheet))[0].id'), 'nuevo');
  backend.grid.push(['Nuevo', '#223344', 'SI', 5, 'NO', 'otro-id']);
  assert.throws(() => run('readAromaCatalog(spreadsheet)'), /único/);
});

test('sin aromas, pedidos anteriores y sincronización de variantes editadas o retiradas', () => {
  const { run, context } = app();
  context.raw = aromas;
  run('const p = normalizeProduct({id:"vela", aroma:raw, stock:"SI"}); addToCart(p,1,p.aromas[0]); addToCart(p,1,p.aromas[1]);');
  run('const updated = normalizeProduct({ id:"vela", stock:"SI", aroma:"Nombre nuevo|#123456|SI|1|NO|floral" }); syncCartWithProducts([updated])');
  assert.equal(run('getCart().length'), 1);
  assert.equal(run('getCart()[0].aroma'), 'Nombre nuevo');
  run('clearCart(); const noAroma = normalizeProduct({id:"simple", aroma:"", stock:"SI"}); addToCart(noAroma,1); syncCartWithProducts([noAroma]);');
  assert.equal(run('getCart()[0].aroma'), '');
  assert.equal(run('getCart().length'), 1);
  run('saveCart([{ id:"legacy", aroma:"Lavanda", cantidad:2, precio:10 }]); syncCartWithProducts([normalizeProduct({id:"legacy", stock:"SI", aroma:"Lavanda"})]);');
  assert.equal(run('getCart().length'), 1);
  assert.equal(run('getCart()[0].aroma'), 'Lavanda');
});
