import { generateWebhookKey, getWebhookKey } from "@/service/keyService";
import {
    listWebhooks,
    createWebhook as createNewWebhook,
    updateWebhook as updateCall,
    deleteWebhook as deleteCall,
    testWebhook as testCall,
    retryLog as retryLogCall,
    type CreateWebhookRequest,
    type UpdateWebhookRequest,
    getAllWebhookLogs
} from "@/service/webhookService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface UseWebhooksOptions {
    webhooksPage?: number;
    webhooksPageSize?: number;
    logsPage?: number;
    logsPageSize?: number;
    enabled?: boolean;
    staleTime?: number;
    refetchInterval?: number;
}

// Query keys factory
const webhookKeys = {
    all: (partnerId: number) => ['webhooks', partnerId] as const,
    lists: (partnerId: number) => [...webhookKeys.all(partnerId), 'list'] as const,
    list: (partnerId: number, page: number, pageSize: number) =>
        [...webhookKeys.lists(partnerId), { page, pageSize }] as const,
    apiKey: (partnerId: number) => [...webhookKeys.all(partnerId), 'apiKey'] as const,
    logs: (partnerId: number, page: number, pageSize: number) =>
        [...webhookKeys.all(partnerId), 'logs', { page, pageSize }] as const,
};

export function useWebhooks(partnerId: number, options: UseWebhooksOptions = {}) {
    const {
        webhooksPage = 1,
        webhooksPageSize = 10,
        logsPage = 1,
        logsPageSize = 10,
        enabled = true,
        staleTime = 5 * 60 * 1000, // 5 minutes
        refetchInterval
    } = options;

    const queryClient = useQueryClient();

    // Fetch webhooks
    const {
        data: webhooks,
        isLoading: webhooksLoading,
        isFetching: webhooksFetching,
        error: webhooksError,
        refetch: refetchWebhooks
    } = useQuery({
        queryKey: webhookKeys.list(partnerId, webhooksPage, webhooksPageSize),
        queryFn: () => listWebhooks(partnerId, { page: webhooksPage, pageSize: webhooksPageSize }),
        enabled,
        staleTime,
        refetchInterval
    });

    // Fetch API key
    const {
        data: apiKey,
        isLoading: apiKeyLoading,
        refetch: refetchApiKey
    } = useQuery({
        queryKey: webhookKeys.apiKey(partnerId),
        queryFn: () => getWebhookKey(partnerId),
        enabled,
        staleTime
    });

    // Fetch logs
    const {
        data: logs,
        isLoading: logsLoading,
        isFetching: logsFetching,
        error: logsError,
        refetch: refetchLogs
    } = useQuery({
        queryKey: webhookKeys.logs(partnerId, logsPage, logsPageSize),
        queryFn: () => getAllWebhookLogs(partnerId, { page: logsPage, pageSize: logsPageSize }),
        enabled,
        staleTime,
        refetchInterval
    });

    // Create webhook mutation
    const createWebhookMutation = useMutation({
        mutationFn: (dto: CreateWebhookRequest) => createNewWebhook(partnerId, dto),
        onSuccess: () => {
            // Invalidate all webhook lists
            queryClient.invalidateQueries({ queryKey: webhookKeys.lists(partnerId) });
        }
    });

    // Update webhook mutation
    const updateWebhookMutation = useMutation({
        mutationFn: ({ webhookId, dto }: { webhookId: number; dto: UpdateWebhookRequest }) =>
            updateCall(webhookId, partnerId, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: webhookKeys.lists(partnerId) });
        }
    });

    // Delete webhook mutation
    const deleteWebhookMutation = useMutation({
        mutationFn: (webhookId: number) => deleteCall(partnerId, webhookId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: webhookKeys.lists(partnerId) });
        }
    });

    // Test webhook mutation
    const testWebhookMutation = useMutation({
        mutationFn: (webhookId: number) => testCall(partnerId, webhookId),
        onSuccess: () => {
            // Invalidate logs after testing
            queryClient.invalidateQueries({
                queryKey: webhookKeys.all(partnerId),
                predicate: (query) => query.queryKey.includes('logs')
            });
        }
    });

    // Retry log mutation
    const retryLogMutation = useMutation({
        mutationFn: (logId: number) => retryLogCall(partnerId, logId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: webhookKeys.all(partnerId),
                predicate: (query) => query.queryKey.includes('logs')
            });
        }
    });

    // Generate API key mutation
    const generateApiKeyMutation = useMutation({
        mutationFn: () => generateWebhookKey(partnerId),
        onSuccess: (newKey) => {
            // Update the cache with new key
            queryClient.setQueryData(webhookKeys.apiKey(partnerId), newKey);
        }
    });

    // Helper function to fetch webhooks with custom pagination
    const fetchWebhooks = async (page?: number, pageSize?: number) => {
        const result = await queryClient.fetchQuery({
            queryKey: webhookKeys.list(partnerId, page ?? webhooksPage, pageSize ?? webhooksPageSize),
            queryFn: () => listWebhooks(partnerId, {
                page: page ?? webhooksPage,
                pageSize: pageSize ?? webhooksPageSize
            })
        });
        return result;
    };

    // Helper function to fetch logs with custom pagination
    const fetchLogs = async (page?: number, pageSize?: number) => {
        const result = await queryClient.fetchQuery({
            queryKey: webhookKeys.logs(partnerId, page ?? logsPage, pageSize ?? logsPageSize),
            queryFn: () => getAllWebhookLogs(partnerId, {
                page: page ?? logsPage,
                pageSize: pageSize ?? logsPageSize
            })
        });
        return result;
    };

    // Helper to invalidate all webhook-related queries
    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: webhookKeys.all(partnerId) });
    };

    const loading = webhooksLoading || apiKeyLoading || logsLoading;
    const isFetching = webhooksFetching || logsFetching;
    const error = webhooksError || logsError;

    return {
        // Data
        webhooks,
        apiKey,
        logs,

        // Loading states
        loading,
        isFetching,
        webhooksLoading,
        logsLoading,
        apiKeyLoading,

        // Error states
        error,
        webhooksError,
        logsError,

        // Refetch functions
        refetch: () => {
            refetchWebhooks();
            refetchLogs();
        },
        refetchWebhooks,
        refetchLogs,
        refetchApiKey,

        // Fetch functions with custom params
        fetchWebhooks,
        fetchLogs,

        // Mutations
        createWebhook: createWebhookMutation.mutateAsync,
        updateWebhook: (webhookId: number, dto: UpdateWebhookRequest) =>
            updateWebhookMutation.mutateAsync({ webhookId, dto }),
        deleteWebhook: deleteWebhookMutation.mutateAsync,
        testWebhook: testWebhookMutation.mutateAsync,
        retryLog: retryLogMutation.mutateAsync,
        generateApiKey: async (afterGenerate?: (key: string) => void) => {
            const key = await generateApiKeyMutation.mutateAsync();
            if (afterGenerate) afterGenerate(key);
            return key;
        },

        // Mutation states
        isCreating: createWebhookMutation.isPending,
        isUpdating: updateWebhookMutation.isPending,
        isDeleting: deleteWebhookMutation.isPending,
        isTesting: testWebhookMutation.isPending,
        isRetrying: retryLogMutation.isPending,
        isGenerating: generateApiKeyMutation.isPending,

        // Utilities
        invalidateAll,
        fetchApiKey: refetchApiKey
    };
}
