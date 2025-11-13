'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { ArrowLeft, Save, Building } from 'lucide-react'

export default function NewCustomerPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    siret: '',
    vat_number: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('=== DÉBUT CRÉATION CLIENT ===')
    console.log('Données formulaire:', formData)
    
    if (!formData.name) {
      console.log('❌ Nom manquant')
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Le nom du client est requis'
      })
      return
    }

    setLoading(true)
    try {
      console.log('📤 Envoi requête API...')
      const response = await fetch('/api/billing/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      console.log('📥 Réponse API:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ Erreur API:', errorData)
        throw new Error(errorData.error || 'Failed to create customer')
      }

      const result = await response.json()
      console.log('✅ Client créé:', result)

      toast({
        title: '✅ Client créé !',
        description: `Le client ${result.customer.name} a été créé avec succès`,
        duration: 5000
      })

      // Attendre un peu pour que le toast s'affiche
      setTimeout(() => {
        router.push('/billing/customers')
      }, 1000)
    } catch (error: any) {
      console.error('❌ Erreur création client:', error)
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de créer le client',
        duration: 5000
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/billing/customers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Nouveau client</h1>
        <p className="text-gray-600 mt-2">Ajoutez un nouveau client à votre portefeuille</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informations du client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nom du client *</Label>
              <Input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: TechStart SAS"
                className="mt-1"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@client.fr"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01 23 45 67 89"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="siret">SIRET</Label>
                <Input 
                  id="siret"
                  name="siret"
                  value={formData.siret}
                  onChange={handleChange}
                  placeholder="12345678901234"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="vat_number">Numéro de TVA</Label>
                <Input 
                  id="vat_number"
                  name="vat_number"
                  value={formData.vat_number}
                  onChange={handleChange}
                  placeholder="FR12345678901"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Adresse complète</Label>
              <Textarea 
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Avenue des Champs-Élysées&#10;75008 Paris"
                className="mt-1"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Création...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Créer le client
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
