import { FiDroplet, FiHash } from 'react-icons/fi'
import { BaseActionDialog } from './BaseActionDialog'

const PRESET_COLORS = [
  { name: 'Red', hex: '#FF0000' },
  { name: 'Green', hex: '#00FF00' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Brown', hex: '#A52A2A' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' }
]

export const ColorPickerDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  color,
  newColor,
  onColorChange,
  isLightColor,
  isEdit = false 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    onConfirm(e)
  }

  return (
    <BaseActionDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit}
      title={isEdit ? 'Edit Color' : 'Add New Color'}
      confirmText={isEdit ? 'Update Color' : 'Add Color'}
      description={isEdit 
        ? 'Edit the color details below.' 
        : 'Add a new color by selecting a color and entering a name.'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        {/* Color Preview */}
        <div className="flex justify-center">
          <div 
            className="w-32 h-32 rounded-full border-4 shadow-inner transition-colors duration-200"
            style={{ 
              backgroundColor: newColor.hex,
              borderColor: newColor.hex === '#FFFFFF' ? '#e2e8f0' : newColor.hex 
            }}
          />
        </div>

        {/* Color Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Color Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDroplet className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                required
                className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-primary/20"
                value={newColor.name}
                onChange={(e) => onColorChange({ ...newColor, name: e.target.value })}
                placeholder="e.g., Royal Blue"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Color Code</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiHash className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-primary/20"
                  value={newColor.hex}
                  onChange={(e) => onColorChange({ ...newColor, hex: e.target.value, value: e.target.value })}
                  placeholder="#000000"
                />
              </div>
              <div className="relative">
                <input
                  type="color"
                  value={newColor.value}
                  onChange={(e) => onColorChange({ ...newColor, hex: e.target.value, value: e.target.value })}
                  className="sr-only"
                  id="color-picker"
                />
                <label
                  htmlFor="color-picker"
                  className="w-10 h-10 rounded-md border-2 cursor-pointer overflow-hidden flex items-center justify-center hover:scale-105 transition-all duration-200"
                  style={{ 
                    backgroundColor: newColor.hex,
                    borderColor: newColor.hex === '#FFFFFF' ? '#e2e8f0' : newColor.hex 
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/20" />
                  <FiDroplet 
                    className={`h-5 w-5 ${
                      isLightColor(newColor.hex) ? 'text-gray-800' : 'text-white'
                    }`} 
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Preset Colors */}
        <div>
          <label className="block text-sm font-medium mb-2">Preset Colors</label>
          <div className="grid grid-cols-5 md:grid-cols-8 gap-2">
            {PRESET_COLORS.map((presetColor) => (
              <button
                type="button"
                key={presetColor.hex}
                onClick={() => onColorChange({ ...newColor, hex: presetColor.hex, value: presetColor.hex })}
                className={`
                  w-8 h-8 rounded-full border-2 transition-all duration-200
                  ${newColor.hex === presetColor.hex ? "scale-110 shadow-lg" : "hover:scale-105"}
                `}
                style={{ 
                  backgroundColor: presetColor.hex,
                  borderColor: presetColor.hex === '#FFFFFF' ? '#e2e8f0' : presetColor.hex
                }}
                title={presetColor.name}
              />
            ))}
          </div>
        </div>
      </form>
    </BaseActionDialog>
  )
} 