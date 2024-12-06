import React, { createContext, useContext, useState } from 'react'
import { cn } from '@/lib/utils'

// Create context for sidebar state
const SidebarContext = createContext({
  isOpen: true,
  toggleSidebar: () => {}
})

// Sidebar Provider Component
export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

// Sidebar Trigger Component
export const SidebarTrigger = ({ className, ...props }) => {
  const { toggleSidebar } = useContext(SidebarContext)

  return (
    <button 
      onClick={toggleSidebar} 
      className={cn("hover:bg-accent hover:text-accent-foreground p-2 rounded-md", className)}
      {...props}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <line x1="3" x2="21" y1="6" y2="6" />
        <line x1="3" x2="21" y1="12" y2="12" />
        <line x1="3" x2="21" y1="18" y2="18" />
      </svg>
    </button>
  )
}

// Sidebar Inset Component
export const SidebarInset = ({ 
  children, 
  className, 
  ...props 
}) => {
  const { isOpen } = useContext(SidebarContext)

  return (
    <div 
      className={cn(
        "flex flex-col w-full transition-all duration-300 ease-in-out",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
