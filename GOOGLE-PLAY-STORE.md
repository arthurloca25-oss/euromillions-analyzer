# 🚀 Publier sur Google Play Store - Guide Complet

## 📱 Méthode: TWA (Trusted Web Activities)

TWA permet de transformer votre PWA en application Android native sans réécrire le code!

---

## ✅ Prérequis

Avant de commencer, vous aurez besoin de:

1. **Un compte développeur Google Play** (25$ unique)
   - Inscription: https://play.google.com/console/signup
   
2. **Node.js et npm** (déjà installé)

3. **JDK (Java Development Kit) 17 ou 11**
   ```bash
   # Vérifier si Java est installé
   java -version
   
   # Si pas installé, installer JDK 17:
   # Sur Ubuntu/Debian:
   sudo apt update
   sudo apt install openjdk-17-jdk
   
   # Sur macOS:
   brew install openjdk@17
   
   # Sur Windows:
   # Télécharger depuis: https://adoptium.net/
   ```

4. **Android Studio** (pour obtenir le SDK Android)
   - Télécharger: https://developer.android.com/studio
   - Installer et ouvrir Android Studio
   - Aller dans Tools → SDK Manager
   - Installer "Android SDK Platform-Tools" et "Android SDK Build-Tools"

---

## 🛠️ Étape 1: Installer Bubblewrap (Outil officiel Google)

```bash
npm install -g @bubblewrap/cli
```

---

## 🔧 Étape 2: Initialiser le projet TWA

Dans le dossier de votre projet, créez un nouveau dossier pour l'application Android:

```bash
mkdir android-app
cd android-app

# Initialiser le projet TWA
bubblewrap init --manifest https://euromillions-analyzer.vercel.app/manifest.json
```

**Questions qui seront posées:**

- **Domain**: `euromillions-analyzer.vercel.app`
- **Application name**: `Et si j'avais joué`
- **Package name**: `com.arthurloca.euromillions` (format: com.votreprenom.nomapp)
- **Host**: `euromillions-analyzer.vercel.app`
- **Start URL**: `/`
- **Icon URL**: `https://euromillions-analyzer.vercel.app/icon-512.png`
- **Splash screen color**: `#1e1b4b` (votre couleur de fond)
- **Theme color**: `#4f46e5` (votre couleur thème)
- **Shortcuts**: Non (sauf si vous voulez)

---

## 📦 Étape 3: Générer le fichier APK/AAB

### Option A: Générer un APK (pour tester)

```bash
bubblewrap build
```

Cela va créer un fichier `app-release-signed.apk` que vous pouvez installer sur votre téléphone pour tester.

### Option B: Générer un AAB (pour Google Play)

```bash
bubblewrap build --generateAppBundle
```

Cela va créer un fichier `.aab` (Android App Bundle) requis par Google Play.

---

## 🔑 Étape 4: Générer une clé de signature

La première fois que vous faites `bubblewrap build`, il va générer automatiquement une clé de signature.

**⚠️ IMPORTANT: Sauvegardez cette clé!**

La clé se trouve dans: `android-app/android.keystore`

**Faites une copie de sécurité de ce fichier!** Si vous la perdez, vous ne pourrez plus mettre à jour votre application sur Google Play.

---

## 🔗 Étape 5: Vérifier le lien entre votre site et l'application

Pour que Google accepte votre TWA, vous devez prouver que vous possédez le domaine.

### 5.1 Générer le fichier assetlinks.json

Après `bubblewrap build`, Bubblewrap vous donnera un fichier `assetlinks.json` ou les instructions pour le créer.

### 5.2 Mettre le fichier sur votre site

Le fichier doit être accessible à: `https://euromillions-analyzer.vercel.app/.well-known/assetlinks.json`

**Comment faire sur Vercel:**

1. Dans votre projet, créez le dossier: `public/.well-known/`
2. Mettez le fichier `assetlinks.json` dedans
3. Pushez sur GitHub (Vercel déploiera automatiquement)

Le fichier assetlinks.json ressemble à ça:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.arthurloca.euromillions",
    "sha256_cert_fingerprints": [
      "VOTRE_EMPREINTE_SHA256_ICI"
    ]
  }
}]
```

Pour obtenir l'empreinte SHA256:

```bash
keytool -list -v -keystore android.keystore -alias android
```

---

## 📤 Étape 6: Uploader sur Google Play Console

### 6.1 Créer une nouvelle application

1. Allez sur: https://play.google.com/console
2. Cliquez sur **"Créer une application"**
3. Remplissez les informations:
   - Nom: **Et si j'avais joué**
   - Langue par défaut: **Français**
   - Type: **Application**
   - Gratuit/Payant: **Gratuit**

### 6.2 Remplir les informations obligatoires

**Fiche de l'application:**
- Description courte (80 caractères max)
- Description complète (4000 caractères max)
- Icône de l'application (512x512 PNG)
- Image de présentation (1024x500 PNG)
- Captures d'écran (minimum 2, format téléphone)

**Catégorie:**
- Catégorie: **Divertissement** ou **Outils**

**Classification du contenu:**
- Répondez au questionnaire (votre app ne contient pas de contenu sensible)

**Politique de confidentialité:**
- URL de votre politique de confidentialité (vous devrez en créer une)

### 6.3 Uploader le fichier AAB

1. Allez dans **"Production"** → **"Créer une version"**
2. Uploadez le fichier `.aab` généré par Bubblewrap
3. Ajoutez les notes de version (en français):
   ```
   Première version de l'application.
   Analysez vos numéros EuroMillions sur 22 ans d'historique!
   ```
4. Cliquez sur **"Examiner la version"**
5. Cliquez sur **"Lancer en production"**

### 6.4 Attendre la validation

Google va examiner votre application. Cela peut prendre **quelques heures à quelques jours**.

Vous recevrez un email quand l'application sera approuvée et publiée! 🎉

---

## 🔄 Mettre à jour l'application

Pour publier une mise à jour:

```bash
cd android-app

# Mettre à jour le numéro de version dans twa-manifest.json
# Incrémenter "versionCode" et "versionName"

# Reconstruire
bubblewrap build --generateAppBundle

# Uploader le nouveau AAB sur Google Play Console
```

---

## 📝 Créer une politique de confidentialité (obligatoire)

Vous devez avoir une politique de confidentialité publique. Voici un modèle simple:

```markdown
# Politique de Confidentialité - Et si j'avais joué

Dernière mise à jour: [DATE]

## Collecte de données
Cette application ne collecte aucune donnée personnelle.
Toutes les analyses sont effectuées localement sur votre appareil.

## Données stockées
Les numéros que vous sélectionnez sont stockés uniquement dans votre navigateur
et ne sont jamais envoyés à un serveur externe.

## Modifications
Cette politique peut être modifiée. Les changements seront publiés sur cette page.

## Contact
Pour toute question: arthur.loca.25@gmail.com
```

**Hébergez cette politique sur:**
- Une page GitHub Pages
- Ou ajoutez une route `/privacy` sur votre site Vercel

---

## 🆘 Problèmes courants

**❌ "Unable to find assetlinks.json"**
- Vérifiez que le fichier est accessible à: `https://euromillions-analyzer.vercel.app/.well-known/assetlinks.json`
- Vérifiez que l'empreinte SHA256 est correcte

**❌ "JDK not found"**
- Installez JDK 17 et configurez la variable d'environnement `JAVA_HOME`

**❌ "Android SDK not found"**
- Installez Android Studio et configurez `ANDROID_SDK_ROOT`

**❌ L'application ne charge pas le site**
- Vérifiez que votre PWA fonctionne bien sur HTTPS
- Vérifiez le fichier assetlinks.json
- Attendez quelques heures pour la propagation DNS

---

## 🎯 Résumé des étapes

1. ✅ Créer un compte développeur Google Play (25$)
2. ✅ Installer les prérequis (JDK, Android Studio)
3. ✅ Installer Bubblewrap: `npm install -g @bubblewrap/cli`
4. ✅ Initialiser le projet TWA: `bubblewrap init`
5. ✅ Générer l'AAB: `bubblewrap build --generateAppBundle`
6. ✅ Ajouter assetlinks.json sur votre site
7. ✅ Créer une politique de confidentialité
8. ✅ Uploader sur Google Play Console
9. ✅ Attendre la validation

---

**Temps estimé:** 2-3 heures de configuration + 1-3 jours de validation par Google

**Besoin d'aide?** N'hésitez pas à demander!
