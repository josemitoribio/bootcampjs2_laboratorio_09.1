import { 
  ResultadoLineaTicket,
  TicketFinal,
  ResultadoTotalTicket,
} from "./modelo";

import {
  calcularDesgloseIva
} from "./calcularticket.helpers"

export const calcularTotalTicket = (lineasCalculadas: ResultadoLineaTicket[]): TicketFinal => {
  if(!lineasCalculadas) {
    throw new Error("Los parámetros introducidos no son correctos");
  }

  const totalSinIva = lineasCalculadas.reduce((total, linea) => total + linea.precioSinIva, 0);
  const totalConIva = lineasCalculadas.reduce((total, linea) => total + linea.precioConIva, 0);

  const desgloseIva = calcularDesgloseIva(lineasCalculadas);

  const resultadoTotal: ResultadoTotalTicket = {
    totalSinIva: Number(totalSinIva.toFixed(2)),
    totalConIva: Number(totalConIva.toFixed(2)),
    totalIva: Number((totalConIva - totalSinIva).toFixed(2)),
  };

  const resultadoFinal: TicketFinal = {
    lineas: lineasCalculadas,
    total: resultadoTotal,
    desgloseIva,
  };

  return resultadoFinal
};