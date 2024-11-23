import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { FiCopy, FiEdit } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

const API_ENDPOINTS = [
  {
    category: 'Authentication',
    endpoints: [
      { method: 'POST', path: '/api/auth/login', description: 'Login to account' },
      { method: 'POST', path: '/api/auth/register', description: 'Create new account' },
      { method: 'POST', path: '/api/auth/refresh', description: 'Refresh access token' },
      { method: 'POST', path: '/api/auth/logout', description: 'Logout from account' }
    ]
  },
  {
    category: 'Profile',
    endpoints: [
      { method: 'GET', path: '/api/profile/me', description: 'Get user profile' },
      { method: 'PUT', path: '/api/profile/update', description: 'Update profile information' },
      { method: 'POST', path: '/api/profile/avatar', description: 'Update profile avatar' }
    ]
  },
  {
    category: 'Store Management',
    endpoints: [
      { method: 'GET', path: '/api/stores/owner/stores', description: 'Get all owner stores' },
      { method: 'POST', path: '/api/stores/owner/stores', description: 'Create new store' },
      { method: 'PUT', path: '/api/stores/owner/stores/:id', description: 'Update store details' },
      { method: 'DELETE', path: '/api/stores/owner/stores/:id', description: 'Delete store' }
    ]
  },
  {
    category: 'Product Management',
    endpoints: [
      { method: 'GET', path: '/api/products', description: 'Get all products' },
      { method: 'GET', path: '/api/products/:id', description: 'Get product details' },
      { method: 'POST', path: '/api/products', description: 'Create new product' },
      { method: 'PUT', path: '/api/products/:id', description: 'Update product' },
      { method: 'DELETE', path: '/api/products/:id', description: 'Delete product' }
    ]
  },
  {
    category: 'Order Management',
    endpoints: [
      { method: 'GET', path: '/api/orders', description: 'Get all orders' },
      { method: 'GET', path: '/api/orders/:id', description: 'Get order details' },
      { method: 'PUT', path: '/api/orders/:id/status', description: 'Update order status' }
    ]
  }
]

const getMethodColor = (method) => {
  const colors = {
    GET: 'bg-blue-100 text-blue-800',
    POST: 'bg-green-100 text-green-800',
    PUT: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800'
  }
  return colors[method] || 'bg-gray-100 text-gray-800'
}

export default function APIs() {
  const { currentStore } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showToken, setShowToken] = useState(false)
  const [editingEndpoint, setEditingEndpoint] = useState(null)
  const token = localStorage.getItem('token')

  const handleCopyEndpoint = (endpoint) => {
    const baseUrl = import.meta.env.VITE_API_URL
    const fullUrl = `${baseUrl}${endpoint.path}`
    
    // Create example request object
    const exampleRequest = {
      url: fullUrl,
      method: endpoint.method,
      headers: {
        'Authorization': 'Bearer your-token-here',
        'Content-Type': 'application/json'
      }
    }

    // Add example body for POST/PUT requests
    if (['POST', 'PUT'].includes(endpoint.method)) {
      exampleRequest.body = JSON.stringify({
        // Add example request body based on endpoint
        example: 'data'
      }, null, 2)
    }

    const textToCopy = `// ${endpoint.description}
fetch('${fullUrl}', {
  method: '${endpoint.method}',
  headers: {
    'Authorization': 'Bearer ${token}',
    'Content-Type': 'application/json'
  }${['POST', 'PUT'].includes(endpoint.method) ? `,
  body: JSON.stringify({
    // Add your request data here
  })` : ''}
})`

    navigator.clipboard.writeText(textToCopy)
      .then(() => toast.success('Copied to clipboard!'))
      .catch(() => toast.error('Failed to copy'))
  }

  const handleEditEndpoint = (endpoint) => {
    setEditingEndpoint(endpoint)
    // You can implement a modal or form for editing the endpoint
    toast.success('Edit functionality coming soon!')
  }

  const filteredEndpoints = selectedCategory === 'all' 
    ? API_ENDPOINTS 
    : API_ENDPOINTS.filter(cat => cat.category === selectedCategory)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">API Documentation</h1>
        <div className="flex gap-4">
          <select
            className="px-4 py-2 border rounded-lg"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {API_ENDPOINTS.map(cat => (
              <option key={cat.category} value={cat.category}>
                {cat.category}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={() => setShowToken(!showToken)}
          >
            {showToken ? 'Hide Token' : 'Show Token'}
          </Button>
        </div>
      </div>

      {showToken && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">Your API Token:</h3>
          <div className="bg-white p-3 rounded border font-mono text-sm overflow-x-auto">
            {token || 'No token found'}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Use this token in the Authorization header: Bearer {token}
          </p>
        </div>
      )}

      {filteredEndpoints.map((category) => (
        <div key={category.category} className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold">{category.category}</h2>
          </div>
          <div className="divide-y">
            {category.endpoints.map((endpoint, index) => (
              <div key={index} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMethodColor(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                    <code className="font-mono text-sm">{endpoint.path}</code>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyEndpoint(endpoint)}
                      className="flex items-center gap-2"
                    >
                      <FiCopy className="h-4 w-4" />
                      Copy
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditEndpoint(endpoint)}
                      className="flex items-center gap-2"
                    >
                      <FiEdit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-gray-600 text-sm">{endpoint.description}</p>
                
                {/* Example Request/Response section */}
                <div className="mt-4 space-y-2">
                  <div className="text-sm font-medium text-gray-500">Example Request:</div>
                  <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                    {`${endpoint.method} ${endpoint.path}

Headers:
{
  "Authorization": "Bearer ${token}",
  "Content-Type": "application/json"
}${['POST', 'PUT'].includes(endpoint.method) ? `

Body:
{
  // Request data
}` : ''}`}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-white rounded-lg shadow-sm border p-4 mt-6">
        <h3 className="font-semibold mb-2">Usage Example:</h3>
        <pre className="bg-gray-50 p-4 rounded border overflow-x-auto">
          {`// Example using fetch
const response = await fetch('${import.meta.env.VITE_API_URL}/api/profile/me', {
  headers: {
    'Authorization': 'Bearer ${token}',
    'Content-Type': 'application/json'
  }
})

// Example using axios
const response = await axios.get('${import.meta.env.VITE_API_URL}/api/profile/me', {
  headers: {
    'Authorization': 'Bearer ${token}'
  }
})`}
        </pre>
      </div>
    </div>
  )
} 