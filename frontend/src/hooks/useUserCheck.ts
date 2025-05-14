import {useState, useEffect, useRef} from 'react'
import {apiRequestor} from '../utils/axiosInstanceHelper'
import {cleanWalletId} from '../utils/ultraWalletHelper'
import useAlerts from './useAlert'
import {TranslationFunction} from '../types/header.types'

export const useUserCheck = (blockchainId: string | null, t: TranslationFunction) => {
  const {success, error: showError} = useAlerts()
  const [userCheckCompleted, setUserCheckCompleted] = useState(false)
  const [isCheckingUser, setIsCheckingUser] = useState(false)
  const lastCheckedBlockchainId = useRef<string | null>(null)
  const checkTimeoutRef = useRef<number | null>(null)

  // Réinitialiser l'état de vérification quand l'utilisateur se déconnecte
  useEffect(() => {
    if (!blockchainId) {
      setUserCheckCompleted(false)
      lastCheckedBlockchainId.current = null
      if (checkTimeoutRef.current) {
        window.clearTimeout(checkTimeoutRef.current)
        checkTimeoutRef.current = null
      }
    }
  }, [blockchainId])

  // Vérifier si l'utilisateur existe et le créer si nécessaire
  useEffect(() => {
    // Si rien n'a changé ou si une vérification est déjà en cours, on ne fait rien
    if (!blockchainId || userCheckCompleted || isCheckingUser || blockchainId === lastCheckedBlockchainId.current) {
      return
    }

    // Définir un délai avant de lancer la vérification pour éviter les requêtes répétées
    if (checkTimeoutRef.current) {
      window.clearTimeout(checkTimeoutRef.current)
    }

    checkTimeoutRef.current = window.setTimeout(async () => {
      try {
        setIsCheckingUser(true)

        // Nettoyer et stocker l'ID pour référence future
        const cleanedBlockchainId = cleanWalletId(blockchainId)
        const response = await apiRequestor.get(`/users/wallets/${cleanedBlockchainId}`)

        // Vérifier si un utilisateur a été trouvé
        const userExists = response.data && response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0

        if (userExists) {
          try {
            const userData = response.data.data[0].attributes

            let existingWallets
            try {
              existingWallets = typeof userData.wallets === 'string' ? JSON.parse(userData.wallets) : userData.wallets
            } catch (e) {
              existingWallets = {}
              console.error('Erreur lors du parsing des wallets existants:', e)
            }

            if (
              !existingWallets ||
              !Object.values(existingWallets).some(wallet => {
                const w = wallet as Record<string, unknown>
                return w.field1 && w.field1 === cleanedBlockchainId
              })
            ) {
              const updatedWallets = {
                row0: {
                  field1: cleanedBlockchainId,
                },
              }

              // Mettre à jour l'utilisateur
              const userId = response.data.data[0].id
              await apiRequestor.patch(`/users/${userId}`, {
                wallets: JSON.stringify(updatedWallets),
              })
            }
          } catch (updateError) {
            console.error('Erreur lors de la mise à jour du wallet:', updateError)
            // Continuer malgré l'erreur de mise à jour du wallet
          }
        } else {
          let username = ''
          let displayName = ''

          try {
            const {getUsername} = await import('./useUsername')
            const ultraUsername = await getUsername(cleanedBlockchainId)
            if (ultraUsername) {
              username = ultraUsername.replace(/[^a-zA-Z0-9_]/g, '_')
              displayName = ultraUsername
            } else {
              username = `ut_${cleanedBlockchainId.slice(0, 8)}`
              displayName = `User ${cleanedBlockchainId.slice(0, 6)}`
            }
          } catch (usernameError) {
            console.error("Erreur lors de la récupération du nom d'utilisateur Ultra:", usernameError)
            // En cas d'erreur, utiliser une valeur par défaut
            username = `ut_${cleanedBlockchainId.slice(0, 8)}`
            displayName = `User ${cleanedBlockchainId.slice(0, 6)}`
          }

          // Créer un mot de passe plus robuste respectant les exigences de Joomla
          const generateStrongPassword = () => {
            const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
            const numbers = '0123456789'
            const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?'

            // Prendre au moins un caractère de chaque catégorie
            let password = ''
            password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length))
            password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length))
            password += numbers.charAt(Math.floor(Math.random() * numbers.length))
            password += specialChars.charAt(Math.floor(Math.random() * specialChars.length))

            // Ajouter des caractères aléatoires supplémentaires pour atteindre une longueur de 12
            const allChars = uppercaseChars + lowercaseChars + numbers + specialChars
            for (let i = 0; i < 8; i++) {
              password += allChars.charAt(Math.floor(Math.random() * allChars.length))
            }

            // Mélanger les caractères
            return password
              .split('')
              .sort(() => 0.5 - Math.random())
              .join('')
          }

          const randomPassword = generateStrongPassword()

          // Format YYYY-MM-DD HH:MM:SS comme attendu par l'API
          const now = new Date()
          const formattedDate = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 8)

          // Créer le wallet au format attendu par l'API (chaîne JSON)
          const wallets = JSON.stringify({
            row0: {
              field1: cleanedBlockchainId,
            },
          })

          const newUser = {
            name: displayName,
            username: username,
            email: `${cleanedBlockchainId}@ultra.io`,
            state: '0', // Non bloqué
            password: randomPassword, // Mot de passe robuste
            password2: randomPassword, // Confirmation du mot de passe (identique)
            groups: ['2'], // Groupe utilisateur standard
            registerDate: formattedDate,
            requireReset: '0',
            resetCount: '0',
            sendEmail: '0',
            sendnotif: ['0'],
            sendcomm: ['0'],
            wallets: wallets,
          }

          try {
            await apiRequestor.post('/users', newUser)
            success(t('new_account_created' as const) || 'Votre compte a été créé automatiquement !')
          } catch (error: unknown) {
            console.error("Erreur lors de la création de l'utilisateur:", error)

            // Vérifier si l'erreur est une erreur de réponse avec un format spécifique
            const err = error as {response?: {status?: number; data?: {errors?: Array<{title?: string}>}}}

            if (err.response?.data) {
              console.error("Détails de l'erreur:", err.response.data)

              // Si l'erreur est due à un nom d'utilisateur ou email déjà utilisé
              const errors = err.response.data.errors || []
              const hasUsernameError = errors.some(e => e.title && typeof e.title === 'string' && e.title.includes('username'))
              const hasEmailError = errors.some(e => e.title && typeof e.title === 'string' && e.title.includes('email'))

              if (err.response.status === 409 || hasUsernameError || hasEmailError) {
                const timestamp = Date.now().toString().slice(-6)
                newUser.username = `ut_${timestamp}_${cleanedBlockchainId.slice(0, 4)}`
                newUser.email = `${timestamp}_${cleanedBlockchainId.slice(0, 4)}@ultra.io`

                try {
                  await apiRequestor.post('/users', newUser)
                  success(t('new_account_created' as const) || 'Votre compte a été créé automatiquement !')
                } catch (retryError) {
                  console.error('Échec de la seconde tentative:', retryError)
                  throw retryError
                }
              } else {
                throw error
              }
            } else {
              throw error // Relancer l'erreur pour qu'elle soit traitée par le catch externe
            }
          }
        }
        setUserCheckCompleted(true)
        lastCheckedBlockchainId.current = blockchainId // Only store the ID after successful check
      } catch (error) {
        console.error("Erreur lors de la vérification/création de l'utilisateur:", error)
        showError(t('account_creation_error' as const) || 'Erreur lors de la vérification/création du compte')
        // Même en cas d'échec, on marque comme terminé pour éviter une boucle d'erreurs
        setUserCheckCompleted(true)
        // Ne pas stocker le blockchainId en cas d'erreur pour permettre une nouvelle tentative
      } finally {
        setIsCheckingUser(false)
        checkTimeoutRef.current = null
      }
    }, 800) // Délai de 800ms pour éviter les requêtes trop fréquentes

    return () => {
      if (checkTimeoutRef.current) {
        window.clearTimeout(checkTimeoutRef.current)
        checkTimeoutRef.current = null
      }
    }
  }, [blockchainId, t, success, showError, userCheckCompleted, isCheckingUser])

  return {
    userCheckCompleted,
    isCheckingUser,
  }
}
