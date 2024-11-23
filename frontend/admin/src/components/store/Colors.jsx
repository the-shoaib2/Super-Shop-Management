import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

export default function Colors() {
  const [colors, setColors] = useState([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newColor, setNewColor] = useState({ name: '', value: '#000000' })

  const handleAddColor = async () => {
    try {
      // API call to add color
      toast.success('Color added successfully')
      setShowAddDialog(false)
    } catch (error) {
      toast.error('Failed to add color')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Colors</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <FiPlus className="mr-2 h-4 w-4" />
          Add Color
        </Button>
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {colors.map((color) => (
          <div
            key={color.id}
            className="bg-white p-4 rounded-lg border flex justify-between items-center"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: color.value }}
              />
              <span>{color.name}</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <FiEdit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <FiTrash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Color Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Color</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleAddColor(); }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={newColor.name}
                  onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                  placeholder="Red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <input
                  type="color"
                  className="w-full p-1 border rounded-md h-10"
                  value={newColor.value}
                  onChange={(e) => setNewColor({ ...newColor, value: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">
                Add Color
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 