import axios from "../request";

// Submit Turnitin detection task
export const submitTurnitinDetection = async (params: {
  type: 0 | 1; // 0-text 1-document url
  text?: string;
  fileUrl?: string;
}) => {
  try {
    const { data } = await axios.post("/turnitin/submit", params);
    return data;
  } catch (error) {
    console.error("Submit turnitin detection failed:", error);
    throw error;
  }
};

// Get detection result
export const getTurnitinResult = async (tId: number) => {
  try {
    const { data } = await axios.get("/turnitin/get", {
      params: { tId },
    });
    return data;
  } catch (error) {
    console.error("Get turnitin result failed:", error);
    throw error;
  }
};

// Poll detection result
export const pollTurnitinResult = async (
  tId: number,
  onProgress?: (status: number, aiWriting?: number) => void,
  interval: number = 20000 // Poll every 20 seconds
): Promise<{
  status: number;
  aiWriting?: number;
  aiWritingFile?: string;
}> => {
  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const result = await getTurnitinResult(tId);

        if (result.code === 200) {
          const { status, aiWriting, aiWritingFile } = result.data;

          // Call progress callback
          if (onProgress) {
            onProgress(status, aiWriting);
          }

          // Check status
          if (status === 2) {
            // Detection completed
            resolve({
              status,
              aiWriting,
              aiWritingFile,
            });
            return;
          } else if (status === -1) {
            // Detection failed
            reject(new Error("Detection failed"));
            return;
          }

          // Continue polling
          setTimeout(poll, interval);
        } else {
          reject(new Error(result.message || "Failed to get detection result"));
        }
      } catch (error) {
        reject(error);
      }
    };

    poll();
  });
};

// Get task list
export const getTurnitinTaskList = async () => {
  try {
    const { data } = await axios.get("/turnitin/list");
    return data;
  } catch (error) {
    console.error("Get turnitin task list failed:", error);
    throw error;
  }
};

// Mark tasks as read
export const markTurnitinTasksAsRead = async (idList: number[]) => {
  try {
    const { data } = await axios.post("/turnitin/read", { idList });
    return data;
  } catch (error) {
    console.error("Mark turnitin tasks as read failed:", error);
    throw error;
  }
};
