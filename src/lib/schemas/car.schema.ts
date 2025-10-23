import { z } from 'zod';
import { CAR_STATUS, CURRENCY_TYPES } from '../utils/constants';
import { validatePlate } from '../utils/validation';

export const carSchema = z.object({
  plate: z.string().min(1, 'Plate is required').refine(validatePlate, {
    message: 'Invalid plate format (e.g., 34 ABC 1234)',
  }),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  productionYear: z
    .number()
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  price: z.number().min(0, 'Price must be positive'),
  currencyType: z.enum([CURRENCY_TYPES.TL, CURRENCY_TYPES.USD]),
  damagePrice: z.number().min(0).optional(),
  carStatusType: z.enum([CAR_STATUS.SALABLE, CAR_STATUS.SOLD]),
});

export type CarFormData = z.infer<typeof carSchema>;
