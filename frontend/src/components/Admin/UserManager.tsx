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
import { useTranslation } from '../../hooks/useTranslation'

// Interface utilisateur
interface UserWallet {
  field1?: string;
  field2?: string;
}

// Interface pour le format des wallets reçus de l'API
interface ParsedWallets {
  [key: string]: {
    field1: string;
  };
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
  const { t } = useTranslation();
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
      showError(t('user_management_load_error'))
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
      success(t('user_management_delete_success'))
      setIsDeleteModalOpen(false)
      setUserToDelete(null)
      fetchUsers()
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      showError(t('user_management_delete_error'))
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
        header: t('user_management_id'),
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
        header: t('user_management_name'),
        accessorFn: row => row.attributes.name,
        id: 'name',
        Cell: ({row, cell}) => (
          <span onClick={() => handleRowClick(row.original.id)} className='cursor-pointer w-full block'>
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        header: t('user_management_username'),
        accessorFn: row => row.attributes.username,
        id: 'username',
        Cell: ({row, cell}) => (
          <span onClick={() => handleRowClick(row.original.id)} className='cursor-pointer w-full block'>
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        header: t('user_management_email'),
        accessorFn: row => row.attributes.email,
        id: 'email',
        Cell: ({row, cell}) => (
          <span onClick={() => handleRowClick(row.original.id)} className='cursor-pointer w-full block'>
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        header: t('user_management_status'),
        accessorFn: row => (row.attributes.block === 0 ? t('user_management_status_active') : t('user_management_status_inactive')),
        id: 'status',
        size: 85,
        Cell: ({row}) => (
          <span onClick={() => handleRowClick(row.original.id)} className={`cursor-pointer inline-block px-2 py-1 text-xs leading-5 font-semibold rounded-full ${row.original.attributes.block === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {row.original.attributes.block === 0 ? t('user_management_status_active') : t('user_management_status_inactive')}
          </span>
        ),
        filterVariant: 'select',
        filterSelectOptions: [
          {value: t('user_management_status_active'), text: t('user_management_status_active')},
          {value: t('user_management_status_inactive'), text: t('user_management_status_inactive')},
        ],
      },
      {
        header: t('user_management_wallet'),
        accessorFn: row => {
          // Récupérer la valeur du wallet depuis row0.field1
          if (row.attributes.wallets) {
            let walletsObj = row.attributes.wallets;
            
            // Si wallets est une chaîne JSON, la parser
            if (typeof walletsObj === 'string') {
              try {
                walletsObj = JSON.parse(walletsObj) as ParsedWallets;
              } catch (e) {
                console.error('Erreur lors du parsing des wallets:', e);
                return t('user_management_wallet_format_error');
              }
            }
            
            // Utiliser une vérification de type plus générique pour éviter les erreurs TypeScript
            if (walletsObj && 
                typeof walletsObj === 'object' && 
                'row0' in walletsObj && 
                walletsObj.row0 && 
                typeof walletsObj.row0 === 'object' &&
                'field1' in walletsObj.row0) {
              // Vérifier si field1 contient une valeur non vide
              const walletValue = (walletsObj as ParsedWallets).row0.field1;
              if (walletValue && walletValue.trim() !== '') {
                return walletValue;
              }
              
              // Si field1 est vide, vérifier s'il y a d'autres champs (row1, etc.)
              for (const key of Object.keys(walletsObj)) {
                if (key !== 'row0' && 
                    walletsObj[key] && 
                    typeof walletsObj[key] === 'object' &&
                    'field1' in walletsObj[key] &&
                    walletsObj[key].field1 && 
                    walletsObj[key].field1.trim() !== '') {
                  return walletsObj[key].field1;
                }
              }
            }
          }
          
          // En dernier recours, utiliser wallet-id s'il existe
          if (row.attributes['wallet-id']) {
            return row.attributes['wallet-id'];
          }
          
          return t('user_management_wallet_not_defined');
        },
        id: 'wallet',
        size: 150,
        Cell: ({row}) => {
          // Extraire la valeur du wallet depuis row0.field1
          let walletValue = t('user_management_wallet_not_defined');
          
          if (row.original.attributes.wallets) {
            let walletsObj = row.original.attributes.wallets;
            
            // Si wallets est une chaîne JSON, la parser
            if (typeof walletsObj === 'string') {
              try {
                walletsObj = JSON.parse(walletsObj) as ParsedWallets;
              } catch (e) {
                console.error('Erreur lors du parsing des wallets:', e);
                walletValue = t('user_management_wallet_format_error');
              }
            }
            
            // Utiliser une vérification de type plus générique pour éviter les erreurs TypeScript
            if (walletsObj && 
                typeof walletsObj === 'object' && 
                'row0' in walletsObj && 
                walletsObj.row0 && 
                typeof walletsObj.row0 === 'object' &&
                'field1' in walletsObj.row0) {
              // Vérifier si field1 contient une valeur non vide
              const firstWalletValue = (walletsObj as ParsedWallets).row0.field1;
              if (firstWalletValue && firstWalletValue.trim() !== '') {
                walletValue = firstWalletValue;
              } else {
                // Si field1 est vide, vérifier s'il y a d'autres champs (row1, etc.)
                for (const key of Object.keys(walletsObj)) {
                  if (key !== 'row0' && 
                      walletsObj[key] && 
                      typeof walletsObj[key] === 'object' &&
                      'field1' in walletsObj[key] &&
                      walletsObj[key].field1 && 
                      walletsObj[key].field1.trim() !== '') {
                    walletValue = walletsObj[key].field1;
                    break;
                  }
                }
              }
            }
          }
          
          // En dernier recours, utiliser wallet-id s'il existe
          if (walletValue === t('user_management_wallet_not_defined') && row.original.attributes['wallet-id']) {
            walletValue = row.original.attributes['wallet-id'];
          }

          return (
            <span 
              onClick={() => handleRowClick(row.original.id)} 
              className='cursor-pointer w-full block overflow-x-auto whitespace-nowrap text-ellipsis'
              title={walletValue}
            >
              {walletValue}
            </span>
          )
        },
      },
      {
        header: t('user_management_register_date'),
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
        header: t('user_management_last_visit'),
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
    [t]
  )

  return (
    <ThemeProvider theme={darkTheme}>
      <div className='bg-gray-800 rounded-lg p-4 shadow-lg'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-semibold text-white'>{t('user_management_title')} ({userCount})</h2>
          <div className='flex gap-2'>
            <button onClick={fetchUsers} className='p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors' title={t('user_management_refresh')}>
              <FaRedo />
            </button>
            <button onClick={handleAdd} className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'>
              <FaPlus /> {t('user_management_add')}
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
                  children: t('user_management_loading'),
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
              header: t('user_management_actions'),
              size: 120,
            },
          }}
          renderRowActions={({row}) => (
            <Box sx={{display: 'flex', gap: '8px', justifyContent: 'center'}}>
              <Tooltip title={t('user_management_edit')}>
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
              <Tooltip title={t('user_management_delete')}>
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
          muiTableBodyRowProps={({ row }) => ({
            onClick: () => handleRowClick(row.original.id),
            sx: { cursor: 'pointer' }
          })}
          localization={{
            actions: t('user_management_actions'),
            and: t('user_management_and'),
            cancel: t('user_management_cancel'),
            clearFilter: t('user_management_clear_filter'),
            clearSearch: t('user_management_clear_search'),
            clearSort: t('user_management_clear_sort'),
            columnActions: t('user_management_column_actions'),
            edit: t('user_management_edit'),
            expand: t('user_management_expand'),
            filterByColumn: t('user_management_filter_by'),
            sortByColumnAsc: t('user_management_sort_asc'),
            sortByColumnDesc: t('user_management_sort_desc'),
            showHideColumns: t('user_management_show_hide_columns'),
            showHideFilters: t('user_management_show_hide_filters'),
            rowsPerPage: t('user_management_rows_per_page'),
            of: t('user_management_of'),
            noResultsFound: t('user_management_no_results'),
            search: t('user_management_search'),
          }}
        />

        {/* Modal pour ajouter/modifier un utilisateur */}
        <UserAddEditModal isOpen={isModalOpen} onClose={handleModalClose} userId={selectedUserId} onSuccess={handleModalSuccess} />

        {/* Modal de confirmation de suppression */}
        <DeleteConfirmationModal 
          isOpen={isDeleteModalOpen} 
          onClose={handleCancelDelete} 
          onConfirm={handleConfirmDelete} 
          title={t('user_management_delete_confirm')} 
          message={t('user_management_delete_message')} 
        />
      </div>
    </ThemeProvider>
  )
}

export default UserManager
