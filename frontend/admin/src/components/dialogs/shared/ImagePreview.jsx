import { FiX } from 'react-icons/fi'

export const ImagePreview = ({ image, index, onRemove }) => (
  <div className="relative aspect-square group rounded-lg overflow-hidden border-2 border-gray-100 hover:border-primary/30 transition-colors">
    <img
      src={image.preview}
      alt={`Preview ${index + 1}`}
      className="w-full h-full object-cover"
    />
    
    {/* Upload Progress Overlay */}
    {image.uploading && (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto mb-2 text-white animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-white text-sm font-medium">
            {image.progress}%
          </span>
        </div>
      </div>
    )}
    
    {/* Hover Controls */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
      <button
        onClick={() => onRemove(index)}
        className="absolute bottom-1.5 right-1.5 p-1.5 bg-white/90 rounded-full text-red-500 
          hover:bg-white hover:scale-105 transition-all"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
    
    {/* Main Image Badge */}
    {index === 0 && (
      <div className="absolute top-1.5 left-1.5">
        <span className="px-2 py-0.5 bg-primary/90 text-white text-[10px] font-medium rounded-full">
          Main
        </span>
      </div>
    )}
  </div>
) 