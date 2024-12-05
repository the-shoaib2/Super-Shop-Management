import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

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
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          
          {/* Dialog container */}
          <motion.div
            className={`relative w-full ${maxWidth} ${className}`}
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="relative bg-card rounded-lg shadow-xl overflow-hidden">
              {children}
            </div>
          </motion.div>
        </div>
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

export function DialogContent({ children, className = '' }) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  )
}

export function DialogFooter({ children, className = '' }) {
  return (
    <div className={`p-4 border-t border-border flex justify-end gap-2 ${className}`}>
      {children}
    </div>
  )
}

export function DialogCloseButton({ onClose }) {
  return (
    <button
      onClick={onClose}
      className="p-2 rounded-full hover:bg-muted transition-colors"
      aria-label="Close dialog"
    >
      <X className="h-5 w-5" />
    </button>
  )
}