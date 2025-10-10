import { makeAutoObservable } from "mobx";
import { getUserPlan } from "@/modules/api/main";

class MainStore {
  isLogin = false;
  turnitin = 0; // Turnitin checks count
  userInfo: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  setLogin(isLogin: boolean) {
    this.isLogin = isLogin;
  }

  setUserInfo(userInfo: any) {
    this.userInfo = userInfo;
  }

  setTurnitin(count: number) {
    this.turnitin = count;
  }

  async updatePlan() {
    try {
      const result = await getUserPlan();
      if (result.code === 200) {
        this.turnitin = result.data.turnitin || 0;
      }
    } catch (error) {
      console.error("Failed to update plan:", error);
    }
  }

  reset() {
    this.isLogin = false;
    this.turnitin = 0;
    this.userInfo = null;
  }
}

export const store = new MainStore();
