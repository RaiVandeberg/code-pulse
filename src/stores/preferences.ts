import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
    autoplay: boolean;
    expandModules?: string | null;
    modulesListCollapsed: boolean;
}

type Action = {
    setAutoplay: (autoplay: boolean) => void;
    setExpandModules: (expandModules: string | undefined) => void;
    setModulesListCollapsed: (modulesListCollapsed: boolean) => void;
}

type Store = State & Action;

export const usePreferencesStore = create<Store>()(
    persist(
        (set) => ({
            autoplay: false,
            expandModules: null,
            modulesListCollapsed: false,
            setAutoplay: (autoplay) => set({ autoplay }),
            setExpandModules: (expandModules) => set({ expandModules }),
            setModulesListCollapsed: (modulesListCollapsed) => set({ modulesListCollapsed }),
        }),
        {
            name: 'codePulse:preferences',
        }
    )
);