import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AvatarCropModal } from "@/components/employee/profile/AvatarCropModal";
import { Mail, Phone, MapPin, LinkIcon } from "lucide-react";
import type { Employee } from "@/types/employee";
import useAuthStore from "@/stores/authStore";

interface AvatarBasicInfoProps {
  employee: Employee;
  onAvatarUpdate?: (updatedEmployee: Employee) => void;
  editable?: boolean;
  className?: string;
  showStats?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

export function AvatarBasicInfo({
  employee,
  onAvatarUpdate,
  editable = false,
  className,
  showStats = true,
}: AvatarBasicInfoProps) {
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>("");
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const { updateUser } = useAuthStore();

  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | undefined>(
    employee.avatar_url || undefined
  );
  useEffect(() => {
    setCurrentAvatarUrl(employee.avatar_url || undefined);
  }, [employee.avatar_url]);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Please select a valid image file (JPEG, PNG, GIF, or WebP)";
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 5MB limit`;
    }
    return null;
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAvatarClick = () => {
    if (!editable) return;
    avatarFileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      toast.error(error);
      if (avatarFileInputRef.current) avatarFileInputRef.current.value = "";
      return;
    }

    try {
      const dataUrl = await readFileAsDataURL(file);
      setSelectedImageSrc(dataUrl);
      setCropModalOpen(true); // Mở modal crop
    } catch {
      toast.error("Failed to load image");
      if (avatarFileInputRef.current) avatarFileInputRef.current.value = "";
    }
  };

  const handleAvatarUpdate = (updatedEmployee: Employee) => {
    onAvatarUpdate?.(updatedEmployee);
    if (updatedEmployee.avatar_url) {
      updateUser({ avatar_url: updatedEmployee.avatar_url });
      setCurrentAvatarUrl(updatedEmployee.avatar_url);
    }

    if (avatarFileInputRef.current) avatarFileInputRef.current.value = "";
  };

  return (
    <>
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            {/* Avatar with Upload Trigger */}
            <div
              className={cn(
                "relative inline-block mb-4",
                editable && "cursor-pointer"
              )}
              onMouseEnter={() => editable && setIsAvatarHovered(true)}
              onMouseLeave={() => editable && setIsAvatarHovered(false)}
            >
              {/* Avatar */}
              <Avatar
                className={cn("w-32 h-32", editable && "cursor-pointer")}
                onClick={handleAvatarClick}
              >
                <AvatarImage
                  src={currentAvatarUrl}
                  alt={employee.full_name}
                  key={currentAvatarUrl}
                />
                <AvatarFallback className="text-3xl">
                  {employee.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              {/* Hover Overlay - chỉ hiện khi editable */}
              {editable && (
                <div
                  className={cn(
                    "absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center transition-opacity cursor-pointer",
                    isAvatarHovered ? "opacity-100" : "opacity-0"
                  )}
                  onClick={handleAvatarClick}
                >
                  <Camera className="h-8 w-8 text-white mb-1" />
                  <span className="text-xs text-white font-medium">
                    Change Photo
                  </span>
                </div>
              )}

              {/* Edit Icon Badge - chỉ hiện khi editable */}
              {editable && (
                <div
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 shadow-lg cursor-pointer hover:bg-primary/90 transition-colors border-2 border-background"
                  onClick={handleAvatarClick}
                >
                  <Pencil className="h-4 w-4" />
                </div>
              )}
            </div>

            {/* Hidden File Input - chỉ hiện khi editable */}
            {editable && (
              <input
                ref={avatarFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                aria-label="Upload avatar"
              />
            )}

            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold">{employee.full_name}</h2>
            </div>

            <p className="text-muted-foreground mb-4">
              {employee.current_position}
            </p>

            {/* Employee ID - hiển thị ngay sau position */}
            <div className="text-primary mb-4">Employee ID: {employee.id}</div>

            {/* Summary */}
            {employee.summary && (
              <p className="text-sm text-muted-foreground mb-6 text-left w-full px-2">
                {employee.summary}
              </p>
            )}

            {/* Stats - chỉ hiện khi showStats = true */}
            {showStats && (
              <div className="grid grid-cols-3 gap-4 w-full mb-6 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {employee.projects?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </div>
                <div className="text-center border-x">
                  <div className="text-2xl font-bold">
                    {employee.technical_skills?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Skills</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {employee.contacts?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Contacts</div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Info */}

          <div className="w-full space-y-3 text-left">
            <div className="w-full space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Work Email
                  </span>
                  <span className="text-foreground break-all">
                    {employee.email}
                  </span>
                </div>
              </div>
              {employee.personal_email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      Personal Email
                    </span>
                    <span className="text-foreground break-all">
                      {employee.personal_email}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{employee.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">
                  {employee.current_address}
                </span>
              </div>
              {employee.profile?.facebook_link && (
                <div className="flex items-center gap-3 text-sm">
                  <LinkIcon className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={employee.profile.facebook_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate"
                  >
                    Facebook Profile
                  </a>
                </div>
              )}
              {employee.profile?.linkedin_link && (
                <div className="flex items-center gap-3 text-sm">
                  <LinkIcon className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={employee.profile.linkedin_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avatar Crop Modal - chỉ hiện khi editable và có onAvatarUpdate */}
      {editable && (
        <AvatarCropModal
          open={cropModalOpen}
          onOpenChange={setCropModalOpen}
          imageSrc={selectedImageSrc}
          employee={employee}
          onAvatarUpdate={handleAvatarUpdate}
        />
      )}
    </>
  );
}
