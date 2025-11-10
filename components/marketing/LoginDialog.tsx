'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { loginSchema, type LoginFormData } from '@/lib/validators'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToSignup?: () => void
}

export function LoginDialog({ open, onOpenChange, onSwitchToSignup }: LoginDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Vérifier si Supabase est configuré
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project.supabase.co') {
        throw new Error('Configuration Supabase manquante. Veuillez configurer vos variables d\'environnement.')
      }

      const supabase = createClient()
      
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (loginError) {
        throw loginError
      }

      // Redirect to dashboard
      window.location.href = '/dashboard'

    } catch (err: any) {
      console.error('Login error:', err) // Debug log
      if (err.message.includes('Invalid login credentials')) {
        setError('Email ou mot de passe incorrect')
      } else if (err.message.includes('Email not confirmed')) {
        setError('Veuillez confirmer votre email avant de vous connecter')
      } else if (err.status === 400) {
        setError('Email ou mot de passe incorrect. Vérifiez vos identifiants.')
      } else {
        setError(err.message || 'Une erreur est survenue lors de la connexion')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    const email = getValues('email')
    if (!email) {
      setError('Veuillez saisir votre email avant de demander la récupération')
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      setResetSent(true)
      setError(null)
    } catch (err: any) {
      setError('Erreur lors de l\'envoi de l\'email de récupération')
    }
  }

  const handleClose = () => {
    reset()
    setError(null)
    setResetSent(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Connexion
          </DialogTitle>
          <p className="text-center text-gray-600">
            Accédez à votre espace SimplRH
          </p>
        </DialogHeader>

        {resetSent ? (
          <div className="text-center py-6">
            <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
              <Mail className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Email envoyé !
            </h3>
            <p className="text-gray-600 mb-4">
              Vérifiez votre boîte mail pour réinitialiser votre mot de passe.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setResetSent(false)}
              className="w-full"
            >
              Retour à la connexion
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
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
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:underline"
                disabled={isLoading}
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 group" 
              disabled={isLoading}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
              {!isLoading && (
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>

            {/* Sign up Link */}
            <div className="text-center text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={() => {
                  handleClose()
                  onSwitchToSignup?.()
                }}
                className="text-blue-600 hover:underline font-medium"
              >
                Créer un compte gratuit
              </button>
            </div>
          </form>
        )}

        {/* Demo Access */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              Ou découvrez SimplRH avec un compte de démonstration
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                // Auto-fill demo credentials
                reset({
                  email: 'demo@simplrh.fr',
                  password: 'Demo123!'
                })
              }}
            >
              Utiliser le compte démo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
