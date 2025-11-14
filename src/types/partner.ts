interface Employee {
    id: number;
    full_name: string;
    email: string;
}

export interface Partner {
    id: number;
    name: string;
    access_employees: Employee[];
}

export interface PartnersResponse {
    partners: Partner[];
}

export interface SearchEmployee {
    id: number;
    name: string;
    email: string;
}