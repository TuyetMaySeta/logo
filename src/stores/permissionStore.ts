import { fetchUserPermissions } from "@/service/roleService";
import type { ActionType, ObjectType, Permission } from "@/types/role";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PermissionState {
  permissions: Permission[];

  fetchPermissions: () => Promise<void>;
  setPermission: (permissions: Permission[]) => void;
  havePermission: (object: ObjectType, action: ActionType) => boolean;
}

const usePermissionStore = create<PermissionState>()(
  persist(
    (set, get) => ({
      permissions: [],
      fetchPermissions: async () => {
        try {
          const data = await fetchUserPermissions();
          set({ permissions: data as Permission[] });
        } catch (error) {
          console.error("Error fetching permissions:", error);
        }
      },
      setPermission: (permissions: Permission[]) => set({ permissions }),
      havePermission: (object: ObjectType, action: ActionType) => {
        const { permissions } = get();
        return permissions.some(
          (perm) => perm.object === object && perm.action === action
        );
      },
    }),
    {
      name: "role-storage", // unique name
      partialize: (state) => ({ permissions: state.permissions }), // only persist the permissions
    }
  )
);

export default usePermissionStore;
