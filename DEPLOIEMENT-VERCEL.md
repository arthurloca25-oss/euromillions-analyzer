# 🚀 Déploiement sur Vercel - Guide Étape par Étape

## ✅ Préparation (déjà fait!)

Votre application est prête pour le déploiement:
- ✅ Configuration PWA complète
- ✅ Icônes générées (192x192 et 512x512)
- ✅ Service Worker configuré
- ✅ Point d'entrée adapté pour production
- ✅ Configuration Vercel créée

---

## 📋 Étape 1: Créer un compte GitHub (si pas déjà fait)

1. Allez sur https://github.com
2. Cliquez sur "Sign up"
3. Suivez les instructions pour créer votre compte

---

## 📦 Étape 2: Créer un dépôt GitHub

1. Connectez-vous à GitHub
2. Cliquez sur le bouton **"+"** en haut à droite → **"New repository"**
3. Nommez votre dépôt: `euromillions-analyzer`
4. Sélectionnez **"Public"** ou **"Private"** (les deux fonctionnent)
5. **NE PAS** cocher "Initialize with README"
6. Cliquez sur **"Create repository"**

---

## 💻 Étape 3: Pousser votre code sur GitHub

Dans votre terminal (dans le dossier de votre projet), exécutez:

```bash
# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit - Application EuroMillions PWA"

# Connecter au dépôt GitHub (remplacez USERNAME par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/USERNAME/euromillions-analyzer.git

# Pousser le code
git branch -M main
git push -u origin main
```

⚠️ Si GitHub vous demande de vous authentifier:
- Utilisez votre nom d'utilisateur GitHub
- Pour le mot de passe, créez un **Personal Access Token**:
  1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. Generate new token → Cochez "repo"
  3. Copiez le token et utilisez-le comme mot de passe

---

## 🌐 Étape 4: Déployer sur Vercel

### Option A: Via l'interface web (RECOMMANDÉ - Plus facile)

1. Allez sur https://vercel.com
2. Cliquez sur **"Sign Up"** ou **"Log In"**
3. Connectez-vous avec votre compte **GitHub**
4. Cliquez sur **"Add New..."** → **"Project"**
5. Trouvez votre dépôt `euromillions-analyzer` et cliquez sur **"Import"**
6. Configuration:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm build` (devrait être auto-détecté)
   - **Output Directory**: `dist` (devrait être auto-détecté)
7. Cliquez sur **"Deploy"**
8. ⏳ Attendez 1-2 minutes que le déploiement se termine
9. 🎉 Votre application est en ligne! Vercel vous donnera une URL du type `https://euromillions-analyzer.vercel.app`

### Option B: Via la ligne de commande

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer
vercel --prod
```

---

## 📱 Étape 5: Installer la PWA

### Sur Mobile (Android/iOS):

1. Ouvrez l'URL Vercel dans votre navigateur mobile
2. **Android (Chrome/Edge)**:
   - Un bouton "Installer l'application" apparaîtra en bas
   - OU: Menu ⋮ → "Ajouter à l'écran d'accueil"
3. **iOS (Safari)**:
   - Appuyez sur le bouton Partager 
   - Sélectionnez "Sur l'écran d'accueil"

### Sur Desktop:

1. Ouvrez l'URL Vercel dans Chrome/Edge
2. Cliquez sur l'icône d'installation dans la barre d'adresse (à droite de l'URL)
3. OU: Menu ⋮ → "Installer Et si j'avais joué..."

---

## 🔄 Mises à jour futures

Pour mettre à jour votre application:

```bash
# Faire vos modifications dans le code

# Committer les changements
git add .
git commit -m "Description de vos modifications"

# Pousser sur GitHub
git push

# Vercel déploiera automatiquement la nouvelle version! 🎉
```

---

## ⚙️ Configuration Supabase (IMPORTANT!)

Si vous utilisez Supabase, vous devez configurer les variables d'environnement sur Vercel:

1. Dans votre projet Vercel → **Settings** → **Environment Variables**
2. Ajoutez:
   - `VITE_SUPABASE_URL`: Votre URL Supabase
   - `VITE_SUPABASE_ANON_KEY`: Votre clé publique Supabase

---

## 🆘 Problèmes courants

**❌ Le build échoue**:
- Vérifiez que tous les packages sont dans `package.json`
- Vérifiez les logs d'erreur sur Vercel

**❌ L'application ne s'affiche pas**:
- Vérifiez que `dist` est bien le dossier de sortie
- Vérifiez dans les logs de déploiement Vercel

**❌ La PWA ne s'installe pas**:
- Assurez-vous d'utiliser HTTPS (automatique sur Vercel)
- Videz le cache du navigateur
- Vérifiez dans Chrome DevTools → Application → Manifest

---

## 🎯 Résumé

1. ✅ Créer un compte GitHub
2. ✅ Créer un dépôt et pousser le code
3. ✅ Déployer sur Vercel (via web ou CLI)
4. ✅ Installer la PWA depuis l'URL Vercel
5. ✅ Profiter de votre application! 🎉

---

**Besoin d'aide?** N'hésitez pas à demander!
