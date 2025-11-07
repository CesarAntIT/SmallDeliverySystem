// cliente b�sico para hablar con tu backend en C#

// obtener todos los productos

export async function getProducts() {
    const r = await fetch('https://localhost:7044/api/Product')
    if (!r.ok) throw new Error('Error al cargar productos')
    return r.json()
}

// eliminar un producto (soft delete)
export async function deleteProduct(id) {
    const r = await fetch(`http://localhost:5277/api/product/${id}`, { method: 'DELETE' })
    if (!r.ok && r.status !== 204) throw new Error('Error al eliminar')
    return true
}
