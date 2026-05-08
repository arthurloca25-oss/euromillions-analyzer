# PWA - Progressive Web App

Votre application "Et si j'avais joué" est maintenant une PWA installable!

## ✅ Ce qui a été configuré:

1. **manifest.json** - Métadonnées de l'application
2. **Service Worker (sw.js)** - Fonctionnement hors ligne
3. **Bouton d'installation** - Apparaît automatiquement sur mobile
4. **Icônes** - Logo de l'application

## 📱 Comment installer la PWA:

### Sur Android (Chrome/Edge):
1. Ouvrez l'application dans le navigateur
2. Un bouton "Installer l'application" apparaîtra en bas
3. OU: Menu ⋮ → "Ajouter à l'écran d'accueil"

### Sur iOS (Safari):
1. Ouvrez l'application dans Safari
2. Appuyez sur le bouton Partager 
3. Sélectionnez "Sur l'écran d'accueil"

### Sur Desktop (Chrome/Edge):
1. Cliquez sur l'icône d'installation dans la barre d'adresse (à droite)
2. OU: Menu ⋮ → "Installer Et si j'avais joué..."

## 🎨 Générer vos propres icônes:

Les icônes actuelles sont des placeholders. Pour créer vos propres icônes:

### Option 1 - En ligne (rapide):
1. Allez sur https://realfavicongenerator.net/
2. Uploadez votre logo (SVG ou PNG 512x512)
3. Téléchargez et remplacez icon-192.png et icon-512.png

### Option 2 - Avec un outil:
```bash
# Installer sharp
npm install -g sharp-cli

# Générer depuis icon.svg
sharp -i public/icon.svg -o public/icon-192.png resize 192 192
sharp -i public/icon.svg -o public/icon-512.png resize 512 512
```

## 🚀 Fonctionnalités PWA actives:

✅ Installation sur l'écran d'accueil
✅ Fonctionne hors ligne (cache intelligent)
✅ Icône et nom personnalisés
✅ Plein écran (pas de barre d'adresse)
✅ Mises à jour automatiques

## 📊 Tester la PWA:

1. Ouvrez Chrome DevTools (F12)
2. Onglet "Application"
3. Vérifiez:
   - Manifest
   - Service Workers
   - Cache Storage

## 🔄 Mises à jour:

Le Service Worker met automatiquement à jour l'application:
- Première visite: téléchargement et mise en cache
- Visites suivantes: chargement instantané depuis le cache
- Nouvelle version: mise à jour en arrière-plan

## 📱 Prochaine étape: Google Play Store

Si vous voulez publier sur Google Play:
1. Utilisez TWA (Trusted Web Activities)
2. Ou convertissez en app native avec Capacitor

Besoin d'aide pour Google Play? Demandez-moi!
