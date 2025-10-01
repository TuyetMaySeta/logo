import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OrgState {
  id: number | null;
  name: string | null;

  setOrg: (id: number | null, name: string | null) => void;
}
const useOrgStore = create<OrgState>()(
  persist(
    (set) => ({
      id: 1,
      name: "SETA International",
      setOrg: (id: number | null, name: string | null = null) =>
        set({ id, name }),
    }),
    {
      name: "org-storage", // unique name
      partialize: (state) => ({ id: state.id }), // only persist the id
    }
  )
);

export default useOrgStore;
