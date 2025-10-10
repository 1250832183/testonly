"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { observer } from "mobx-react";
import { store } from "@/stores/main";
import { Avatar, Dropdown, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import styles from "./index.module.scss";

const Navbar: React.FC = observer(() => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

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

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const userMenuItems: MenuProps["items"] = [
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
          <button
            className={`${styles.tab} ${
              pathname === "/my-tasks" ? styles.active : ""
            }`}
            onClick={() => router.push("/my-tasks")}
          >
            My Tasks
          </button>
        </div>

        <div className={styles.auth}>
          {user ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar
                size={40}
                src={user.user_metadata?.avatar_url}
                icon={<UserOutlined />}
                className={styles.avatar}
              />
            </Dropdown>
          ) : (
            <Button
              type="primary"
              onClick={handleLogin}
              className={styles.loginButton}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
