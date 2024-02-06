import { 
  ResultadoLineaTicket,
  TicketFinal,
  ResultadoTotalTicket,
} from "./modelo";

import {
  calcularDesgloseIva,
  calcularTotalSinIva,
  calcularTotalConIva
} from "./calcularticket.helpers"

export const calcularTotalTicket = (lineasCalculadas: ResultadoLineaTicket[]): TicketFinal => {
  if (!lineasCalculadas) {
    throw new Error("Los parámetros introducidos no son correctos");
  }

  // Calcular total sin IVA
  const totalSinIva = calcularTotalSinIva(lineasCalculadas);

  // Calcular total con IVA
  const totalConIva = calcularTotalConIva(lineasCalculadas);

  // Calcular desglose del IVA
  const desgloseIva = calcularDesgloseIva(lineasCalculadas);

  // Resultado total del ticket
  const resultadoTotal: ResultadoTotalTicket = {
    totalSinIva: Number(totalSinIva.toFixed(2)),
    totalConIva: Number(totalConIva.toFixed(2)),
    totalIva: Number((totalConIva - totalSinIva).toFixed(2)),
  };

  // Construir resultado final
  const resultadoFinal: TicketFinal = {
    lineas: lineasCalculadas,
    total: resultadoTotal,
    desgloseIva,
  };

  return resultadoFinal;
};