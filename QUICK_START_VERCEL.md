# Quick Start - Déployer SimplRH sur Vercel en 10 minutes ⚡

Guide ultra-rapide pour déployer votre application SimplRH.

---

## 📋 Prérequis (5 min)

1. **Compte Supabase** → [app.supabase.com](https://app.supabase.com) (gratuit)
2. **Compte Vercel** → [vercel.com](https://vercel.com) (gratuit)
3. **Repository GitHub** avec votre code SimplRH

---

## 🗄️ Étape 1 : Supabase (5 min)

### 1. Créer le projet
```
1. Supabase → New Project
2. Name: simplrh-prod
3. Region: Europe (Paris)
4. Password: [générez-un-mot-de-passe-fort]
5. Create → Attendez 2 min
```

### 2. Créer la base de données
```sql
-- Dans SQL Editor → New query
-- Copiez le contenu de db/schema.sql
-- Run (Ctrl+Enter)
```

### 3. Appliquer RLS
```sql
-- Nouvelle query
-- Copiez le contenu de db/rls.sql
-- Run
```

### 4. Récupérer les clés
```
Settings → API
Notez :
- Project URL: https://xxxxx.supabase.co
- anon key: eyJhbGc...
- service_role key: eyJhbGc... (GARDEZ SECRET !)
```

---

## 🚀 Étape 2 : Vercel (5 min)

### 1. Importer le projet
```
1. Vercel Dashboard → New Project
2. Import Git Repository → Choisir simplrh
3. STOP ! Ne cliquez pas encore sur Deploy
```

### 2. Ajouter les variables d'environnement

**⚠️ IMPORTANT : Ajoutez ces 5 variables AVANT de déployer**

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_APP_URL=https://votre-app.vercel.app
NEXT_PUBLIC_APP_NAME=SimplRH
```

> 💡 **Astuce** : Pour `NEXT_PUBLIC_APP_URL`, utilisez d'abord l'URL que Vercel vous suggère (ex: simplrh-xxx.vercel.app), vous la mettrez à jour après.

### 3. Deploy !
```
Cliquez sur "Deploy"
Attendez 3-4 minutes
✅ Si tout est vert → Bravo, l'app est en ligne !
```

---

## 🔗 Étape 3 : Connexion Supabase ↔ Vercel (1 min)

### 1. Récupérer l'URL Vercel
```
Après le déploiement, Vercel affiche :
https://simplrh-xxx.vercel.app
```

### 2. Configurer Supabase Auth
```
Supabase → Authentication → URL Configuration

Site URL: https://simplrh-xxx.vercel.app

Redirect URLs (ajouter ces 4 URLs):
https://simplrh-xxx.vercel.app/auth/callback
https://simplrh-xxx.vercel.app/dashboard
http://localhost:3000/auth/callback
http://localhost:3000/dashboard

Save
```

### 3. Mettre à jour NEXT_PUBLIC_APP_URL
```
Vercel → Settings → Environment Variables
NEXT_PUBLIC_APP_URL → Edit
Nouvelle valeur: https://simplrh-xxx.vercel.app
Save

Vercel → Deployments → Latest → ... → Redeploy
```

---

## ✅ Étape 4 : Tester (2 min)

### 1. Créer un compte
```
1. Ouvrir https://simplrh-xxx.vercel.app
2. Cliquer "S'inscrire"
3. Email + Mot de passe
4. Confirmer l'email (vérifier spam)
```

### 2. Créer l'organisation
```
1. Nom de l'organisation
2. SIRET (optionnel)
3. Sélectionner les modules
4. Créer
```

### 3. Tester une fonctionnalité
```
1. Dashboard visible ? ✅
2. Créer un client
3. Créer une facture
4. Tout fonctionne ? 🎉
```

---

## 🐛 Problèmes Courants

### "Supabase non configuré"
→ Vérifiez les variables d'environnement dans Vercel
→ Redéployez après avoir modifié les variables

### "Non authentifié" sur toutes les pages
→ Vérifiez les Redirect URLs dans Supabase Auth
→ Vérifiez que `NEXT_PUBLIC_APP_URL` correspond à votre URL

### Erreur 500 sur les APIs
→ Vercel → Deployments → Function Logs
→ Regardez l'erreur exacte
→ Vérifiez les politiques RLS dans Supabase

### Build failed
→ Vérifiez les logs de build dans Vercel
→ Testez en local : `npm run build`
→ Corrigez les erreurs TypeScript

---

## 📚 Aller Plus Loin

**Guide complet** : Lisez `DEPLOIEMENT_VERCEL.md` pour :
- Configuration avancée
- Domaine personnalisé
- Stripe et Email
- Monitoring
- Troubleshooting détaillé

**Optimisations** : Lisez `OPTIMISATIONS_REALISEES.md` pour comprendre :
- Les corrections appliquées
- Les optimisations de performance
- Les améliorations de sécurité

---

## 🎯 Checklist Rapide

Avant de considérer le déploiement terminé :

- [ ] ✅ Build Vercel réussi (badge vert)
- [ ] ✅ Inscription fonctionne
- [ ] ✅ Email de confirmation reçu
- [ ] ✅ Onboarding terminé
- [ ] ✅ Dashboard s'affiche
- [ ] ✅ Création de facture fonctionne
- [ ] ✅ Pas d'erreur dans les logs Vercel
- [ ] ✅ Pas d'erreur dans les logs Supabase

---

## 💡 Tips Pro

1. **Preview Deployments** : Chaque commit crée une preview sur Vercel (gratuit)
2. **Branches** : `main` → production, `develop` → staging
3. **Rollback** : Vercel permet de revenir à une version précédente en 1 clic
4. **Custom Domain** : Ajoutez votre domaine dans Vercel → Settings → Domains
5. **Logs temps réel** : `vercel logs` (CLI) ou sur le dashboard

---

## 🆘 Besoin d'Aide ?

1. **Logs Vercel** : Deployments → Latest → View Function Logs
2. **Logs Supabase** : Logs → API Logs
3. **Documentation** : `DEPLOIEMENT_VERCEL.md` (guide détaillé)
4. **GitHub Issues** : Ouvrez une issue avec vos logs

---

**Temps total estimé : 10-15 minutes** ⏱️

Bravo, votre app SimplRH est maintenant en production ! 🚀🎉
