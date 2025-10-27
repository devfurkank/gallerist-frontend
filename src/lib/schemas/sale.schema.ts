import { z } from 'zod';

export const saleSchema = z.object({
  customerId: z.number({
    required_error: 'Customer selection is required',
    invalid_type_error: 'Please select a valid customer',
  }).positive('Please select a valid customer'),
  
  galleristId: z.number({
    required_error: 'Gallerist selection is required',
    invalid_type_error: 'Please select a valid gallerist',
  }).positive('Please select a valid gallerist'),
  
  carId: z.number({
    required_error: 'Car selection is required',
    invalid_type_error: 'Please select a valid car',
  }).positive('Please select a valid car'),
});

export type SaleFormData = z.infer<typeof saleSchema>;

