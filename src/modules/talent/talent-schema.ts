import { z } from 'zod';

export const talentFormSchema = z.object({
  name: z.string().min(1, 'First name is required'),
  prenom: z.string().min(1, 'Last name is required'),
  adresse: z.string().optional(),
  lat: z.number().optional(),
  long: z.number().optional(),
  passion: z.array(z.string()).optional(),
});

export type TalentFormData = z.infer<typeof talentFormSchema>;
