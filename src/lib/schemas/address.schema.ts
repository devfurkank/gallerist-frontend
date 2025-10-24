import { z } from 'zod';

/**
 * Backend validasyonları ile uyumlu Address şeması
 * Backend: AddressDTOIU - tüm alanlar @NotEmpty ile zorunlu
 */
export const addressSchema = z.object({
  city: z.string().min(1, 'Şehir zorunludur').trim(),
  district: z.string().min(1, 'İlçe zorunludur').trim(),
  neighborhood: z.string().min(1, 'Mahalle zorunludur').trim(),
  street: z.string().min(1, 'Sokak zorunludur').trim(),
});

export type AddressFormData = z.infer<typeof addressSchema>;

