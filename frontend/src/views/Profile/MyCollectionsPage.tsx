import React, {useState, useEffect, useRef} from 'react'
import {Link} from 'react-router-dom'
import {useUltraWallet} from '../../utils/ultraWalletHelper'
import {fetchUserNfts, Nft, getCachedNfts, getCachedCollections, NftCollection, isNftLoadingComplete} from '../../utils/nftService'
import useAlerts from '../../hooks/useAlert'

const ITEMS_PER_PAGE = 12;
const INITIAL_COLLECTIONS_TO_SHOW = 10;

function MyCollectionsPage() {
  const {blockchainId} = useUltraWallet()
  const {error: showError} = useAlerts()
  const [nfts, setNfts] = useState<Nft[]>([])
  const [collections, setCollections] = useState<NftCollection[]>([])
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMorePages, setHasMorePages] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalNftCount, setTotalNftCount] = useState(0)
  const [selectedNft, setSelectedNft] = useState<Nft | null>(null)
  const [isNftDetailsOpen, setIsNftDetailsOpen] = useState(false)
  const nftDetailsRef = useRef<HTMLDivElement>(null)
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({})
  const [showAllCollections, setShowAllCollections] = useState(false)
  const [collectionSearchQuery, setCollectionSearchQuery] = useState("")

  // Charger les NFTs au chargement de la page
  useEffect(() => {
    const loadNfts = async () => {
      if (!blockchainId) {
        setIsLoading(false)
        return
      }
      
      try {
        setIsLoading(true)
        // Charger les NFTs avec un limit de 25 pour avoir rapidement la première page
        const userNfts = await fetchUserNfts(blockchainId)
        setNfts(userNfts)
        setTotalNftCount(userNfts.length)
        
        // Récupérer les collections
        const userCollections = getCachedCollections(blockchainId);
        setCollections(userCollections);
        
        // Réinitialiser la sélection et la pagination
        setSelectedCollection(null);
        setCurrentPage(1);
        
        updateHasMorePages(userNfts.length, 1);
      } catch (err) {
        console.error('Erreur lors du chargement des NFTs:', err)
        showError('Impossible de charger vos NFTs. Veuillez réessayer plus tard.')
      } finally {
        setIsLoading(false)
      }
    }

    loadNfts()
  }, [blockchainId, showError])

  // Fonction pour gérer les clics à l'extérieur de la popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isNftDetailsOpen && nftDetailsRef.current && !nftDetailsRef.current.contains(event.target as Node)) {
        handleCloseNftDetails();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNftDetailsOpen]);

  // Fonction pour déterminer s'il y a une page suivante disponible
  const updateHasMorePages = (nftsCount: number, page: number) => {
    const isComplete = isNftLoadingComplete(blockchainId || '');
    const hasMore = nftsCount > ITEMS_PER_PAGE * page;
    setHasMorePages(hasMore);
    
    // Si le chargement est complet et qu'on n'a pas plus de NFTs pour la page suivante
    if (isComplete && !hasMore) {
      console.log('[MyCollectionsPage] Fin des NFTs atteinte, désactivation du bouton Suivant');
    }
  };

  // Écouter les mises à jour des NFTs en arrière-plan
  useEffect(() => {
    const handleNftUpdate = (event: Event) => {
      if (blockchainId) {
        const customEvent = event as CustomEvent<{ walletId: string }>;
        if (customEvent.detail.walletId === blockchainId) {
          const updatedNfts = getCachedNfts(blockchainId);
          setNfts(updatedNfts);
          setTotalNftCount(updatedNfts.length);
          
          // Mettre à jour les collections
          const updatedCollections = getCachedCollections(blockchainId);
          setCollections(updatedCollections);
          
          updateHasMorePages(
            selectedCollection 
              ? updatedCollections.find(c => c.id === selectedCollection)?.nfts.length || 0 
              : updatedNfts.length, 
            currentPage
          );
        }
      }
    }

    document.addEventListener('nftUpdate', handleNftUpdate)
    
    return () => {
      document.removeEventListener('nftUpdate', handleNftUpdate)
    }
  }, [blockchainId, currentPage, selectedCollection])

  // Pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (hasMorePages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Gestion du changement de collection
  const handleCollectionChange = (collectionId: string | null) => {
    setSelectedCollection(collectionId);
    setCurrentPage(1); // Réinitialiser la page lors du changement de collection
    
    // Mettre à jour l'indicateur de pages supplémentaires
    const relevantCount = collectionId 
      ? collections.find(c => c.id === collectionId)?.nfts.length || 0
      : nfts.length;
    
    updateHasMorePages(relevantCount, 1);
  };

  // Ouvrir la popup de détails du NFT
  const handleNftClick = (nft: Nft) => {
    setSelectedNft(nft);
    setIsNftDetailsOpen(true);
  };

  // Fermer la popup de détails
  const handleCloseNftDetails = () => {
    setIsNftDetailsOpen(false);
    setSelectedNft(null);
  };

  // Toggle l'état d'expansion de la description
  const toggleDescriptionExpand = (collectionId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [collectionId]: !prev[collectionId]
    }));
  };

  // Placeholder text dynamique pour la barre de recherche
  const getSearchPlaceholder = () => {
    return selectedCollection 
      ? "Rechercher un UNIQ" 
      : "Rechercher une collection";
  };

  // Filtrer et trier les collections
  const filteredCollections = collections
    .filter(collection => 
      collection.name.toLowerCase().includes(collectionSearchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  
  // Filtrer les collections à afficher dans les boutons
  const displayedCollections = showAllCollections 
    ? filteredCollections 
    : filteredCollections.slice(0, INITIAL_COLLECTIONS_TO_SHOW);

  const hasMoreCollections = filteredCollections.length > INITIAL_COLLECTIONS_TO_SHOW;

  // Filtrer les NFTs en fonction de la recherche
  const searchFilteredNfts = (() => {
    // Si une collection est sélectionnée et qu'on a une recherche active
    if (selectedCollection && collectionSearchQuery) {
      // Récupérer les NFTs de cette collection
      const collectionNfts = collections.find(c => c.id === selectedCollection)?.nfts || [];
      const searchTermLower = collectionSearchQuery.toLowerCase();
      
      // Filtrer les NFTs de cette collection avec recherche étendue
      return collectionNfts.filter(nft => {
        // Recherche dans le nom du NFT
        const nftName = nft.metadata.content.name || `NFT #${nft.serialNumber}`;
        if (nftName.toLowerCase().includes(searchTermLower)) return true;
        
        // Recherche dans l'ID du NFT
        if (nft.id && nft.id.toLowerCase().includes(searchTermLower)) return true;
        
        // Recherche dans le numéro de série
        if (nft.serialNumber.toString().includes(searchTermLower)) return true;
        
        // Recherche dans les attributs
        if (nft.attributes && nft.attributes.length > 0) {
          return nft.attributes.some(attr => 
            attr.key.toLowerCase().includes(searchTermLower) || 
            attr.value.toString().toLowerCase().includes(searchTermLower)
          );
        }
        
        return false;
      });
    }
    // Si aucune collection n'est sélectionnée mais qu'on a une recherche active
    else if (!selectedCollection && collectionSearchQuery) {
      // Filtrer les NFTs par collection correspondant à la recherche
      return nfts.filter(nft => {
        const collectionId = nft.factory?.id || nft.collection?.id;
        const matchingCollection = collections.find(c => 
          (c.id === collectionId) && 
          c.name.toLowerCase().includes(collectionSearchQuery.toLowerCase())
        );
        return !!matchingCollection;
      });
    }
    // Si aucune recherche active
    return nfts;
  })();

  // Filtrer les NFTs selon la collection sélectionnée
  const filteredNfts = selectedCollection
    ? (collectionSearchQuery 
        ? searchFilteredNfts // Si recherche active dans collection sélectionnée
        : collections.find(c => c.id === selectedCollection)?.nfts || []) // Collection sélectionnée sans recherche
    : searchFilteredNfts; // Pas de collection sélectionnée

  // Filtrer les NFTs pour la page courante
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const displayedNfts = filteredNfts.slice(startIndex, endIndex)
  
  // Calcul des informations de pagination
  const totalFilteredCount = filteredNfts.length;
  const totalPages = Math.ceil(totalFilteredCount / ITEMS_PER_PAGE);
  const isLastPage = currentPage >= totalPages && isNftLoadingComplete(blockchainId || '');

  // Réinitialiser la page actuelle lorsque la recherche change
  useEffect(() => {
    setCurrentPage(1);
    
    // Mettre à jour l'indicateur de pages supplémentaires pour les résultats de recherche
    if (!selectedCollection) {
      updateHasMorePages(searchFilteredNfts.length, 1);
    }
  }, [collectionSearchQuery]);

  // Ajouter Tailwind Plugin pour line-clamp si pas déjà fait
  useEffect(() => {
    // Ajouter une classe .line-clamp-5 personnalisée en CSS
    const style = document.createElement('style');
    style.textContent = `
      .line-clamp-5 {
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `;
    
    // Vérifier si le style existe déjà pour éviter les doublons
    if (!document.querySelector('style[data-line-clamp]')) {
      style.setAttribute('data-line-clamp', 'true');
      document.head.appendChild(style);
    }
    
    return () => {
      // Nettoyer lors du démontage du composant
      const existingStyle = document.querySelector('style[data-line-clamp]');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  // Limiter les descriptions des collections
  const renderCollectionDescription = (collection: NftCollection | undefined) => {
    if (!collection || !collection.description) {
      return <p>Aucune description disponible.</p>;
    }
    
    const isExpanded = expandedDescriptions[collection.id] || false;
    
    return (
      <div>
        <div 
          className={`description-container ${!isExpanded ? 'max-h-[120px] overflow-hidden relative' : ''}`}
        >
          <div className="text-gray-400">
            {collection.description.split('\n').map((line, index) => {
              if (line.trim() === '') return null;
              
              // Vérifier si c'est une ligne avec une puce
              if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
                return (
                  <div key={index} className="flex mb-2">
                    <span className="mr-2">•</span>
                    <span>{line.replace(/^[•\-*]\s*/, '').trim()}</span>
                  </div>
                );
              }
              
              // Ligne normale
              return <p key={index} className="mb-2">{line.trim()}</p>;
            })}
          </div>
          
          {/* Dégradé pour masquer le texte qui déborde */}
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-dark-950 to-transparent"></div>
          )}
        </div>
        
        <button 
          onClick={() => toggleDescriptionExpand(collection.id)}
          className="text-primary-300 hover:text-primary-400 text-sm mt-1 focus:outline-none"
        >
          {isExpanded ? 'Afficher moins' : 'Afficher plus'}
        </button>
      </div>
    );
  };

  // Affichage des résultats de recherche
  const getSearchResultsMessage = () => {
    if (!collectionSearchQuery) return null;
    
    if (selectedCollection) {
      const collectionName = collections.find(c => c.id === selectedCollection)?.name;
      return (
        <div className="mb-6 px-4 py-3 bg-dark-800 rounded-lg text-gray-300">
          <span className="font-medium">
            Résultats pour "{collectionSearchQuery}" dans la collection "{collectionName}":
          </span> {filteredNfts.length} NFTs trouvés
        </div>
      );
    }
    
    return (
      <div className="mb-6 px-4 py-3 bg-dark-800 rounded-lg text-gray-300">
        <span className="font-medium">
          Résultats pour "{collectionSearchQuery}":
        </span> {filteredNfts.length} NFTs trouvés
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-dark-950 text-white py-12'>
      <div className='container mx-auto px-4'>
        <div className='max-w-5xl mx-auto'>
          {/* Header avec titre et barre de recherche */}
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-dark-800'>
            <h1 className='text-3xl font-bold text-primary-300'>Mes collections</h1>
            
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto'>
              <div className='relative flex-grow w-full sm:w-auto'>
                <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={getSearchPlaceholder()}
                  className="pl-10 pr-10 py-2 w-full rounded-lg bg-dark-800 text-white border border-dark-700 focus:border-primary-500 focus:outline-none"
                  value={collectionSearchQuery}
                  onChange={(e) => setCollectionSearchQuery(e.target.value)}
                />
                {collectionSearchQuery && (
                  <button 
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                    onClick={() => setCollectionSearchQuery("")}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              <Link to='/collections' className='px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors whitespace-nowrap w-full sm:w-auto text-center'>
                Explorer les collections
              </Link>
            </div>
          </div>

          {/* Sélecteur de collections */}
          {collections.length > 0 && !isLoading && (
            <div className='mb-8'>
              <h2 className='text-xl font-bold mb-4'>Collections ({filteredCollections.length})</h2>
              <div className='flex flex-wrap gap-3'>
                <button
                  onClick={() => handleCollectionChange(null)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCollection === null
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-800 text-white hover:bg-dark-700'
                  }`}
                >
                  Toutes ({collectionSearchQuery ? searchFilteredNfts.length : nfts.length})
                </button>
                
                {displayedCollections.map(collection => (
                  <button
                    key={collection.id}
                    onClick={() => handleCollectionChange(collection.id)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedCollection === collection.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-800 text-white hover:bg-dark-700'
                    }`}
                  >
                    {collection.name} ({collection.totalItems})
                  </button>
                ))}
                
                {hasMoreCollections && (
                  <button
                    onClick={() => setShowAllCollections(!showAllCollections)}
                    className="px-4 py-2 rounded-lg bg-dark-800 text-white hover:bg-dark-700 transition-colors"
                  >
                    {showAllCollections ? 'Afficher moins' : `Afficher ${filteredCollections.length - INITIAL_COLLECTIONS_TO_SHOW} de plus`}
                  </button>
                )}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : displayedNfts.length > 0 ? (
            <>
              {/* Affichage du nom de la collection sélectionnée */}
              {selectedCollection && collections.find(c => c.id === selectedCollection)?.description && !collectionSearchQuery && (
                <div className='mb-6'>
                  <h2 className='text-2xl font-bold text-primary-300 mb-2'>
                    {collections.find(c => c.id === selectedCollection)?.name}
                  </h2>
                  <div className='text-gray-400'>
                    {renderCollectionDescription(collections.find(c => c.id === selectedCollection))}
                  </div>
                </div>
              )}
              
              {/* Affichage des résultats de recherche */}
              {collectionSearchQuery && getSearchResultsMessage()}
              
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                {displayedNfts.map((nft) => {
                  const imageUrl = nft.metadata.content.medias.square?.uri || 
                                nft.metadata.content.medias.product?.uri || 
                                nft.metadata.content.medias.gallery?.uri ||
                                nft.metadata.content.medias.hero?.uri

                  // Récupérer le nom de la collection pour ce NFT
                  const collectionName = nft.metadata.content.subName || 
                                       collections.find(c => c.id === nft.factory?.id || c.id === nft.collection?.id)?.name || 
                                       'Collection inconnue';

                  return (
                    <div 
                      key={nft.id} 
                      className='bg-dark-800 rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 cursor-pointer'
                      onClick={() => handleNftClick(nft)}
                    >
                  <div className='relative h-48'>
                        {imageUrl ? (
                          <img src={imageUrl} alt={nft.metadata.content.name} className='w-full h-full object-cover' />
                        ) : (
                          <div className="w-full h-full bg-dark-800 flex items-center justify-center text-gray-500">
                            Aucune image
                          </div>
                        )}
                    <div className='absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent'></div>
                    <div className='absolute bottom-4 left-4'>
                          <h3 className='text-lg font-semibold text-white'>{nft.metadata.content.name || `NFT #${nft.serialNumber}`}</h3>
                    </div>
                  </div>
                  <div className='p-4'>
                        <div className='flex justify-between items-center mb-2'>
                      <div className='text-sm'>
                            <span className='text-gray-400'>Serie #</span>
                            <span className='text-primary-300 ml-1'>{nft.serialNumber}</span>
                      </div>
                      <div className='text-sm'>
                            <span className='text-primary-300'>{collectionName}</span>
                      </div>
                    </div>
                    <div className='flex justify-between items-center'>
                          <span className='text-xs text-gray-400'>ID: {nft.id ? nft.id.slice(0, 8) : ''}</span>
                          <span className='text-primary-300 hover:text-primary-400 text-sm font-medium'>
                            Voir les détails →
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
                  </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-4 mt-6">
                  <button 
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === 1 
                        ? 'bg-dark-800 text-gray-500 cursor-not-allowed' 
                        : 'bg-dark-700 text-white hover:bg-dark-600'
                    }`}
                  >
                    Précédent
                  </button>
                  
                  <span className="text-gray-400">
                    Page {currentPage}/{isNftLoadingComplete(blockchainId || '') ? totalPages : totalPages+'+'}
                  </span>
                  
                  <button 
                    onClick={handleNextPage}
                    disabled={isLastPage || !hasMorePages}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isLastPage || !hasMorePages 
                        ? 'bg-dark-800 text-gray-500 cursor-not-allowed' 
                        : 'bg-dark-700 text-white hover:bg-dark-600'
                    }`}
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className='text-center py-12 bg-dark-800 rounded-xl'>
              <div className='w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-8 h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                </svg>
              </div>
              <h2 className='text-xl font-semibold mb-2'>
                {collectionSearchQuery 
                  ? selectedCollection 
                    ? `Aucun NFT trouvé pour "${collectionSearchQuery}" dans cette collection`
                    : 'Aucun NFT trouvé pour cette recherche'
                  : selectedCollection 
                    ? 'Aucun NFT dans cette collection'
                    : 'Aucune collection pour le moment'}
              </h2>
              <p className='text-gray-400 mb-6'>
                {collectionSearchQuery
                  ? 'Essayez avec d\'autres termes de recherche.'
                  : selectedCollection
                    ? 'Cette collection ne contient pas de NFTs ou ils sont en cours de chargement.'
                    : 'Commencez à créer votre collection en acquérant de nouveaux NFTs'}
              </p>
              <div className="flex justify-center gap-4">
                {selectedCollection && (
                  <button
                    onClick={() => handleCollectionChange(null)}
                    className='px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors inline-block'
                  >
                    Voir toutes les collections
                  </button>
                )}
              <Link to='/collections' className='px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors inline-block'>
                  Explorer les collections
              </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Popup de détails du NFT */}
      {isNftDetailsOpen && selectedNft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div 
            ref={nftDetailsRef}
            className="bg-dark-800 rounded-xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header de la popup */}
            <div className="sticky top-0 bg-dark-800 p-4 border-b border-dark-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-primary-300">Détails du NFT</h2>
              <button 
                onClick={handleCloseNftDetails}
                className="p-1 rounded-full hover:bg-dark-700 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenu principal de la popup */}
            <div className="overflow-y-auto p-4 flex-1">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image du NFT et attributs */}
                <div className="md:w-1/2">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-dark-900 mb-4">
                    {(selectedNft.metadata.content.medias.square?.uri || 
                      selectedNft.metadata.content.medias.product?.uri || 
                      selectedNft.metadata.content.medias.gallery?.uri ||
                      selectedNft.metadata.content.medias.hero?.uri) ? (
                      <img 
                        src={
                          selectedNft.metadata.content.medias.square?.uri || 
                          selectedNft.metadata.content.medias.product?.uri || 
                          selectedNft.metadata.content.medias.gallery?.uri ||
                          selectedNft.metadata.content.medias.hero?.uri
                        } 
                        alt={selectedNft.metadata.content.name}
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        Aucune image
                      </div>
                    )}
                  </div>

                  {/* Attributs */}
                  {selectedNft.attributes && selectedNft.attributes.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Attributs</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedNft.attributes.map((attr, index) => (
                          <div key={index} className="bg-dark-900 p-2 rounded-lg">
                            <span className="text-xs text-gray-400 block">{attr.key}</span>
                            <span className="text-sm text-white">{attr.value.toString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Informations du NFT */}
                <div className="md:w-1/2">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {selectedNft.metadata.content.name || `NFT #${selectedNft.serialNumber}`}
                  </h1>

                  <div className="mb-4">
                    <span className="text-sm text-gray-400">Collection</span>
                    <p className="text-primary-300 font-medium">
                      {selectedNft.metadata.content.subName || 
                       collections.find(c => c.id === selectedNft.factory?.id || c.id === selectedNft.collection?.id)?.name || 
                       'Collection inconnue'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <span className="text-sm text-gray-400">ID du NFT</span>
                      <p className="text-white font-medium break-all">{selectedNft.id}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Numéro de série</span>
                      <p className="text-white font-medium">{selectedNft.serialNumber}</p>
                    </div>
                    {selectedNft.mintDate && (
                      <div>
                        <span className="text-sm text-gray-400">Date de mint</span>
                        <p className="text-white font-medium">
                          {new Date(selectedNft.mintDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {selectedNft.metadata.content.description && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <div className="text-gray-300 text-sm">
                        {selectedNft.metadata.content.description.split('\n').map((line, index) => {
                          if (line.trim() === '') return null;
                          
                          // Vérifier si c'est une ligne avec une puce
                          if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
                            return (
                              <div key={index} className="flex mb-2">
                                <span className="mr-2">•</span>
                                <span>{line.replace(/^[•\-*]\s*/, '').trim()}</span>
                              </div>
                            );
                          }
                          
                          // Ligne normale
                          return <p key={index} className="mb-2">{line.trim()}</p>;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer de la popup */}
            <div className="sticky bottom-0 bg-dark-800 p-4 border-t border-dark-700 flex justify-end">
              <button
                onClick={handleCloseNftDetails}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyCollectionsPage