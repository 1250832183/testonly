"use client";

import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";
import { MailOutlined, GoogleOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

interface LoginModalProps {
  isShow: boolean;
  onClose: () => void;
  onGoogleLogin: () => Promise<void>;
  onMagicLinkLogin: (email: string) => Promise<void>;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isShow,
  onClose,
  onGoogleLogin,
  onMagicLinkLogin,
}) => {
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await onGoogleLogin();
    } catch (error) {
      message.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLinkLogin = async () => {
    if (!email) {
      message.error("Please enter your email address");
      return;
    }

    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      message.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await onMagicLinkLogin(email);
      setEmailSent(true);
      message.success("Magic link sent! Check your email.");
    } catch (error) {
      message.error("Failed to send magic link, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsEmailMode(false);
    setEmail("");
    setEmailSent(false);
    onClose();
  };

  const handleBackToOptions = () => {
    setIsEmailMode(false);
    setEmailSent(false);
    setEmail("");
  };

  return (
    <Modal
      open={isShow}
      onCancel={handleClose}
      footer={null}
      width={440}
      centered
      className={styles.loginModal}
    >
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>
            Sign in to access your Turnitin checks
          </p>
        </div>

        {!isEmailMode ? (
          // Login method selection
          <div className={styles.loginOptions}>
            {/* Google Login */}
            <button
              className={styles.googleButton}
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <GoogleOutlined className={styles.icon} />
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className={styles.divider}>
              <span>or</span>
            </div>

            {/* Email Login */}
            <button
              className={styles.emailButton}
              onClick={() => setIsEmailMode(true)}
            >
              <MailOutlined className={styles.icon} />
              <span>Continue with Email</span>
            </button>
          </div>
        ) : (
          // Magic Link form
          <div className={styles.emailForm}>
            {!emailSent ? (
              <>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Email Address</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="large"
                    prefix={<MailOutlined className={styles.inputIcon} />}
                    onPressEnter={handleMagicLinkLogin}
                    disabled={loading}
                  />
                </div>

                <div className={styles.magicLinkInfo}>
                  <p>
                    We&apos;ll send you a magic link to sign in without a password.
                  </p>
                </div>

                <Button
                  type="primary"
                  size="large"
                  block
                  loading={loading}
                  onClick={handleMagicLinkLogin}
                  className={styles.submitButton}
                >
                  {loading ? "Sending..." : "Send Magic Link"}
                </Button>

                <button
                  className={styles.backButton}
                  onClick={handleBackToOptions}
                >
                  ← Back to login options
                </button>
              </>
            ) : (
              // Email sent success view
              <div className={styles.successView}>
                <div className={styles.successIcon}>
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r="30"
                      fill="#eff6ff"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                    <path
                      d="M20 32L28 40L44 24"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className={styles.successTitle}>Check Your Email!</h3>
                <p className={styles.successMessage}>
                  We&apos;ve sent a magic link to <strong>{email}</strong>
                </p>
                <p className={styles.successHint}>
                  Click the link in the email to sign in. The link will expire
                  in 1 hour.
                </p>

                <button
                  className={styles.resendButton}
                  onClick={handleMagicLinkLogin}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Resend Magic Link"}
                </button>

                <button
                  className={styles.backButton}
                  onClick={handleBackToOptions}
                >
                  ← Use different email
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <p className={styles.terms}>
            By continuing, you agree to our{" "}
            <a href="/terms" target="_blank">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" target="_blank">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;

