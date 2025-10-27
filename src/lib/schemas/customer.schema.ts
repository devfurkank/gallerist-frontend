import { z } from 'zod';
import { validateTCKN } from '../utils/validation';

export const customerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  tckn: z.string().length(11, 'TCKN must be 11 digits').refine(validateTCKN, {
    message: 'Invalid TCKN',
  }),
  birthDate: z.string().min(1, 'Birth date is required'),
  addressId: z.string().min(1, 'Address is required'),
  accountId: z.string().min(1, 'Account is required'),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
