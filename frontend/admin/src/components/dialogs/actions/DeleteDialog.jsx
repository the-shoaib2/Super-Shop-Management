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
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
          <FiAlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-lg">
            Are you sure you want to delete this {itemType}?
          </h3>
          <p className="text-sm text-muted-foreground">
            {message || `"${itemName}" will be permanently removed. This action cannot be undone.`}
          </p>
        </div>
      </div>
    </BaseActionDialog>
  )
} 