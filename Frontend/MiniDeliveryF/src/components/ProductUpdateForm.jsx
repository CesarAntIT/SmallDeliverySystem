// src/components/ProductUpdateForm.jsx
import React, { useEffect, useState } from "react";
import { getProductById, updateProduct } from "../services/ProductService";

export default function ProductUpdateForm({ productId }) {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch (error) {
        console.error(error);
        setMessage("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!product.name || !product.price || !product.stock) {
      setMessage("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      await updateProduct(product.id, product);
      setMessage("Producto actualizado correctamente ✅");
    } catch (error) {
      console.error(error);
      setMessage("Error al actualizar el producto ❌");
    }
  };

  if (loading) return <p>Cargando producto...</p>;

  return (
    <form onSubmit={handleSubmit} className="update-form">
      <h2>Actualizar Producto</h2>

      <label>Nombre:</label>
      <input
        type="text"
        name="name"
        value={product.name}
        onChange={handleChange}
        required
      />

      <label>Descripción:</label>
      <textarea
        name="description"
        value={product.description || ""}
        onChange={handleChange}
      />

      <label>Precio:</label>
      <input
        type="number"
        name="price"
        value={product.price}
        onChange={handleChange}
        required
      />

      <label>Stock:</label>
      <input
        type="number"
        name="stock"
        value={product.stock}
        onChange={handleChange}
        required
      />

      <label>
        <input
          type="checkbox"
          name="isActive"
          checked={product.isActive}
          onChange={handleChange}
        />
        Activo
      </label>

      <button type="submit">Actualizar</button>

      {message && <p>{message}</p>}
    </form>
  );
}
