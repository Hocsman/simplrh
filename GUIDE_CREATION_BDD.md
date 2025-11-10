# 📊 Guide de Création de la Base de Données Supabase

## ⚠️ IMPORTANT : Cette étape est OBLIGATOIRE

Sans la base de données, l'application ne pourra pas :
- ❌ Sauvegarder les utilisateurs
- ❌ Créer des organisations
- ❌ Enregistrer des factures
- ❌ Gérer des employés
- ❌ Stocker des documents

---

## 🎯 Objectif

Créer toutes les tables nécessaires dans votre base de données Supabase pour que l'application fonctionne complètement.

---

## 📋 Étapes Détaillées

### **Étape 1 : Accéder à Supabase**

1. Ouvrez votre navigateur
2. Allez sur **[https://supabase.com](https://supabase.com)**
3. Connectez-vous avec votre compte
4. Vous verrez votre projet : `rpyngzsggwflkyellljy`

### **Étape 2 : Ouvrir l'Éditeur SQL**

1. Dans le menu de gauche, cliquez sur **"SQL Editor"** (icône avec `</>`)
2. Cliquez sur **"New query"** (en haut à droite)

### **Étape 3 : Exécuter le Script de Structure**

#### 📝 Script 1 : `schema.sql` - OBLIGATOIRE

**Ce script crée :**
- ✅ Table `users` - Utilisateurs
- ✅ Table `orgs` - Organisations
- ✅ Table `members` - Membres des organisations
- ✅ Table `customers` - Clients
- ✅ Table `invoices` - Factures
- ✅ Table `invoice_items` - Lignes de factures
- ✅ Table `payments` - Paiements
- ✅ Table `employees` - Employés
- ✅ Table `leave_requests` - Demandes de congés
- ✅ Table `leave_policies` - Politiques de congés
- ✅ Table `absences` - Absences
- ✅ Table `payroll_exports` - Exports de paie
- ✅ Table `doc_templates` - Templates de documents
- ✅ Table `doc_requests` - Demandes de documents
- ✅ Table `doc_files` - Fichiers de documents
- ✅ Table `audit_logs` - Logs d'audit

**Comment faire :**

1. Ouvrez le fichier `db/schema.sql` dans votre éditeur (VS Code, etc.)
2. **Copiez TOUT le contenu** (Ctrl+A puis Ctrl+C)
3. **Collez** dans l'éditeur SQL de Supabase (Ctrl+V)
4. Cliquez sur **"Run"** (bouton en bas à droite) ou appuyez sur **Ctrl+Enter**
5. ✅ Attendez quelques secondes
6. ✅ Vous devriez voir "Success" en vert

**Exemple de ce que vous allez voir :**
```
Success. No rows returned
Time: 0.234 seconds
```

---

### **Étape 4 : Exécuter le Script de Sécurité**

#### 🔒 Script 2 : `rls.sql` - OBLIGATOIRE

**Ce script configure :**
- ✅ Row Level Security (RLS) - Chaque utilisateur voit uniquement SES données
- ✅ Politiques d'accès par table
- ✅ Permissions par rôle

**Comment faire :**

1. Créez une **nouvelle requête** (New query)
2. Ouvrez le fichier `db/rls.sql`
3. **Copiez TOUT le contenu**
4. **Collez** dans l'éditeur SQL
5. Cliquez sur **"Run"**
6. ✅ Vous devriez voir "Success"

**⚠️ IMPORTANT :** Ce script garantit que :
- Un utilisateur ne peut voir QUE les données de son organisation
- Les rôles sont respectés (owner, admin, manager, etc.)
- Impossible d'accéder aux données d'une autre organisation

---

### **Étape 5 : Exécuter le Script de Données de Test (OPTIONNEL)**

#### 🧪 Script 3 : `seed.sql` - OPTIONNEL

**Ce script ajoute :**
- 🧑 Utilisateur de test
- 🏢 Organisation de test
- 👥 Employés de test
- 📄 Factures de test
- 📋 Templates de documents

**Recommandation :** 
- ✅ **OUI** si vous voulez tester rapidement l'application avec des données
- ❌ **NON** si vous voulez partir d'une base vierge

**Comment faire :**

1. Créez une **nouvelle requête** (New query)
2. Ouvrez le fichier `db/seed.sql`
3. **Copiez TOUT le contenu**
4. **Collez** dans l'éditeur SQL
5. Cliquez sur **"Run"**
6. ✅ Vous devriez voir "Success"

---

## ✅ Vérification

### Comment vérifier que tout fonctionne ?

1. Dans Supabase, allez dans **"Table Editor"** (menu de gauche)
2. Vous devriez voir toutes les tables :
   - ✅ users
   - ✅ orgs
   - ✅ members
   - ✅ customers
   - ✅ invoices
   - ✅ employees
   - ✅ leave_requests
   - ✅ doc_templates
   - ✅ etc.

3. Si vous avez exécuté `seed.sql`, vous verrez des données dans certaines tables

---

## 🧪 Test de l'Application

### Après avoir créé la base de données :

#### Test 1 : Inscription
1. Allez sur `http://localhost:3000/auth/signup`
2. Créez un compte avec votre email
3. ✅ Vous recevrez un email de confirmation Supabase
4. Cliquez sur le lien de confirmation

#### Test 2 : Onboarding
1. Après confirmation, vous serez sur `/onboarding`
2. Entrez le nom de votre organisation
3. Sélectionnez les modules
4. Cliquez sur "Créer l'organisation"
5. ✅ Redirection vers `/dashboard`

#### Test 3 : Créer une Facture
1. Allez sur `/billing/customers/new`
2. Créez un client
3. Allez sur `/billing/invoices/new`
4. Créez une facture
5. ✅ Téléchargez le PDF

#### Test 4 : Vérifier les Données
1. Retournez dans Supabase → Table Editor
2. Regardez la table `orgs` → Votre organisation est là !
3. Regardez la table `invoices` → Votre facture est là !
4. ✅ Les données sont bien sauvegardées

---

## 🔒 Sécurité RLS - Comment ça marche ?

### Exemple de Politique

Pour la table `invoices` :
```sql
-- Un utilisateur peut voir uniquement les factures de SON organisation
CREATE POLICY "Users can view their org invoices"
ON invoices FOR SELECT
USING (
  org_id IN (
    SELECT org_id FROM members WHERE user_id = auth.uid()
  )
);
```

**Résultat :**
- ✅ Vous voyez VOS factures
- ❌ Vous ne voyez PAS les factures d'autres organisations
- ✅ Sécurité automatique au niveau de la base de données

---

## ❓ Questions Fréquentes

### Q1 : J'ai une erreur "relation already exists"
**R :** Normal si vous avez déjà exécuté le script. Le script `schema.sql` commence par `DROP TABLE IF EXISTS` pour nettoyer avant de recréer.

### Q2 : Puis-je modifier les tables après ?
**R :** Oui ! Vous pouvez ajouter des colonnes, créer des index, etc. via l'éditeur SQL.

### Q3 : Que se passe-t-il si je ne crée pas la base de données ?
**R :** L'application chargera mais :
- ❌ Impossible de s'inscrire
- ❌ Impossible de créer des données
- ❌ Erreurs dans la console
- ⚠️ L'application restera en mode "vitrine"

### Q4 : Faut-il exécuter les scripts à chaque démarrage ?
**R :** NON ! Une seule fois suffit. Les tables restent dans Supabase.

### Q5 : Et si je veux tout recommencer ?
**R :** Re-exécutez `schema.sql` → Il va supprimer et recréer toutes les tables (ATTENTION : toutes les données seront perdues)

---

## 📊 Structure de la Base de Données

```
┌─────────────────────────────────────────────────┐
│               Base de Données                    │
└─────────────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
    ┌───▼───┐    ┌───▼────┐   ┌───▼────┐
    │ Users │    │  Orgs  │   │Members │
    └───┬───┘    └───┬────┘   └───┬────┘
        │            │            │
        └────────────┴────────────┘
                 │
        ┌────────┼────────┐
        │        │        │
    ┌───▼──┐ ┌──▼───┐ ┌──▼────┐
    │Billing│ │People│ │  Docs │
    │Module │ │Module│ │Module │
    └───────┘ └──────┘ └───────┘
```

---

## 🎯 Résumé des Actions

| Script | Fichier | Obligatoire | Durée | Description |
|--------|---------|-------------|-------|-------------|
| 1️⃣ | `db/schema.sql` | ✅ OUI | ~2s | Crée toutes les tables |
| 2️⃣ | `db/rls.sql` | ✅ OUI | ~1s | Configure la sécurité |
| 3️⃣ | `db/seed.sql` | ⏸️ Optionnel | ~1s | Ajoute des données de test |

**Temps total : ~5 minutes**

---

## ✅ Une fois terminé

Votre base de données sera :
- ✅ Complète avec toutes les tables
- ✅ Sécurisée avec RLS
- ✅ Prête à recevoir des données
- ✅ Accessible uniquement par les utilisateurs autorisés

**Et votre application SimplRH sera 100% fonctionnelle !** 🚀

---

## 📞 Besoin d'Aide ?

Si vous rencontrez un problème :
1. Vérifiez les messages d'erreur dans l'éditeur SQL
2. Assurez-vous d'avoir copié TOUT le contenu du fichier
3. Vérifiez que vous êtes bien dans le bon projet Supabase
4. Essayez de rafraîchir la page Supabase

---

**Prêt à créer votre base de données ?** 🎯

Suivez les étapes ci-dessus et votre application sera opérationnelle dans 5 minutes !






