// crm-clientes.js
console.log('[crm-clientes] module top');

import { db } from './firebase-config.js';
import {
  collection, addDoc, serverTimestamp,
  query, orderBy, onSnapshot
} from 'https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js';

// DOM refs usados dentro de init
let formCliente = null;
let tbodyClientes = null;
let SELECT_CLIENTE_ENTRADA = null;

// helper
function escapeHTML(s = "") {
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// render tabela
export function renderTabelaClientes(lista) {
  if (!tbodyClientes) return;
  tbodyClientes.innerHTML = "";
  lista.forEach(c => {
    const criado = c.criadoEm?.seconds ? new Date(c.criadoEm.seconds * 1000).toLocaleString() : "-";
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHTML(c.nome)}</td>
      <td>${escapeHTML(c.email || "-")}</td>
      <td>${escapeHTML(c.telefone || "-")}</td>
      <td>${escapeHTML(c.status || "-")}</td>
      <td>${escapeHTML(c.origem || "-")}</td>
      <td>${escapeHTML(c.observacoes || "-")}</td>
      <td>${criado}</td>
    `;
    tbodyClientes.appendChild(tr);
  });
}

// popular select
export function populateClientSelect(selectEl, lista = []) {
  if (!selectEl) return;
  selectEl.innerHTML = `<option value="">Selecione um cliente...</option>`;
  lista.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.nome;
    selectEl.appendChild(opt);
  });
}

// listener snapshot
export function listenClientes() {
  try {
    const q = query(collection(db, "clientes"), orderBy("criadoEm", "desc"));
    onSnapshot(q, (snapshot) => {
      const clientes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      window.CLIENTES_CACHE = clientes;
      renderTabelaClientes(clientes);
      if (SELECT_CLIENTE_ENTRADA) populateClientSelect(SELECT_CLIENTE_ENTRADA, clientes);
      console.log('[crm-clientes] onSnapshot updated — count:', clientes.length);
    }, (err) => {
      console.error('[crm-clientes] onSnapshot error:', err);
    });
  } catch (err) {
    console.error('[crm-clientes] listenClientes error:', err);
  }
}

// função pública de adicionar cliente
export async function handleAddCliente(e) {
  if (e && e.preventDefault) e.preventDefault();
  console.log('[crm-clientes] handleAddCliente called');

  // refetch form values (no closure)
  const nome = document.getElementById("cliNome")?.value.trim();
  const telefone = document.getElementById("cliTelefone")?.value.trim();
  const email = document.getElementById("cliEmail")?.value.trim();
  const status = document.getElementById("cliTipo")?.value || 'lead';
  const origem = document.getElementById("cliOrigem")?.value || '';
  const obs = document.getElementById("cliObs")?.value || '';

  if (!nome) {
    alert('Nome é obrigatório.');
    return;
  }

  try {
    console.log('[crm-clientes] adicionando documento para cliente:', nome)
    const ref = await addDoc(collection(db, "clientes"), {
      nome, telefone, email,
      status, origem,
      observacoes: obs,
      criadoEm: serverTimestamp()
    });
    console.log('[crm-clientes] addDoc OK id=', ref.id);
    if (formCliente) formCliente.reset();
  } catch (err) {
    console.error('[crm-clientes] addDoc error:', err);
    alert('Erro ao salvar cliente (ver console).');
  }
}

// inicializador seguro
function init() {
  console.log('[crm-clientes] init starting');
  formCliente = document.getElementById('formCliente');
  tbodyClientes = document.querySelector('#listaClientes tbody');
  SELECT_CLIENTE_ENTRADA = document.getElementById('clienteEntrada');

  if (formCliente) {
    // remove listeners duplicados (defensive)
    formCliente.removeEventListener('submit', handleAddCliente);
    formCliente.addEventListener('submit', handleAddCliente);
    console.log('[crm-clientes] submit listener attached to #formCliente');
  } else {
    console.warn('[crm-clientes] #formCliente not found at init()');
  }

  listenClientes();
}

// liga no DOMContentLoaded ou executa imediatamente se DOM já pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
