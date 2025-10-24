import { z } from 'zod';

/**
 * Account schema compatible with backend validations
 * Backend: AccountDTOIU - accountNo, iban @NotEmpty, amount, currencyType @NotNull
 */
export const accountSchema = z.object({
  accountNo: z.string().min(1, 'Account number is required').trim(),
  iban: z
    .string()
    .min(1, 'IBAN is required')
    .regex(/^TR\d{2}/, 'IBAN must start with "TR" and be in valid format')
    .length(26, 'IBAN must be 26 characters')
    .trim(),
  amount: z
    .number()
    .min(0, 'Amount cannot be negative'),
  currencyType: z.enum(['TL', 'USD']),
});

export type AccountFormData = z.infer<typeof accountSchema>;

