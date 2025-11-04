import { useEffect, useState } from 'react'
import { getProducts, deleteProduct } from '../api'

const fmtMoney = n => Number(n ?? 0).toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })

export default function ProductList() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [toDelete, setToDelete] = useState(null)
    const [message, setMessage] = useState(null) // ← nuevo estado para mostrar resultado

    const DEMO_USER_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'

    useEffect(() => {
        getProducts().then(setItems).finally(() => setLoading(false))
    }, [])

    const confirmDelete = async () => {
        if (!toDelete) return
        try {
            await deleteProduct(toDelete.id, DEMO_USER_ID)
            setItems(prev => prev.filter(p => p.id !== toDelete.id))
            setMessage({ type: 'success', text: 'Producto eliminado correctamente ✅' })
        } catch {
            setMessage({ type: 'error', text: 'No se pudo eliminar el producto ❌' })
        } finally {
            setToDelete(null)
            // oculta el mensaje a los 3 segundos
            setTimeout(() => setMessage(null), 3000)
        }
    }

    if (loading) return <p style={{ padding: 16 }}>Cargando...</p>

    return (
        <div style={{ maxWidth: 980, margin: '28px auto', fontFamily: 'Inter, system-ui, sans-serif', position: 'relative' }}>
            <h1 style={{ marginBottom: 14 }}>Inventario</h1>

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

            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 6px 20px rgba(0,0,0,.06)', overflow: 'hidden' }}>
                <table width="100%" cellPadding="12" style={{ borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f5f7fb', fontWeight: 600 }}>
                        <tr>
                            <th align="left">Nombre</th>
                            <th align="left">Código</th>
                            <th align="right">Precio</th>
                            <th align="right">Stock</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(p => (
                            <tr key={p.id} style={{ borderTop: '1px solid #eef0f4' }}>
                                <td>{p.name ?? p.Name}</td>
                                <td>{p.code ?? p.Code ?? '-'}</td>
                                <td align="right">{fmtMoney(p.price ?? p.Price)}</td>
                                <td align="right">{p.stock ?? p.Stock}</td>
                                <td align="right">
                                    <button
                                        onClick={() => setToDelete(p)}
                                        style={{ background: '#ef4444', color: '#fff', border: 0, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && (
                            <tr><td colSpan="5" style={{ padding: 18, textAlign: 'center', color: '#666' }}>No hay productos</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {toDelete && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)', display: 'grid', placeItems: 'center' }}>
                    <div style={{ background: '#fff', padding: 18, borderRadius: 12, width: 360, boxShadow: '0 10px 30px rgba(0,0,0,.2)' }}>
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
    )
}
