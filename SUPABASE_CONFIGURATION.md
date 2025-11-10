# 🔧 Configuration Supabase - SimplRH

## 📋 Checklist des étapes à effectuer sur Supabase

### ✅ **1. Exécuter les scripts SQL**

Dans **SQL Editor** de Supabase, exécuter dans cet ordre :

#### 1.1 Créer le schéma de la base de données
```sql
-- Copier et coller le contenu de : db/schema.sql
-- Puis cliquer sur "Run"
```

#### 1.2 Activer Row Level Security
```sql
-- Copier et coller le contenu de : db/rls.sql
-- Puis cliquer sur "Run"
```

#### 1.3 (Optionnel) Ajouter des données de test
```sql
-- Copier et coller le contenu de : db/seed.sql
-- Puis cliquer sur "Run"
```

---

### 📦 **2. Créer le Storage Bucket**

L'application a besoin d'un bucket de stockage pour :
- Les exports de paie (CSV)
- Les documents générés (PDF)
- Les factures (PDF)

#### Étapes :
1. Aller dans **Storage** dans le menu Supabase
2. Cliquer sur **"New bucket"**
3. Paramètres du bucket :
   - **Name** : `documents`
   - **Public bucket** : ✅ **OUI** (pour permettre les téléchargements)
   - **File size limit** : `50 MB` (ou selon vos besoins)
   - **Allowed MIME types** : 
     - `application/pdf`
     - `text/csv`
     - `application/vnd.ms-excel`
     - `image/*` (optionnel)

4. Cliquer sur **"Create bucket"**

---

### 🔒 **3. Configurer les politiques Storage (RLS)**

Une fois le bucket créé, configurer les politiques de sécurité :

#### Aller dans Storage → documents → Policies

Exécuter ce SQL pour créer les politiques :

```sql
-- Politique 1 : Les utilisateurs authentifiés peuvent uploader dans leur org
CREATE POLICY "Users can upload to their org folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] IN (
    SELECT org_id::text 
    FROM members 
    WHERE user_id = auth.uid()
  )
);

-- Politique 2 : Les utilisateurs peuvent lire les fichiers de leur org
CREATE POLICY "Users can read their org files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] IN (
    SELECT org_id::text 
    FROM members 
    WHERE user_id = auth.uid()
  )
);

-- Politique 3 : Les utilisateurs peuvent supprimer les fichiers de leur org
CREATE POLICY "Users can delete their org files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] IN (
    SELECT org_id::text 
    FROM members 
    WHERE user_id = auth.uid()
  )
);

-- Politique 4 : Les utilisateurs peuvent mettre à jour les fichiers de leur org
CREATE POLICY "Users can update their org files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] IN (
    SELECT org_id::text 
    FROM members 
    WHERE user_id = auth.uid()
  )
);
```

---

### 🔐 **4. Configurer l'authentification**

#### Aller dans **Authentication → Settings**

#### 4.1 Email Templates
Personnaliser les emails envoyés aux utilisateurs :

**Confirm signup** (Confirmation d'inscription) :
```html
<h2>Bienvenue sur SimplRH !</h2>
<p>Cliquez sur le lien ci-dessous pour confirmer votre adresse email :</p>
<p><a href="{{ .ConfirmationURL }}">Confirmer mon email</a></p>
```

**Reset password** (Réinitialisation de mot de passe) :
```html
<h2>Réinitialisation de mot de passe</h2>
<p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
<p><a href="{{ .ConfirmationURL }}">Réinitialiser mon mot de passe</a></p>
```

#### 4.2 Site URL
- **Site URL** : Votre URL de production (ex: `https://votre-app.vercel.app`)
- En développement : `http://localhost:3000`

#### 4.3 Redirect URLs (Allowed)
Ajouter ces URLs autorisées :
- `http://localhost:3000/**` (développement)
- `https://votre-app.vercel.app/**` (production)

#### 4.4 Email Auth (Activer)
- ✅ **Enable email confirmations** (Confirmation email obligatoire)
- ✅ **Enable email change confirmations**

---

### 🔔 **5. (Optionnel) Configurer les Webhooks**

Si vous utilisez Stripe ou d'autres services externes :

#### Aller dans **Database → Webhooks**

Exemple pour Stripe :
- **Table** : `invoices`
- **Events** : `INSERT`, `UPDATE`
- **Webhook URL** : `https://votre-app.vercel.app/api/stripe/webhook`

---

### 📊 **6. (Optionnel) Activer Realtime**

Pour les mises à jour en temps réel (notifications, chat, etc.) :

```sql
-- Activer Realtime sur certaines tables
ALTER PUBLICATION supabase_realtime ADD TABLE leave_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE absences;
```

Puis dans **Database → Replication** :
- Activer les tables nécessaires

---

### 🛡️ **7. Vérifier les permissions**

#### Tester les permissions RLS :

1. Créer un utilisateur de test
2. Se connecter avec cet utilisateur
3. Vérifier qu'il peut :
   - ✅ Voir uniquement les données de son organisation
   - ✅ Créer des données dans son organisation
   - ❌ Ne PAS voir les données des autres organisations

---

## 🔍 **Vérification finale**

### Checklist avant la mise en production :

- [ ] **Tables créées** : Toutes les tables du schema.sql existent
- [ ] **RLS activé** : Row Level Security est actif sur toutes les tables
- [ ] **Storage bucket créé** : Le bucket "documents" existe et est public
- [ ] **Politiques Storage** : Les 4 politiques RLS storage sont actives
- [ ] **Auth configurée** : Confirmation email activée
- [ ] **URLs configurées** : Site URL et Redirect URLs correctes
- [ ] **Variables d'env** : `.env.local` correctement configuré

---

## 🚨 **Troubleshooting**

### Problème : "relation does not exist"
➡️ Vous n'avez pas exécuté `schema.sql`

### Problème : "new row violates row-level security policy"
➡️ Vérifier que les politiques RLS sont bien créées via `rls.sql`

### Problème : "Failed to upload file"
➡️ Vérifier que le bucket "documents" existe et est public

### Problème : "Email confirmation required"
➡️ Vérifier la configuration Email dans Authentication → Settings

---

## 📞 **Support**

- [Documentation Supabase](https://supabase.com/docs)
- [SQL Editor](https://supabase.com/docs/guides/database/overview)
- [Storage Documentation](https://supabase.com/docs/guides/storage)
- [Auth Documentation](https://supabase.com/docs/guides/auth)

---

**Une fois ces étapes complétées, votre application SimplRH sera 100% fonctionnelle ! 🎉**





