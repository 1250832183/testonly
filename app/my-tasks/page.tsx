"use client";

import React, { useState, useCallback, useEffect } from "react";

// Force dynamic rendering
export const dynamic = "force-dynamic";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react";
import { store } from "@/stores/main";
import { turnitinStore } from "@/stores/turnitin";
import LottieAnimation from "@/components/LottieAnimation";
import styles from "./page.module.scss";
import clsx from "classnames";
import { message } from "antd";

export interface Task {
  TurnitinId: number;
  createdAt: number;
  status: number; // 0-pending -1-failed 1-detecting 2-completed
  aiWriting?: number;
  aiWritingFile?: {
    name: string;
    url: string;
    type?: string;
  } | null;
  read: boolean;
}

const MyTasksPage = observer(() => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Format timestamp to MM/DD/YYYY
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Load task list
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      await turnitinStore.loadTasks();
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load tasks on component mount
  useEffect(() => {
    if (store.isLogin === true) {
      loadTasks();
    }
  }, [loadTasks, store.isLogin]);

  // Mark all unread tasks as read when visiting My Tasks page
  useEffect(() => {
    if (store.isLogin && turnitinStore.tasks.length > 0) {
      const unreadTasks = turnitinStore.tasks.filter(
        (task) => task.status === 2 && !task.read
      );
      if (unreadTasks.length > 0) {
        const unreadIds = unreadTasks.map((task) => task.TurnitinId);
        turnitinStore.markTasksAsReadAPI(unreadIds);
      }
    }
  }, [store.isLogin, turnitinStore.tasks.length]);

  const handleDownloadClick = useCallback(async (task: Task) => {
    try {
      if (!task.aiWritingFile || !task.aiWritingFile.url) {
        message.error("No report file available for download");
        return;
      }

      // Mark task as read
      await turnitinStore.markTasksAsReadAPI([task.TurnitinId]);

      // Download report file
      const link = document.createElement("a");
      link.href = task.aiWritingFile.url;
      link.download = `${task.aiWritingFile.name || "report"}`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success("Report downloaded successfully");
    } catch (error) {
      console.error("Failed to download report:", error);
      message.error("Failed to download report");
    }
  }, []);

  const renderTaskCard = (task: Task) => {
    const detecting = task.status === 1 || task.status === 0;
    return (
      <div
        key={`${task.TurnitinId}-${task.createdAt}`}
        className={clsx(styles.taskCard, { [styles.detecting]: detecting })}
      >
        {detecting && (
          <div className={styles.aiWatermark}>
            <img className={styles.aiIcon} src="/images/turnitin/ai.svg" alt="AI" />
          </div>
        )}

        <div className={styles.taskTitle}>
          <span className={styles.taskTitleText}>
            {task.aiWritingFile?.name || "Untitled"}
          </span>
          {task.status === 2 && !task.read && (
            <div className={styles.newTag}>New</div>
          )}
        </div>

        {detecting ? (
          <div className={styles.detectingContent}>
            <div className={styles.taskDate}>Estimated time 5-10 minutes</div>
            <div className={styles.detectingAnimation}>
              <LottieAnimation
                path="/lotties/turnitin-detecting.json"
                loop={true}
                autoplay={true}
                className={styles.detectingAnimationLottie}
              />
            </div>
          </div>
        ) : task.status === 2 ? (
          <div className={styles.completedContent}>
            <div className={styles.taskDate}>{formatDate(task.createdAt)}</div>
            <button
              className={styles.downloadButton}
              onClick={() => handleDownloadClick(task)}
            >
              <span>📥</span>
              Download
            </button>
          </div>
        ) : task.status === -1 ? (
          <div className={styles.failedContent}>
            <div className={styles.taskStatus}>Failed</div>
            <div className={styles.taskDate}>{formatDate(task.createdAt)}</div>
          </div>
        ) : (
          <div className={styles.pendingContent}>
            <div className={styles.taskDate}>{formatDate(task.createdAt)}</div>
          </div>
        )}
      </div>
    );
  };

  if (!store.isLogin) {
    return (
      <div className={styles.myTasksPage}>
        <div className={styles.emptyState}>
          <h2>Please login to view your tasks</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.myTasksPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Tasks</h1>
      </div>

      <div className={styles.tasksGrid}>
        {loading ? (
          <div className={styles.loadingMessage}>Loading...</div>
        ) : !Array.isArray(turnitinStore.tasks) ||
          turnitinStore.tasks.length === 0 ? (
          <div className={styles.emptyMessage}>No tasks yet</div>
        ) : (
          turnitinStore.tasks.map(renderTaskCard)
        )}
      </div>
    </div>
  );
});

export default MyTasksPage;
