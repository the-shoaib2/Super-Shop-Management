import { Dialog } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1]
    }
  }
}

const dialogVariants = {
  hidden: { 
    scale: 0.90,
    opacity: 0,
    y: 0
  },
  visible: { 
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      duration: 0.5,
      bounce: 0.3
    }
  },
  exit: { 
    scale: 0.90,
    opacity: 0,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1]
    }
  }
}

export function AnimatedDialog({ 
  isOpen, 
  onClose, 
  children, 
  maxWidth = 'max-w-lg',
  className = ''
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog 
          open={isOpen} 
          onClose={onClose} 
          className="relative z-50"
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
          
          {/* Dialog container */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              className={`w-full ${maxWidth} ${className}`}
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Dialog.Panel className="relative bg-card rounded-lg shadow-xl overflow-hidden">
                {children}
              </Dialog.Panel>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

// Helper components for consistent layout
export function DialogHeader({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-between p-4 border-b border-border ${className}`}>
      {children}
    </div>
  )
}

export function DialogTitle({ children, className = '' }) {
  return (
    <Dialog.Title className={`text-lg font-semibold text-foreground ${className}`}>
      {children}
    </Dialog.Title>
  )
}

export function DialogContent({ children, className = '' }) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  )
}

export function DialogFooter({ children, className = '' }) {
  return (
    <div className={`border-t border-border p-4 bg-muted flex justify-end space-x-2 ${className}`}>
      {children}
    </div>
  )
}

export function DialogCloseButton({ onClose }) {
  return (
    <button
      onClick={onClose}
      className="rounded-full p-1.5 text-muted-foreground hover:bg-muted transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  )
} 