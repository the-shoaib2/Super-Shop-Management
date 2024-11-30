import { FiAlertTriangle } from 'react-icons/fi'
import { BaseActionDialog } from './BaseActionDialog'

export const DeleteDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Delete Item',
  itemName,
  itemType = 'item',
  message
}) => {
  return (
    <BaseActionDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      confirmText="Delete"
      confirmVariant="destructive"
    >
      <div className="flex items-start gap-3 py-2">
        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <FiAlertTriangle className="h-4 w-4 text-red-600" />
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-900">
            Are you sure you want to delete {itemType} "{itemName}"?
          </p>
          <p className="text-xs text-muted-foreground">
            {message || "This action cannot be undone."}
          </p>
        </div>
      </div>
    </BaseActionDialog>
  )
} 