import emsClient from "@/service/emsClient";

// Fetch employee profile
export async function uploadAvatar(file: File) {
  const url = `/media/upload/avatar`;
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await emsClient.post(url, formData, {
        headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

