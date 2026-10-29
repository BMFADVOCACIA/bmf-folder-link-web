'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveHash } = require('../assets/path.js');

test('raiz do OneDrive', () => {
  assert.deepEqual(resolveHash('#/onedrive/'), { label: 'Raiz do OneDrive', protocolUrl: 'bmf-pasta://onedrive/' });
});
test('pasta com espacos', () => {
  assert.deepEqual(resolveHash('#/onedrive/Ambiente%20de%20Trabalho'), {
    label: 'Ambiente de Trabalho', protocolUrl: 'bmf-pasta://onedrive/Ambiente%20de%20Trabalho'
  });
});
test('subpastas com acentos e espacos', () => {
  const target = resolveHash('#/onedrive/Clientes%20Previdenci%C3%A1rios/P/CLIENTE%20EXEMPLO');
  assert.equal(target.protocolUrl, 'bmf-pasta://onedrive/Clientes%20Previdenci%C3%A1rios/P/CLIENTE%20EXEMPLO');
  assert.equal(target.label, 'Clientes Previdenciários / P / CLIENTE EXEMPLO');
});
test('rejeita protocolo inesperado, hash vazio e paths vazios', () => {
  for (const s of ['', '#/foo/x', '#/onedrive/A//B', '#/onedrive/A/']) assert.throws(() => resolveHash(s));
});
test('rejeita travessia, barras codificadas, bytes de controle e nomes Windows invalidos', () => {
  for (const s of ['..', '%2E%2E', '.', 'A%2FB', 'A%5CB', 'A%00B', 'A%0AB', 'CON', 'NUL.txt', 'A.', 'A%20', 'A%3AB']) {
    assert.throws(() => resolveHash('#/onedrive/' + s), s);
  }
});
test('rejeita codificacao invalida', () => {
  for (const s of ['A%ZZ', 'A%E0%A4%A', 'A%']) assert.throws(() => resolveHash('#/onedrive/' + s), s);
});
test('nao permite URL demasiado longa e preserva percentual literal valido', () => {
  const long = '#/onedrive/' + new Array(12).fill('X'.repeat(200)).join('/');
  assert.throws(() => resolveHash(long), /2048/);
  assert.equal(resolveHash('#/onedrive/100%25').protocolUrl, 'bmf-pasta://onedrive/100%25');
});
