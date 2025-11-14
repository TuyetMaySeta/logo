import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { ZoomIn, ZoomOut, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import type { Employee } from "@/types/employee";
import { uploadAvatar } from "@/service/mediaService";
import { fetchCurrentUserProfile } from "@/service/employeeService";
import useAuthStore from "@/stores/authStore";

interface AvatarCropModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  employee: Employee;
  onAvatarUpdate: (updatedEmployee: Employee) => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const AvatarCropModal: React.FC<AvatarCropModalProps> = ({
  open,
  onOpenChange,
  imageSrc,
  onAvatarUpdate,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const { reloadUser } = useAuthStore();

  const onCropAreaChange = useCallback(
    (_croppedArea: CropArea, croppedAreaPixels: CropArea) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleApplyCrop = async () => {
    if (!croppedAreaPixels || isUploading) return;

    try {
      setIsUploading(true);

      // Step 1: Crop image
      const croppedBlob = await getCroppedImage(imageSrc, croppedAreaPixels);

      // Step 2: Upload to server
      const file = new File([croppedBlob], `avatar-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      await uploadAvatar(file);

      // Step 4: Fetch updated employee data
      const employeeResponse = await fetchCurrentUserProfile();
      onAvatarUpdate(employeeResponse);

      await reloadUser();

      toast.success("Avatar updated successfully!");
      onOpenChange(false);

      // Reset states
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    if (isUploading) return;
    onOpenChange(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  return (
    <Dialog open={open} onOpenChange={isUploading ? undefined : onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Upload New Profile Photo</DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-[400px] bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropAreaChange={onCropAreaChange}
          />
        </div>

        <div className="px-6 py-4 space-y-4 border-t">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Zoom</span>
              <span className="font-medium">{zoom.toFixed(1)}x</span>
            </div>
            <div className="flex items-center gap-3">
              <ZoomOut className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(value) => setZoom(value[0])}
                className="flex-1"
                disabled={isUploading}
              />
              <ZoomIn className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApplyCrop}
              className="flex-1"
              disabled={isUploading || !croppedAreaPixels}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Apply & Upload"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const getCroppedImage = (
  imageSrc: string,
  croppedAreaPixels: CropArea
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob"));
          }
        },
        "image/jpeg",
        0.9
      );
    };
    image.onerror = () => reject(new Error("Failed to load image"));
  });
};
