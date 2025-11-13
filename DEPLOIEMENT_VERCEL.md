# Guide de Déploiement Vercel - SimplRH

Ce guide vous accompagne pas à pas pour déployer SimplRH sur Vercel avec une base de données Supabase.

## Prérequis

- [x] Compte GitHub avec le repository SimplRH
- [x] Compte Supabase (gratuit) : https://supabase.com
- [x] Compte Vercel (gratuit) : https://vercel.com
- [ ] Base de données Supabase configurée
- [ ] Variables d'environnement prêtes

---

## Étape 1 : Configuration de Supabase

### 1.1 Créer un projet Supabase

1. Connectez-vous sur https://app.supabase.com
2. Cliquez sur **"New Project"**
3. Remplissez les informations :
   - **Name** : `simplrh-production`
   - **Database Password** : Générez un mot de passe fort (notez-le !)
   - **Region** : Choisissez `Europe (Paris)` ou la plus proche
   - **Plan** : Free (gratuit) pour commencer
4. Cliquez sur **"Create new project"**
5. Attendez 2-3 minutes que le projet soit créé

### 1.2 Récupérer les clés API

1. Dans votre projet Supabase, allez dans **Settings** > **API**
2. Notez ces valeurs (vous en aurez besoin) :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public key** : `eyJhbGc...` (clé publique)
   - **service_role key** : `eyJhbGc...` (clé secrète - NE PAS PARTAGER)

### 1.3 Créer le schéma de base de données

1. Dans Supabase, allez dans **SQL Editor**
2. Cliquez sur **"New query"**
3. Copiez le contenu du fichier `db/schema.sql` de votre projet
4. Cliquez sur **"Run"** (Ctrl+Enter)
5. Vérifiez qu'il n'y a pas d'erreurs (vous devriez voir "Success")

### 1.4 Appliquer les politiques RLS (Row Level Security)

1. Toujours dans **SQL Editor**, créez une nouvelle requête
2. Copiez le contenu du fichier `db/rls.sql`
3. Cliquez sur **"Run"**
4. Vérifiez le succès de l'exécution

### 1.5 Configurer l'authentification

1. Allez dans **Authentication** > **Providers**
2. Activez **Email** (déjà activé par défaut)
3. Dans **Settings** > **Auth**, configurez :
   - **Site URL** : Laissez vide pour l'instant (vous le mettrez à jour après le déploiement Vercel)
   - **Redirect URLs** : Laissez vide pour l'instant

---

## Étape 2 : Configuration de Vercel

### 2.1 Créer un compte et connecter GitHub

1. Allez sur https://vercel.com
2. Cliquez sur **"Sign Up"** et connectez-vous avec GitHub
3. Autorisez Vercel à accéder à vos repositories

### 2.2 Importer le projet SimplRH

1. Sur le dashboard Vercel, cliquez sur **"Add New..."** > **"Project"**
2. Trouvez votre repository `simplrh` dans la liste
3. Cliquez sur **"Import"**

### 2.3 Configurer les variables d'environnement

**IMPORTANT** : Avant de cliquer sur "Deploy", ajoutez ces variables :

```env
# REQUIRED - Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...votre-clé-publique
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...votre-clé-secrète

# REQUIRED - Application
NEXT_PUBLIC_APP_URL=https://votre-app.vercel.app
NEXT_PUBLIC_APP_NAME=SimplRH

# OPTIONAL - Stripe (si vous utilisez les paiements)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# OPTIONAL - Email (si vous utilisez les notifications)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxx
SMTP_FROM=noreply@votre-domaine.com
```

**Comment ajouter les variables** :
1. Dans la section "Environment Variables" sur Vercel
2. Cliquez sur "Add" pour chaque variable
3. Collez le nom et la valeur
4. Sélectionnez "Production", "Preview", et "Development"
5. Cliquez sur "Add"

### 2.4 Configuration du build (optionnel)

Vercel détecte automatiquement Next.js, mais vous pouvez vérifier :

- **Framework Preset** : Next.js
- **Build Command** : `npm run build`
- **Output Directory** : `.next`
- **Install Command** : `npm install`

### 2.5 Déployer !

1. Une fois toutes les variables ajoutées, cliquez sur **"Deploy"**
2. Attendez 2-5 minutes que le build se termine
3. Si tout est vert, votre app est en ligne ! 🎉

---

## Étape 3 : Configuration post-déploiement

### 3.1 Récupérer l'URL Vercel

1. Une fois déployé, Vercel vous donne une URL : `https://simplrh-xxx.vercel.app`
2. Notez cette URL

### 3.2 Mettre à jour Supabase avec l'URL Vercel

1. Retournez sur Supabase
2. Allez dans **Authentication** > **URL Configuration**
3. Ajoutez votre URL Vercel dans :
   - **Site URL** : `https://simplrh-xxx.vercel.app`
   - **Redirect URLs** : Ajoutez ces URLs :
     ```
     https://simplrh-xxx.vercel.app/auth/callback
     https://simplrh-xxx.vercel.app/dashboard
     http://localhost:3000/auth/callback (pour le dev)
     http://localhost:3000/dashboard (pour le dev)
     ```
4. Cliquez sur **"Save"**

### 3.3 Mettre à jour NEXT_PUBLIC_APP_URL

1. Retournez sur Vercel
2. Allez dans **Settings** > **Environment Variables**
3. Trouvez `NEXT_PUBLIC_APP_URL`
4. Cliquez sur **Edit**
5. Remplacez par votre vraie URL : `https://simplrh-xxx.vercel.app`
6. Cliquez sur **"Save"**
7. **Redéployez** : Allez dans **Deployments** > cliquez sur les "..." du dernier déploiement > **"Redeploy"**

---

## Étape 4 : Tester votre application

### 4.1 Créer un compte utilisateur

1. Allez sur `https://simplrh-xxx.vercel.app`
2. Cliquez sur **"S'inscrire"** ou allez sur `/auth/signup`
3. Créez un compte avec votre email
4. Vérifiez votre email (Supabase envoie un lien de confirmation)
5. Cliquez sur le lien de confirmation
6. Vous êtes redirigé vers l'onboarding

### 4.2 Créer votre organisation

1. Remplissez les informations de votre organisation
   - Nom de l'organisation
   - SIRET (optionnel pour les tests)
2. Sélectionnez les modules que vous voulez activer
3. Cliquez sur **"Créer mon organisation"**
4. Vous êtes redirigé vers le dashboard 🎉

### 4.3 Tester les fonctionnalités

**Test de facturation** :
1. Allez dans **Facturation** > **Clients**
2. Créez un client de test
3. Allez dans **Factures**
4. Créez une facture
5. Vérifiez que la facture est créée et visible

**Test RH** :
1. Allez dans **Équipe** > **Employés**
2. Ajoutez un employé
3. Créez une demande de congé
4. Vérifiez l'affichage

---

## Étape 5 : Configuration d'un domaine personnalisé (optionnel)

### 5.1 Ajouter votre domaine sur Vercel

1. Dans Vercel, allez dans **Settings** > **Domains**
2. Ajoutez votre domaine : `app.simplrh.fr` ou `simplrh.com`
3. Vercel vous donne les DNS à configurer

### 5.2 Configurer vos DNS

Chez votre registrar (OVH, Gandi, Cloudflare, etc.) :

**Option A - CNAME** (recommandé) :
```
Type: CNAME
Name: app (ou @)
Value: cname.vercel-dns.com
```

**Option B - A Record** :
```
Type: A
Name: @ (ou votre sous-domaine)
Value: 76.76.21.21
```

### 5.3 Mettre à jour les URLs

Une fois le domaine configuré :

1. **Vercel** : Mettez à jour `NEXT_PUBLIC_APP_URL` avec votre nouveau domaine
2. **Supabase** : Mettez à jour les Redirect URLs avec votre domaine
3. Redéployez sur Vercel

---

## Étape 6 : Monitoring et maintenance

### 6.1 Activer le monitoring Vercel

1. Dans Vercel, allez dans **Analytics** (si disponible sur votre plan)
2. Activez le monitoring des performances

### 6.2 Vérifier les logs

**Logs Vercel** :
- Allez dans **Deployments** > Cliquez sur un déploiement > **"View Function Logs"**
- Vérifiez qu'il n'y a pas d'erreurs

**Logs Supabase** :
- Dans Supabase, allez dans **Logs** > **API Logs**
- Vérifiez les requêtes et les erreurs éventuelles

### 6.3 Sauvegardes de base de données

**Important** : Le plan gratuit Supabase ne fait pas de sauvegardes automatiques !

Pour faire une sauvegarde manuelle :
1. Allez dans **Database** > **Backups**
2. Cliquez sur **"Take backup"** (disponible sur plan Pro)
3. OU exportez via SQL : `pg_dump` (voir docs Supabase)

---

## Troubleshooting (Résolution de problèmes)

### Problème : "Supabase non configuré"

**Cause** : Variables d'environnement manquantes ou incorrectes

**Solution** :
1. Vérifiez que toutes les variables SUPABASE sont bien ajoutées dans Vercel
2. Vérifiez qu'il n'y a pas d'espace ou de caractère invisible
3. Redéployez après avoir modifié les variables

### Problème : "Non authentifié" sur toutes les pages

**Cause** : Middleware ou Supabase Auth mal configuré

**Solution** :
1. Vérifiez les Redirect URLs dans Supabase
2. Vérifiez que `NEXT_PUBLIC_APP_URL` correspond à votre URL de production
3. Videz le cache de votre navigateur et réessayez

### Problème : Erreur 500 sur les API

**Cause** : Erreur dans le code ou problème de connexion Supabase

**Solution** :
1. Allez dans Vercel > Deployments > View Function Logs
2. Trouvez l'erreur exacte dans les logs
3. Vérifiez les politiques RLS dans Supabase (peut-être trop restrictives)

### Problème : Build failed sur Vercel

**Cause** : Erreur TypeScript ou dépendance manquante

**Solution** :
1. Lisez les logs de build dans Vercel
2. Testez le build en local : `npm run build`
3. Corrigez les erreurs TypeScript
4. Committez et poussez les corrections

### Problème : "Organization non trouvée"

**Cause** : L'utilisateur n'a pas d'organisation dans la table `members`

**Solution** :
1. Vérifiez dans Supabase Table Editor > members
2. Si vide, l'utilisateur doit passer par l'onboarding
3. Ou ajoutez manuellement un enregistrement dans `members`

---

## Checklist de déploiement

Avant de mettre en production :

- [ ] Base de données Supabase créée avec schema.sql et rls.sql
- [ ] Toutes les variables d'environnement ajoutées dans Vercel
- [ ] Build réussi sur Vercel (badge vert)
- [ ] Test de création de compte utilisateur
- [ ] Test de l'onboarding organisation
- [ ] Test de création d'une facture
- [ ] Test de création d'un employé
- [ ] Redirect URLs Supabase configurées
- [ ] NEXT_PUBLIC_APP_URL mise à jour avec l'URL de production
- [ ] Domaine personnalisé configuré (si applicable)
- [ ] Monitoring activé
- [ ] Backup de base de données configuré

---

## Liens utiles

- **Vercel Documentation** : https://vercel.com/docs
- **Supabase Documentation** : https://supabase.com/docs
- **Next.js Documentation** : https://nextjs.org/docs
- **Support SimplRH** : [GitHub Issues](https://github.com/votre-repo/issues)

---

## Mises à jour futures

Pour déployer une mise à jour :

1. Faites vos modifications en local
2. Testez avec `npm run dev`
3. Committez sur GitHub
4. Vercel détecte automatiquement et redéploie (si activé)
5. OU déclenchez manuellement dans Vercel > Deployments > Redeploy

**Production tip** : Utilisez des branches Git :
- `main` → Production (Vercel)
- `develop` → Staging (Preview Vercel)
- `feature/*` → Development (local)

---

Félicitations ! Votre application SimplRH est maintenant en production sur Vercel ! 🎉

Pour toute question, consultez les logs Vercel et Supabase, ou ouvrez une issue sur GitHub.
