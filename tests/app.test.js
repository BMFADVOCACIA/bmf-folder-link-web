'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

function loadPage(hash, { throwOnAssign = false } = {}) {
  const elements = {};
  for (const id of ['open-link', 'folder-path', 'status', 'state']) {
    elements[id] = { hidden: true, textContent: '', href: '', dataset: {}, removeAttribute(name) { if (name === 'href') this.href = ''; } };
  }
  const attempts = [];
  let listener = null;
  const context = {
    location: {
      hash,
      assign(url) { attempts.push(url); if (throwOnAssign) throw new Error('Blocked by browser'); }
    },
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
  return { elements, attempts, navigate(nextHash) { context.location.hash = nextHash; listener(); } };
}

test('automaticamente tenta abrir a pasta validada ao carregar', () => {
  const page = loadPage('#/onedrive/Ambiente%20de%20Trabalho');
  assert.deepEqual(page.attempts, ['bmf-pasta://onedrive/Ambiente%20de%20Trabalho']);
  assert.equal(page.elements['open-link'].href, page.attempts[0]);
  assert.equal(page.elements['open-link'].hidden, false);
  assert.match(page.elements['status'].textContent, /Tentando abrir/i);
  assert.equal(page.elements['state'].dataset.state, 'ready');
});

test('mantem o link manual se a abertura automatica lancar erro', () => {
  const page = loadPage('#/onedrive/Ambiente%20de%20Trabalho', { throwOnAssign: true });
  assert.equal(page.attempts.length, 1);
  assert.equal(page.elements['open-link'].hidden, false);
  assert.equal(page.elements['open-link'].href, page.attempts[0]);
  assert.equal(page.elements['state'].dataset.state, 'ready');
});

test('link invalido nunca aciona o protocolo local e remove fallback anterior', () => {
  const page = loadPage('#/onedrive/..');
  assert.equal(page.attempts.length, 0);
  assert.equal(page.elements['open-link'].hidden, true);
  page.navigate('#/onedrive/Ambiente%20de%20Trabalho');
  assert.equal(page.attempts.length, 1);
  page.navigate('#/onedrive/A%2FB');
  assert.equal(page.attempts.length, 1);
  assert.equal(page.elements['open-link'].href, '');
  assert.equal(page.elements['open-link'].hidden, true);
  assert.equal(page.elements['state'].dataset.state, 'error');
});

test('sem pasta no endereco nao tenta abrir aplicativo externo', () => {
  const page = loadPage('');
  assert.deepEqual(page.attempts, []);
  assert.equal(page.elements['open-link'].hidden, true);
});
