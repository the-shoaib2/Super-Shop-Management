import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { FullscreenButton } from "@/components/fullscreen-button"
import { cn } from "@/lib/utils"
import React from 'react';
import { useLocation } from "react-router-dom"

const PageHeader = React.forwardRef(({ 
  title,
  showBorder = true,
  showFullscreen = true,
  className,
  children,
  hidden,
  ...props 
}, ref) => {
  if (hidden) return null;

  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter(Boolean)
  
  const formatSegment = (segment) => {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <header 
      ref={ref}
      className={cn(
        "sticky top-0 z-50 w-full",
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "flex h-14 shrink-0 items-center gap-2",
        "transition-[width,height] ease-linear",
        "group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14",
        showBorder && "border-b",
        className
      )} 
      {...props}
    >
      <div className="flex items-center justify-between w-full px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {pathSegments.map((segment, index) => {
                const isLast = index === pathSegments.length - 1
                const path = `/${pathSegments.slice(0, index + 1).join('/')}`
                const displayName = formatSegment(segment)

                return (
                  <React.Fragment key={path}>
                    <BreadcrumbItem className={cn(
                      "hidden md:block",
                      isLast && "block"
                    )}>
                      {isLast ? (
                        <BreadcrumbPage>{displayName}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={path}>{displayName}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </React.Fragment>
                )
              })}
              {children}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center">
          {showFullscreen && <FullscreenButton />}
        </div>
      </div>
    </header>
  )
})

PageHeader.displayName = "PageHeader"

export { PageHeader }