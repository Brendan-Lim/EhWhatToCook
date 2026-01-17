export function buildImagePrompt({ name, description }) {
  const desc = description ? `, ${description}` : "";
  return `Top-down clipart illustration of ${name}${desc}. Clean light background, vibrant colors, appetizing, no text, no people, no utensils, centered composition.`;
}
