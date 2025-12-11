import { db } from "./firebase-config.js";
import {
  collection, addDoc, serverTimestamp,
  query, orderBy, onSnapshot
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

console.log("[CRM] clientes.js carregado");

// ELEMENTOS
const formCliente = document.getElementById("formCliente");
const tbodyClientes = document.querySelector("#listaClientes tbody");

// SELECT usado no financeiro.js
const SELECT_CLIENTE_ENTRADA = document.getElementById("clienteEntrada");

// ESCAPE seguro
function escapeHTML(s = "") {
  return String(s).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#39;'
  }[m]));
}

/* ============================================================
   RENDERIZAÇÃO DE TABELA
============================================================ */
export function renderTabelaClientes(lista) {
  if (!tbodyClientes) return;
  tbodyClientes.innerHTML = "";

  lista.forEach(c => {
    const criado = c.criadoEm?.seconds
      ? new Date(c.criadoEm.seconds * 1000).toLocaleString()
      : "-";

    const tr = document.createElement("tr");
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

/* ============================================================
   POPULAR SELECTS
============================================================ */
export function populateClientSelect(selectEl, lista) {
  if (!selectEl) return;

  selectEl.innerHTML = `<option value="">Selecione um cliente...</option>`;
  lista.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.nome;
    selectEl.appendChild(opt);
  });
}

/* ============================================================
   SNAPSHOT (RECEBE DO FIRESTORE)
============================================================ */
export function listenClientes() {
  const q = query(collection(db, "clientes"), orderBy("criadoEm", "desc"));

  onSnapshot(q, (snapshot) => {
    const clientes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Cache global (acesso no financeiro.js e dashboard.js)
    window.CLIENTES_CACHE = clientes;

    renderTabelaClientes(clientes);

    if (SELECT_CLIENTE_ENTRADA) {
      populateClientSelect(SELECT_CLIENTE_ENTRADA, clientes);
    }
  });
}

/* ============================================================
   ADICIONAR CLIENTE (ENVIA PARA FIRESTORE)
============================================================ */
export async function handleAddCliente(e) {
  e.preventDefault();

  const nome = document.getElementById("cliNome")?.value.trim();
  const telefone = document.getElementById("cliTelefone")?.value.trim();
  const email = document.getElementById("cliEmail")?.value.trim();
  const status = document.getElementById("cliTipo")?.value;
  const origem = document.getElementById("cliOrigem")?.value;
  const obs = document.getElementById("cliObs")?.value;

  if (!nome) return alert("Nome é obrigatório.");

  try {
    const ref = await addDoc(collection(db, "clientes"), {
      nome, telefone, email,
      status, origem,
      observacoes: obs,
      criadoEm: serverTimestamp()
    });
    console.log("OK", ref.id);
  } catch (err) {
    console.error("ERRO FIRESTORE:", err);
  }

  formCliente.reset();
  console.log("Cliente cadastrado via Firestore");
}

function initFormListener(){
  const formCliente = document.getElementById("formCliente");

  if (!formCliente) {
    console.error("[CRM] Formulário #formCliente NÃO encontrado no DOM.");
    return;
  } else {
    console.log("[CRM] Listener de submit conectado ao formCliente");
    formCliente.addEventListener("submit", handleAddCliente);

    listenClientes();
  }
}

/* ============================================================
   AUTO-INICIALIZAÇÃO
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initFormListener();
});
