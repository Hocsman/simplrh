'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { FileText, Download, AlertTriangle } from 'lucide-react'

interface Template {
  key: string
  title: string
  schema: any
}

export default function GenerateDocPage() {
  const [loading, setLoading] = useState(false)
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [generatedDoc, setGeneratedDoc] = useState<any>(null)
  
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Load templates (stub)
    setTemplates([
      {
        key: 'contrat-prestation',
        title: 'Contrat de prestation de services',
        schema: {
          type: 'object',
          properties: {
            prestataire: {
              type: 'object',
              properties: {
                nom: { type: 'string', title: 'Nom/Raison sociale' },
                adresse: { type: 'string', title: 'Adresse' },
                siret: { type: 'string', title: 'SIRET' }
              }
            },
            client: {
              type: 'object',
              properties: {
                nom: { type: 'string', title: 'Nom/Raison sociale' },
                adresse: { type: 'string', title: 'Adresse' }
              }
            },
            prestation: {
              type: 'object',
              properties: {
                description: { type: 'string', title: 'Description de la prestation' },
                duree: { type: 'string', title: 'Durée' },
                prix: { type: 'number', title: 'Prix (€ HT)' }
              }
            }
          }
        }
      },
      {
        key: 'cgv-ecommerce',
        title: 'Conditions Générales de Vente - E-commerce',
        schema: {
          type: 'object',
          properties: {
            entreprise: {
              type: 'object',
              properties: {
                nom: { type: 'string', title: 'Nom de l\'entreprise' },
                adresse: { type: 'string', title: 'Adresse' },
                siret: { type: 'string', title: 'SIRET' },
                email: { type: 'string', title: 'Email de contact' }
              }
            },
            site: {
              type: 'object',
              properties: {
                url: { type: 'string', title: 'URL du site' },
                activite: { type: 'string', title: 'Activité principale' }
              }
            }
          }
        }
      },
      {
        key: 'mise-en-demeure',
        title: 'Lettre de mise en demeure',
        schema: {
          type: 'object',
          properties: {
            expediteur: {
              type: 'object',
              properties: {
                nom: { type: 'string', title: 'Nom/Raison sociale' },
                adresse: { type: 'string', title: 'Adresse' }
              }
            },
            destinataire: {
              type: 'object',
              properties: {
                nom: { type: 'string', title: 'Nom/Raison sociale' },
                adresse: { type: 'string', title: 'Adresse' }
              }
            },
            objet: {
              type: 'object',
              properties: {
                description: { type: 'string', title: 'Objet de la mise en demeure' },
                montant: { type: 'number', title: 'Montant dû (€)' },
                echeance: { type: 'string', title: 'Date d\'échéance' },
                delai: { type: 'number', title: 'Délai de règlement (jours)' }
              }
            }
          }
        }
      }
    ])
  }, [])

  const getTemplate = () => {
    return templates.find(t => t.key === selectedTemplate)
  }

  const renderFormField = (key: string, property: any, parentKey = '') => {
    const fieldKey = parentKey ? `${parentKey}.${key}` : key
    const value = getNestedValue(formData, fieldKey) || ''

    if (property.type === 'object') {
      return (
        <div key={fieldKey} className="space-y-4">
          <h4 className="font-medium text-gray-900 capitalize">{property.title || key}</h4>
          <div className="pl-4 space-y-4 border-l-2 border-gray-200">
            {Object.entries(property.properties || {}).map(([subKey, subProperty]) =>
              renderFormField(subKey, subProperty, fieldKey)
            )}
          </div>
        </div>
      )
    }

    return (
      <div key={fieldKey} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {property.title || key}
        </label>
        {property.type === 'string' && property.title?.includes('Description') ? (
          <Textarea
            value={value}
            onChange={(e) => setNestedValue(fieldKey, e.target.value)}
            placeholder={`Entrez ${property.title?.toLowerCase()}`}
            rows={3}
          />
        ) : property.type === 'number' ? (
          <Input
            type="number"
            value={value}
            onChange={(e) => setNestedValue(fieldKey, parseFloat(e.target.value) || 0)}
            placeholder={`Entrez ${property.title?.toLowerCase()}`}
          />
        ) : property.type === 'string' && key.includes('date') ? (
          <Input
            type="date"
            value={value}
            onChange={(e) => setNestedValue(fieldKey, e.target.value)}
          />
        ) : (
          <Input
            type="text"
            value={value}
            onChange={(e) => setNestedValue(fieldKey, e.target.value)}
            placeholder={`Entrez ${property.title?.toLowerCase()}`}
          />
        )}
      </div>
    )
  }

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  const setNestedValue = (path: string, value: any) => {
    const keys = path.split('.')
    const newData = { ...formData }
    let current = newData

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {}
      }
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value
    setFormData(newData)
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTemplate) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez sélectionner un template'
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/docs/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_key: selectedTemplate,
          payload: formData
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate document')
      }

      const result = await response.json()
      setGeneratedDoc(result)
      
      toast({
        title: 'Document généré !',
        description: 'Votre document est prêt au téléchargement'
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de générer le document'
      })
    } finally {
      setLoading(false)
    }
  }

  const template = getTemplate()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Générer un document
        </h1>
        <p className="text-gray-600 mt-2">
          Créez des documents juridiques professionnels en quelques clics
        </p>
      </div>

      {generatedDoc && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-green-900">Document généré avec succès</h3>
                <p className="text-sm text-green-700">
                  Template: {templates.find(t => t.key === selectedTemplate)?.title}
                </p>
              </div>
              <Button asChild>
                <a href={generatedDoc.download_url} download>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger PDF
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleGenerate} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Sélection du template
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedTemplate} onValueChange={(value) => {
                setSelectedTemplate(value)
                setFormData({})
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez un template de document" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.key} value={template.key}>
                      {template.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedTemplate && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Template sélectionné</Badge>
                  </div>
                  <h4 className="font-medium text-blue-900">
                    {template?.title}
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Remplissez les champs ci-dessous pour générer votre document
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {template && (
          <Card>
            <CardHeader>
              <CardTitle>Informations du document</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(template.schema.properties || {}).map(([key, property]) =>
                  renderFormField(key, property)
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTemplate && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <h4 className="font-medium text-amber-900">Avertissement légal</h4>
              </div>
              <p className="text-sm text-amber-800">
                Les documents générés sont des modèles à titre informatif. 
                Il est recommandé de les faire relire par un professionnel du droit 
                avant utilisation dans un contexte commercial ou juridique.
              </p>
            </CardContent>
          </Card>
        )}

        {template && (
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedTemplate('')
                setFormData({})
                setGeneratedDoc(null)
              }}
            >
              Réinitialiser
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Génération...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Générer le document
                </div>
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}