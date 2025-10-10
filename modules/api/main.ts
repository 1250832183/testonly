import axios from "../request";

export const uploadFile = async (file: File) => {
  try {
    // Step 1: Get pre-upload info
    const { data: preUploadData } = await axios.post(
      "/file/preUpload",
      {
        contentType: file.type,
      },
      {
        headers: {
          "x-scene": "general",
          "x-source": "turnitin",
        },
      }
    );

    const { uploadUrl, formData, accessUrl, fileField } = preUploadData.data;

    // Step 2: Upload file
    const fd = new FormData();
    for (const k in formData) {
      fd.append(k, formData[k]);
    }
    fd.append(fileField, file);

    await fetch(uploadUrl, {
      method: "POST",
      body: fd,
    });

    return {
      success: true,
      accessUrl,
    };
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Upload failed",
    };
  }
};

// Get user plan info
export const getUserPlan = async () => {
  try {
    const { data } = await axios.get("/plan/info");
    return data;
  } catch (error) {
    console.error("Get user plan failed:", error);
    throw error;
  }
};
