
import { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import './App.css'
import RegistroForm from './Components/RegistroArticulos'
import { deleteProduct } from "./api";



function App() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [message, setMessage] = useState(null) // ← nuevo estado para mostrar resultado
  

  // El puerto se cambiaria dependiendo del puerto que muestre el backend 
  const API_URL = "http://localhost:5277/api/product";

  const cargarProductos = () => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener productos");
        return res.json();
      })
      .then((data) => {
        setProductos(data);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudo conectar con el servidor");
        setProductos([]);
      });
  };

  const confirmDelete = async () => {
      if (!toDelete) return
      try {
          await deleteProduct(toDelete.id)
          setProductos(prev => prev.filter(p => p.id !== toDelete.id))
          setMessage({ type: 'success', text: 'Producto eliminado correctamente ✅' })
      } catch {
          setMessage({ type: 'error', text: 'No se pudo eliminar el producto ❌' })
      } finally {
          setToDelete(null)
          // oculta el mensaje a los 3 segundos
          setTimeout(() => setMessage(null), 3000)
      }
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", color: "white", backgroundColor: "#222", minHeight: "100vh" }}>
      <h1 style={{fontSize:"xx-large", fontWeight:"bolder"}}>Gestión de Productos</h1><br />
      <hr />
      <br />
      {error && <p style={{ color: "red" }}>{error}</p>}

       <button
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        {mostrarFormulario ? "Cerrar formulario" : "Agregar nuevo artículo"}
      </button>

      {/* Mostrar el formulario si el botón está activo */}
      {mostrarFormulario && (
        <div style={{ marginBottom: "30px" }}>
          <RegistroForm />
        </div>
      )}
    
      {/* mensaje flotante */}
            {message && (
                <div style={{
                    position: 'fixed',
                    top: 20,
                    right: 20,
                    background: message.type === 'success' ? '#16a34a' : '#dc2626',
                    color: 'white',
                    padding: '12px 18px',
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,.15)',
                    zIndex: 1000,
                    transition: 'opacity .3s'
                }}>
                    {message.text}
                </div>
      )}

      {productos.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#444" }}>
              <th style={{ padding: "10px", border: "1px solid #666" }}>Nombre</th>
              <th style={{ padding: "10px", border: "1px solid #666" }}>Descripción</th>
              <th style={{ padding: "10px", border: "1px solid #666" }}>Precio</th>
              <th style={{ padding: "10px", border: "1px solid #666" }}>Stock</th>
              <th style={{ padding: "10px", border: "1px solid #666" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} style={{ backgroundColor: "#333" }}>
                <td style={{ padding: "10px", border: "1px solid #666" }}>{p.name}</td>
                <td style={{ padding: "10px", border: "1px solid #666" }}>{p.description}</td>
                <td style={{ padding: "10px", border: "1px solid #666" }}>RD$ {p.price}</td>
                <td style={{ padding: "10px", border: "1px solid #666" }}>{p.stock}</td>
                <td style={{ padding: "10px", border: "1px solid #666" }}>
                  <div className="flex gap-4">
                      <button
                        onClick={() => setProductoSeleccionado(p)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => setToDelete(p)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                      >
                        Eliminar
                      </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {productoSeleccionado && (
        <ProductForm product={productoSeleccionado} onUpdate={cargarProductos} />
      )}

      {toDelete && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)', display: 'grid', placeItems: 'center' }}>
                    <div style={{ background: '#fff', padding: 18, borderRadius: 12, width: 360, boxShadow: '0 10px 30px rgba(0,0,0,.2)',color:'black' }}>
                        <h3>Confirmar</h3>
                        <p>¿Seguro que quieres eliminar “{toDelete.name ?? toDelete.Name}”?</p>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button onClick={() => setToDelete(null)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc' }}>
                                Cancelar
                            </button>
                            <button onClick={confirmDelete} style={{ padding: '8px 12px', borderRadius: 8, border: 0, background: '#ef4444', color: '#fff' }}>
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
                
            )}
    </div>
  );

}

export default App;
