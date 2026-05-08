// Gestion de l'installation PWA et du Service Worker
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Enregistrer le Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('✅ Service Worker enregistré:', registration);
          })
          .catch((error) => {
            console.error('❌ Erreur Service Worker:', error);
          });
      });
    }

    // Détecter si l'app est installée
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Capturer l'événement d'installation
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Détecter quand l'app est installée
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA installée!');
      setIsInstalled(true);
      setIsInstallable(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const installPWA = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('✅ Utilisateur a accepté l\'installation');
    } else {
      console.log('❌ Utilisateur a refusé l\'installation');
    }

    setInstallPrompt(null);
    setIsInstallable(false);
  };

  return {
    isInstallable,
    isInstalled,
    installPWA
  };
}

// Composant bouton d'installation
export function InstallButton() {
  const { isInstallable, isInstalled, installPWA } = usePWA();

  if (isInstalled || !isInstallable) return null;

  return (
    <button
      onClick={installPWA}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all flex items-center gap-2 z-50 animate-bounce"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      Installer l'application
    </button>
  );
}
