import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Employee } from "@/types/employee";

interface DocumentTabProps {
  formData: Employee;
  handleNestedChange: (parent: string, field: string, value: string) => void;
  isHRView: boolean;
}

export function DocumentTab({
  formData,
  handleNestedChange,
  isHRView,
}: DocumentTabProps) {
  // Safe access to document - handle both object and array structures
  

  return (
    <TabsContent value="document" className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-semibold">Identity document</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="identity_number">Identity Number</Label>
              <Input
                id="identity_number"
                value={formData.document?.identity_number || ""}
                onChange={(e) =>
                  handleNestedChange("document", "identity_number", e.target.value)
                }
                disabled={isHRView}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="identity_date">Identity Issue Date</Label>
              <Input
                id="identity_date"
                type="date"
                value={formData.document?.identity_date || ""}
                onChange={(e) =>
                  handleNestedChange("document", "identity_date", e.target.value)
                }
                disabled={isHRView}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="identity_place">Identity Issue Place</Label>
              <Input
                id="identity_place"
                value={formData.document?.identity_place || ""}
                onChange={(e) =>
                  handleNestedChange("document", "identity_place", e.target.value)
                }
                disabled={isHRView}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="old_identity_number">Old Identity Number</Label>
              <Input
                id="old_identity_number"
                value={formData.document?.old_identity_number || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "document",
                    "old_identity_number",
                    e.target.value
                  )
                }
                disabled={isHRView}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="old_identity_date">Old Identity Issue Date</Label>
              <Input
                id="old_identity_date"
                type="date"
                value={formData.document?.old_identity_date || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "document",
                    "old_identity_date",
                    e.target.value
                  )
                }
                disabled={isHRView}
              />
            </div>
          </div>

          <h3 className="font-semibold pt-4">Tax & Insurance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tax_id_number">Tax ID Number</Label>
              <Input
                id="tax_id_number"
                value={formData.document?.tax_id_number || ""}
                onChange={(e) =>
                  handleNestedChange("document", "tax_id_number", e.target.value)
                }
                disabled={isHRView}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social_insurance_number">
                Social Insurance Number
              </Label>
              <Input
                id="social_insurance_number"
                value={formData.document?.social_insurance_number || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "document",
                    "social_insurance_number",
                    e.target.value
                  )
                }
                disabled={isHRView}
              />
            </div>
          </div>

          <h3 className="font-semibold pt-4">Bank Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bank_name">Bank Name</Label>
              <Input
                id="bank_name"
                value={formData.document?.bank_name || ""}
                onChange={(e) =>
                  handleNestedChange("document", "bank_name", e.target.value)
                }
                disabled={isHRView}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch_name">Branch Name</Label>
              <Input
                id="branch_name"
                value={formData.document?.branch_name || ""}
                onChange={(e) =>
                  handleNestedChange("document", "branch_name", e.target.value)
                }
                disabled={isHRView}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="account_bank_number">Account Number</Label>
              <Input
                id="account_bank_number"
                value={formData.document?.account_bank_number || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "document",
                    "account_bank_number",
                    e.target.value
                  )
                }
                disabled={isHRView}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motorbike_plate">Motorbike Plate</Label>
              <Input
                id="motorbike_plate"
                value={formData.document?.motorbike_plate || ""}
                onChange={(e) =>
                  handleNestedChange("document", "motorbike_plate", e.target.value)
                }
                disabled={isHRView}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}