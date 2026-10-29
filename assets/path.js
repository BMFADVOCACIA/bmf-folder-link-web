/* BMF Folder Link Web: caminho relativo => protocolo local v1.1. */
(function (root) {
  'use strict';
  const PREFIX = '#/onedrive/';
  const PROTOCOL = 'bmf-pasta://onedrive/';
  const RESERVED = /^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i;
  const BAD = /[\\/:*?"<>|\x00-\x1f\x7f]/;

  function resolveHash(hash) {
    if (typeof hash !== 'string' || !hash.startsWith(PREFIX)) {
      throw new Error('Link invalido: formato esperado #/onedrive/Pasta/Subpasta.');
    }
    const suffix = hash.slice(PREFIX.length);
    const rawSegments = suffix === '' ? [] : suffix.split('/');
    const segments = rawSegments.map(function (raw) {
      if (!raw || /%(?![0-9A-Fa-f]{2})/.test(raw)) {
        throw new Error('Segmento vazio ou codificacao invalida.');
      }
      let name;
      try { name = decodeURIComponent(raw); }
      catch (_) { throw new Error('Codificacao invalida no nome da pasta.'); }
      if (!name || name.length > 255 || name === '.' || name === '..' ||
          BAD.test(name) || /[. ]$/.test(name) || RESERVED.test(name)) {
        throw new Error('Nome de pasta nao permitido.');
      }
      return name;
    });
    const encoded = segments.map(encodeURIComponent).join('/');
    const protocolUrl = PROTOCOL + encoded;
    if (protocolUrl.length > 2048) {
      throw new Error('Link excede o limite de 2048 caracteres.');
    }
    return { label: segments.length ? segments.join(' / ') : 'Raiz do OneDrive', protocolUrl };
  }

  const api = { resolveHash };
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.BMFFolderLinkPath = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
