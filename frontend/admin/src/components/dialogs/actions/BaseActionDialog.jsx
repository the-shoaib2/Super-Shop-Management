import { 
  AnimatedDialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogCloseButton
} from '@/components/ui/animated-dialog'
import { Button } from '@/components/ui/button'

export const BaseActionDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'default',
  children 
}) => {
  return (
    <AnimatedDialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
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
          {cancelText}
        </Button>
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </DialogFooter>
    </AnimatedDialog>
  )
} 