(function () {
  'use strict';
  const link = document.getElementById('open-link');
  const path = document.getElementById('folder-path');
  const status = document.getElementById('status');
  const state = document.getElementById('state');

  function render() {
    // O link do protocolo so e estabelecido apos validar o fragmento.
    link.removeAttribute('href');
    link.hidden = true;
    path.textContent = '';
    try {
      const result = window.BMFFolderLinkPath.resolveHash(window.location.hash);
      path.textContent = result.label;
      link.href = result.protocolUrl;
      link.hidden = false;
      status.textContent = 'Pasta identificada. Clique para abrir no Explorador.';
      state.dataset.state = 'ready';
    } catch (error) {
      status.textContent = error.message;
      state.dataset.state = 'error';
    }
  }

  window.addEventListener('hashchange', render);
  render();
})();
