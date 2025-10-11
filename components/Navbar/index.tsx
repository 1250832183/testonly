"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { observer } from "mobx-react";
import { store } from "@/stores/main";
import { turnitinStore } from "@/stores/turnitin";
import { Avatar, Dropdown, Button, message, Tooltip } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import LoginModal from "@/components/LoginModal";
import styles from "./index.module.scss";
import "@ant-design/v5-patch-for-react-19"

const Navbar: React.FC = observer(() => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Start polling tasks when logged in
  useEffect(() => {
    if (store.isLogin) {
      turnitinStore.startTasksPolling();
      store.updatePlan();
    }
    return () => {
      turnitinStore.stopTasksPolling();
    };
  }, [store.isLogin]);

  useEffect(() => {
    // Check current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      store.setLogin(!!user);
      if (user) {
        store.setUserInfo(user);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      store.setLogin(!!session?.user);
      if (session?.user) {
        store.setUserInfo(session.user);
      } else {
        store.reset();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleShowLogin = () => {
    setShowLoginModal(true);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleMagicLinkLogin = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Magic link error:", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // 获取用户邮箱
  const userEmail = user?.email || "";

  // 获取邮箱首字母
  const getEmailInitial = (email: string) => {
    if (!email) return "";
    return email.charAt(0).toUpperCase();
  };

  // 获取头像 URL 或首字母
  const avatarSrc = user?.user_metadata?.avatar_url;
  const emailInitial = !avatarSrc ? getEmailInitial(userEmail) : null;

  const userMenuItems: MenuProps["items"] = [
    {
      key: "email",
      label: (
        <div className={styles.userInfo}>
          <div className={styles.userEmail}>{userEmail}</div>
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <div className={styles.logo}>
            <h1>Turnitin Checker</h1>
          </div>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${pathname === "/" ? styles.active : ""}`}
              onClick={() => router.push("/")}
            >
              Upload
            </button>
            <div className={styles.tabWrapper}>
              <button
                className={`${styles.tab} ${
                  pathname === "/my-tasks" ? styles.active : ""
                }`}
                onClick={() => router.push("/my-tasks")}
              >
                My Tasks
              </button>
              {turnitinStore.unreadTasksCountForBadge > 0 && (
                <span className={styles.badge}>
                  {/* {turnitinStore.unreadTasksCountForBadge} */}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.auth}>
          {user ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              {avatarSrc ? (
                <Avatar
                  size={40}
                  src={avatarSrc}
                  className={styles.avatar}
                />
              ) : (
                <Avatar
                  size={40}
                  className={styles.avatarWithInitial}
                  style={{
                    backgroundColor: "#3b82f6",
                    cursor: "pointer",
                  }}
                >
                  {emailInitial}
                </Avatar>
              )}
            </Dropdown>
          ) : (
            <Button
              type="primary"
              onClick={handleShowLogin}
              className={styles.loginButton}
            >
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isShow={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onGoogleLogin={handleGoogleLogin}
        onMagicLinkLogin={handleMagicLinkLogin}
      />
    </nav>
  );
});

export default Navbar;
