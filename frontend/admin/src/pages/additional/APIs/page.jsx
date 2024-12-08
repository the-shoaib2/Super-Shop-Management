import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { FiCopy, FiEdit, FiKey, FiLoader, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { genetrateStoreApi } from '../../../services/api/apis/apis';

const API_ENDPOINTS = [
  {
    category: 'API Documentation',
    endpoints: [
      { method: 'GET', path: '/documentation', description: 'API Documentation Overview' }
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
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showToken, setShowToken] = useState(false)
  const [storeApiKeys, setStoreApiKeys] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)

  const copyStoreApiKey = (key) => {
    // Show "Not Implemented" toast

    toast.error('Copy Store API Key.', {
    })
  }

  const handleGenerateStoreApiKey = useCallback(async () => {
    setIsGenerating(true)
    try {
      const response = await genetrateStoreApi();
      
      if (response.success) {
        const newApiKey = response.data?.apiKey; // Adjust based on actual response structure
        if (newApiKey) {
          setStoreApiKeys(prevKeys => [...prevKeys, newApiKey])
          toast.success('API key generated successfully')
        } else {
          throw new Error('No API key in response')
        }
      } else {
        throw new Error(response.error || 'Failed to generate API key')
      }
    } catch (error) {
      console.error('Error generating API key:', error)
      toast.error(error.message || 'Failed to generate API key')
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const deleteStoreApiKey = (id) => {
    // Show "Not Implemented" toast
    toast.error('API Key Deletion Not Implemented', {

      icon: '🚧'
    })
  }

  const handleCopyEndpoint = (endpoint) => {
    // Show "Not Implemented" toast
    toast.error('Endpoint Copy Not Implemented', {
      icon: '🚧'
    })
  }

  const handleEditEndpoint = (endpoint) => {
    // Show "Not Implemented" toast
    toast.error('Endpoint Edit Not Implemented', {
      icon: '🚧'
    })  
  }

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

      {/* Store API Key Generation */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Store API Keys</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateStoreApiKey}
            disabled={isGenerating || storeApiKeys.length >= 5}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <FiLoader className="h-4 w-4 animate-spin" />
            ) : (
            <FiKey className="h-4 w-4" />
            )}
            {isGenerating ? 'Generating...' : 'Generate API Key'}
          </Button>
        </div>

        {storeApiKeys.length === 0 ? (
        <p className="text-gray-500 text-sm text-center">
            Generate a unique API key for accessing store-specific API endpoints.
            Maximum of 5 keys allowed.
          </p>
        ) : (
          <div className="space-y-4">
            {storeApiKeys.map((apiKeyObj) => (
              <div 
                key={apiKeyObj.id} 
                className="bg-gray-50 p-4 rounded-lg border flex items-center justify-between"
              >
                <div className="flex-grow mr-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-sm">Store API Key</h3>
                    <span className="text-xs text-gray-500">
                      Created: {apiKeyObj.createdAt}
                    </span>
                  </div>
                  <code className="bg-white p-2 rounded border font-mono text-sm break-all block">
                    {apiKeyObj.key}
                  </code>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyStoreApiKey(apiKeyObj.key)}
                    className="flex items-center gap-2"
                  >
                    <FiCopy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteStoreApiKey(apiKeyObj.id)}
                    className="flex items-center gap-2 text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {storeApiKeys.length > 0 && (
          <p className="text-sm text-gray-500 mt-4 text-center">
            🔒 Keep these keys confidential. They provide access to your store's API resources.
          </p>
        )}
      </div>

      {showToken && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">API Token:</h3>
          <div className="bg-white p-3 rounded border font-mono text-sm overflow-x-auto">
            No token available
          </div>
        </div>
      )}

      {API_ENDPOINTS.map((category) => (
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
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}