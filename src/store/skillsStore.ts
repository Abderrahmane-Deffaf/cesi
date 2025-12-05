import { create } from 'zustand';
import { getAllSkills, getSkillsByIds, updateSkill } from '@/modules/talent/skills';
import { getAllLanguages, getLanguagesByIds } from '@/modules/talent/languages';
import { addSkillToTalent, removeSkillFromTalent, addLanguageToTalent } from '@/modules/talent/actions';

interface SkillsStore {
  allSkills: any[];
  allLanguages: any[];
  userSkills: any[];
  userLanguages: any[];
  loading: boolean;
  error: string | null;
  
  fetchAllSkills: () => Promise<void>;
  fetchAllLanguages: () => Promise<void>;
  fetchUserSkills: (skillIds: string) => Promise<void>;
  fetchUserLanguages: (languageIds: string) => Promise<void>;
  addSkill: (talentId: string, skillId: string) => Promise<void>;
  removeSkill: (talentId: string, skillId: string) => Promise<void>;
  updateSkillLevel: (skillId: string, level: number) => Promise<void>;
  addLanguage: (talentId: string, languageId: string) => Promise<void>;
}

export const useSkillsStore = create<SkillsStore>((set, get) => ({
  allSkills: [],
  allLanguages: [],
  userSkills: [],
  userLanguages: [],
  loading: false,
  error: null,
  
  fetchAllSkills: async () => {
    set({ loading: true, error: null });
    const result = await getAllSkills();
    set({ allSkills: result.data || [], loading: false });
  },
  
  fetchAllLanguages: async () => {
    set({ loading: true, error: null });
    const result = await getAllLanguages();
    set({ allLanguages: result.data || [], loading: false });
  },
  
  fetchUserSkills: async (skillIds: string) => {
    set({ loading: true, error: null });
    const result = await getSkillsByIds(skillIds);
    set({ userSkills: result.data || [], loading: false });
  },
  
  fetchUserLanguages: async (languageIds: string) => {
    set({ loading: true, error: null });
    const result = await getLanguagesByIds(languageIds);
    set({ userLanguages: result.data || [], loading: false });
  },
  
  addSkill: async (talentId: string, skillId: string) => {
    set({ loading: true, error: null });
    const result = await addSkillToTalent(talentId, skillId);
    
    if (result.error) {
      set({ error: result.error, loading: false });
    } else {
      set({ loading: false });
    }
  },
  
  removeSkill: async (talentId: string, skillId: string) => {
    set({ loading: true, error: null });
    const result = await removeSkillFromTalent(talentId, skillId);
    
    if (result.error) {
      set({ error: result.error, loading: false });
    } else {
      set({
        userSkills: get().userSkills.filter(s => s.id !== skillId),
        loading: false
      });
    }
  },
  
  updateSkillLevel: async (skillId: string, level: number) => {
    set({ loading: true, error: null });
    const result = await updateSkill(skillId, level);
    
    if (result.error) {
      set({ error: result.error, loading: false });
    } else {
      set({
        userSkills: get().userSkills.map(s => 
          s.id === skillId ? { ...s, level } : s
        ),
        loading: false
      });
    }
  },
  
  addLanguage: async (talentId: string, languageId: string) => {
    set({ loading: true, error: null });
    const result = await addLanguageToTalent(talentId, languageId);
    
    if (result.error) {
      set({ error: result.error, loading: false });
    } else {
      set({ loading: false });
    }
  },
}));
