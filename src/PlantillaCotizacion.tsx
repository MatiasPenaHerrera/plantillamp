import React, { useState } from 'react';
import { Download, Plus, Trash2, Printer } from 'lucide-react';
import logo from "./assets/logo.png";

export default function PlantillaCotizacion() {
  const [cotizacion, setCotizacion] = useState({
    numero: '11-2025',
    fecha: '2025-11-07',
    cliente: {
      nombre: 'Paulina Mujica',
      direccion: 'Eduardo Frei Montalva 7050, bodega n7',
      telefono: '+56 9 5058 8170',
      asunto: '100 toldos estampados y 100 mesas'
    },
    items: [
      { codigo: 'A7F3X9Q2', descripcion: 'Servicio de estampado en una cara con logotipo "NIVEA"', cantidad: 100, precioUnitario: 22000 },
      { codigo: 'T9L2R7K8', descripcion: 'Toldo plegable araña 3x3m Azul', cantidad: 100, precioUnitario: 27000 },
      { codigo: 'L6Q1R8F3', descripcion: 'Mesa plegable rectangular tipo maleta 180cm blanco', cantidad: 100, precioUnitario: 5000 }
    ],
    condiciones: {
      solicitadoPor: 'Paulina Mujica',
      formaPago: 'Transferencia',
      despacho: 'Despacho a coordinar'
    },
    validez: 5,
    autorizadoPor: 'MATIAS PEÑA'
  });

  const calcularSubtotal = () => {
    return cotizacion.items.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
  };

  const calcularIVA = () => {
    return Math.round(calcularSubtotal() * 0.19);
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularIVA();
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precio);
  };

  const actualizarCliente = (campo, valor) => {
    setCotizacion({
      ...cotizacion,
      cliente: { ...cotizacion.cliente, [campo]: valor }
    });
  };

  const actualizarItem = (index, campo, valor) => {
    const nuevosItems = [...cotizacion.items];
    nuevosItems[index] = { ...nuevosItems[index], [campo]: valor };
    setCotizacion({ ...cotizacion, items: nuevosItems });
  };

  const agregarItem = () => {
    setCotizacion({
      ...cotizacion,
      items: [...cotizacion.items, { codigo: '', descripcion: '', cantidad: 1, precioUnitario: 0 }]
    });
  };

  const eliminarItem = (index) => {
    const nuevosItems = cotizacion.items.filter((_, i) => i !== index);
    setCotizacion({ ...cotizacion, items: nuevosItems });
  };

  const exportarAExcel = () => {
    let csv = 'GESTIONES Y SERVICIOS MP - COTIZACIÓN\n';
    csv += 'RUT: 77.968.591-8\n';
    csv += 'Antonio Bellet 193, Of. 1210, Providencia, Santiago\n\n';
    csv += `Cotización N°: ${cotizacion.numero}\n`;
    csv += `Fecha: ${cotizacion.fecha}\n\n`;
    csv += 'INFORMACIÓN DEL CLIENTE\n';
    csv += `Cliente:,${cotizacion.cliente.nombre}\n`;
    csv += `Teléfono:,${cotizacion.cliente.telefono}\n`;
    csv += `Dirección:,${cotizacion.cliente.direccion}\n`;
    csv += `Asunto:,${cotizacion.cliente.asunto}\n\n`;
    csv += 'PRODUCTOS Y SERVICIOS\n';
    csv += 'Código,Descripción,Cantidad,Precio Unitario,Total\n';
    cotizacion.items.forEach(item => {
      csv += `${item.codigo},${item.descripcion},${item.cantidad},${item.precioUnitario},${item.cantidad * item.precioUnitario}\n`;
    });
    csv += `\nSubtotal:,,,,${calcularSubtotal()}\n`;
    csv += `IVA (19%):,,,,${calcularIVA()}\n`;
    csv += `TOTAL:,,,,${calcularTotal()}\n\n`;
    csv += 'CONDICIONES\n';
    csv += `Solicitado por:,${cotizacion.condiciones.solicitadoPor}\n`;
    csv += `Forma de Pago:,${cotizacion.condiciones.formaPago}\n`;
    csv += `Despacho:,${cotizacion.condiciones.despacho}\n`;
    csv += `Validez:,${cotizacion.validez} días\n`;
    csv += `Autorizado por:,${cotizacion.autorizadoPor}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Cotizacion_${cotizacion.numero.replace('/', '-')}.csv`;
    link.click();
  };

  return (
    <>
      {/* Estilos para impresión */}
      <style>{`
        @media print {
          body {
            margin: 0;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .print-content {
            box-shadow: none !important;
            border: none !important;
          }
          .print-header {
            background: linear-gradient(to right, #0f172a, #2563eb) !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @page {
            margin: 12mm;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden print-content">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-700 to-blue-600 text-white p-8 print-header">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                {/* Logo */}
                <img src={logo} alt="Logo MP" className="w-16 h-16 object-contain bg-white rounded-lg p-2" />
                <div>
                  <h1 className="text-3xl font-bold mb-2">GESTIONES Y SERVICIOS MP</h1>
                  <p className="text-sm opacity-90">RUT: 77.968.591-8</p>
                  <p className="text-sm opacity-90">Antonio Bellet 193, Of. 1210, Providencia</p>
                  <p className="text-sm opacity-90">Santiago, Chile</p>
                </div>
              </div>

              {/* Número de Cotización */}
              <div className="text-right">
                <label className="block text-sm font-semibold mb-1">N° Cotización</label>
                <input
                  type="text"
                  value={cotizacion.numero}
                  onChange={(e) => setCotizacion({ ...cotizacion, numero: e.target.value })}
                  className="bg-white/20 text-white px-3 py-1 rounded text-sm font-semibold text-right mb-2"
                  placeholder="Ej: 00123"
                />
                <input
                  type="date"
                  value={cotizacion.fecha}
                  onChange={(e) => setCotizacion({ ...cotizacion, fecha: e.target.value })}
                  className="bg-white/20 text-white px-3 py-1 rounded text-sm w-full"
                />
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Información del Cliente */}
            <div className="bg-gray-50 border-l-4 border-blue-500 p-6 rounded mb-6">
              <h2 className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-4">
                Información del Cliente
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Cliente</label>
                  <input
                    type="text"
                    value={cotizacion.cliente.nombre}
                    onChange={(e) => actualizarCliente('nombre', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={cotizacion.cliente.telefono}
                    onChange={(e) => actualizarCliente('telefono', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-600 block mb-1">Dirección de Entrega</label>
                  <input
                    type="text"
                    value={cotizacion.cliente.direccion}
                    onChange={(e) => actualizarCliente('direccion', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-600 block mb-1">Asunto</label>
                  <input
                    type="text"
                    value={cotizacion.cliente.asunto}
                    onChange={(e) => actualizarCliente('asunto', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Tabla de Items */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-700 text-white">
                    <th className="px-2 py-3 text-left text-xs font-semibold uppercase w-24">Código</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Descripción</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase w-24">Cant.</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase w-32">P. Unitario</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase w-32">Total</th>
                    <th className="px-4 py-3 w-16 no-print"></th>
                  </tr>
                </thead>
                <tbody>
                  {cotizacion.items.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.codigo}
                          onChange={(e) => actualizarItem(index, 'codigo', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded font-mono"
                          placeholder="Código"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.descripcion}
                          onChange={(e) => actualizarItem(index, 'descripcion', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          placeholder="Descripción del producto/servicio"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.cantidad}
                          onChange={(e) => actualizarItem(index, 'cantidad', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-center"
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.precioUnitario}
                          onChange={(e) => actualizarItem(index, 'precioUnitario', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-right"
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {formatearPrecio(item.cantidad * item.precioUnitario)}
                      </td>
                      <td className="px-4 py-3 text-center no-print">
                        <button
                          onClick={() => eliminarItem(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={agregarItem}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition no-print"
              >
                <Plus size={18} />
                Agregar Item
              </button>
            </div>

            {/* Totales */}
            <div className="flex justify-end mb-6">
              <div className="w-80 bg-gray-50 rounded-lg overflow-hidden">
                <div className="flex justify-between px-5 py-3 border-b">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-semibold">{formatearPrecio(calcularSubtotal())}</span>
                </div>
                <div className="flex justify-between px-5 py-3 border-b-2 border-blue-500">
                  <span className="text-sm">IVA (19%)</span>
                  <span className="font-semibold">{formatearPrecio(calcularIVA())}</span>
                </div>
                <div className="flex justify-between px-5 py-4 bg-slate-700 text-white">
                  <span className="text-lg font-bold">TOTAL</span>
                  <span className="text-xl font-bold">{formatearPrecio(calcularTotal())}</span>
                </div>
              </div>
            </div>

            {/* Condiciones */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
                <label className="text-xs text-blue-600 font-semibold uppercase block mb-2">
                  Solicitado por
                </label>
                <input
                  type="text"
                  value={cotizacion.condiciones.solicitadoPor}
                  onChange={(e) => setCotizacion({
                    ...cotizacion,
                    condiciones: { ...cotizacion.condiciones, solicitadoPor: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
                <label className="text-xs text-blue-600 font-semibold uppercase block mb-2">
                  Forma de Pago
                </label>
                <input
                  type="text"
                  value={cotizacion.condiciones.formaPago}
                  onChange={(e) => setCotizacion({
                    ...cotizacion,
                    condiciones: { ...cotizacion.condiciones, formaPago: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
                <label className="text-xs text-blue-600 font-semibold uppercase block mb-2">
                  Despacho
                </label>
                <input
                  type="text"
                  value={cotizacion.condiciones.despacho}
                  onChange={(e) => setCotizacion({
                    ...cotizacion,
                    condiciones: { ...cotizacion.condiciones, despacho: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            {/* Nota de Validez */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-6">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-yellow-800 mb-1">NOTA IMPORTANTE</p>
                  <p className="text-sm text-yellow-800">
                    Esta cotización tiene una validez de{' '}
                    <input
                      type="number"
                      value={cotizacion.validez}
                      onChange={(e) => setCotizacion({ ...cotizacion, validez: parseInt(e.target.value) || 0 })}
                      className="w-16 px-2 py-1 mx-1 border border-yellow-400 rounded text-center bg-white"
                      min="1"
                    />
                    días hábiles a partir de la fecha de emisión. Pasado este plazo, los precios y condiciones están sujetos a modificación.
                  </p>
                </div>
              </div>
            </div>

            {/* Autorización */}
            <div className="bg-gray-50 p-4 rounded">
              <label className="text-xs text-gray-600 block mb-2">Autorizado por</label>
              <input
                type="text"
                value={cotizacion.autorizadoPor}
                onChange={(e) => setCotizacion({ ...cotizacion, autorizadoPor: e.target.value })}
                className="w-64 px-3 py-2 border border-gray-300 rounded font-semibold"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 border-t-4 border-blue-500">
            <div className="text-center text-sm text-gray-600">
              <p className="font-semibold mb-1">Cualquier consulta sobre esta cotización:</p>
              <p>📧 gestionesyserviciosmp@gmail.com | 📱 +56 9 6445 9168</p>
            </div>
          </div>
        </div>

        {/* Botones de Exportar e Imprimir */}
        <div className="max-w-6xl mx-auto mt-6 flex justify-center gap-4 no-print">
          <button
            onClick={exportarAExcel}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-lg"
          >
            <Download size={20} />
            Exportar a CSV (Abrir en Excel)
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
          >
            <Printer size={20} />
            Imprimir / PDF
          </button>
        </div>
      </div>
    </>
  );
}