'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, ChevronDown } from 'lucide-react'
import { LoginDialog } from '@/components/marketing/LoginDialog'
import { SignupDialog } from '@/components/marketing/SignupDialog'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            SimplRH
          </Link>          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/fonctionnalites" className="text-gray-600 hover:text-blue-600 transition-colors">
              Fonctionnalités
            </Link>
            <Link href="/tarifs" className="text-gray-600 hover:text-blue-600 transition-colors">
              Tarifs
            </Link>
            <Link href="/demo" className="text-gray-600 hover:text-blue-600 transition-colors">
              Démo
            </Link>
            <Link href="/#faq" className="text-gray-600 hover:text-blue-600 transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="ghost" 
              onClick={() => setIsLoginOpen(true)}
              className="text-gray-600 hover:text-blue-600"
            >
              Connexion
            </Button>
            <Button onClick={() => setIsSignupOpen(true)}>
              Essai gratuit
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link 
                href="/fonctionnalites" 
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Fonctionnalités
              </Link>
              <Link 
                href="/tarifs" 
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Tarifs
              </Link>
              <Link 
                href="/demo" 
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Démo
              </Link>
              <Link 
                href="/#faq" 
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="pt-4 border-t flex flex-col space-y-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsLoginOpen(true)
                    setIsMenuOpen(false)
                  }}
                >
                  Connexion
                </Button>
                <Button 
                  onClick={() => {
                    setIsSignupOpen(true)
                    setIsMenuOpen(false)
                  }}
                >
                  Essai gratuit
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
      <SignupDialog open={isSignupOpen} onOpenChange={setIsSignupOpen} />
    </>
  )
}
