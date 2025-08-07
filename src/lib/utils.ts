import { CourseDifficulty } from "@/generated/prisma"
import { match } from "assert"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDuration = (durationInMs: number, showHours = false) => {
  const hours = Math.floor(durationInMs / (100 * 60 * 60))
  const minutes = Math.floor((durationInMs % (100 * 60 * 60)) / (100 * 60))
  const seconds = Math.floor((durationInMs % (100 * 60)) / 1000)

  const formatNumber = (num: number) => num.toString().padStart(2, '0')

  if (hours > 0 || showHours) {
    return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`
  }
  return `${formatNumber(minutes)}:${formatNumber(seconds)}`
}

export const formatDificulty = (difficulty: string) => {
  switch (difficulty) {
    case CourseDifficulty.EASY:
      return 'Iniciante'
    case CourseDifficulty.MEDIUM:
      return 'Intermediário'
    case CourseDifficulty.HARD:
      return 'Avançado'
    default:
      return 'Desconhecido'
  }
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

export const formatName = (firstName: string, lastName?: string | null) => {
  if (!lastName) {
    return firstName
  }
  return `${firstName} ${lastName}`
}

export const unMockValue = (value: string) => {
  return value.replace(/[^0-9a-z]/gi, "")
}

export const calculateInstallmentsOptions = (price: number) => {
  const gatewayFeePercentage = 0.0399; // 3.99% Assas
  const gatewayFixedFee = 0.8; // 0.49 Assas
  const maxInstallments = 12;
  const noInterestInstallments = 6;

  const installmentOptions: InstallmentOptions[] = [];

  for (let i = 1; i <= maxInstallments; i++) {
    let total = price

    if (i > noInterestInstallments) {
      total += total * gatewayFeePercentage + gatewayFixedFee;
    }

    total = Math.round(total * 100) / 100; // Arredondar para duas casas decimais
    const installmentValue = Math.round((total / i) * 100) / 100; // Arredondar para duas casas decimais

    installmentOptions.push({
      installments: i,
      total,
      installmentValue,
      hasInterest: i > noInterestInstallments,
    });



  }
  return installmentOptions;
}