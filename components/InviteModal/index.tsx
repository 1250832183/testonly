"use client";

import React, { useState } from "react";
import styles from "./index.module.scss";
import clsx from "classnames";
import { observer } from "mobx-react";
import { message } from "antd";

interface InviteModalProps {
  isShow: boolean;
  onClose?: () => void;
  /** Referral link to share */
  referralLink?: string;
  /** Rewards earned this month */
  earned?: number;
  /** Monthly reward limit */
  limit?: number;
}

const GiftIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 7H2v5h20V7Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 21V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path
      d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FriendIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckBadgeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 12l2 2 4-4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M16 2v4M8 2v4M3 10h18"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const InviteModal: React.FC<InviteModalProps> = ({
  isShow,
  onClose,
  referralLink = "https://turnitchecker.ai/?ref=ABC123",
  earned = 3,
  limit = 10,
}) => {
  const [copied, setCopied] = useState(false);

  const isLimitReached = earned >= limit;
  const progress = Math.min((earned / limit) * 100, 100);

  const handleClose = () => {
    onClose?.();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      message.success("Referral link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      message.error("Failed to copy link");
    }
  };

  if (!isShow) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalWrapper} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal}>
          {/* Close button */}
          <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6L18 18M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.giftBadge}>
              <GiftIcon />
            </div>
            <h2 className={styles.title}>Invite Friends, Get Free Checks</h2>
            <p className={styles.subtitle}>Share your referral link and earn rewards.</p>
          </div>

          {/* Reward details — normal vs limit reached */}
          {isLimitReached ? (
            <div className={styles.limitBox}>
              <h3 className={styles.limitTitle}>Monthly reward limit reached</h3>
              <p className={styles.limitText}>
                You have earned {limit} / {limit} referral rewards this month. Additional
                rewards will be available again next month.
              </p>
            </div>
          ) : (
            <ul className={styles.rewardList}>
              <li className={styles.rewardItem}>
                <span className={styles.rewardIcon}>
                  <FriendIcon />
                </span>
                <span className={styles.rewardCopy}>
                  Your friend gets $1 off their first Standard Check.
                </span>
              </li>
              <li className={styles.rewardItem}>
                <span className={styles.rewardIcon}>
                  <CheckBadgeIcon />
                </span>
                <span className={styles.rewardCopy}>
                  You get 1 free Standard Check after their first paid Standard Check is
                  completed.
                </span>
              </li>
              <li className={styles.rewardItem}>
                <span className={styles.rewardIcon}>
                  <CalendarIcon />
                </span>
                <span className={styles.rewardCopy}>
                  Earn up to {limit} rewards each calendar month.
                </span>
              </li>
            </ul>
          )}

          {/* Referral link */}
          <div className={styles.linkSection}>
            <label className={styles.linkLabel}>Your referral link</label>
            <div className={styles.linkRow}>
              <input
                className={styles.linkInput}
                value={referralLink}
                readOnly
                aria-label="Referral link"
              />
              <button
                className={clsx(styles.copyButton, { [styles.copied]: copied })}
                onClick={handleCopy}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className={styles.progressSection}>
            <div className={styles.progressLabel}>
              This month:{" "}
              <span className={styles.progressValue}>
                {earned} / {limit}
              </span>{" "}
              {isLimitReached ? "earned" : "rewards earned"}
            </div>
            <div className={styles.progressBar}>
              <div
                className={clsx(styles.progressFill, {
                  [styles.full]: isLimitReached,
                })}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Disclaimer */}
          <p className={styles.disclaimer}>
            Rewards are granted only after a referred user completes their first paid
            Standard Check. Academic Plan, AI Refinement, free checks, and refunded orders
            are not eligible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default observer(InviteModal);
