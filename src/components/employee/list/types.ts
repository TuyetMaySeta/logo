export interface CVData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  skills: string[];
  status: "pending" | "approved" | "rejected" | "interviewing";
  appliedDate: string;
  education: string;
  location: string;
  avatar?: string;
  salary?: string;
  rating?: number;
}

export type StatusKey = CVData["status"];

export const statusConfig: Record<StatusKey, { variant: string; color: string }> = {
  pending: {
    variant: "secondary",
    color: "bg-yellow-100 text-yellow-800",
  },
  approved: {
    variant: "default",
    color: "bg-green-100 text-green-800",
  },
  rejected: {
    variant: "destructive",
    color: "bg-red-100 text-red-800",
  },
  interviewing: {
    variant: "outline",
    color: "bg-blue-100 text-blue-800",
  },
};
