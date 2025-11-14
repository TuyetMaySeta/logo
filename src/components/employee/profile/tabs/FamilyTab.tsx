import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface FamilyTabProps {
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

export function FamilyTab({
  formData,
  handleArrayItemChange,
  handleAddArrayItem,
  handleRemoveArrayItem,
  isHRView,
}: FamilyTabProps) {
  return (
    <TabsContent value="family" className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Children</h3>
            {!isHRView && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  handleAddArrayItem("children", {
                    employee_id: formData.id,
                    full_name: "",
                    date_of_birth: "",
                  })
                }
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Child
              </Button>
            )}
          </div>
          {formData.children?.map((child: any, index: number) => (
            <div key={child.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Child #{index + 1}</h4>
                {!isHRView && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveArrayItem("children", index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={child.full_name}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "children",
                        index,
                        "full_name",
                        e.target.value
                      )
                    }
                    disabled={isHRView}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={child.date_of_birth}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "children",
                        index,
                        "date_of_birth",
                        e.target.value
                      )
                    }
                    disabled={isHRView}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-4">
            <h3 className="font-semibold">Emergency Contacts</h3>
            {!isHRView && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  handleAddArrayItem("contacts", {
                    employee_id: formData.id,
                    name: "",
                    relation: "",
                    phone: "",
                  })
                }
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Contact
              </Button>
            )}
          </div>
          {formData.contacts?.map((contact: any, index: number) => (
            <div key={contact.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Contact #{index + 1}</h4>
                {!isHRView && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveArrayItem("contacts", index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={contact.name}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "contacts",
                        index,
                        "name",
                        e.target.value
                      )
                    }
                    disabled={isHRView}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Relation</Label>
                  <Input
                    value={contact.relation}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "contacts",
                        index,
                        "relation",
                        e.target.value
                      )
                    }
                    disabled={isHRView}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Phone</Label>
                  <Input
                    value={contact.phone}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "contacts",
                        index,
                        "phone",
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