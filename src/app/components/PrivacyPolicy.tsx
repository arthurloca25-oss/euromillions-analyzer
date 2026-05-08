export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Politique de Confidentialité</h1>
        <p className="text-sm text-gray-500 mb-8">Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Collecte de données</h2>
          <p className="text-gray-700 leading-relaxed">
            Cette application <strong>"Et si j'avais joué"</strong> ne collecte <strong>aucune donnée personnelle</strong>.
            Toutes les analyses de tirages EuroMillions sont effectuées localement sur votre appareil.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Données stockées</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Les numéros que vous sélectionnez et analysez sont stockés uniquement dans le cache de votre navigateur
            (localStorage) et ne sont <strong>jamais envoyés à un serveur externe</strong>.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Ces données restent sur votre appareil et peuvent être supprimées à tout moment en vidant le cache de votre navigateur.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Données de tirages EuroMillions</h2>
          <p className="text-gray-700 leading-relaxed">
            L'application contient l'historique complet des tirages EuroMillions depuis 2004.
            Ces données sont des informations publiques disponibles sur le site officiel de la FDJ (Française des Jeux).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Cookies et traceurs</h2>
          <p className="text-gray-700 leading-relaxed">
            Cette application n'utilise <strong>aucun cookie publicitaire ou traceur</strong>.
            Seuls les cookies techniques nécessaires au fonctionnement de la PWA (Progressive Web App) sont utilisés.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Services tiers</h2>
          <p className="text-gray-700 leading-relaxed">
            L'application est hébergée sur Vercel. Aucune donnée utilisateur n'est transmise à Vercel ou à tout autre service tiers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Sécurité</h2>
          <p className="text-gray-700 leading-relaxed">
            L'application fonctionne entièrement en HTTPS pour garantir la sécurité des communications.
            Cependant, comme aucune donnée personnelle n'est collectée, il n'y a aucun risque de fuite de données.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Droits des utilisateurs</h2>
          <p className="text-gray-700 leading-relaxed">
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
            Cependant, comme cette application ne collecte aucune donnée personnelle, ces droits ne s'appliquent pas.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Modifications de cette politique</h2>
          <p className="text-gray-700 leading-relaxed">
            Cette politique de confidentialité peut être modifiée à tout moment.
            Les changements seront publiés sur cette page avec une nouvelle date de mise à jour.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Contact</h2>
          <p className="text-gray-700 leading-relaxed">
            Pour toute question concernant cette politique de confidentialité, vous pouvez nous contacter à:
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Email:</strong> <a href="mailto:arthur.loca.25@gmail.com" className="text-blue-600 hover:underline">arthur.loca.25@gmail.com</a>
          </p>
        </section>

        <section className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Cette application est un projet personnel et n'est pas affiliée à la FDJ ou à EuroMillions.
          </p>
        </section>
      </div>
    </div>
  );
}
