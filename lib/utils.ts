import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isIncluded(str1: string, str2: string) {
  // Función que elimina números y caracteres no alfabéticos y convierte a minúsculas.
  const normalize = (s: string) => s.replace(/[^a-zA-Z]/g, "").toLowerCase();
  
  // Normalizamos ambos strings.
  const n1 = normalize(str1);
  const n2 = normalize(str2);
  
  // Retorna true si n1 está incluido en n2.
  return n2.includes(n1);
}