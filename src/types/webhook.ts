export type Webhook = {
    id: number;
    name: string;
    url: string;
    event: string;
    is_active: boolean;
};

export type Key = {
    target_id: number;
    type: "webhook" | "api";
    partner_id: number;

    name: string;
    value?: string;
};

export type Log = {
    id: number;
    webhook_id: number;
    event: string;
    timestamp: string;
    response_status: number;
    duration: string;
    payload: Record<string, any>;
    response_body: string;
};
// types.ts - Centralized type definitions

export interface Section {
  id: string;
  title: string;
  icon: any;
  subsections?: Subsection[];
}

export interface Subsection {
  id: string;
  title: string;
}

export interface CodeExample {
  id: string;
  code: string;
  language?: string;
}

export interface TableRow {
  [key: string]: string | React.ReactNode;
}
