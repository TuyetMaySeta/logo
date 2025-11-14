import type { Log, Webhook } from "@/types/webhook";
import emsClient from "./emsClient";
import type { Pagination, PaginationParams } from "@/types/pagination";


export interface CreateWebhookRequest {
    name: string;
    url: string;
    event: string;
}

export interface UpdateWebhookRequest {
    name?: string;
    url?: string;
    events?: string;
    is_active?: boolean;
}

// interface WebhookListResponse {
//     webhooks: Webhook[];
// }

export async function createWebhook(partnerId: number, webhookData: CreateWebhookRequest): Promise<void> {
    const response = await emsClient.post(`/developer/partners/${partnerId}/webhooks`, webhookData);
    if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to create webhook");
    }
}

export async function deleteWebhook(partnerID: number, webhookId: number): Promise<void> {
    const response = await emsClient.delete(`/developer/partners/${partnerID}/webhooks/${webhookId}`);
    if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to delete webhook");
    }
}
export async function listWebhooks(partnerId: number, params: PaginationParams): Promise<Pagination<Webhook>> {
    const response = await emsClient.get<Pagination<Webhook>>(`/developer/partners/${partnerId}/webhooks`, {
        params: params
    });
    if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to list webhooks");
    }
    return response.data;
}

export async function updateWebhook(webhookId: number, partner_id: number, webhookData: UpdateWebhookRequest): Promise<void> {
    const response = await emsClient.put(`/developer/partners/${partner_id}/webhooks/${webhookId}`, webhookData);
    if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to update webhook");
    }
}

export async function getAllWebhookLogs(partnerId: number, params: PaginationParams): Promise<Pagination<Log>> {
    const response = await emsClient.get<Pagination<Log>>(`/developer/partners/${partnerId}/webhooks/logs`, {
        params: params
    });
    if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to get webhook logs");
    }
    return response.data;
}

export async function testWebhook(partnerId: number, webhookId: number): Promise<void> {
    const response = await emsClient.post(`/developer/partners/${partnerId}/webhooks/${webhookId}/test`);
    if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to test webhook");
    }
}

export async function retryLog(partner_id: number, log_id: number): Promise<void> {
    const response = await emsClient.post(`/developer/partners/${partner_id}/webhooks/logs/${log_id}/retry`);
    if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to retry webhook log");
    }
}