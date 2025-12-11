import "/assets/js/nexify-crm/firebase-config.js";
import "/assets/js/nexify-crm/crm-clientes.js";
import "/assets/js/nexify-crm/crm-financeiro.js";
import "/assets/js/nexify-crm/crm-dashboard.js";
import "/assets/js/nexify-crm/crm-filters.js";

// Navegação
document.querySelectorAll(".sidebar nav a").forEach(link => {
  link.onclick = () => {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.querySelector(`#${link.dataset.page}`).classList.add("active");

    document.querySelectorAll(".sidebar nav a").forEach(a => a.classList.remove("active"));
    link.classList.add("active");
  };
});
