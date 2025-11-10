'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Calendar, Save } from 'lucide-react'

interface Employee {
  id: string
  full_name: string
  email?: string
}

export default function NewLeaveRequestPage() {
  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [type, setType] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [comment, setComment] = useState('')
  
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Set default dates
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    setStartDate(today.toISOString().split('T')[0])
    setEndDate(tomorrow.toISOString().split('T')[0])
    
    // Fetch employees (stub)
    setEmployees([
      { id: '1', full_name: 'Jean Dupont', email: 'jean.dupont@demo.com' },
      { id: '2', full_name: 'Marie Martin', email: 'marie.martin@demo.com' }
    ])
  }, [])

  const calculateDays = () => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEmployee || !type || !startDate || !endDate) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires'
      })
      return
    }

    if (new Date(endDate) < new Date(startDate)) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'La date de fin doit être après la date de début'
      })
      return
    }

    setLoading(true)
    try {
      const selectedEmployeeData = employees.find(e => e.id === selectedEmployee)
      
      const response = await fetch('/api/people/leave-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: selectedEmployee,
          type,
          start_date: startDate,
          end_date: endDate,
          comment: comment || undefined,
          employee_name: selectedEmployeeData?.full_name // For email
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create leave request')
      }

      const leaveRequest = await response.json()
      
      toast({
        title: 'Demande créée !',
        description: `Demande de congé créée pour ${selectedEmployeeData?.full_name}`
      })

      router.push('/people/leave-requests')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de créer la demande de congé'
      })
    } finally {
      setLoading(false)
    }
  }

  const days = calculateDays()

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Nouvelle demande de congé
        </h1>
        <p className="text-gray-600 mt-2">
          Créez une nouvelle demande de congé avec notification automatique
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Détails de la demande
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employé *
              </label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.full_name} {employee.email && `(${employee.email})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de congé *
              </label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CP">Congés payés (CP)</SelectItem>
                  <SelectItem value="RTT">RTT</SelectItem>
                  <SelectItem value="Maladie">Arrêt maladie</SelectItem>
                  <SelectItem value="Congé sans solde">Congé sans solde</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Date de début *
                </label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin *
                </label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {days > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Durée :</strong> {days} jour{days > 1 ? 's' : ''}
                  {startDate && endDate && (
                    <span className="ml-2">
                      (du {new Date(startDate).toLocaleDateString('fr-FR')} au {new Date(endDate).toLocaleDateString('fr-FR')})
                    </span>
                  )}
                </p>
              </div>
            )}

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Commentaire (optionnel)
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Motif ou informations complémentaires..."
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
                Créer la demande
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}