export const FormField = ({ label, error, children }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium">
      {label}
      {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
    </label>
    {children}
  </div>
) 