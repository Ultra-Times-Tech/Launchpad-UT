# Système de Cache Intelligent pour les Collections

## Vue d'ensemble

Le système de cache intelligent permet de maintenir les données des collections à jour automatiquement sans affecter les performances de l'application. Il combine plusieurs stratégies pour optimiser l'expérience utilisateur.

## Fonctionnalités

### 1. Cache avec TTL (Time To Live)
- **Durée de vie** : 5 minutes par défaut (configurable par environnement)
- **Persistance** : Les données sont sauvegardées dans le localStorage
- **Validation automatique** : Vérifie si les données sont obsolètes avant chaque utilisation

### 2. Polling Intelligent
- **Fréquence** : Toutes les 30 secondes par défaut
- **Optimisations** :
  - Ne s'exécute que si la page est visible
  - S'arrête automatiquement quand la page est cachée
  - Redémarre automatiquement quand la page redevient visible

### 3. Détection de Changements
- **Comparaison intelligente** : Compare le contenu JSON avant de mettre à jour
- **Mise à jour silencieuse** : Pas de rechargement de page, juste les données
- **Logging** : Console log quand de nouvelles données sont détectées

## Configuration

### Environnements

#### Développement
```typescript
TTL: 30 secondes
POLLING_INTERVAL: 5 secondes
```

#### Production
```typescript
TTL: 2 minutes
POLLING_INTERVAL: 15 secondes
```

### Personnalisation

Modifiez `frontend/src/config/cache.config.ts` pour ajuster :

- `TTL` : Durée de vie du cache
- `POLLING_INTERVAL` : Fréquence du polling
- `ENABLE_POLLING` : Active/désactive le polling
- `ENABLE_VISIBILITY_CHECK` : Active/désactive la vérification de visibilité

## Optimisations des Performances

### 1. Pas de Re-fetch Inutile
- Vérifie si les données sont récentes avant de faire une nouvelle requête
- Utilise le cache localStorage pour éviter les requêtes au démarrage

### 2. Polling Intelligent
- S'arrête quand la page n'est pas visible
- Redémarre automatiquement au retour sur la page
- Force un refresh si les données sont obsolètes au retour

### 3. Mise à Jour Silencieuse
- Garde les données actuelles pendant le refresh
- Pas de "flicker" ou d'état de chargement
- Mise à jour uniquement si il y a des changements

### 4. Gestion d'Erreurs
- Les erreurs de polling en arrière-plan n'affectent pas l'UI
- Conserve les données existantes en cas d'erreur réseau
- Retry automatique au prochain polling

## Compatibilité

- ✅ Fonctionne avec tous les navigateurs modernes
- ✅ Compatible avec le SSR/SSG
- ✅ Respecte les préférences de performance du navigateur
- ✅ Fonctionne même si JavaScript est désactivé (données en cache)

## Dépannage

### Les données ne se mettent pas à jour
1. Vérifiez la console pour les erreurs
2. Vérifiez que l'API backend fonctionne
3. Vérifiez la configuration du cache dans `cache.config.ts`

### Polling trop fréquent
1. Ajustez `POLLING_INTERVAL` dans la configuration
2. Désactivez le polling avec `ENABLE_POLLING: false`

### Données obsolètes au retour sur la page
1. Vérifiez que `ENABLE_VISIBILITY_CHECK` est activé
2. Vérifiez la valeur de `TTL` dans la configuration 