console.log("[CRM] filters.js carregado");

export function filtrarPorTexto(lista, texto) {
  texto = texto.toLowerCase();

  return lista.filter(i =>
    JSON.stringify(i).toLowerCase().includes(texto)
  );
}

export function filtrarPorPeriodo(lista, periodo) {
  const agora = new Date();
  const msDia = 86400000;

  return lista.filter(item => {
    const data = new Date(item.criadoEm.seconds * 1000);

    switch (periodo) {
      case "hoje":
        return data.toDateString() === agora.toDateString();
      case "7dias":
        return (agora - data) <= msDia * 7;
      case "mes":
        return data.getMonth() === agora.getMonth();
      case "ano":
        return data.getFullYear() === agora.getFullYear();
      default:
        return true;
    }
  });
}
