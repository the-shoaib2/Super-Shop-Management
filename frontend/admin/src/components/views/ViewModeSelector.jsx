import { FiGrid, FiList, FiSquare } from 'react-icons/fi'
import { cn } from "@/lib/utils"

export const ViewModeSelector = ({ viewMode, onViewModeChange }) => (
  <div className="inline-flex items-center overflow-hidden rounded-md border bg-white">
    <div className="flex divide-x">
      <button
        className={cn(
          "inline-flex items-center px-4 py-2 text-sm gap-2 transition-colors",
          viewMode === 'grid' 
            ? "bg-primary text-primary-foreground" 
            : "hover:bg-muted"
        )}
        onClick={() => onViewModeChange('grid')}
      >
        <FiGrid className="h-4 w-4" />
        <span className="hidden sm:inline">Grid</span>
      </button>

      <button
        className={cn(
          "inline-flex items-center px-4 py-2 text-sm gap-2 transition-colors",
          viewMode === 'list' 
            ? "bg-primary text-primary-foreground" 
            : "hover:bg-muted"
        )}
        onClick={() => onViewModeChange('list')}
      >
        <FiList className="h-4 w-4" />
        <span className="hidden sm:inline">List</span>
      </button>

      <button
        className={cn(
          "inline-flex items-center px-4 py-2 text-sm gap-2 transition-colors",
          viewMode === 'details' 
            ? "bg-primary text-primary-foreground" 
            : "hover:bg-muted"
        )}
        onClick={() => onViewModeChange('details')}
      >
        <FiSquare className="h-4 w-4" />
        <span className="hidden sm:inline">Details</span>
      </button>
    </div>
  </div>
) 