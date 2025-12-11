import { db } from "./firebase-config.js";
import {
  collection, addDoc, serverTimestamp,
  query, orderBy, onSnapshot
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

console.log("[CRM] financeiro.js carregado");

// ELEMENTOS
const formFin = document.getElementById("formFinanceiro");
const tbodyFin = document.querySelector("#listaFinanceiro tbody");
const selectClienteEntrada = document.getElementById("clienteEntrada");

/* ============================================================
   RENDERIZAÇÃO DE TABELA
============================================================ */
export function renderTabelaFinanceiro(lista) {
  if (!tbodyFin) return;

  tbodyFin.innerHTML = "";
  lista.forEach(f => {
    const criado = f.criadoEm?.seconds
      ? new Date(f.criadoEm.seconds * 1000).toLocaleString()
      : "-";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${f.tipo}</td>
      <td>R$ ${f.valor.toFixed(2)}</td>
      <td>${f.categoria || "-"}</td>
      <td>${f.metodo || "-"}</td>
      <td>${f.clienteNome || "-"}</td>
      <td>${f.descricao || "-"}</td>
      <td>${criado}</td>
    `;
    tbodyFin.appendChild(tr);
  });
}

/* ============================================================
   SNAPSHOT (RECEBE DO FIRESTORE)
============================================================ */
export function listenFinanceiro() {
  const q = query(collection(db, "financeiro"), orderBy("criadoEm", "desc"));

  onSnapshot(q, (snapshot) => {
    const lista = snapshot.docs.map(doc => ({
      id: doc.id, ...doc.data()
    }));

    window.FINANCEIRO_CACHE = lista;

    renderTabelaFinanceiro(lista);
  });
}

/* ============================================================
   ADICIONAR LANÇAMENTO (ENVIA PARA FIRESTORE)
============================================================ */
export async function handleAddFinanceiro(e) {
  e.preventDefault();

  const tipo = document.getElementById("finTipo").value;
  const valor = parseFloat(document.getElementById("finValor").value);
  const categoria = document.getElementById("finCategoria").value;
  const metodo = document.getElementById("finMetodo").value;
  const desc = document.getElementById("finDesc").value;

  let clienteId = null;
  let clienteNome = null;

  if (tipo === "entrada") {
    clienteId = selectClienteEntrada.value;

    if (!clienteId) {
      return alert("Selecione um cliente para registrar a ENTRADA.");
    }

    const cli = window.CLIENTES_CACHE.find(c => c.id === clienteId);
    clienteNome = cli?.nome || "Cliente não encontrado";
  }

  await addDoc(collection(db, "financeiro"), {
    tipo,
    valor,
    categoria,
    metodo,
    descricao: desc,
    clienteId,
    clienteNome,
    criadoEm: serverTimestamp()
  });

  formFin.reset();
}

/* ============================================================
   AUTO-INICIALIZAÇÃO
============================================================ */
if (formFin) {
  formFin.addEventListener("submit", handleAddFinanceiro);
}

listenFinanceiro();
