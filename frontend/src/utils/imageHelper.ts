/**
 * Image Helper Utility
 *
 * This utility provides functions for working with images in the application,
 * including determining optimal dimensions and loading strategies.
 */

// Define standard image dimensions for different screen sizes
export const imageDimensions = {
  mobile: {
    width: 640,
    height: 360,
    aspectRatio: '16:9',
  },
  tablet: {
    width: 1024,
    height: 384,
    aspectRatio: '8:3',
  },
  desktop: {
    width: 1280,
    height: 400,
    aspectRatio: '16:5',
  },
  largeDesktop: {
    width: 1920,
    height: 600,
    aspectRatio: '16:5',
  },
}

/**
 * Get the asset URL based on the environment
 * @param path - The path to the asset
 * @returns The full URL to the asset
 */
export const getAssetUrl = (path: string): string => {
  const baseUrl = import.meta.env.VITE_APP_ASSETS_URL || ''

  // If the path already starts with http or https, return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  // If the path starts with a slash, remove it
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path

  // Return the full URL
  return `${baseUrl}${normalizedPath}`
}

/**
 * Generate responsive image sources for different screen sizes
 * @param imagePath - The base path to the image
 * @returns An object with image sources for different screen sizes
 */
export const getResponsiveImageSources = (imagePath: string) => {
  // This is a simplified example. In a real application, you might have
  // different versions of the same image optimized for different screen sizes.
  return {
    mobile: getAssetUrl(imagePath),
    tablet: getAssetUrl(imagePath),
    desktop: getAssetUrl(imagePath),
    largeDesktop: getAssetUrl(imagePath),
  }
}

/**
 * Calculate the aspect ratio for an image
 * @param width - The width of the image
 * @param height - The height of the image
 * @returns The aspect ratio as a string (e.g., "16:9")
 */
export const calculateAspectRatio = (width: number, height: number): string => {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
  const divisor = gcd(width, height)
  return `${width / divisor}:${height / divisor}`
}