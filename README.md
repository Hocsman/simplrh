# SimplRH - Suite RH et Gestion Simplifiée

Une application SaaS complète pour gérer votre facturation, vos équipes et vos documents juridiques.

## 🚀 Fonctionnalités

### 📊 Module Facturation
- Création de devis et factures
- Génération PDF et Factur-X (XML)
- Gestion des paiements Stripe
- Relances automatiques
- Suivi des impayés

### 👥 Module RH
- Gestion des employés
- Demandes de congés avec workflow de validation
- Suivi des absences
- Exports paie (Silae/PayFit CSV)
- Calendrier des congés

### 📄 Module Documents
- Générateur de documents juridiques
- Modèles préfabriqués (contrats, CGV, mises en demeure)
- Export PDF/DOCX
- Bibliothèque de documents

## 🛠️ Technologies

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **UI**: TailwindCSS + shadcn/ui + Lucide React
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Paiements**: Stripe
- **Déploiement**: Vercel + Supabase

## 📦 Installation

### Prérequis
- Node.js 18+
- pnpm (recommandé) ou npm
- Compte Supabase
- Compte Stripe (optionnel pour développement)

### Étapes

1. **Cloner le projet**
```bash
git clone <your-repo>
cd simplrh
```

2. **Installer les dépendances**
```bash
pnpm install
# ou
npm install
```

3. **Configuration des variables d'environnement**
```bash
cp .env.example .env.local
```

Éditez `.env.local` avec vos propres clés :

```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=SimplRH

# Supabase (REQUIS)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe (optionnel pour développement)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email SMTP (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

4. **Configurer Supabase**

Créez un nouveau projet Supabase et exécutez les scripts SQL dans l'ordre :

```bash
# Dans l'éditeur SQL de Supabase, exécutez dans l'ordre :
# 1. db/schema.sql - Structure de la base de données
# 2. db/rls.sql - Politiques de sécurité Row Level Security
# 3. db/seed.sql - Données de test (optionnel)
```

5. **Lancer le serveur de développement**
```bash
pnpm dev
# ou
npm run dev
```

6. **Ouvrir l'application**
```
http://localhost:3000
```

## 🗂️ Structure du projet

```
simplrh/
├── app/                    # Pages Next.js (App Router)
│   ├── (marketing)/        # Pages marketing publiques
│   ├── auth/              # Connexion/inscription
│   ├── dashboard/         # Dashboard principal
│   ├── billing/           # Module facturation
│   ├── people/            # Module RH
│   ├── docs/              # Module documents
│   ├── settings/          # Paramètres
│   └── api/               # Routes API
├── components/            # Composants UI réutilisables
│   ├── ui/               # Composants shadcn/ui
│   └── marketing/        # Composants marketing
├── lib/                  # Utilitaires et services
│   ├── supabase/         # Client Supabase
│   ├── stripe/           # Intégration Stripe
│   └── utils/            # Fonctions utilitaires
├── domains/              # Logique métier par module
│   ├── core/             # Auth, organisations, audit
│   ├── billing/          # Factures, clients, paiements
│   ├── people/           # Employés, congés, paie
│   └── docs/             # Templates, génération documents
└── db/                   # Scripts SQL
    ├── schema.sql        # Structure de la DB
    ├── rls.sql          # Politiques de sécurité
    └── seed.sql         # Données de test
```

## 🔒 Sécurité

- **Row Level Security (RLS)** activé sur toutes les tables
- **Authentification** via Supabase Auth
- **Multi-tenant** par `org_id`
- **Rôles utilisateurs** : owner, admin, manager, employee, accountant, legal
- **Variables d'environnement** pour les secrets

## 📚 Utilisation

### Premier démarrage

1. **Créer un compte** sur `/auth/signup`
2. **Créer votre organisation** via l'onboarding
3. **Configurer les modules** actifs dans `/settings`
4. **Inviter des membres** de votre équipe
5. **Commencer à utiliser** les fonctionnalités

### Test des modules

#### Module Facturation
1. Aller sur `/billing/invoices/new`
2. Sélectionner "Client Demo" 
3. Ajouter des articles
4. Créer la facture → PDF + XML Factur-X générés
5. Tester le changement de statut (marquer comme payée)

#### Module RH
1. Aller sur `/people/leave-requests/new`
2. Sélectionner un employé
3. Créer une demande de congé
4. Approuver/rejeter depuis `/people/leave-requests`
5. Tester l'export CSV paie depuis `/people`

#### Module Documents
1. Aller sur `/docs/generate`
2. Choisir un template (contrat, CGV, mise en demeure)
3. Remplir le formulaire
4. Générer le PDF
5. Télécharger le document

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Ajouter les variables d'environnement dans le dashboard Vercel
```

### Variables d'environnement de production

Assurez-vous de configurer toutes les variables dans votre environnement de production :
- URL Supabase de production
- Clés Stripe de production
- Configuration SMTP réelle

## 🛠️ Développement

### Scripts disponibles

```bash
pnpm dev          # Serveur de développement
pnpm build        # Build de production  
pnpm start        # Serveur de production
pnpm lint         # ESLint
pnpm lint:fix     # ESLint avec correction automatique
pnpm type-check   # Vérification TypeScript
pnpm format       # Prettier
```

### Checklist de test en local

#### ✅ Authentification
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Onboarding création d'organisation
- [ ] Redirection vers dashboard

#### ✅ Module Facturation
- [ ] Création de facture
- [ ] Génération PDF visible
- [ ] Génération XML Factur-X
- [ ] Changement de statut (sent → paid)
- [ ] Liste des factures en retard

#### ✅ Module RH
- [ ] Création demande de congé
- [ ] Approbation/rejet demande
- [ ] Export CSV Silae/PayFit
- [ ] Affichage dans dashboard

#### ✅ Module Documents
- [ ] Sélection template
- [ ] Remplissage formulaire
- [ ] Génération PDF
- [ ] Téléchargement document

#### ✅ Dashboard
- [ ] Widgets avec données réelles
- [ ] Actions rapides fonctionnelles
- [ ] Navigation vers modules

#### ✅ Sécurité
- [ ] RLS appliqué (pas d'accès cross-org)
- [ ] Rôles respectés
- [ ] Pages protégées par auth

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE

## 📞 Support

- Documentation : [docs.simplrh.com](https://docs.simplrh.com)
- Issues : GitHub Issues
- Email : support@simplrh.com

---

**SimplRH** - Simplifiez votre gestion d'entreprise 🚀