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
  
export const calcularPrecioConIva = (precio: number, cantidad: number, tipoIva: TipoIva): number => {
    if (!precio || !cantidad || !tipoIva) {
      throw new Error("Los parámetros introducidos no son correctos");
    }
  
    let resultado: number;
  
    switch (tipoIva) {
      case "general":
        resultado = precio * cantidad * 1.21;
        break;
      case "reducido":
        resultado = precio * cantidad * 1.1;
        break;
      case "superreducidoA":
        resultado = precio * cantidad * 1.05;
        break;
      case "superreducidoB":
        resultado = precio * cantidad * 1.04;
        break;
      case "superreducidoC":
      case "sinIva":
        resultado = precio * cantidad;
        break;
      default:
        throw new Error("Tipo de IVA no válido");
    }
  
    return Number(resultado.toFixed(2));
  };
  
export const calculaLineasTicket = (lineasTicket: LineaTicket[]): ResultadoLineaTicket[] => {
    if(!lineasTicket) {
      throw new Error("Los parámetros introducidos no son correctos");
    }
  
    const lineasCalculadas: ResultadoLineaTicket[] = [];
  
    for (let i = 0; i < lineasTicket.length; i++) {
      const linea = lineasTicket[i];
  
      const precioSinIva = calcularPrecioSinIva(linea.producto.precio, linea.cantidad);
      const precioConIva = calcularPrecioConIva(linea.producto.precio, linea.cantidad, linea.producto.tipoIva);
  
      const resultadoLinea: ResultadoLineaTicket = {
        nombre: linea.producto.nombre,
        cantidad: linea.cantidad,
        precioSinIva,
        tipoIva: linea.producto.tipoIva,
        precioConIva,
      };
  
      lineasCalculadas.push(resultadoLinea);
    }
  
    return lineasCalculadas;
  };
  
export const calcularDesgloseIva = (lineasCalculadas: ResultadoLineaTicket[]): TotalPorTipoIva[] => {
    if (!lineasCalculadas) {
      throw new Error("Los parámetros introducidos no son correctos");
    }
  
    const desglose: TotalPorTipoIva[] = [];
  
    lineasCalculadas.forEach((linea) => {
      const { tipoIva, precioConIva } = linea;
      const tipoIvaExistente = desglose.find((item) => item.tipoIva === tipoIva);
  
      if (tipoIvaExistente) {
        tipoIvaExistente.cuantia += precioConIva;
      } else {
        desglose.push({ tipoIva, cuantia: precioConIva });
      }
    });
  
    return desglose;
  };