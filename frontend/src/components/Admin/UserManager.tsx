import {useState, useEffect, useMemo} from 'react'
import {apiRequestor} from '../../utils/axiosInstanceHelper'
import {FaPlus, FaRedo} from 'react-icons/fa'
import useAlerts from '../../hooks/useAlert'
import UserAddEditModal from './UserAddEditModal'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import {MaterialReactTable, type MRT_ColumnDef, type MRT_ColumnFiltersState, type MRT_PaginationState, type MRT_SortingState} from 'material-react-table'
import {Box, IconButton, Tooltip} from '@mui/material'
import {Delete as DeleteIcon, Edit as EditIcon} from '@mui/icons-material'
import {ThemeProvider, createTheme} from '@mui/material/styles'

// Interface utilisateur
interface UserWallet {
  field2: string
}

interface User {
  id: string
  type: string
  attributes: {
    id: number
    name: string
    username: string
    email: string
    block: number
    registerDate: string
    lastvisitDate?: string
    'wallet-id'?: string
    wallets?: {[key: string]: UserWallet}
    // Autres attributs selon votre modèle
  }
}

const UserManager = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userCount, setUserCount] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined)
  const {success, error: showError} = useAlerts()

  // États pour Material React Table
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<MRT_SortingState>([
    {id: 'id', desc: false}, // Tri par défaut par ID, ordre croissant
  ])
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

  // Créer un thème sombre pour Material UI
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#3f8bfd',
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: '#1f2937',
        paper: '#374151',
      },
    },
  })

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await apiRequestor.get('/users')
      if (response.data && response.data.data) {
        setUsers(response.data.data)
        setUserCount(response.data.data.length)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error)
      showError('Impossible de charger les utilisateurs.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (userId: string) => {
    setUserToDelete(userId)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) return

    try {
      await apiRequestor.delete(`/users/${userToDelete}`)
      success('Utilisateur supprimé avec succès !')
      // Fermer la modal et réinitialiser l'utilisateur à supprimer
      setIsDeleteModalOpen(false)
      setUserToDelete(null)
      // Rafraîchir la liste
      fetchUsers()
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      showError("Impossible de supprimer l'utilisateur.")
    }
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
    setUserToDelete(null)
  }

  const handleEdit = (userId: string) => {
    setSelectedUserId(userId)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedUserId(undefined)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleModalSuccess = () => {
    fetchUsers()
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Jamais'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Ajouter cette fonction pour gérer le clic sur une ligne spécifique
  const handleRowClick = (userId: string) => {
    setSelectedUserId(userId)
    setIsModalOpen(true)
  }

  // Définition des colonnes pour Material React Table
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        header: 'ID',
        accessorFn: row => row.attributes.id,
        id: 'id',
        size: 80,
        Cell: ({row, cell}) => (
          <span onClick={() => handleRowClick(row.original.id)} className='cursor-pointer w-full block'>
            {cell.getValue<number>()}
          </span>
        ),
      },
      {
        header: 'Nom',
        accessorFn: row => row.attributes.name,
        id: 'name',
        Cell: ({row, cell}) => (
          <span onClick={() => handleRowClick(row.original.id)} className='cursor-pointer w-full block'>
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        header: 'Utilisateur',
        accessorFn: row => row.attributes.username,
        id: 'username',
        Cell: ({row, cell}) => (
          <span onClick={() => handleRowClick(row.original.id)} className='cursor-pointer w-full block'>
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        header: 'Email',
        accessorFn: row => row.attributes.email,
        id: 'email',
        Cell: ({row, cell}) => (
          <span onClick={() => handleRowClick(row.original.id)} className='cursor-pointer w-full block'>
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        header: 'Statut',
        accessorFn: row => (row.attributes.block === 0 ? 'Actif' : 'Bloqué'),
        id: 'status',
        Cell: ({row}) => (
          <span onClick={() => handleRowClick(row.original.id)} className={`cursor-pointer inline-block px-2 py-1 text-xs leading-5 font-semibold rounded-full ${row.original.attributes.block === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {row.original.attributes.block === 0 ? 'Actif' : 'Bloqué'}
          </span>
        ),
        filterVariant: 'select',
        filterSelectOptions: [
          {value: 'Actif', text: 'Actif'},
          {value: 'Bloqué', text: 'Bloqué'},
        ],
      },
      {
        header: 'Wallet',
        accessorFn: row => {
          return row.attributes['wallet-id'] || (row.attributes.wallets && Object.keys(row.attributes.wallets).length > 0 ? Object.keys(row.attributes.wallets)[0] : 'Non défini')
        },
        id: 'wallet',
        Cell: ({row}) => {
          const walletId = row.original.attributes['wallet-id'] || (row.original.attributes.wallets && Object.keys(row.original.attributes.wallets).length > 0 ? Object.keys(row.original.attributes.wallets)[0] : 'Non défini')

          return (
            <span onClick={() => handleRowClick(row.original.id)} className='cursor-pointer w-full block'>
              {walletId === 'Non défini' ? walletId : `${walletId.slice(0, 8)}...${walletId.slice(-4)}`}
            </span>
          )
        },
      },
      {
        header: "Date d'inscription",
        accessorFn: row => row.attributes.registerDate,
        id: 'registerDate',
        Cell: ({row}) => (
          <span onClick={() => handleRowClick(row.original.id)} className='cursor-pointer w-full block'>
            {formatDate(row.original.attributes.registerDate)}
          </span>
        ),
        sortingFn: 'datetime',
      },
      {
        header: 'Dernière visite',
        accessorFn: row => row.attributes.lastvisitDate || '',
        id: 'lastvisitDate',
        Cell: ({row}) => (
          <span onClick={() => handleRowClick(row.original.id)} className='cursor-pointer w-full block'>
            {formatDate(row.original.attributes.lastvisitDate)}
          </span>
        ),
        sortingFn: 'datetime',
      },
    ],
    [handleRowClick]
  )

  return (
    <ThemeProvider theme={darkTheme}>
      <div className='bg-gray-800 rounded-lg p-4 shadow-lg'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-semibold text-white'>Gestion des Utilisateurs ({userCount})</h2>
          <div className='flex gap-2'>
            <button onClick={fetchUsers} className='p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors' title='Actualiser'>
              <FaRedo />
            </button>
            <button onClick={handleAdd} className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'>
              <FaPlus /> Ajouter
            </button>
          </div>
        </div>

        <MaterialReactTable
          columns={columns}
          data={users}
          initialState={{
            showColumnFilters: false,
            sorting: [{id: 'id', desc: false}], // Tri initial par ID, ordre croissant
          }}
          state={{
            columnFilters,
            globalFilter,
            isLoading,
            pagination,
            sorting,
          }}
          enableGlobalFilter
          enableColumnFilters
          enableFilters
          enablePagination
          enableSorting
          enableColumnResizing
          enableRowSelection={false}
          manualPagination={false}
          manualSorting={false}
          manualFiltering={false}
          muiToolbarAlertBannerProps={
            isLoading
              ? {
                  color: 'info',
                  children: 'Chargement des données',
                }
              : undefined
          }
          onColumnFiltersChange={setColumnFilters}
          onGlobalFilterChange={setGlobalFilter}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          positionActionsColumn='last'
          positionToolbarAlertBanner='top'
          enableRowActions={true}
          displayColumnDefOptions={{
            'mrt-row-actions': {
              header: 'Actions',
              size: 120,
            },
          }}
          renderRowActions={({row}) => (
            <Box sx={{display: 'flex', gap: '8px', justifyContent: 'center'}}>
              <Tooltip title='Modifier'>
                <IconButton
                  onClick={e => {
                    e.stopPropagation()
                    handleEdit(row.original.id)
                  }}
                  color='primary'
                  size='small'>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Supprimer'>
                <IconButton
                  onClick={e => {
                    e.stopPropagation()
                    handleDelete(row.original.id)
                  }}
                  color='error'
                  size='small'>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          muiTableProps={{
            sx: {
              tableLayout: 'fixed',
            },
          }}
          muiTableBodyProps={{
            sx: {
              '& .MuiTableRow-root': {
                backgroundColor: '#374151',
                '&:hover': {
                  backgroundColor: '#4B5563',
                  cursor: 'pointer',
                },
              },
            },
          }}
          localization={{
            actions: 'Actions',
            and: 'et',
            cancel: 'Annuler',
            clearFilter: 'Effacer le filtre',
            clearSearch: 'Effacer la recherche',
            clearSort: 'Effacer le tri',
            columnActions: 'Actions de colonne',
            edit: 'Modifier',
            expand: 'Étendre',
            filterByColumn: 'Filtrer par {column}',
            sortByColumnAsc: 'Trier par {column} croissant',
            sortByColumnDesc: 'Trier par {column} décroissant',
            showHideColumns: 'Afficher/Masquer les colonnes',
            showHideFilters: 'Afficher/Masquer les filtres',
            rowsPerPage: 'Lignes par page',
            of: 'de',
            noResultsFound: 'Aucun résultat trouvé',
            search: 'Rechercher',
          }}
        />

        {/* Modal pour ajouter/modifier un utilisateur */}
        <UserAddEditModal isOpen={isModalOpen} onClose={handleModalClose} userId={selectedUserId} onSuccess={handleModalSuccess} />

        {/* Modal de confirmation de suppression */}
        <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={handleCancelDelete} onConfirm={handleConfirmDelete} title='Confirmer la suppression' message='Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.' />
      </div>
    </ThemeProvider>
  )
}

export default UserManager
