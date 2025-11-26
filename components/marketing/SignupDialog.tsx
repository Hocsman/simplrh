'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { signupSchema, type SignupFormData } from '@/lib/validators'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, AlertCircle, Eye, EyeOff, Building, Mail, Lock, User } from 'lucide-react'

interface SignupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignupDialog({ open, onOpenChange }: SignupDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  })

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: signupError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            company_name: data.company
          }
        }
      })

      if (signupError) {
        throw signupError
      }

      setSuccess(true)
      
      // Redirect after success
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)

    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setError(null)
    setSuccess(false)
    onOpenChange(false)
  }

  if (success) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Compte créé avec succès !
            </h3>
            <p className="text-gray-600 mb-4">
              Vérifiez votre email pour activer votre compte.
            </p>
            <div className="text-sm text-gray-500">
              Redirection vers le dashboard...
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Créer votre compte
          </DialogTitle>
          <div className="text-center">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              ✨ Essai gratuit 14 jours
            </Badge>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                {...register('fullName')}
                placeholder="John Doe"
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'entreprise
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />              <Input
                {...register('company')}
                placeholder="Ma Super Entreprise"
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            {errors.company && (
              <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email professionnel
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                {...register('email')}
                type="email"
                placeholder="john@entreprise.com"
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Au moins 8 caractères avec majuscules, minuscules et chiffres
            </p>
          </div>

          {/* Terms */}
          <div className="text-xs text-gray-500 text-center">
            En créant un compte, vous acceptez nos{' '}
            <a href="/terms" className="text-blue-600 hover:underline">
              Conditions d'utilisation
            </a>{' '}
            et notre{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Politique de confidentialité
            </a>.
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700" 
            disabled={isLoading}
          >
            {isLoading ? 'Création en cours...' : 'Créer mon compte gratuit'}
          </Button>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-600">
            Déjà un compte ?{' '}
            <button
              type="button"
              onClick={() => {
                handleClose()
                // Open login dialog - this would be passed as a prop
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              Se connecter
            </button>
          </div>
        </form>

        {/* Benefits */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-600 mb-3">
            Ce qui vous attend :
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Accès à tous les modules pendant 14 jours</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Configuration guidée gratuite</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Support prioritaire français</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
