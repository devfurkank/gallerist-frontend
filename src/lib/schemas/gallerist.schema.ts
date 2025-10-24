import { z } from 'zod';

export const galleristSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  address: z.object({
    city: z.string().min(2, 'City must be at least 2 characters'),
    district: z.string().min(2, 'District must be at least 2 characters'),
    neighborhood: z.string().min(2, 'Neighborhood must be at least 2 characters'),
    street: z.string().min(2, 'Street must be at least 2 characters'),
  }),
});

export type GalleristFormData = z.infer<typeof galleristSchema>;

