import { z } from 'zod';

export const skillsFormSchema = z.object({
  skill_id: z.string().min(1, 'Please select a skill'),
});

export type SkillsFormData = z.infer<typeof skillsFormSchema>;
