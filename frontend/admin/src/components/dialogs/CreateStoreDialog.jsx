import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'

export default function CreateStoreDialog({ open, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Call your API to create store
      const response = await fetch('http://localhost:8080/api/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) throw new Error('Failed to create store')
      
      const store = await response.json()
      localStorage.setItem('store', JSON.stringify(store))
      toast.success('Store created successfully')
      onClose()
    } catch (error) {
      toast.error('Failed to create store')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Your Store</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Store Name</label>
            <input
              type="text"
              required
              className="w-full p-2 rounded-md border"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              required
              className="w-full p-2 rounded-md border"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              required
              className="w-full p-2 rounded-md border"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full">
            Create Store
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 