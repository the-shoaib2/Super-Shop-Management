import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react'
import { cn } from "@/lib/utils"

export const SidebarNavButton = ({ 
  path, 
  label, 
  icon: Icon, 
  className 
}) => {
  const location = useLocation()
  const isActive = location.pathname === path

  return (
    <Link to={path} className="w-full block">
      <Button 
        variant="ghost" 
        className={cn(
          "w-full justify-between items-center group",
          " text-white",
          isActive 
            ? "bg-primary/90 text-white font-semibold" 
            : "",
          "transition-all duration-200 ease-in-out",
          "px-3 py-2", 
          className
        )}
      >
        <div className="flex items-center">
          {Icon && (
            <Icon 
              className={cn(
                "mr-3 h-4 w-4 text-white",
                "group-hover:text-white"
              )} 
            />
          )}
          <span>{label}</span>
        </div>
        <ChevronRight 
          className={cn(
            "h-4 w-4 text-white",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            isActive ? "opacity-100" : ""
          )}
        />
      </Button>
    </Link>
  )
}
