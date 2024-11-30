import { FiAlertTriangle, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { 
  AnimatedDialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogCloseButton
} from '@/components/ui/animated-dialog'
import { Button } from '@/components/ui/button'

export const DeleteColorDialog = ({ isOpen, onClose, onConfirm, colorName }) => {
  return (
    <AnimatedDialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>Delete Color</DialogTitle>
        <DialogCloseButton onClose={onClose} />
      </DialogHeader>
      
      <DialogContent>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <FiAlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">
              Are you sure you want to delete this color?
            </h3>
            <p className="text-sm text-muted-foreground">
              "{colorName}" will be permanently removed. This action cannot be undone.
            </p>
          </div>
        </div>
      </DialogContent>
      
      <DialogFooter>
        <Button
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={onConfirm}
        >
          Delete Color
        </Button>
      </DialogFooter>
    </AnimatedDialog>
  )
}

export const EditColorDialog = ({ isOpen, onClose, onConfirm, color, children }) => {
  return (
    <AnimatedDialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>Edit Color</DialogTitle>
        <DialogCloseButton onClose={onClose} />
      </DialogHeader>
      
      <DialogContent>
        {children}
      </DialogContent>
      
      <DialogFooter>
        <Button
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
        >
          Save Changes
        </Button>
      </DialogFooter>
    </AnimatedDialog>
  )
} 