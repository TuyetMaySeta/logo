import { Book, CheckCircle, Webhook } from "lucide-react";
import type { Section } from "../webhook";


export const SECTIONS: Section[] = [
  {
    id: "overview",
    title: "Introduction",
    icon: Book,
    subsections: [
      { id: "what-is-webhook", title: "Overview" },
      { id: "delivery", title: "Delivery & Headers" },
      { id: "security", title: "Security" },
      { id: "response", title: "Server Response" },
    ],
  },
  {
    id: "event-payload",
    title: "Events & payloads",
    icon: CheckCircle,
    subsections: [{ id: "employee-create", title: "Employee Create" }],
  },
  {
    id: "webhook",
    title: "Using Webhooks",
    icon: Webhook,
    subsections: [
      { id: "create-webhook", title: "Create Webhooks" },
      { id: "edit-webhook", title: "Edit Webhooks" },
      { id: "delete-webhook", title: "Delete Webhooks" },
      { id: "disable-webhook", title: "Disable Webhooks" },
      { id: "testing-webhook", title: "Testing Webhooks" },
      {
        id: "handling-failed-webhook-deliveries",
        title: "Handling failed deliveries",
      },
    ],
  },
];

export const HTTP_HEADERS = [
  ["Content-Type", "Always application/json"],
  ["X-API-KEY", "A unique API key provided to authenticate requests from the webhook sender. "],
  ["X-Timestamp", "ISO 8601 timestamp of when the webhook was sent"],
];

export const PAYLOAD_FIELDS = [
  ["employee_id", "int", "❌", "Unique ID of the employee in EMS"],
  ["full_name", "string", "❌", "Full name of the employee"],
  ["personal_email", "string", "✅", "Personal email address"],
  ["email", "string", "❌", "Company (SETA) email address"],
  ["phone", "string", "❌", "Personal phone number"],
  ["gender", "string", "❌", "Gender of the employee (Male / Female)"],
  ["date_of_birth", "date", "❌", "Date of birth (ISO format)"],
  ["marital_status", "string", "✅", "Marital status (Single, Married, etc.)"],
  ["join_date", "date", "❌", "Employee start date"],
  ["current_position", "string", "❌", "Current job title or position"],
];

export const RESPONSE_STATUSES = [
  ["200 OK", "Successfully received and processed the webhook"],
  ["400 Bad Request", "Invalid or malformed payload"],
  ["401 Unauthorized", "Signature or authentication failed"],
  ["500 Internal Server Error", "Internal processing error"],
];

export const WORKFLOW_STEPS = [
  "An event occurs in the EMS system (e.g., a new employee is created). The EMS system constructs a payload containing event details in JSON format.",
  "The payload is sent to your configured webhook endpoint via an HTTP POST request.",
  "Your application receives, validates, and processes the payload.",
  "The server returns a 200 OK response to acknowledge successful receipt.",
];

export const SAMPLE_PAYLOAD = {
  
    "event": "employee_created",
    "data": {
      "employee_id": 1212,
      "full_name": "truong",
      "personal_email": null,
      "email": "truong.truong@seta-international.vn",
      "phone": "0987654321",
      "gender": "Male",
      "date_of_birth": "2025-11-03",
      "marital_status": "Single",
      "join_date": "2025-11-07",
      "current_position": "Test"
    }
  
};

export const IMAGES = {
  webhookIntegration: "https://raw.githubusercontent.com/TuyetMaySeta/API_blog/refs/heads/main/anh1.png",
  addWebhook: "https://raw.githubusercontent.com/TuyetMaySeta/API_blog/refs/heads/main/hinh2.png",
  configureWebhook: "https://raw.githubusercontent.com/TuyetMaySeta/otp_mail/refs/heads/main/anhah.png",
  editWebhook: "https://raw.githubusercontent.com/TuyetMaySeta/API_blog/refs/heads/main/hinh5.png",
  updateForm: "https://raw.githubusercontent.com/TuyetMaySeta/API_blog/refs/heads/main/hinh6.png",
  deleteWebhook: "https://raw.githubusercontent.com/TuyetMaySeta/API_blog/refs/heads/main/hinh7.png",
  toggleStatus: "https://raw.githubusercontent.com/TuyetMaySeta/API_blog/refs/heads/main/hinh8.png",
  testWebhook: "https://raw.githubusercontent.com/TuyetMaySeta/API_blog/refs/heads/main/hinh9.png",
  deliveryLog: "https://raw.githubusercontent.com/TuyetMaySeta/API_blog/refs/heads/main/hinh10.png",
  failureDetails: "https://raw.githubusercontent.com/TuyetMaySeta/API_blog/refs/heads/main/hinh11.png",
};