import { useState, useEffect } from 'react'
import { orderAPI } from '../../../services/api'
import { toast } from 'react-hot-toast'
import LoadingScreen from '@/components/loading-screen'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const fetchOrders = async () => {
    try {
      let response
      if (statusFilter === 'all') {
        response = await orderAPI.getAllOrders()
      } else {
        response = await orderAPI.getOrdersByStatus(statusFilter)
      }
      
      if (response.data?.message) {
        setOrders([])
      } else {
        setOrders(response.data || [])
      }
    } catch (error) {
      toast.error('Failed to fetch orders')
      console.error(error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus)
      toast.success('Order status updated successfully')
      fetchOrders()
    } catch (error) {
      toast.error('Failed to update order status')
      console.error(error)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 text-lg">
            No orders found {statusFilter !== 'all' && `with status "${statusFilter}"`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="px-6 py-4">#{order.id}</td>
                  <td className="px-6 py-4">{order.customerName}</td>
                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">${order.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className="px-2 py-1 border rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 