import {Routes, Route, Navigate} from 'react-router-dom'
import './App.css'
import HomePage from './views/HomePage'
import CollectionsPage from './views/CollectionsPage'
import CollectionDetailsPage from './views/CollectionDetailsPage'
import MintPage from './views/MintPage'
import FactoryTestPage from './views/FactoryTestPage'
import MintTestPage from './views/MintTestPage'
import CollectionsTestPage from './views/CollectionsTestPage'
import ImageUploadTest from './views/ImageUploadTest'
import Header from './components/Header'
import Footer from './components/Footer'
import {AlertContainer} from './components/Alert/Alert'
import ProfilePage from './views/Profile/ProfilePage'
import MyUniqsPage from './views/Profile/MyUniqsPage'
import MyCollectionsPage from './views/Profile/MyCollectionsPage'
import MainContent from './components/MainContent'
import MentionsLegalesPage from './views/Legal/LegalPage'
import PrivacyPolicyPage from './views/Legal/PrivacyPolicyPage'
import TermsOfServicePage from './views/Legal/TermsOfServicePage'
import ContactPage from './views/ContactPage'
import AdminDashboard from './views/AdminDashboard'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import { getBrowserLanguage } from './utils/language'
import LanguageInitializer from './components/LanguageInitializer'
import { useTranslation } from './contexts/TranslationContext'
import { Language, RouteSegments as RouteSegmentsType } from './types/translations.types'

// Configuration des routes pour mapper les clés de segment aux composants
// et indiquer si une route est protégée.
const routeConfig: Record<string, { component: React.ComponentType<object>; protected?: boolean }> = {
  home: { component: HomePage }, 
  collections: { component: CollectionsPage },
  collection_details: { component: CollectionDetailsPage }, // Deviendra /:segment/:id
  mint: { component: MintPage }, // Deviendra /:segment/:category/:id
  profile: { component: ProfilePage, protected: true },
  my_uniqs: { component: MyUniqsPage, protected: true },
  my_collections: { component: MyCollectionsPage, protected: true },
  admin_ut: { component: AdminDashboard, protected: true }, 
  legal: { component: MentionsLegalesPage },
  privacy: { component: PrivacyPolicyPage },
  terms: { component: TermsOfServicePage },
  contact: { component: ContactPage },
  factory_test: { component: FactoryTestPage },
  mint_test: { component: MintTestPage },
  collections_test: { component: CollectionsTestPage },
  upload_test: { component: ImageUploadTest },
};

function App() {
  const defaultBrowserLang = getBrowserLanguage();
  const { currentLang, allTranslations, tReady } = useTranslation();

  if (!tReady || !currentLang || !allTranslations) {
    return <div className='flex flex-col min-h-screen bg-dark-950 text-white justify-center items-center'>Loading application...</div>; 
  }

  const langToUse = currentLang as Language;
  // Utiliser les segments de la langue courante, avec fallback sur l'anglais, puis un objet vide si tout échoue.
  const defaultSegments: RouteSegmentsType = allTranslations.en?._routeSegments || {};
  const currentSegments: RouteSegmentsType = allTranslations[langToUse]?._routeSegments || defaultSegments;

  if (Object.keys(currentSegments).length === 0 && Object.keys(defaultSegments).length === 0) {
    console.error(`[App.tsx] CRITICAL: No route segments found for language ${langToUse} or for default (en). Check translation files.`);
    return <div className='flex flex-col min-h-screen bg-dark-950 text-white justify-center items-center'>Error: Could not load language route segments.</div>;
  }
  // Si currentSegments est vide mais defaultSegments existe, utiliser defaultSegments (typiquement en).
  const finalSegments = Object.keys(currentSegments).length > 0 ? currentSegments : defaultSegments;

  return (
    <div className='flex flex-col min-h-screen bg-dark-950 text-white'>
      <Header />
      <MainContent>
        <ScrollToTop />
        <Routes>
          {/* Redirection de la racine vers la langue actuelle du contexte ou celle du navigateur par défaut */}
          <Route path='/' element={<Navigate to={`/${langToUse}`} replace />} />

          <Route path='/:lang' element={<LanguageInitializer />}>
            {/* Générer les routes dynamiquement */}
            {Object.entries(finalSegments).map(([key, segmentValue]) => {
              const config = routeConfig[key as keyof RouteSegmentsType];
              if (!config) {
                console.warn(`[App.tsx] No component configuration for route key: ${key}`);
                return null;
              }

              let path = segmentValue;
              if (key === 'collection_details') path = `${segmentValue}/:id`;
              if (key === 'mint') path = `${segmentValue}/:category/:id`;
              
              const isIndexRoute = key === 'home' && (segmentValue === '' || segmentValue === undefined);

              const routeElement = (
                <Route 
                  key={`${langToUse}-${key}`}
                  index={isIndexRoute}
                  path={isIndexRoute ? undefined : path}
                  element={<config.component />}
                />
              );

              if (config.protected) {
                return (
                  <Route key={`protected-${langToUse}-${key}`} element={<ProtectedRoute />}>
                    {routeElement}
                  </Route>
                );
              }
              return routeElement;
            }).filter(Boolean)}
            
            {/* Route de fallback à l'intérieur de /:lang/ pour les chemins non reconnus */}
            {/* Redirige vers la page d'accueil de la langue actuelle (si définie), sinon boucle possible */}
            {finalSegments.home !== undefined && (
              <Route path='*' element={<Navigate to={finalSegments.home || ''} replace />} />
            )}
          </Route>

          {/* Fallback global si aucune route ne correspond (par exemple, URL malformée sans langue valide) */}
          {/* Redirige vers la langue du navigateur par défaut. */}
          <Route path='*' element={<Navigate to={`/${defaultBrowserLang}`} replace />} />
        </Routes>
      </MainContent>
      <Footer />
      <AlertContainer position='top-right' />
    </div>
  )
}

export default App