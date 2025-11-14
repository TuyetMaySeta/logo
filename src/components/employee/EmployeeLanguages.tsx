import React from "react";
import { Languages } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Language } from "@/types/skill";

interface EmployeeLanguagesProps {
  languages: Language[];
}

export const EmployeeLanguages: React.FC<EmployeeLanguagesProps> = ({
  languages,
}) => {
  if (!Array.isArray(languages) || languages.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Languages className="w-5 h-5" />
          Languages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {languages.map((lang: Language) => (
            <div
              key={lang.id}
              className="border rounded-md p-2 space-y-1 text-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium">{lang.language_name}</div>
                <Badge variant="outline" className="text-xs">
                  {lang.proficiency}
                </Badge>
              </div>
              {lang.description && (
                <p className="text-xs text-muted-foreground">
                  {lang.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
