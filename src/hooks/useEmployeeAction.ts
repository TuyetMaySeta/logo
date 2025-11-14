import { useCallback } from "react";
import emsClient from "../service/emsClient";
import { toast } from "sonner";

interface UseEmployeeActionReturn {
  handleDownloadCV: (id: number) => Promise<void>;
  handleDownloadMyCV: () => Promise<void>; 
  handleShareLink: (id: number) => Promise<void>;
}

export const useEmployeeAction = (): UseEmployeeActionReturn => {
  /**
   * Handle CV download action
   */
  const handleDownloadCV = useCallback(async (id: number): Promise<void> => {
    try {
      toast.info("Downloading CV...", {
        description: `Downloading CV of employee #${id}`,
      });

      const response = await emsClient.get(
        `/employees/${id}/cv/download/docx`,
        {
          responseType: "blob",
        }
      );

      const contentDisposition =
        response.headers["content-disposition"] ||
        response.headers["Content-Disposition"];

      let filename = `CV_Employee_${id}.docx`; 

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch?.[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "").trim();
        }
      }

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("CV downloaded successfully!", {
        description: `${filename} has been downloaded`,
      });
    } catch (error) {
      console.error("CV download failed:", error);
      toast.error("Failed to download CV", {
        description: "Could not download CV. Please try again.",
      });
      throw error;
    }
  }, []);

  const handleDownloadMyCV = useCallback(async (): Promise<void> => {
    try {
      toast.info("Downloading CV...", {
        description: "Downloading your CV",
      });

      const response = await emsClient.get(
        `/employees/cv/download/docx`,
        {
          responseType: "blob",
        }
      );

      const contentDisposition =
        response.headers["content-disposition"] ||
        response.headers["Content-Disposition"];

      let filename = `My_CV.docx`; 

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch?.[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "").trim();
        }
      }

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("CV downloaded successfully!", {
        description: `${filename} has been downloaded`,
      });
    } catch (error) {
      console.error("CV download failed:", error);
      toast.error("Failed to download CV", {
        description: "Could not download CV. Please try again.",
      });
      throw error;
    }
  }, []);


  /**
   * Handle share link generation action
   */
  const handleShareLink = useCallback(async (id: number): Promise<void> => {
    try {
      toast.info("Creating Link...", {
        description: `Creating share link for employee #${id}`,
      });

      const response = await emsClient.post(
        `/orgs/employees/share-link/${id}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to generate share link");
      }

      const shareUrl =
        response.data.share_url ||
        response.data.url ||
        response.data.link;

      if (!shareUrl) {
        throw new Error("Share URL not found in response");
      }

      await navigator.clipboard.writeText(shareUrl);

      toast.success("Link copied!", {
        description: `Employee #${id} link has been copied to clipboard`,
      });
    } catch (error) {
      console.error("Share link generation failed:", error);
      toast.error("Failed to copy link", {
        description: "Couldn't copy link. Please try again.",
      });
      throw error;
    }
  }, []);

  return {
    handleDownloadCV,
    handleDownloadMyCV,
    handleShareLink,
  };
};