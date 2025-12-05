import { create } from 'zustand';
import { getProjectsByIds, createProject, updateProject, deleteProject, type Project } from '@/modules/talent/projects';
import { addProjectToTalent } from '@/modules/talent/actions';

interface ProjectsStore {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: (projectIds: string) => Promise<void>;
  addProject: (project: Omit<Project, 'id'>, talentId: string) => Promise<void>;
  editProject: (id: string, updates: Partial<Project>) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
}

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: [],
  loading: false,
  error: null,
  
  fetchProjects: async (projectIds: string) => {
    set({ loading: true, error: null });
    const result = await getProjectsByIds(projectIds);
    
    if (result.error) {
      set({ error: result.error, loading: false });
    } else {
      set({ projects: result.data || [], loading: false });
    }
  },
  
  addProject: async (project: Omit<Project, 'id'>, talentId: string) => {
    set({ loading: true, error: null });
    const result = await createProject(project);
    
    if (result.error) {
      set({ error: result.error, loading: false });
    } else if (result.data) {
      await addProjectToTalent(talentId, result.data.id!);
      set({ 
        projects: [...get().projects, result.data],
        loading: false 
      });
    }
  },
  
  editProject: async (id: string, updates: Partial<Project>) => {
    set({ loading: true, error: null });
    const result = await updateProject(id, updates);
    
    if (result.error) {
      set({ error: result.error, loading: false });
    } else if (result.data) {
      set({
        projects: get().projects.map(p => p.id === id ? result.data! : p),
        loading: false
      });
    }
  },
  
  removeProject: async (id: string) => {
    set({ loading: true, error: null });
    const result = await deleteProject(id);
    
    if (result.error) {
      set({ error: result.error, loading: false });
    } else {
      set({
        projects: get().projects.filter(p => p.id !== id),
        loading: false
      });
    }
  },
}));
