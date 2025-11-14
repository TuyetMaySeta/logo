import React, { useEffect, useState } from "react";
import { Mail, Phone, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Employee } from "@/types/employee";
import emsClient from "@/service/emsClient";
import UserAvatar from "./list/Avartar";

interface EmployeeProfileProps {
  employee: Employee;
}

const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employee }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  useEffect(() => {
    const loadAvatar = async () => {
      if (employee.avatar_path && !employee.avatar_url) {
        try {
          const response = await emsClient.get(
            `/media/?path=${employee.avatar_path}`
          );
          setAvatarUrl(response.data.media_url);
        } catch (error) {
          console.error("Failed to load avatar:", error);
        }
      }
    };
    loadAvatar();
  }, [employee.avatar_path, employee.avatar_url]);

  return (
    <Card>
      <CardHeader className="text-center pb-4">
        <UserAvatar
          name={employee.full_name}
          avatarUrl={employee.avatar_url || avatarUrl}
          size={80}
          className="mx-auto mb-4"
        />
        <CardTitle className="text-xl">{employee.full_name}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {employee.current_position}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{employee.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>{employee.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{employee.join_date}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span>ID: {employee.id}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeProfile;
