// Utility type to check if T is an array type
export function isEmptyList<T>(data: T): boolean {
    return Array.isArray(data) && data.length === 0;
  }

export const capitalizeFirstLetter = (str: string): string => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };