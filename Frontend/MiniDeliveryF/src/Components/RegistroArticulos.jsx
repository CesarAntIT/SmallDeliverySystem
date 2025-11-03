
import { Plus, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useEffect } from "react";

const RegistroForm=()=>{
  const API_URL = "https://localhost:7044/api/Inventory/Register";
  const [formData, setFormData] = useState({
  Name: '',
  Description: '',
  Price: '',
  Stock: '',
  Fecha: '',
  Categoria:''
});
 const [mensaje, setMensaje] = useState('');
 

useEffect(() => {
  if (mensaje) {
    const timer = setTimeout(() => setMensaje(''), 2000); 
    return () => clearTimeout(timer);
  }
}, [mensaje]);

  const handleInputChange=(e)=>{
    const {name, value}= e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit= async (e)=>{
    e.preventDefault();
    setMensaje('');

    const product={
      Name: formData.Name,
      Description: formData.Description,
      Price: parseFloat(formData.Price),
      Stock: parseInt(formData.Stock)
    }

// Validar campos obligatorios
    const newErrors = {};

    if (!formData.Name.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.Categoria) newErrors.categoria = "Debe seleccionar una categoría.";
    if (!formData.Price || parseFloat(formData.Price) <= 0)
      newErrors.precio = "Ingrese un precio válido.";
    if (!formData.Stock || parseInt(formData.Stock) < 0)
      newErrors.stock = "Ingrese una cantidad válida de stock.";
    if (!formData.Fecha)
      newErrors.fecha = "Debe ingresar una fecha de vencimiento.";

    // Detener envio si hay errores
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMensaje("Por favor complete los campos obligatorios.");
      return;
    }

    setErrors({});


    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });

      if (!response.ok) {
        throw new Error('Error al registrar el artículo');
      }

      const result = await response.json();
      setMensaje(result.message);
      setFormData({
        Name: '',
        Description: '',
        Price: '',
        Stock: '',
        Fecha: '',
        Categoria:''
      });
    } catch (error) {
      console.error(error);
      setMensaje('No se pudo conectar con el servidor.');
    }
  };

  const [errors, setErrors] = useState({});
  const categorias= ['Comida', 'Bebida', 'Postre', 'Otro'];

    return (
      
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
          
          <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
           {mensaje && (
            <div
              className={`mb-4 p-3 rounded-md text-center font-medium transition-all duration-500
                ${mensaje.includes('Por favor') || mensaje.includes('No se pudo')
                  ? 'bg-red-100 text-red-700 border border-red-300'
                  : 'bg-green-100 text-green-700 border border-green-300'}`}
            >
           {mensaje}
            </div>
          )}


            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Registrar Nuevo Artículo
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Artículo *
                </label>
                <input
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Hamburguesa Especial"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.nombre}
                  </p>
                )}
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría *
                </label>
                <select
                  name="Categoria"
                  value={formData.Categoria}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    errors.categoria ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="" disabled >Selecciona una categoría</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.categoria && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.categoria}
                  </p>
                )}
              </div>

              {/* Precio y Stock */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio (RD$) *
                  </label>
                  <input
                    type="number"
                    name="Price"
                    value={formData.Price}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.precio ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.precio && (
                    <p className="text-red-500 text-xs mt-1">{errors.precio}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    name="Stock"
                    value={formData.Stock}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.stock ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
                  )}
                </div>

                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha vencimiento *
                  </label>
                  <input
                    type="date"
                    name="Fecha"
                    value={formData.Fecha}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.stock ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.fecha && (
                    <p className="text-red-500 text-xs mt-1">{errors.fecha}</p>
                  )}
                </div>

              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción (Opcional)
                </label>
                <textarea
                  name="Description"
                  value={formData.Description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                  placeholder="Descripción del artículo..."
                />
              </div>

              {/* Botón Submit */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Agregar Artículo
              </button>

            </form>
            
          </div>
          
        </div>
    )
}

export default RegistroForm