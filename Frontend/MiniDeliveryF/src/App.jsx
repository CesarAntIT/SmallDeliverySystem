import { useEffect, useState } from "react";
import ProductForm from "./ProductForm";

function App() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [error, setError] = useState("");

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
        setError("❌ No se pudo conectar con el servidor");
        setProductos([]);
      });
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", color: "white", backgroundColor: "#222", minHeight: "100vh" }}>
      <h1>Gestión de Productos</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

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
                <td style={{ padding: "10px", border: "1px solid #666" }}>{p.price}</td>
                <td style={{ padding: "10px", border: "1px solid #666" }}>{p.stock}</td>
                <td style={{ padding: "10px", border: "1px solid #666" }}>
                  <button onClick={() => setProductoSeleccionado(p)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {productoSeleccionado && (
        <ProductForm product={productoSeleccionado} onUpdate={cargarProductos} />
      )}
    </div>
  );
}

export default App;
