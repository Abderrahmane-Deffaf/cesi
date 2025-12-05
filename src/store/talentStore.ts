import { create } from 'zustand';
import { getTalentByUserId, updateTalent, type Talent } from '@/modules/talent/actions';

interface TalentStore {
  talent: Talent | null;
  loading: boolean;
  error: string | null;
  fetchTalent: (userId: string) => Promise<void>;
  updateTalentData: (id: string, updates: Partial<Talent>) => Promise<void>;
  setTalent: (talent: Talent | null) => void;
}

export const useTalentStore = create<TalentStore>((set) => ({
  talent: null,
  loading: false,
  error: null,
  
  fetchTalent: async (userId: string) => {
    set({ loading: true, error: null });
    const result = await getTalentByUserId(userId);
    
    if (result.error) {
      set({ error: result.error, loading: false });
    } else {
      set({ talent: result.data, loading: false });
    }
  },
  
  updateTalentData: async (id: string, updates: Partial<Talent>) => {
    set({ loading: true, error: null });
    const result = await updateTalent(id, updates);
    
    if (result.error) {
      set({ error: result.error, loading: false });
    } else {
      set({ talent: result.data, loading: false });
    }
  },
  
  setTalent: (talent: Talent | null) => set({ talent }),
}));
