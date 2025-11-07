// src/pages/UpdateProductPage.jsx
import React from "react";
import ProductUpdateForm from "../Components/ProductUpdateForm";

export default function UpdateProductPage() {
  
  const productId = 1;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Gestión de Inventario</h1>
      <ProductUpdateForm productId={productId} />
    </div>
  );
}
