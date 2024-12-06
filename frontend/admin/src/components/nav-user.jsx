import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'react-hot-toast'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NavUser({
  user
}) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  // Fallback avatar and name if user is undefined
  const avatarSrc = user?.avatar || '/default-avatar.png'
  const userName = user?.fullName || user?.name || 'Guest'
  const userEmail = user?.email || 'guest@example.com'

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      toast.error('Failed to logout')
      console.error('Logout error:', error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full flex items-center justify-between p-2 rounded-lg bg-primary text-white hover:bg-primary/90 cursor-pointer transition-all duration-200 ease-in-out">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={avatarSrc} alt={userName} />
              <AvatarFallback className="rounded-lg text-white bg-primary">{userName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-white">{userName}</span>
              <span className="truncate text-xs text-white/70">{userEmail}</span>
            </div>
          </div>
          <ChevronsUpDown className="ml-auto size-4 text-white/70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-lg"
        align="end place-items-start"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={avatarSrc} alt={userName} />
              <AvatarFallback className="rounded-lg">{userName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{userName}</span>
              <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer hover:bg-accent/10 transition-colors duration-200">
            <Sparkles className="mr-2 h-4 w-4" />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer hover:bg-accent/10 transition-colors duration-200">
            <BadgeCheck className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer hover:bg-accent/10 transition-colors duration-200">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer hover:bg-accent/10 transition-colors duration-200">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onSelect={handleLogout}
          className="text-destructive focus:text-destructive cursor-pointer hover:bg-destructive/10 font-bold transition-colors duration-200"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
