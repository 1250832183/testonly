import { makeAutoObservable, runInAction } from "mobx";
import {
  getTurnitinTaskList,
  markTurnitinTasksAsRead,
} from "@/modules/api/turnitin";

export type Task = {
  TurnitinId: number;
  createdAt: number; // timestamp
  status: number; // 0-pending -1-failed 1-detecting 2-completed
  aiWriting?: number;
  aiWritingFile?: {
    name: string;
    url: string;
    type?: string;
  } | null;
  read: boolean; // read status
};

class TurnitinStore {
  // Task list related
  tasks: Task[] = [];
  tasksLoading = false;
  tasksPollingInterval: NodeJS.Timeout | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Task list related methods
  setTasks(tasks: Task[]) {
    this.tasks = Array.isArray(tasks) ? tasks : [];
  }

  setTasksLoading(loading: boolean) {
    this.tasksLoading = loading;
  }

  // Get unread tasks count
  get unreadTasksCount() {
    if (!Array.isArray(this.tasks)) {
      return 0;
    }
    return this.tasks.filter((task) => task.status === 2 && !task.read).length;
  }

  // Mark tasks as read
  markTasksAsRead(idList: number[]) {
    if (!Array.isArray(this.tasks)) {
      return;
    }
    this.tasks = this.tasks.map((task) =>
      idList.includes(task.TurnitinId) ? { ...task, read: true } : task
    );
  }

  // Stop polling
  stopTasksPolling() {
    if (this.tasksPollingInterval) {
      clearInterval(this.tasksPollingInterval);
      this.tasksPollingInterval = null;
    }
  }

  // Load task list
  async loadTasks() {
    try {
      this.setTasksLoading(true);
      const result = await getTurnitinTaskList();

      if (result.code === 200) {
        runInAction(() => {
          const tasks = (result.data?.data || []).filter(
            (item: any) => item.TurnitinId
          );
          this.tasks = Array.isArray(tasks) ? tasks : [];
        });
      } else {
        runInAction(() => {
          this.tasks = [];
        });
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
      runInAction(() => {
        this.tasks = [];
      });
    } finally {
      this.setTasksLoading(false);
    }
  }

  // Start polling task list
  startTasksPolling() {
    if (this.tasksPollingInterval) return;

    // Load immediately
    this.loadTasks();

    // Poll every 30 seconds
    this.tasksPollingInterval = setInterval(() => {
      this.loadTasks();
    }, 30000);
  }

  // Mark tasks as read (call API)
  async markTasksAsReadAPI(idList: number[]) {
    if (idList.length === 0) return;

    try {
      await markTurnitinTasksAsRead(idList);
      // Update local state
      this.markTasksAsRead(idList);
    } catch (error) {
      console.error("Failed to mark tasks as read:", error);
    }
  }

  // Reset state
  reset() {
    this.tasks = [];
    this.tasksLoading = false;
    this.stopTasksPolling();
  }
}

export const turnitinStore = new TurnitinStore();
