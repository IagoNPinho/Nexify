console.log('[nxf-crm] entry script loaded');

import './firebase-config.js';       // relativo: mesmo diretório
import './crm-clientes.js';
import './crm-financeiro.js';
import './crm-dashboard.js';
import './crm-filters.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('[nxf-crm] DOMContentLoaded fired');
});

// Navegação
document.querySelectorAll(".sidebar nav a").forEach(link => {
  link.onclick = () => {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.querySelector(`#${link.dataset.page}`).classList.add("active");

    document.querySelectorAll(".sidebar nav a").forEach(a => a.classList.remove("active"));
    link.classList.add("active");
  };
});
