# Génération de Documents - SimplRH

Guide complet pour utiliser et comprendre le système de génération de documents juridiques de SimplRH.

**Version** : 1.0
**Date** : 13 novembre 2025

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Templates disponibles](#templates-disponibles)
3. [Utilisation](#utilisation)
4. [Architecture technique](#architecture-technique)
5. [APIs](#apis)
6. [Personnalisation](#personnalisation)
7. [Troubleshooting](#troubleshooting)

---

## Vue d'ensemble

SimplRH intègre un système complet de génération de documents juridiques professionnels au format PDF. Le système permet de :

- ✅ Générer des documents à partir de templates prédéfinis
- ✅ Stocker les documents dans Supabase Storage
- ✅ Télécharger les documents générés de manière sécurisée
- ✅ Tracer toutes les générations dans l'audit log
- ✅ Respecter l'isolation multi-tenant (RLS)

### Fonctionnalités principales

- **Génération PDF** : Création de PDFs professionnels avec PDFKit
- **Templates dynamiques** : Système extensible pour ajouter de nouveaux templates
- **Stockage sécurisé** : Documents stockés dans Supabase Storage avec isolation par organisation
- **Téléchargement sécurisé** : Vérification d'authentification et d'autorisation
- **Historique** : Traçabilité complète des générations

---

## Templates disponibles

### 1. Contrat de prestation de services

**Clé** : `contrat-prestation`
**Usage** : Contrats entre prestataire et client

**Données requises** :
```typescript
{
  prestataire: {
    nom: string          // Nom ou raison sociale du prestataire
    adresse: string      // Adresse complète
    siret?: string       // SIRET (optionnel)
  },
  client: {
    nom: string          // Nom ou raison sociale du client
    adresse: string      // Adresse complète
  },
  prestation: {
    description: string  // Description détaillée de la prestation
    duree?: string       // Durée estimée (ex: "3 mois")
    prix: number         // Prix en euros HT
  }
}
```

**Contenu généré** :
- En-tête avec titre du contrat
- Identification des parties (prestataire et client)
- 7 articles complets :
  1. Objet du contrat
  2. Durée de la prestation
  3. Obligations du prestataire
  4. Obligations du client
  5. Rémunération
  6. Résiliation
  7. Loi applicable
- Blocs de signature pour les deux parties
- Mentions légales en pied de page

### 2. Conditions Générales de Vente (E-commerce)

**Clé** : `cgv-ecommerce`
**Usage** : CGV pour sites de vente en ligne

**Données requises** :
```typescript
{
  entreprise: {
    nom: string          // Nom de l'entreprise
    adresse: string      // Adresse du siège
    siret: string        // SIRET obligatoire
    email: string        // Email de contact
    telephone?: string   // Téléphone (optionnel)
  },
  site: {
    url: string          // URL du site web
    activite: string     // Description de l'activité
  }
}
```

**Contenu généré** :
- En-tête avec titre et identification de l'entreprise
- 10 articles complets :
  1. Objet
  2. Acceptation des CGV
  3. Produits et services
  4. Commandes
  5. Prix et modalités de paiement
  6. Livraison
  7. Droit de rétractation (14 jours)
  8. Garanties
  9. Responsabilité
  10. Données personnelles (RGPD)
- Mentions de contact
- Pied de page avec date de génération

### 3. Lettre de mise en demeure

**Clé** : `mise-en-demeure`
**Usage** : Courrier formel de relance pour impayé

**Données requises** :
```typescript
{
  expediteur: {
    nom: string          // Nom ou raison sociale de l'expéditeur
    adresse: string      // Adresse complète
  },
  destinataire: {
    nom: string          // Nom ou raison sociale du destinataire
    adresse: string      // Adresse complète
  },
  objet: {
    description: string  // Objet de la mise en demeure
    montant: number      // Montant dû en euros
    echeance: string     // Date d'échéance (format: "YYYY-MM-DD")
    delai?: number       // Délai de règlement en jours (défaut: 8)
  }
}
```

**Contenu généré** :
- En-tête avec coordonnées expéditeur et destinataire
- Date et lieu
- Titre "MISE EN DEMEURE"
- Corps de lettre formel avec :
  - Rappel de l'obligation
  - Montant dû formaté
  - Date d'échéance
  - Délai de règlement
  - Conséquences légales
- Formule de politesse
- Signature de l'expéditeur
- Mentions légales (lettre recommandée avec AR)

---

## Utilisation

### Interface utilisateur

1. **Accéder à la page de génération**
   ```
   Dashboard → Documents → Générer un document
   URL: /docs/generate
   ```

2. **Sélectionner un template**
   - Choisir le type de document dans le menu déroulant
   - La description du template s'affiche

3. **Remplir le formulaire**
   - Les champs requis sont marqués d'un astérisque
   - Les champs s'adaptent au type de données (texte, nombre, date)
   - Les descriptions longues utilisent des zones de texte

4. **Générer le document**
   - Cliquer sur "Générer le document"
   - Attendre la génération (1-3 secondes)
   - Le bouton de téléchargement apparaît

5. **Télécharger le PDF**
   - Cliquer sur "Télécharger PDF"
   - Le fichier est téléchargé avec un nom descriptif

### Via l'API

#### Génération d'un document

```typescript
// POST /api/docs/generate
const response = await fetch('/api/docs/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    template_key: 'contrat-prestation',
    payload: {
      prestataire: {
        nom: 'ACME Services',
        adresse: '123 Rue Exemple, 75001 Paris',
        siret: '12345678900010'
      },
      client: {
        nom: 'Client Corp',
        adresse: '456 Avenue Test, 75002 Paris'
      },
      prestation: {
        description: 'Développement d\'une application web',
        duree: '3 mois',
        prix: 15000
      }
    }
  })
})

const result = await response.json()
// { success: true, download_url: '/api/docs/download/uuid-xxx' }
```

#### Téléchargement d'un document

```typescript
// GET /api/docs/download/[id]
const response = await fetch(`/api/docs/download/${documentId}`)
const blob = await response.blob()

// Créer un lien de téléchargement
const url = window.URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = 'document.pdf'
a.click()
```

---

## Architecture technique

### Flux de génération

```
1. Utilisateur remplit le formulaire
        ↓
2. POST /api/docs/generate
        ↓
3. Authentification (getAuthContext)
        ↓
4. Création du doc_request (status: 'draft')
        ↓
5. Génération du PDF (lib/document-templates.ts)
        ↓
6. Upload vers Supabase Storage
        ↓
7. Création du doc_file
        ↓
8. Mise à jour doc_request (status: 'generated')
        ↓
9. Log d'audit
        ↓
10. Retour de l'URL de téléchargement
```

### Structure de la base de données

#### Table `doc_templates`

```sql
CREATE TABLE doc_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES orgs(id),      -- NULL pour templates publics
    key TEXT NOT NULL,                     -- Clé unique du template
    locale TEXT DEFAULT 'fr',              -- Langue du template
    version INTEGER DEFAULT 1,             -- Versioning
    title TEXT NOT NULL,                   -- Titre du template
    schema JSONB NOT NULL,                 -- JSON Schema pour validation
    is_public BOOLEAN DEFAULT false,       -- Template public ou privé
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table `doc_requests`

```sql
CREATE TABLE doc_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id),
    template_key TEXT NOT NULL,
    payload_json JSONB NOT NULL,           -- Données fournies
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generated', 'error')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table `doc_files`

```sql
CREATE TABLE doc_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id),
    request_id UUID NOT NULL REFERENCES doc_requests(id) ON DELETE CASCADE,
    path TEXT NOT NULL,                    -- Chemin dans Supabase Storage
    type TEXT DEFAULT 'pdf' CHECK (type IN ('pdf', 'docx')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Fichiers principaux

#### `lib/document-generator.ts`

Classe de base pour la génération de PDFs.

**Responsabilités** :
- Initialisation du document PDFKit
- Méthodes utilitaires pour mise en page :
  - `addHeader()` : En-tête principal
  - `addSectionTitle()` : Titres de section
  - `addParagraph()` : Paragraphes de texte
  - `addTable()` : Tableaux
  - `addSignatureBlock()` : Blocs de signature
  - `addFooter()` : Pied de page
- Gestion des sauts de page automatiques
- Finalisation et export du Buffer

**Exemple d'utilisation** :
```typescript
const pdf = new DocumentPDFGenerator({
  title: 'Mon Document',
  author: 'SimplRH'
})

pdf.addHeader('TITRE PRINCIPAL', 'Sous-titre optionnel')
pdf.addSectionTitle('Section 1')
pdf.addParagraph('Contenu du paragraphe...')
pdf.addSignatureBlock('Jean Dupont')

const buffer = await pdf.finalize()
```

#### `lib/document-templates.ts`

Implémentations spécifiques des templates.

**Fonctions exportées** :
- `generateContratPrestation(data: any): Promise<Buffer>`
- `generateCGVEcommerce(data: any): Promise<Buffer>`
- `generateMiseEnDemeure(data: any): Promise<Buffer>`

**Pattern** :
```typescript
export async function generateContratPrestation(data: any): Promise<Buffer> {
  const pdf = new DocumentPDFGenerator({ title: 'Contrat de prestation' })

  // Construction du document
  pdf.addHeader('CONTRAT DE PRESTATION DE SERVICES')
  // ... ajout du contenu

  return pdf.finalize()
}
```

#### `domains/docs/templates.ts`

Logique métier pour les templates.

**Fonctions principales** :
- `getPublicTemplates()` : Liste des templates publics
- `getTemplate(key, orgId?)` : Récupération d'un template
- `createDocumentRequest(orgId, data, actorId?)` : Création d'une demande
- `getDocumentRequests(orgId)` : Liste des demandes d'une organisation
- `updateDocumentRequestStatus(...)` : Mise à jour du statut

#### `app/api/docs/generate/route.ts`

API de génération de documents.

**Flow** :
1. Authentification et récupération de l'organisation
2. Validation des données (template_key, payload)
3. Création du doc_request
4. Switch sur template_key pour choisir le générateur
5. Génération du PDF
6. Upload vers Supabase Storage
7. Mise à jour du statut
8. Log d'audit
9. Retour de l'URL de téléchargement

#### `app/api/docs/download/[id]/route.ts`

API de téléchargement sécurisé.

**Flow** :
1. Authentification
2. Récupération du doc_request avec ses files
3. Vérification que l'organisation correspond
4. Vérification que le document est généré
5. Téléchargement depuis Supabase Storage
6. Conversion Blob → Buffer
7. Retour du PDF avec headers appropriés

---

## APIs

### POST /api/docs/generate

Génère un nouveau document à partir d'un template.

**Authentification** : Requise (session Supabase)

**Body** :
```typescript
{
  template_key: string    // Clé du template ('contrat-prestation', 'cgv-ecommerce', 'mise-en-demeure')
  payload: Record<string, any>  // Données du document (voir section Templates)
}
```

**Réponses** :

**201 Created** - Document généré avec succès
```json
{
  "success": true,
  "download_url": "/api/docs/download/550e8400-e29b-41d4-a716-446655440000"
}
```

**400 Bad Request** - Données manquantes ou invalides
```json
{
  "error": "Template key manquant"
}
```

**401 Unauthorized** - Non authentifié
```json
{
  "error": "Non authentifié"
}
```

**404 Not Found** - Template inconnu
```json
{
  "error": "Template non trouvé"
}
```

**500 Internal Server Error** - Erreur de génération
```json
{
  "error": "Erreur lors de la génération du document"
}
```

### GET /api/docs/download/[id]

Télécharge un document généré.

**Authentification** : Requise (session Supabase)

**Paramètres** :
- `id` (path) : UUID du doc_request

**Réponses** :

**200 OK** - Document trouvé et téléchargé
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="document-xxx.pdf"`
- Body: PDF binaire

**401 Unauthorized** - Non authentifié
```json
{
  "error": "Non authentifié"
}
```

**404 Not Found** - Document non trouvé, pas encore généré, ou pas dans l'organisation
```json
{
  "error": "Document non trouvé"
}
// OU
{
  "error": "Document non disponible"
}
```

**500 Internal Server Error** - Erreur de téléchargement
```json
{
  "error": "Erreur lors du téléchargement"
}
```

---

## Personnalisation

### Ajouter un nouveau template

#### 1. Créer la fonction de génération

Dans `lib/document-templates.ts` :

```typescript
export async function generateMonNouveauTemplate(data: any): Promise<Buffer> {
  const pdf = new DocumentPDFGenerator({
    title: 'Mon Nouveau Document',
    author: 'SimplRH'
  })

  // En-tête
  pdf.addHeader('MON DOCUMENT', 'Sous-titre si nécessaire')

  // Contenu
  pdf.addSectionTitle('Section 1')
  pdf.addParagraph(`Texte avec données: ${data.champ1}`)

  // Signature
  pdf.addSignatureBlock(data.signataire)

  return pdf.finalize()
}
```

#### 2. Ajouter le template à la base de données

Dans `domains/docs/templates.ts`, ajouter au tableau `DEFAULT_TEMPLATES` :

```typescript
{
  org_id: null,
  key: 'mon-nouveau-template',
  locale: 'fr',
  version: 1,
  title: 'Mon Nouveau Document',
  is_public: true,
  schema: {
    type: 'object',
    properties: {
      champ1: { type: 'string', title: 'Champ 1' },
      champ2: { type: 'number', title: 'Champ 2' }
    },
    required: ['champ1']
  }
}
```

#### 3. Ajouter le cas dans l'API

Dans `app/api/docs/generate/route.ts`, ajouter le case dans le switch :

```typescript
switch (validatedData.template_key) {
  case 'contrat-prestation':
    pdfBuffer = await generateContratPrestation(validatedData.payload)
    break
  case 'mon-nouveau-template':
    pdfBuffer = await generateMonNouveauTemplate(validatedData.payload)
    break
  // ... autres cases
}
```

#### 4. Mettre à jour l'UI (optionnel)

Si les templates sont chargés depuis la DB, aucune modification n'est nécessaire. Sinon, ajouter le template dans `app/docs/generate/page.tsx`.

### Personnaliser le style des PDFs

Dans `lib/document-generator.ts`, modifier les constantes :

```typescript
private addHeader(title: string, subtitle?: string) {
  this.doc
    .fontSize(20)              // Taille du titre
    .fillColor('#1a1a1a')      // Couleur du texte
    .text(title, { align: 'center' })

  if (subtitle) {
    this.doc
      .fontSize(12)
      .fillColor('#666666')
      .text(subtitle, { align: 'center' })
  }

  this.currentY = this.doc.y + 20
}
```

---

## Troubleshooting

### Le document ne se génère pas

**Symptômes** : Erreur 500 lors de la génération

**Solutions** :
1. Vérifier les logs Vercel/serveur : `vercel logs`
2. Vérifier que toutes les données requises sont fournies
3. Vérifier le format des données (types)
4. Tester la génération en local : `npm run dev`

**Exemple de logs** :
```
Error: Missing required field: prestataire.nom
```

### Le téléchargement échoue (404)

**Symptômes** : "Document non disponible"

**Causes possibles** :
1. Le document n'est pas encore généré (vérifier le statut dans `doc_requests`)
2. Le bucket Supabase Storage n'existe pas
3. Les permissions RLS bloquent l'accès

**Solutions** :
1. Vérifier le statut du document dans Supabase :
   ```sql
   SELECT * FROM doc_requests WHERE id = 'xxx';
   SELECT * FROM doc_files WHERE request_id = 'xxx';
   ```

2. Créer le bucket `documents` dans Supabase Storage si nécessaire

3. Vérifier les politiques RLS sur `doc_files`

### Le PDF est mal formaté

**Symptômes** : Texte coupé, sauts de page incorrects

**Solutions** :
1. Ajuster les marges dans `DocumentPDFGenerator` :
   ```typescript
   this.doc = new PDFDocument({
     size: 'A4',
     margins: { top: 50, bottom: 50, left: 50, right: 50 }
   })
   ```

2. Forcer un saut de page avant une section :
   ```typescript
   if (this.currentY > 700) {
     this.doc.addPage()
     this.currentY = 50
   }
   ```

### Erreur "Cannot read properties of undefined"

**Symptômes** : Erreur lors de l'accès à `data.prestataire.nom`

**Solution** : Valider les données avant génération
```typescript
if (!data?.prestataire?.nom) {
  throw new Error('Le nom du prestataire est requis')
}
```

### Le bucket Supabase Storage n'existe pas

**Symptômes** : Erreur "Bucket not found: documents"

**Solution** : Créer le bucket dans Supabase
```
1. Supabase Dashboard → Storage
2. New Bucket
3. Name: documents
4. Public: false
5. Create
```

Puis ajouter les politiques RLS :
```sql
-- Policy: Organisations can upload their own documents
CREATE POLICY "Organisations can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] IN (
    SELECT org_id::text FROM members WHERE user_id = auth.uid()
  )
);

-- Policy: Organisations can read their own documents
CREATE POLICY "Organisations can read documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] IN (
    SELECT org_id::text FROM members WHERE user_id = auth.uid()
  )
);
```

---

## Sécurité

### Contrôles d'accès

- ✅ Authentification requise sur toutes les APIs
- ✅ Vérification d'appartenance à l'organisation (RLS)
- ✅ Isolation des documents par organisation (org_id)
- ✅ Validation des données côté serveur
- ✅ Pas d'exécution de code arbitraire (templates statiques)

### Bonnes pratiques

1. **Ne jamais exposer les IDs de documents publiquement**
   - Utiliser des UUIDs aléatoires
   - Vérifier l'organisation sur chaque requête

2. **Valider toutes les entrées utilisateur**
   ```typescript
   const schema = z.object({
     template_key: z.enum(['contrat-prestation', 'cgv-ecommerce', 'mise-en-demeure']),
     payload: z.record(z.any())
   })
   const validatedData = schema.parse(body)
   ```

3. **Limiter la taille des payloads**
   - Configurer Next.js : `bodySizeLimit: '1mb'`
   - Valider la taille des champs texte

4. **Logger les générations**
   - Audit log automatique sur chaque génération
   - Traçabilité complète (qui, quoi, quand)

---

## Performance

### Optimisations actuelles

- ✅ Génération synchrone (1-3 secondes)
- ✅ Pas de stockage local (direct Supabase Storage)
- ✅ Streaming du PDF vers le client
- ✅ Cache des templates publics

### Optimisations futures (optionnel)

1. **Génération asynchrone pour documents complexes**
   ```typescript
   // Utiliser une queue (BullMQ, Inngest, etc.)
   await queue.add('generate-document', { requestId, template, payload })
   // Notifier l'utilisateur par email ou webhook
   ```

2. **Cache des PDFs générés**
   - Hasher le payload
   - Vérifier si un document identique existe déjà
   - Réutiliser le fichier existant

3. **Compression des PDFs**
   ```typescript
   const pdfBuffer = await pdf.finalize()
   const compressed = await compressPDF(pdfBuffer)
   ```

---

## Exemples complets

### Exemple 1 : Contrat de prestation en React

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function ContratForm() {
  const [loading, setLoading] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)

    try {
      const response = await fetch('/api/docs/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_key: 'contrat-prestation',
          payload: {
            prestataire: {
              nom: formData.get('prestataire_nom'),
              adresse: formData.get('prestataire_adresse'),
              siret: formData.get('prestataire_siret')
            },
            client: {
              nom: formData.get('client_nom'),
              adresse: formData.get('client_adresse')
            },
            prestation: {
              description: formData.get('prestation_description'),
              duree: formData.get('prestation_duree'),
              prix: parseFloat(formData.get('prestation_prix') as string)
            }
          }
        })
      })

      const result = await response.json()
      setDownloadUrl(result.download_url)
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la génération')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2>Prestataire</h2>
      <input name="prestataire_nom" placeholder="Nom" required />
      <input name="prestataire_adresse" placeholder="Adresse" required />
      <input name="prestataire_siret" placeholder="SIRET" />

      <h2>Client</h2>
      <input name="client_nom" placeholder="Nom" required />
      <input name="client_adresse" placeholder="Adresse" required />

      <h2>Prestation</h2>
      <textarea name="prestation_description" placeholder="Description" required />
      <input name="prestation_duree" placeholder="Durée (ex: 3 mois)" />
      <input name="prestation_prix" type="number" placeholder="Prix HT" required />

      <Button type="submit" disabled={loading}>
        {loading ? 'Génération...' : 'Générer le contrat'}
      </Button>

      {downloadUrl && (
        <Button asChild>
          <a href={downloadUrl} download>Télécharger le PDF</a>
        </Button>
      )}
    </form>
  )
}
```

### Exemple 2 : Génération en backend (API route)

```typescript
// app/api/my-custom-doc/route.ts
import { generateContratPrestation } from '@/lib/document-templates'
import { uploadDocument } from '@/lib/storage'
import { getAuthContext } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  const { error, orgId } = await getAuthContext()
  if (error) return error

  // Données en dur ou récupérées d'ailleurs
  const payload = {
    prestataire: { nom: 'Ma Société', adresse: '123 Rue Test', siret: '12345678900010' },
    client: { nom: 'Client X', adresse: '456 Avenue Y' },
    prestation: { description: 'Service Z', prix: 5000 }
  }

  // Génération
  const pdfBuffer = await generateContratPrestation(payload)

  // Upload
  const fileName = `contrat-${Date.now()}.pdf`
  const uploadResult = await uploadDocument(orgId, fileName, pdfBuffer, 'application/pdf')

  return NextResponse.json({ path: uploadResult.path })
}
```

---

## Annexes

### Dépendances

```json
{
  "pdfkit": "^0.15.0"
}
```

### Variables d'environnement

Aucune variable spécifique n'est requise pour la génération de documents (les variables Supabase sont suffisantes).

### Limites connues

- **Taille maximale du payload** : 1 MB (limite Next.js)
- **Temps de génération** : 1-3 secondes (synchrone)
- **Formats supportés** : PDF uniquement (DOCX prévu mais non implémenté)
- **Langue** : Français uniquement (i18n prévu mais non implémenté)

---

## Support

Pour toute question ou problème :

1. **Documentation** : Relisez cette documentation
2. **Logs** : Consultez les logs Vercel et Supabase
3. **Code** : Examinez les fichiers sources mentionnés
4. **GitHub Issues** : Ouvrez une issue avec logs et reproduction

---

**Document généré automatiquement**
SimplRH - Plateforme RH complète
Version 1.0 - 13 novembre 2025
