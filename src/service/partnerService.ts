import type { PartnersResponse } from "@/types/partner";
import emsClient from "./emsClient";

export async function fetchAllPartner(): Promise<PartnersResponse> {
    const response = await emsClient.get<PartnersResponse>(`/developer/partners`);
    return response.data;
}

export async function addEmployeeToPartner(partnerId: number, employeeId: number): Promise<void> {
    const response = await emsClient.post(`/developer/partners/${partnerId}/access/${employeeId}`);

    if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to add employee to partner");
    }
}

export async function removeEmployeeFromPartner(partnerId: number, employeeId: number): Promise<void> {
    const response = await emsClient.delete(`/developer/partners/${partnerId}/access/${employeeId}`);

    if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to remove employee from partner");
    }
}

export async function fetchAccessiblePartners(): Promise<PartnersResponse> {
    const response = await emsClient.get<PartnersResponse>(`/developer/partners/accessible`);
    return response.data;
}