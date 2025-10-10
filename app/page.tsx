"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

// Force dynamic rendering
export const dynamic = "force-dynamic";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react";
import { store } from "@/stores/main";
import { turnitinStore } from "@/stores/turnitin";
import { message } from "antd";
import LottieAnimation from "@/components/LottieAnimation";
import TurnitinSubscription from "@/components/TurnitinSubscription";
import { uploadFile } from "@/modules/api/main";
import {
  submitTurnitinDetection,
  pollTurnitinResult,
} from "@/modules/api/turnitin";
import styles from "./page.module.scss";
import clsx from "classnames";

const TurnitinCheckerPage = observer(() => {
  const router = useRouter();
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [checksCount, setChecksCount] = useState(store.turnitin || 0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "completed"
  >("idle");
  const [detectionStatus, setDetectionStatus] = useState<
    "idle" | "running" | "completed"
  >("idle");
  const [showTurnitinSubscription, setShowTurnitinSubscription] =
    useState(false);
  const [turnitinSubscriptionLoading, setTurnitinSubscriptionLoading] =
    useState(false);
  const [currentTId, setCurrentTId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MIN_CHARS = 300;
  const MAX_CHARS = 30000;
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

  // Monitor store turnitin count changes
  useEffect(() => {
    setChecksCount(store.turnitin || 0);
  }, [store.turnitin]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= MAX_CHARS) {
      setText(newText);
    }
  };

  const handleFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Start upload process
      setUploadedFile(file);
      setUploadStatus("uploading");
      setUploadProgress(0);
      setIsUploading(true);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            return prev;
          }
          const increment = Math.random() * (100 - prev) * 0.1 + 1;
          return Math.min(prev + increment, 95);
        });
      }, 200);

      try {
        const result = await uploadFile(file);

        if (result.success) {
          clearInterval(progressInterval);
          setUploadStatus("completed");
          setUploadProgress(100);
          setUploadedFileUrl(result.accessUrl);
          message.success("File uploaded successfully");
        } else {
          throw new Error("Upload failed");
        }
      } catch (error: any) {
        console.error("Upload error:", error);
        clearInterval(progressInterval);
        message.error(error.message || "File upload failed, please try again");
        setUploadStatus("idle");
        setUploadedFile(null);
        setUploadProgress(0);
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const handleDetect = useCallback(async () => {
    console.log("handleDetect", store.isLogin, store.turnitin);
    
    if (!store.isLogin) {
      message.error("Please login first");
      return;
    }

    if (store.turnitin === 0) {
      setShowTurnitinSubscription(true);
      return;
    }

    const hasValidText = text.length >= MIN_CHARS && text.length <= MAX_CHARS;
    const hasUploadedFile = uploadStatus === "completed";

    if (!hasValidText && !hasUploadedFile) {
      message.error(
        "Please enter at least 300 characters OR upload a file to scan."
      );
      return;
    }

    if (hasValidText && text.length > MAX_CHARS) {
      message.error("Please limit your input to 30,000 characters or less.");
      return;
    }

    setIsDetecting(true);
    setDetectionStatus("running");

    try {
      const submitParams = hasUploadedFile
        ? {
            type: 1 as const,
            fileUrl: uploadedFileUrl,
          }
        : {
            type: 0 as const,
            text: text,
          };

      const submitResult = await submitTurnitinDetection(submitParams);

      store.updatePlan();

      if (submitResult.code === 200) {
        const { tId } = submitResult.data;
        setCurrentTId(tId);
        // 设置当前正在处理的任务ID
        turnitinStore.setCurrentProcessingTaskId(tId);

        const result = await pollTurnitinResult(tId, (status, aiWriting) => {
          console.log("Detection progress:", { status, aiWriting });
        });

        setDetectionStatus("completed");
        setIsDetecting(false);
        message.success("Detection completed");
      } else {
        throw new Error(submitResult.message || "Submit detection failed");
      }
    } catch (error: any) {
      console.error("Detection error:", error);
      message.error(error.message || "Detection failed, please try again");
      setDetectionStatus("idle");
      setIsDetecting(false);
    }
  }, [text, uploadStatus, uploadedFileUrl, store.turnitin, store.isLogin]);

  const handleDeleteFile = useCallback(() => {
    setUploadedFile(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    setIsUploading(false);
    setText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleReset = useCallback(() => {
    setText("");
    setUploadedFile(null);
    setUploadedFileUrl("");
    setUploadStatus("idle");
    setUploadProgress(0);
    setIsUploading(false);
    setDetectionStatus("idle");
    setCurrentTId(null);
    // 清除当前正在处理的任务ID
    turnitinStore.setCurrentProcessingTaskId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleDownloadReport = useCallback(() => {
    message.success("Report downloaded successfully!");
  }, []);

  const handleChecksClick = useCallback(() => {
    setShowTurnitinSubscription(true);
  }, []);

  const handleSubscriptionClose = useCallback(() => {
    setShowTurnitinSubscription(false);
  }, []);

  const handleSubscriptionSubscribe = useCallback(
    (productId: string, month: number, isTrial: boolean) => {
      setTurnitinSubscriptionLoading(true);
      setTimeout(() => {
        setTurnitinSubscriptionLoading(false);
        setShowTurnitinSubscription(false);
        message.success("Subscription successful!");
      }, 2000);
    },
    []
  );

  const charCount = text.length;
  const isTextValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;
  const isDetectEnabled = isTextValid || uploadStatus === "completed";
  const isUploadEnabled =
    detectionStatus === "idle" || detectionStatus === "completed";

  return (
    <div className={styles.turnitinChecker}>
      <div className={styles.container}>
        {/* Left Section - Information */}
        <div className={styles.leftSection}>
          <h1 className={styles.title}>Turnitin Checker</h1>
          <p className={styles.description}>
            Get your official Turnitin similarity report instantly, check before
            submission, and ensure originality.
          </p>
          <ul className={styles.features}>
            <li>Officially Authorized by Turnitin</li>
            <li>Direct Connection to Turnitin Servers</li>
            <li>No Storage, No Traces</li>
          </ul>
        </div>

        {/* Right Section - Interaction */}
        <div className={styles.rightSection}>
          {/* Text Input Area */}
          <div className={styles.inputArea}>
            {detectionStatus !== "idle" ? (
              <div className={styles.detectionDisplay}>
                {detectionStatus === "running" && (
                  <>
                    <div className={styles.detectionStatus}>
                      Detection in Progress...
                    </div>
                    <div className={styles.detectionMessage}>
                      Your document is being analyzed. This usually takes 5-10
                      minutes. You can stay on this page or check progress in My
                      Task.
                    </div>
                    <div className={styles.animationContainer}>
                      <LottieAnimation
                        path="/lotties/turnitin-detecting.json"
                        width={300}
                        height={300}
                        loop={true}
                        autoplay={true}
                      />
                    </div>
                  </>
                )}

                {detectionStatus === "completed" && (
                  <>
                    <div className={styles.completeAnimation}>
                      <LottieAnimation
                        path="/lotties/turnitin-complete.json"
                        width="100%"
                        loop={true}
                        autoplay={true}
                        renderer="svg"
                      />
                    </div>
                    <div className={styles.detectionComplete}>
                      Detection complete!
                    </div>
                    <div className={styles.detectionMessage}>
                      Your report is ready.
                    </div>
                    <div className={styles.detectionButtons}>
                      <button
                        className={styles.resetButton}
                        onClick={handleReset}
                      >
                        Reset
                      </button>
                      <button
                        className={styles.downloadButton}
                        onClick={handleDownloadReport}
                      >
                        <img
                          src="/images/turnitin/Download.png"
                          className={styles.downloadIcon}
                          alt="Download"
                        />
                        Download Report
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : uploadStatus !== "idle" ? (
              <div className={styles.fileDisplay}>
                <div className={styles.fileIcon}>
                  <img
                    className={styles.pdfIcon}
                    src="/images/pdf/ic_pdf_s.png"
                    alt="PDF"
                  />
                </div>
                <div className={styles.fileName}>{uploadedFile?.name}</div>

                {uploadStatus === "uploading" && (
                  <>
                    <div className={styles.uploadStatus}>
                      uploading... ({Math.round(uploadProgress)}%)
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </>
                )}

                {uploadStatus === "completed" && (
                  <div
                    className={styles.deleteButton}
                    onClick={handleDeleteFile}
                  >
                    Delete
                  </div>
                )}
              </div>
            ) : (
              <>
                <textarea
                  className={styles.textInput}
                  placeholder="Paste your text here..."
                  value={text}
                  onChange={handleTextChange}
                  maxLength={MAX_CHARS}
                />
                <div className={styles.charCount}>
                  {charCount}/{MAX_CHARS}
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <div className={styles.checksButton} onClick={handleChecksClick}>
              <span className={styles.checksNumber}>{checksCount}</span>
              <span className={styles.checksText}>checks</span>
            </div>

            <div className={styles.buttonGroup}>
              <div
                className={clsx(styles.uploadButton, {
                  [styles.disabled]: isUploading || !isUploadEnabled,
                })}
                onClick={
                  isUploadEnabled && !isUploading ? handleFileUpload : undefined
                }
              >
                <svg
                  className={styles.uploadIcon}
                  width="20"
                  height="20"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M40 15V50" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M27 28L40 15L53 28" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 55H60" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M15 65H65" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
                  <path d="M25 55V65" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M55 55V65" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                {uploadStatus === "completed" ? "Replace file" : "Upload file"}
              </div>

              <div
                className={clsx(styles.detectButton, {
                  [styles.disabled]: !isDetectEnabled || isDetecting,
                })}
                onClick={handleDetect}
              >
                {isDetecting ? "Detecting..." : "Detect"}
              </div>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {/* Turnitin Subscription Modal */}
      <TurnitinSubscription
        isShow={showTurnitinSubscription}
        onClose={handleSubscriptionClose}
        onSubscribe={handleSubscriptionSubscribe}
        loading={turnitinSubscriptionLoading}
      />
    </div>
  );
});

export default TurnitinCheckerPage;
