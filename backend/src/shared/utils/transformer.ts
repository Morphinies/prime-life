// camelCase to snake_case
export function toSnakeCase(str: string) {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

//  snake_case to camelCase
export function toCamelCase(str: string) {
  return str.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
