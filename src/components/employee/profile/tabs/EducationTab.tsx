import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface EducationTabProps {
  formData: any;
  handleArrayItemChange: (
    arrayName: string,
    index: number,
    field: string,
    value: string | number
  ) => void;
  handleAddArrayItem: (
    arrayName: string,
    template: Record<string, unknown>
  ) => void;
  handleRemoveArrayItem: (arrayName: string, index: number) => void;
  isHRView: boolean;
}

export function EducationTab({
  formData,
  handleArrayItemChange,
  handleAddArrayItem,
  handleRemoveArrayItem,
  isHRView,
}: EducationTabProps) {
  return (
    <TabsContent value="education" className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Education</h3>
            {!isHRView && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  handleAddArrayItem("educations", {
                    employee_id: formData.id,
                    school_name: "",
                    graduation_year: new Date().getFullYear(),
                    degree: "",
                    major: "",
                  })
                }
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Education
              </Button>
            )}
          </div>
          {formData.educations?.map((edu: any, index: number) => (
            <div key={edu.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Education #{index + 1}</h4>
                {!isHRView && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveArrayItem("educations", index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>School Name</Label>
                  <Input
                    value={edu.school_name}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "educations",
                        index,
                        "school_name",
                        e.target.value
                      )
                    }
                    disabled={isHRView}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "educations",
                        index,
                        "degree",
                        e.target.value
                      )
                    }
                    disabled={isHRView}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Major</Label>
                  <Input
                    value={edu.major}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "educations",
                        index,
                        "major",
                        e.target.value
                      )
                    }
                    disabled={isHRView}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Graduation Year</Label>
                  <Input
                    type="number"
                    value={edu.graduation_year}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "educations",
                        index,
                        "graduation_year",
                        Number.parseInt(e.target.value)
                      )
                    }
                    disabled={isHRView}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-4">
            <h3 className="font-semibold">Certifications</h3>
            {!isHRView && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  handleAddArrayItem("certifications", {
                    employee_id: formData.id,
                    certificate_name: "",
                    issued_by: "",
                    issued_date: "",
                    expiry_date: "",
                  })
                }
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Certification
              </Button>
            )}
          </div>
          {formData.certifications?.map((cert: any, index: number) => (
            <div key={cert.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Certification #{index + 1}</h4>
                {!isHRView && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      handleRemoveArrayItem("certifications", index)
                    }
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Certificate Name</Label>
                  <Input
                    value={cert.certificate_name}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "certifications",
                        index,
                        "certificate_name",
                        e.target.value
                      )
                    }
                    disabled={isHRView}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Issued By</Label>
                  <Input
                    value={cert.issued_by}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "certifications",
                        index,
                        "issued_by",
                        e.target.value
                      )
                    }
                    disabled={isHRView}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Issued Date</Label>
                  <Input
                    type="date"
                    value={cert.issued_date}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "certifications",
                        index,
                        "issued_date",
                        e.target.value
                      )
                    }
                    disabled={isHRView}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Input
                    type="date"
                    value={cert.expiry_date}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "certifications",
                        index,
                        "expiry_date",
                        e.target.value
                      )
                    }
                    disabled={isHRView}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </TabsContent>
  );
}