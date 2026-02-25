/**
 * Generates a Tailwind-compatible color class from a string.
 * Uses a simple hash to ensure consistent colors for the same input.
 */
export const stringToColor = (str) => {
  if (!str) return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200';

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // HSL values
  const hue = Math.abs(hash) % 360;
  const saturation = 70 + (Math.abs(hash) % 30);
  const lightness = 60 + (Math.abs(hash) % 20);

  // HSL to RGB
  const rgb = hslToRgb(hue / 360, saturation / 100, lightness / 100);

  // Calculate luminance for contrast
  const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  const textColor = luminance > 0.6 ? 'text-black' : 'text-white';

  // Return classes
  return `bg-[rgb(${rgb[0]},${rgb[1]},${rgb[2]})] ${textColor}`;
};

// Helper: HSL to RGB conversion
const hslToRgb = (h, s, l) => {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

export const stringToColorStyle = (str) => {
  if (!str) {
    return {
      backgroundColor: '#374151', // Tailwind gray-700 (darker)
      color: '#e5e7eb',           // Tailwind gray-200 (lighter)
    };
  }

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // HSL values (even darker)
  const hue = Math.abs(hash) % 360;
  const saturation = 50 + (Math.abs(hash) % 20); // 50-70%
  const lightness = 12 + (Math.abs(hash) % 10);  // 12-22% (much darker)

  // HSL to RGB
  const rgb = hslToRgb(hue / 360, saturation / 100, lightness / 100);

  // Calculate luminance for contrast
  const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  const textColor = luminance > 0.5 ? '#222' : '#e5e7eb'; // Use light text for dark backgrounds

  return {
    backgroundColor: `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`,
    color: textColor,
  };
};