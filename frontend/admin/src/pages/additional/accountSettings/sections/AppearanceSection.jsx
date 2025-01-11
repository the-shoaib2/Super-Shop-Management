import { THEMES } from '../constants/settings'

export function AppearanceSection({ formData, setFormData, currentTheme, setCurrentTheme }) {
  const handleThemeChange = (theme) => {
    setCurrentTheme(theme)
    document.documentElement.className = theme
    localStorage.setItem('theme', theme)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Theme</h3>
        <div className="grid grid-cols-3 gap-4">
          {THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`
                p-4 rounded-lg border-2 text-center space-y-2
                ${currentTheme === theme.id ? 'border-primary' : 'border-border'}
              `}
            >
              <div 
                className="w-full h-12 rounded-md mb-2"
                style={{ backgroundColor: theme.color }}
              />
              <span className="text-sm font-medium">{theme.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Font Size</h3>
        <select
          className="w-full p-2 border rounded-md"
          value={formData.fontSize}
          onChange={(e) => setFormData({ ...formData, fontSize: e.target.value })}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.reducedMotion}
            onChange={(e) => setFormData({ ...formData, reducedMotion: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span>Reduce motion</span>
        </label>
      </div>
    </div>
  )
} 