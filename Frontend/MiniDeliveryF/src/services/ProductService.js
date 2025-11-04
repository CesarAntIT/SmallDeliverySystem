const API_URL = "https://localhost:7044/api/products";

// Obtener un producto por su ID
export async function getProductById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("Error al obtener el producto");
  return response.json();
}

// Actualizar un producto existente
export async function updateProduct(id, updatedData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) throw new Error("Error al actualizar el producto");
  return response.json();
}
