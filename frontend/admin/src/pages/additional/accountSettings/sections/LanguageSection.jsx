import { LANGUAGES } from '../constants/settings'

export function LanguageSection({ formData, setFormData }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Language</h3>
        <select
          className="w-full p-2 border rounded-md"
          value={formData.language}
          onChange={(e) => setFormData({ ...formData, language: e.target.value })}
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Time Zone</h3>
        <select
          className="w-full p-2 border rounded-md"
          value={formData.timeZone}
          onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
        >
          {Intl.supportedValuesOf('timeZone').map(zone => (
            <option key={zone} value={zone}>{zone}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Date Format</h3>
        <select
          className="w-full p-2 border rounded-md"
          value={formData.dateFormat}
          onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
        >
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>
    </div>
  )
} 