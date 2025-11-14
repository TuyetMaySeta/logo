import { fetchAccessiblePartners } from "@/service/partnerService";
import type { Partner } from "@/types/partner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type DeveloperAccess = {
    isDeveloper: boolean;
    partners: Partner[];
    loading: boolean;
    fetchAccessiblePartner: () => Promise<void>;
};

export const useDeveloperStore = create<DeveloperAccess>()(
    persist(
        (set) => ({
            isDeveloper: false,
            partners: [],
            loading: false,

            fetchAccessiblePartner: async () => {
                set({ loading: true });
                try {
                    const data = await fetchAccessiblePartners();
                    set({
                        isDeveloper: data.partners.length > 0,
                        partners: data.partners,
                        loading: false,
                    });
                } catch {
                    set({ loading: false });
                }
            },
        }),
        {
            name: "developer-store", // localStorage key
            // persist only the fields you want (don't persist transient 'loading')
            partialize: (state) => ({ isDeveloper: state.isDeveloper, partners: state.partners }),
        }
    )
);
