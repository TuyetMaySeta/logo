import emsClient from "./emsClient";

interface KeyResponse {
    value: string;
}

export async function getWebhookKey(partnerId: number): Promise<string> {
    const response = await emsClient.get<KeyResponse>(`/developer/partners/${partnerId}/webhooks/keys`);

    if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to get webhook key");
    }

    return response.data.value;
}

export async function generateWebhookKey(partnerId: number): Promise<string> {
    const response = await emsClient.post<KeyResponse>(`/developer/partners/${partnerId}/webhooks/keys/generate`);

    if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to generate webhook key");
    }

    return response.data.value;
}