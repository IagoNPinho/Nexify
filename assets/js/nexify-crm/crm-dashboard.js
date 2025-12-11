import { db } from "./firebase-config.js";
import {
  collection, query, orderBy, onSnapshot
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

console.log("[CRM] dashboard.js carregado");

// ELEMENTOS
const cardEntradas = document.getElementById("card-entradas");
const cardSaidas = document.getElementById("card-saidas");
const cardSaldo = document.getElementById("card-saldo");

const tabelaUltEntradas = document.getElementById("ultimasEntradas");
const tabelaUltSaidas = document.getElementById("ultimasSaidas");

// GRÁFICO
let chart;

/* ============================================================
   GERAÇÃO DOS CARDS
============================================================ */
function atualizarCards(fin) {
  const entradas = fin.filter(f => f.tipo === "entrada").reduce((t, f) => t + f.valor, 0);
  const saidas = fin.filter(f => f.tipo === "saida").reduce((t, f) => t + f.valor, 0);
  const saldo = entradas - saidas;

  cardEntradas.textContent = `R$ ${entradas.toFixed(2)}`;
  cardSaidas.textContent = `R$ ${saidas.toFixed(2)}`;
  cardSaldo.textContent = `R$ ${saldo.toFixed(2)}`;
}

/* ============================================================
   ÚLTIMAS ENTRADAS/SAÍDAS
============================================================ */
function renderUltimos(fin) {
  if (tabelaUltEntradas) {
    tabelaUltEntradas.innerHTML = "";
    fin.filter(f => f.tipo === "entrada").slice(0, 5).forEach(f => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${f.clienteNome || "-"}</td>
        <td>R$ ${f.valor.toFixed(2)}</td>
        <td>${f.categoria}</td>
      `;
      tabelaUltEntradas.appendChild(tr);
    });
  }

  if (tabelaUltSaidas) {
    tabelaUltSaidas.innerHTML = "";
    fin.filter(f => f.tipo === "saida").slice(0, 5).forEach(f => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>R$ ${f.valor.toFixed(2)}</td>
        <td>${f.categoria}</td>
      `;
      tabelaUltSaidas.appendChild(tr);
    });
  }
}

/* ============================================================
   CHART.JS
============================================================ */
function renderChart(fin) {
  if (!document.getElementById("chart")) return;

  const labels = fin.map(f => new Date(f.criadoEm.seconds * 1000).toLocaleDateString());
  const valores = fin.map(f => f.valor);

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("chart"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Movimentação Financeira",
        data: valores,
        borderWidth: 2
      }]
    }
  });
}

/* ============================================================
   SNAPSHOT
============================================================ */
export function listenDashboard() {
  const q = query(collection(db, "financeiro"), orderBy("criadoEm", "desc"));

  onSnapshot(q, (snapshot) => {
    const lista = snapshot.docs.map(doc => ({
      id: doc.id, ...doc.data()
    }));

    window.FINANCEIRO_CACHE = lista;

    atualizarCards(lista);
    renderUltimos(lista);
    renderChart(lista);
  });
}

listenDashboard();
