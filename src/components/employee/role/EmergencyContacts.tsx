import React from "react";
import { Users, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EmployeeContact } from "@/types/employee";

interface EmergencyContactsProps {
  contacts: EmployeeContact[];
}

export const EmergencyContacts: React.FC<EmergencyContactsProps> = ({
  contacts,
}) => {
  if (!Array.isArray(contacts) || contacts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5" />
          Emergency Contacts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact: EmployeeContact) => (
            <div key={contact.id} className="border rounded-lg p-4 space-y-2">
              <div className="font-medium">{contact.name}</div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Relation:</span>{" "}
                {contact.relation}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-3 h-3" />
                {contact.phone}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
