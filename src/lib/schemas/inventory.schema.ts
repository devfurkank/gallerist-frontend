import { z } from 'zod';

export const galleristCarSchema = z.object({
  galleristId: z.number({
    required_error: 'Gallerist is required',
  }).min(1, 'Gallerist must be selected'),
  carId: z.number({
    required_error: 'Car is required',
  }).min(1, 'Car must be selected'),
});

export type GalleristCarFormData = z.infer<typeof galleristCarSchema>;


