'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

function loadPage(hash) {
  const elements = {};
  for (const id of ['open-link', 'folder-path', 'status', 'state']) {
    elements[id] = { hidden: true, textContent: '', href: '', dataset: {}, removeAttribute(name) { if (name === 'href') this.href = ''; } };
  }
  let listener = null;
  const context = {
    location: { hash },
    addEventListener(name, callback) { if (name === 'hashchange') listener = callback; },
    document: { getElementById(id) { return elements[id]; } }
  };
  context.window = context;
  context.globalThis = context;
  vm.createContext(context);
  for (const file of ['path.js', 'app.js']) {
    const source = fs.readFileSync(path.join(__dirname, '../assets/', file), 'utf8');
    vm.runInContext(source, context, { filename: file });
  }
  return { elements, navigate(hash) { context.location.hash = hash; listener(); } };
}

test('pagina exibe botao com protocolo para caminho confirmado', () => {
  const page = loadPage('#/onedrive/Ambiente%20de%20Trabalho');
  assert.equal(page.elements['open-link'].href, 'bmf-pasta://onedrive/Ambiente%20de%20Trabalho');
  assert.equal(page.elements['open-link'].hidden, false);
  assert.equal(page.elements['folder-path'].textContent, 'Ambiente de Trabalho');
  assert.equal(page.elements['state'].dataset.state, 'ready');
});
test('hash invalido remove link e falha fechada mesmo apos link valido', () => {
  const page = loadPage('#/onedrive/Ambiente%20de%20Trabalho');
  page.navigate('#/onedrive/..');
  assert.equal(page.elements['open-link'].href, '');
  assert.equal(page.elements['open-link'].hidden, true);
  assert.equal(page.elements['state'].dataset.state, 'error');
});
test('nao oferece link sem pasta', () => {
  const page = loadPage('');
  assert.equal(page.elements['open-link'].hidden, true);
  assert.equal(page.elements['state'].dataset.state, 'error');
});
