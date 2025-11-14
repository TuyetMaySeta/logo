"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, GitCompare } from "lucide-react";
import { useProfileComparison } from "@/hooks/useProfileComparison";
import { useState } from "react";
import {
  BasicInfoSection,
  DocumentSection,
  EducationSection,
  LanguagesSection,
  TechnicalSkillsSection,
  CertificationsSection,
  ProjectsSection,
  ContactsSection,
  ChildrenSection,
  ProfileInfoSection,
} from "../comparison/ComparisonSections";
import { LoadingState } from "@/components/common/Loading";

interface ProfileComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: number;
  onSuccess?: () => void;
  onApprove?: () => void;
  onReject?: (comment?: string) => void;
}

export function ProfileComparisonDialog({
  open,
  onOpenChange,
  employeeId,
  onSuccess,
  onApprove,
  onReject,
}: ProfileComparisonDialogProps) {
  const { originalProfile, draftProfile, isLoading } =
    useProfileComparison(employeeId);

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectComment, setRejectComment] = useState("");

  const onApproveClick = () => {
    onApprove?.();
    onSuccess?.();
    onOpenChange(false);
  };

  const onRejectClick = () => {
    setShowRejectDialog(true);
  };

  const onConfirmReject = () => {
    onReject?.(rejectComment);
    onSuccess?.();
    setShowRejectDialog(false);
    setRejectComment("");
    onOpenChange(false);
  };

  const onCancelReject = () => {
    setShowRejectDialog(false);
    setRejectComment("");
  };

  if (isLoading || !originalProfile || !draftProfile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl">
          <div className="flex items-center justify-center p-8">
            <LoadingState />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-primary">
              <GitCompare className="w-6 h-6 text-chart-1" />
              All profile changes - {originalProfile.full_name} -{" "}
              {originalProfile.email}
            </DialogTitle>
            <DialogDescription>
              Review all detected changes{" "}
              {/* <span className="font-semibold text-chart-1">
                {totalChanges} items
              </span> */}
            </DialogDescription>
          </DialogHeader>

          {/* Table of changes */}
          <div className="flex-1 overflow-y-auto">
            <div className="bg-card rounded-lg border">
              <div className="grid grid-cols-2 gap-4 p-4 border-b bg-muted/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-chart-1"></div>
                  <span className="font-semibold text-sm">Original</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="font-semibold text-sm">Modified</span>
                </div>
              </div>

              <div className="p-4 space-y-6">
                <BasicInfoSection
                  original={originalProfile}
                  draft={draftProfile}
                />
                <DocumentSection
                  original={originalProfile}
                  draft={draftProfile}
                />
                <EducationSection
                  original={originalProfile}
                  draft={draftProfile}
                />
                <LanguagesSection
                  original={originalProfile}
                  draft={draftProfile}
                />
                <TechnicalSkillsSection
                  original={originalProfile}
                  draft={draftProfile}
                />
                <CertificationsSection
                  original={originalProfile}
                  draft={draftProfile}
                />
                <ProjectsSection
                  original={originalProfile}
                  draft={draftProfile}
                />
                <ContactsSection
                  original={originalProfile}
                  draft={draftProfile}
                />
                <ChildrenSection
                  original={originalProfile}
                  draft={draftProfile}
                />
                <ProfileInfoSection
                  original={originalProfile}
                  draft={draftProfile}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 border-t pt-4 sticky bottom bg-background flex-shrink-0">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              variant="destructive"
              className="gap-2 bg-chart-1"
              onClick={onRejectClick}
              disabled={isLoading}
            >
              <XCircle className="w-4 h-4" />
              Reject Changes
            </Button>
            <Button
              className="gap-2 bg-success hover:bg-success/90"
              onClick={onApproveClick}
              disabled={isLoading}
            >
              <CheckCircle className="w-4 h-4" />
              Approve Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="w-5 h-5" />
              Reject Profile Changes
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting these changes. This will
              help the employee understand what needs to be corrected.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="reject-comment">Reason for rejection</Label>
            <Textarea
              id="reject-comment"
              placeholder="Enter your reason here..."
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onCancelReject}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirmReject}
              className="gap-2"
            >
              <XCircle className="w-4 h-4" />
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
