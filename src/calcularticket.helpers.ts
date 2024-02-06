import { 
    TipoIva,
    ResultadoLineaTicket,
    LineaTicket,
    TotalPorTipoIva,
   } from "./modelo";

export const calcularPrecioSinIva = (precio: number, cantidad: number): number => {
    if (!precio || !cantidad) {
      throw new Error("Los parámetros introducidos no son correctos");
    }
      return Number((precio * cantidad).toFixed(2));
   };
  
const calcularIva = (precio: number, cantidad: number, tipoIva: TipoIva) => {
    switch (tipoIva) {
      case "general":
        return precio * cantidad * 1.21;
      case "reducido":
        return precio * cantidad * 1.1;
      case "superreducidoA":
        return precio * cantidad * 1.05;
      case "superreducidoB":
        return precio * cantidad * 1.04;
      case "superreducidoC":
      case "sinIva":
        return precio * cantidad;
      default:
        throw new Error("Tipo de IVA no válido");
    }
  };

export const calcularPrecioConIva = (precio: number, cantidad: number, tipoIva: TipoIva): number => {
    if (!precio || !cantidad || !tipoIva) {
      throw new Error("Los parámetros introducidos no son correctos");
    }
  
    let resultado: number = calcularIva(precio, cantidad, tipoIva)
  
    return Number(resultado.toFixed(2));
  };
  
const calcularPrecioLinea = (linea: LineaTicket): ResultadoLineaTicket => {
    return {
      nombre: linea.producto.nombre,
      cantidad: linea.cantidad,
      tipoIva: linea.producto.tipoIva,
      precioSinIva: calcularPrecioSinIva(linea.producto.precio, linea.cantidad),
      precioConIva: calcularPrecioConIva(linea.producto.precio, linea.cantidad, linea.producto.tipoIva),
    };
  };
  
export const calculaLineasTicket = (lineasTicket: LineaTicket[]): ResultadoLineaTicket[] => {
    if (!lineasTicket) {
      throw new Error("Los parámetros introducidos no son correctos");
    }
    return lineasTicket.map(calcularPrecioLinea);
  };

const calcularDesgloseParaLinea = (linea: ResultadoLineaTicket, desglose: TotalPorTipoIva[]): void => {
  const { tipoIva, precioConIva } = linea;
  const tipoIvaExistente = desglose.find((item) => item.tipoIva === tipoIva);

  if (tipoIvaExistente) {
      tipoIvaExistente.cuantia += precioConIva;
  } else {
      desglose.push({ tipoIva, cuantia: precioConIva });
  }
};

export const calcularDesgloseIva = (lineasCalculadas: ResultadoLineaTicket[]): TotalPorTipoIva[] => {
  if (!lineasCalculadas) {
      throw new Error("Los parámetros introducidos no son correctos");
  }

  const desglose: TotalPorTipoIva[] = [];

  lineasCalculadas.forEach((linea) => {
      calcularDesgloseParaLinea(linea, desglose);
  });

  return desglose;
};

export const calcularTotalSinIva = (lineasCalculadas: ResultadoLineaTicket[]): number => {
  return lineasCalculadas.reduce((total, linea) => total + linea.precioSinIva, 0);
};

export const calcularTotalConIva = (lineasCalculadas: ResultadoLineaTicket[]): number => {
  return lineasCalculadas.reduce((total, linea) => total + linea.precioConIva, 0);
};
