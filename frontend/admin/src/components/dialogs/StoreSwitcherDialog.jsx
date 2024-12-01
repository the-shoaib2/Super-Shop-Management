import { 
  AnimatedDialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogCloseButton
} from '@/components/ui/animated-dialog'
import { Button } from '@/components/ui/button'

export default function StoreSwitcherDialog({ 
  open, 
  onClose, 
  stores, 
  loading, 
  onStoreSwitch 
}) {
  const truncateText = (text, maxLength) => {
    return text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <AnimatedDialog 
      isOpen={open} 
      onClose={onClose}
      maxWidth="max-w-[400px]"
    >
      <DialogHeader>
        <DialogTitle>Switch Store</DialogTitle>
        <DialogCloseButton onClose={onClose} />
      </DialogHeader>
      
      <DialogContent>
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
          {stores.map((store) => (
            <Button
              key={store.id}
              variant="ghost"
              className="w-full justify-start transition-colors hover:bg-accent"
              onClick={() => onStoreSwitch(store)}
            >
              <div className="flex flex-col items-start">
                <span title={store.name}>{truncateText(store.name, 30)}</span>
                {store.category && (
                  <span className="text-xs text-muted-foreground" title={store.category}>
                    {truncateText(store.category, 25)}
                  </span>
                )}
              </div>
            </Button>
          ))}
          
          {stores.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No stores found. Create one to get started.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </AnimatedDialog>
  )
} 