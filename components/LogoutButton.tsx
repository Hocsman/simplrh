'use client'

import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/actions/auth'

interface LogoutButtonProps {
    variant?: 'default' | 'ghost' | 'outline'
    size?: 'default' | 'sm' | 'lg'
    className?: string
}

export function LogoutButton({ variant = 'ghost', size = 'sm', className }: LogoutButtonProps) {
    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            onClick={() => signOut()}
        >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
        </Button>
    )
}
