import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileText, X, Loader2, Link2, Bot } from "lucide-react";
import { toast } from "sonner";
import emsClient from "@/service/emsClient";

interface ImportCVModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess: (data: any) => void;
}

const modelOptions = [
  {
    value: "gemini-2.5",
    label: "Gemini 2.5",
    description: "Best Performance",
  },
  {
    value: "gemini-2.0",
    label: "Gemini 2.0",
    description: "Good Performance and Fast Response",
  },
  {
    value: "ollama",
    label: "Ollama",
    description: "Local model, stable but slower",
  },
];

export const ImportCVModal = ({
  open,
  onOpenChange,
  onImportSuccess,
}: ImportCVModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [driveUrl, setDriveUrl] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>("gemini-2.5");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");

  const acceptedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  const acceptedExtensions = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];

  const validateFile = (selectedFile: File): boolean => {
    if (!acceptedFileTypes.includes(selectedFile.type)) {
      toast.error("Invalid file type", {
        description: "Please upload PDF, DOC, DOCX, or image files (JPG, PNG)",
      });
      return false;
    }

    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error("File too large", {
        description: "Please upload a file smaller than 10MB",
      });
      return false;
    }

    return true;
  };

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      toast.error("URL required", {
        description: "Please enter a valid Google Drive share link",
      });
      return false;
    }

    // Basic URL validation
    try {
      new URL(url);
      return true;
    } catch {
      toast.error("Invalid URL", {
        description: "Please enter a valid URL",
      });
      return false;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleUploadFile = async () => {
    if (!file) {
      toast.error("No file selected", {
        description: "Please select a CV file to upload",
      });
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading("Analyzing CV...");

    try {
      const formData = new FormData();
      formData.append("cv_file", file);

      const res = await emsClient(`/cvs/upload-file?model=${selectedModel}`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });

      if (res.status < 200 || res.status >= 300) {
        throw new Error(res.data?.message || `HTTP ${res.status}`);
      }

      toast.dismiss(loadingToast);
      toast.success("CV imported successfully!", {
        description: "Employee data has been extracted from the CV",
      });

      onImportSuccess(res.data);
      handleCloseModal();
    } catch (e: unknown) {
      toast.dismiss(loadingToast);
      toast.error("Failed to import CV", {
        description:
          e && typeof e === "object" && "message" in e
            ? (e as { message?: string }).message
            : "An error occurred while processing the CV",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUploadUrl = async () => {
    if (!validateUrl(driveUrl)) {
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading("Analyzing CV from URL...");

    try {
      const res = await emsClient(`/cvs/upload-url?model=${selectedModel}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          cv_url: driveUrl,
        },
      });

      if (res.status < 200 || res.status >= 300) {
        throw new Error(res.data?.message || `HTTP ${res.status}`);
      }

      toast.dismiss(loadingToast);
      toast.success("CV imported successfully!", {
        description: "Employee data has been extracted from the CV",
      });

      onImportSuccess(res.data);
      handleCloseModal();
    } catch (e: unknown) {
      toast.dismiss(loadingToast);
      toast.error("Failed to import CV", {
        description:
          e && typeof e === "object" && "message" in e
            ? (e as { message?: string }).message
            : "An error occurred while processing the CV",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCloseModal = () => {
    if (!uploading) {
      onOpenChange(false);
      setFile(null);
      setDriveUrl("");
      setSelectedModel("gemini-2.5");
      setActiveTab("upload");
    }
  };

  const getFileIcon = () => {
    if (!file) return <Upload className="w-12 h-12 text-gray-400" />;
    return <FileText className="w-12 h-12 text-blue-500" />;
  };

  const selectedModelInfo = modelOptions.find(
    (model) => model.value === selectedModel
  );

  return (
    <Dialog open={open} onOpenChange={uploading ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import from CV</DialogTitle>
          <DialogDescription>
            Upload a CV file or provide a Google Drive share link to
            automatically extract employee information
          </DialogDescription>
        </DialogHeader>

        {/* Model Selection */}
        <div className="space-y-2">
          <Label htmlFor="model-select" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            AI Model
          </Label>
          <Select
            value={selectedModel}
            onValueChange={setSelectedModel}
            disabled={uploading}
          >
            <SelectTrigger id="model-select">
              <SelectValue placeholder="Select AI model" />
            </SelectTrigger>
            <SelectContent>
              {modelOptions.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  <div className="flex flex-col">
                    <span className="font-medium">{model.label}</span>
                    <span className="text-xs text-gray-500">
                      {model.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "upload" | "url")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" disabled={uploading}>
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="url" disabled={uploading}>
              <Link2 className="w-4 h-4 mr-2" />
              From URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 py-4">
            {!file ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-2">
                  {getFileIcon()}
                  <div className="text-sm text-gray-600">
                    <label
                      htmlFor="cv-upload"
                      className={`text-blue-600 hover:text-blue-700 font-medium ${
                        uploading ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      Click to upload
                    </label>{" "}
                    or drag and drop
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, JPG, PNG (max 10MB)
                  </p>
                  <input
                    id="cv-upload"
                    type="file"
                    className="hidden"
                    accept={acceptedExtensions.join(",")}
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getFileIcon()}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    disabled={uploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="url" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="drive-url">Google Drive Share Link</Label>
              <Input
                id="drive-url"
                type="url"
                placeholder="https://drive.google.com/file/d/..."
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                disabled={uploading}
              />
              <p className="text-xs text-gray-500">
                Make sure the link is publicly accessible or has proper sharing
                permissions
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCloseModal}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={
              activeTab === "upload" ? handleUploadFile : handleUploadUrl
            }
            disabled={
              uploading || (activeTab === "upload" ? !file : !driveUrl.trim())
            }
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing with {selectedModelInfo?.label}...
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 mr-2" />
                Import with {selectedModelInfo?.label}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
