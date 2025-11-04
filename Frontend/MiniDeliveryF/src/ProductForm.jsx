import { useState, useEffect } from "react";
import "./ProductForm.css";

function ProductForm({ product, onUpdate }) {
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    stock: ""
  });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        id: product.id,
        name: product.name,
        description: product.description || "",
        price: product.price,
        stock: product.stock
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensaje("");

    if (!form.name || form.price <= 0 || form.stock < 0) {
      setMensaje("Campos obligatorios incompletos o inválidos");
      return;
    }

    fetch(`http://localhost:5277/api/product/${form.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: form.id,
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        isActive: true
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar el producto");
        setMensaje("Producto actualizado correctamente");
        onUpdate();
      })
      .catch((err) => setMensaje("Error: " + err.message));
  };

  return (
    <div className="product-form-container">
      <h2>Editar Producto</h2>

      <form onSubmit={handleSubmit} className="product-form">
        <label>Nombre</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre del producto"
        />

        <label>Descripción</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripción"
        />

        <label>Precio</label>
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Precio"
        />

        <label>Stock</label>
        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
        />

        <button type="submit">Guardar Cambios</button>
      </form>

      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
}

export default ProductForm;
