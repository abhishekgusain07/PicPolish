/**
 * Convert RGB color string to hex format
 * @param rgb - RGB string like "rgb(255, 0, 0)"
 * @returns Hex color string like "#ff0000"
 */
export function rgbToHex(rgb: string): string {
  const result = rgb.match(/\d+/g)
  if (!result || result.length !== 3) return '#000000'

  const [r, g, b] = result.map(Number)
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

/**
 * Convert hex color to RGB format
 * @param hex - Hex color string like "#ff0000"
 * @returns RGB string like "rgb(255, 0, 0)"
 */
export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return 'rgb(0, 0, 0)'

  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)

  return `rgb(${r}, ${g}, ${b})`
}

/**
 * Extract RGB values from a gradient string
 * @param gradient - Gradient string like "linear-gradient(135deg, rgb(255, 0, 0), rgb(0, 255, 0))"
 * @returns Array of RGB strings
 */
export function extractRGBValues(gradient: string): string[] {
  const rgbRegex = /rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)/g
  return gradient.match(rgbRegex) || []
}

/**
 * Extract hex colors from RGB values in a gradient
 * @param gradient - Gradient string
 * @returns Array of hex color strings
 */
export function extractHexColors(gradient: string): string[] {
  const rgbValues = extractRGBValues(gradient)
  return rgbValues.map(rgbToHex)
}

/**
 * Reconstruct gradient string from hex colors
 * @param colors - Array of hex color strings
 * @param direction - Gradient direction (default: 135deg)
 * @returns Complete gradient string
 */
export function reconstructGradient(
  colors: string[],
  direction: string = '135deg'
): string {
  if (colors.length === 0) return 'linear-gradient(135deg, #000000, #ffffff)'
  if (colors.length === 1)
    return `linear-gradient(${direction}, ${hexToRgb(colors[0])}, ${hexToRgb(colors[0])})`

  const rgbColors = colors.map(hexToRgb)
  return `linear-gradient(${direction}, ${rgbColors.join(', ')})`
}

/**
 * Validate if a string is a valid hex color
 * @param color - Color string to validate
 * @returns True if valid hex color
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color)
}

/**
 * Sanitize and validate hex color, return fallback if invalid
 * @param color - Color string to sanitize
 * @param fallback - Fallback color if invalid
 * @returns Valid hex color
 */
export function sanitizeHexColor(
  color: string,
  fallback: string = '#000000'
): string {
  if (!color) return fallback

  // Remove whitespace and ensure # prefix
  let sanitized = color.trim()
  if (!sanitized.startsWith('#')) {
    sanitized = '#' + sanitized
  }

  // Expand 3-digit hex to 6-digit
  if (sanitized.length === 4) {
    sanitized =
      '#' +
      sanitized[1] +
      sanitized[1] +
      sanitized[2] +
      sanitized[2] +
      sanitized[3] +
      sanitized[3]
  }

  return isValidHexColor(sanitized) ? sanitized : fallback
}

/**
 * Extract hex colors from RGB values in a gradient with validation
 * @param gradient - Gradient string
 * @returns Array of valid hex color strings
 */
export function extractHexColorsWithValidation(gradient: string): string[] {
  const rgbValues = extractRGBValues(gradient)
  const hexColors = rgbValues.map(rgbToHex)

  // Validate and sanitize each color
  const validColors = hexColors.map((color) =>
    sanitizeHexColor(color, '#000000')
  )

  // Ensure we have at least 2 colors for a gradient
  if (validColors.length === 0) {
    return ['#ff002c', '#ff00d8'] // Default pink gradient
  }
  if (validColors.length === 1) {
    return [validColors[0], '#ffffff'] // Add white as second color
  }

  return validColors
}

/**
 * Update a specific color in the gradient colors array
 * @param colors - Current array of hex colors
 * @param index - Index to update
 * @param newColor - New hex color
 * @returns Updated colors array
 */
export function updateGradientColor(
  colors: string[],
  index: number,
  newColor: string
): string[] {
  if (index < 0 || index >= colors.length) return colors

  const newColors = [...colors]
  newColors[index] = sanitizeHexColor(newColor, colors[index])
  return newColors
}
