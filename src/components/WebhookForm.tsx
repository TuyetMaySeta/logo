import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Webhook, Plus, Trash2, Activity, CheckCircle, XCircle, Eye } from 'lucide-react';


interface WebhookFormData {
    name: string;
    url: string;
    events: string[];
    secret: string;
}

interface WebhookItem extends WebhookFormData {
    id: number;
    createdAt: string;
}

interface WebhookLog {
    id: number;
    webhookId: number;
    webhookName: string;
    event: string;
    status: 'success' | 'failed';
    statusCode: number;
    timestamp: string;
    requestBody: object;
    responseBody: string;
    duration: number;
}

interface AlertState {
    type: 'success' | 'error';
    message: string;
}

export default function WebhookRegistration() {
    const [webhooks, setWebhooks] = useState<WebhookItem[]>([]);
    const [logs, setLogs] = useState<WebhookLog[]>([]);
    const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
    const [formData, setFormData] = useState<WebhookFormData>({
        name: '',
        url: '',
        events: [],
        secret: ''
    });
    const [alert, setAlert] = useState<AlertState | null>(null);

    const availableEvents: string[] = [
        'user.created',
        'user.updated',
        'user.deleted',
        'payment.success',
        'payment.failed',
        'order.created',
        'order.completed',
        'order.cancelled'
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEventToggle = (event: string) => {
        setFormData(prev => ({
            ...prev,
            events: prev.events.includes(event)
                ? prev.events.filter(e => e !== event)
                : [...prev.events, event]
        }));
    };

    const generateSecret = () => {
        const secret = 'whsec_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        setFormData(prev => ({ ...prev, secret }));
    };

    const simulateWebhookCall = (webhook: WebhookItem) => {
        const randomEvent = webhook.events[Math.floor(Math.random() * webhook.events.length)];
        const isSuccess = Math.random() > 0.3;

        const newLog: WebhookLog = {
            id: Date.now(),
            webhookId: webhook.id,
            webhookName: webhook.name,
            event: randomEvent,
            status: isSuccess ? 'success' : 'failed',
            statusCode: isSuccess ? 200 : Math.random() > 0.5 ? 500 : 404,
            timestamp: new Date().toISOString(),
            requestBody: {
                event: randomEvent,
                data: {
                    id: Math.floor(Math.random() * 10000),
                    timestamp: new Date().toISOString()
                }
            },
            responseBody: isSuccess ? 'OK' : 'Internal Server Error',
            duration: Math.floor(Math.random() * 500) + 50
        };

        setLogs(prev => [newLog, ...prev]);
        setAlert({
            type: isSuccess ? 'success' : 'error',
            message: `Webhook ${webhook.name}: ${isSuccess ? 'Thành công' : 'Thất bại'}`
        });
        setTimeout(() => setAlert(null), 3000);
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.url || formData.events.length === 0) {
            setAlert({ type: 'error', message: 'Vui lòng điền đầy đủ thông tin và chọn ít nhất một sự kiện' });
            return;
        }

        const newWebhook: WebhookItem = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString()
        };

        setWebhooks(prev => [...prev, newWebhook]);
        setFormData({ name: '', url: '', events: [], secret: '' });
        setAlert({ type: 'success', message: 'Đăng ký webhook thành công!' });

        setTimeout(() => setAlert(null), 3000);
    };

    const handleDelete = (id: number) => {
        setWebhooks(prev => prev.filter(w => w.id !== id));
        setLogs(prev => prev.filter(log => log.webhookId !== id));
        setAlert({ type: 'success', message: 'Đã xóa webhook' });
        setTimeout(() => setAlert(null), 3000);
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('vi-VN');
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <Webhook className="w-12 h-12 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">Quản Lý Webhook</h1>
                    <p className="text-slate-600">Đăng ký và quản lý các webhook endpoint của bạn</p>
                </div>

                {alert && (
                    <Alert className={`mb-6 ${alert.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        {alert.type === 'success' ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                        <AlertDescription className={alert.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                            {alert.message}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Đăng Ký Webhook Mới
                            </CardTitle>
                            <CardDescription>Thêm một webhook endpoint mới vào hệ thống</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Tên Webhook
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="VD: Production Payment Webhook"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        URL Endpoint
                                    </label>
                                    <input
                                        type="url"
                                        name="url"
                                        value={formData.url}
                                        onChange={handleInputChange}
                                        placeholder="https://api.example.com/webhooks"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Sự Kiện
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {availableEvents.map(event => (
                                            <label key={event} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.events.includes(event)}
                                                    onChange={() => handleEventToggle(event)}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-slate-700">{event}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Secret Key (Tùy chọn)
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            name="secret"
                                            value={formData.secret}
                                            onChange={handleInputChange}
                                            placeholder="Nhập hoặc tạo secret key"
                                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={generateSecret}
                                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition text-sm"
                                        >
                                            Tạo
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Đăng Ký Webhook
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Webhooks Đã Đăng Ký ({webhooks.length})</CardTitle>
                            <CardDescription>Danh sách các webhook endpoint hiện có</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {webhooks.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    <Webhook className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>Chưa có webhook nào được đăng ký</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                                    {webhooks.map(webhook => (
                                        <div key={webhook.id} className="border border-slate-200 rounded-lg p-4 bg-white hover:shadow-md transition">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-slate-800">{webhook.name}</h3>
                                                <button
                                                    onClick={() => handleDelete(webhook.id)}
                                                    className="text-red-500 hover:text-red-700 transition"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-slate-600 mb-2 break-all">{webhook.url}</p>
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {webhook.events.map(event => (
                                                    <span key={event} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                        {event}
                                                    </span>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => simulateWebhookCall(webhook)}
                                                className="w-full text-sm bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
                                            >
                                                Test Webhook
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            Webhook Logs ({logs.length})
                        </CardTitle>
                        <CardDescription>Lịch sử các request webhook</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {logs.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium">Chưa có log nào</p>
                                <p className="text-sm">Test một webhook để xem logs xuất hiện ở đây</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b">
                                        <tr>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Status</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Webhook</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Timestamp</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Duration</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.map((log) => (
                                            <tr key={log.id} className="border-b hover:bg-slate-50 transition">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        {log.status === 'success' ? (
                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                        ) : (
                                                            <XCircle className="w-4 h-4 text-red-500" />
                                                        )}
                                                        <span className={`text-xs px-2 py-1 rounded ${log.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {log.statusCode}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <p className="font-medium text-sm">{log.webhookName}</p>
                                                    <p className="text-xs text-slate-500">{log.event}</p>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-slate-600">
                                                    {formatTimestamp(log.timestamp)}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-slate-600">
                                                    {log.duration}ms
                                                </td>
                                                <td className="py-3 px-4">
                                                    <button
                                                        onClick={() => setSelectedLog(log)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-100 transition"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        Chi tiết
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {selectedLog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedLog(null)}>
                        <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <CardHeader>
                                <CardTitle>Chi Tiết Log</CardTitle>
                                <CardDescription>Thông tin chi tiết về request webhook</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-700 mb-1">Webhook</h3>
                                    <p className="text-sm text-slate-600">{selectedLog.webhookName}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-700 mb-1">Event</h3>
                                    <p className="text-sm text-slate-600">{selectedLog.event}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-700 mb-1">Status</h3>
                                    <div className="flex items-center gap-2">
                                        {selectedLog.status === 'success' ? (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-500" />
                                        )}
                                        <span className="text-sm text-slate-600">{selectedLog.statusCode} - {selectedLog.status}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-700 mb-1">Timestamp</h3>
                                    <p className="text-sm text-slate-600">{formatTimestamp(selectedLog.timestamp)}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-700 mb-1">Duration</h3>
                                    <p className="text-sm text-slate-600">{selectedLog.duration}ms</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-700 mb-1">Request Body</h3>
                                    <pre className="text-xs bg-slate-50 p-3 rounded-lg overflow-x-auto">
                                        {JSON.stringify(selectedLog.requestBody, null, 2)}
                                    </pre>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-700 mb-1">Response</h3>
                                    <pre className="text-xs bg-slate-50 p-3 rounded-lg overflow-x-auto">
                                        {selectedLog.responseBody}
                                    </pre>
                                </div>
                                <button
                                    onClick={() => setSelectedLog(null)}
                                    className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 rounded-lg transition"
                                >
                                    Đóng
                                </button>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}