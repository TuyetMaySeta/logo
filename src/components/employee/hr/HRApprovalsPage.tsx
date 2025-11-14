import { Card, CardContent } from "@/components/ui/card";
import BaseTable from "@/components/common/BaseTable";
import { useHRApprovals } from "@/hooks/useHRApprovals";
import { createDraftProfileColumns } from "./DraftProfileColumns";
// import { ProfileChangesDialog } from "./ProfileChangeDialog";
import { ProfileComparisonDialog } from "./ProfileComparisonDialog";

const HRApprovalsPage = () => {
  const {
    draftProfiles,
    totalCount,
    selectedProfile,
    isViewDialogOpen,
    isLoading,
    tableState,
    setTableState,
    setIsViewDialogOpen,
    handleViewProfile,
    handleApproveProfile,
    handleRejectProfile,
  } = useHRApprovals();

  const columns = createDraftProfileColumns();

  return (
    <div className="w-full">
      <div className=" max-w-full w-full space-y-6 p-7 flex flex-col">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2 text-primary">
            Profile Change Approvals
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and approve or reject employee profile update requests
          </p>
        </div>

        {/* Draft Profiles Table */}
        <Card className=" w-full">
          <CardContent>
            <BaseTable
              data={draftProfiles}
              columns={columns}
              count={totalCount}
              isLoading={isLoading}
              tableState={tableState}
              onTableStateChange={setTableState}
              onRowClick={handleViewProfile}
            />
          </CardContent>
        </Card>
      </div>

      {selectedProfile && (
        <ProfileComparisonDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          employeeId={selectedProfile.id}
          onSuccess={() => {
            setIsViewDialogOpen(false);
          }}
          onApprove={async () => {
            await handleApproveProfile(selectedProfile.id);
          }}
          onReject={async (comment) => {
            await handleRejectProfile(selectedProfile.id, comment);
          }}
        />
      )}
    </div>
  );
};
export default HRApprovalsPage;
