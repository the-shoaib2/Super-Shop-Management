export const VariantButton = ({ selected, onClick, children, error }) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      relative w-full h-[68px] px-3 rounded-lg border-2 transition-all duration-200
      ${selected 
        ? 'border-primary bg-primary/5 shadow-sm' 
        : error
          ? 'border-red-200 hover:border-red-300 bg-red-50/50'
          : 'border-gray-200 hover:border-primary/30 hover:bg-gray-50/80'
      }
    `}
  >
    {children}
    {selected && (
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
    )}
  </button>
) 