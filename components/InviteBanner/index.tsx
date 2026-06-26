"use client";

import React from "react";
import styles from "./index.module.scss";
import { observer } from "mobx-react";

interface InviteBannerProps {
  /** Rewards earned this month */
  earned?: number;
  /** Monthly reward limit */
  limit?: number;
  /** Open the invite modal */
  onInvite?: () => void;
  /** Dismiss the banner */
  onClose?: () => void;
}

const GiftBoxIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8"
      stroke="#3b82f6"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 7H2v5h20V7Z"
      stroke="#3b82f6"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 21V7" stroke="#3b82f6" strokeWidth="1.6" strokeLinecap="round" />
    <path
      d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z"
      stroke="#3b82f6"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z"
      stroke="#3b82f6"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InviteBanner: React.FC<InviteBannerProps> = ({
  earned = 3,
  limit = 10,
  onInvite,
  onClose,
}) => {
  const progress = Math.min((earned / limit) * 100, 100);

  return (
    <div className={styles.banner}>
      <div className={styles.left}>
        <div className={styles.giftIcon}>
          <GiftBoxIcon />
        </div>
        <div className={styles.copy}>
          <h3 className={styles.title}>Earn free Standard Checks</h3>
          <p className={styles.description}>
            Invite friends to try TurnitChecker. You get 1 free Standard Check when they
            complete their first paid check.
          </p>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.progressBlock}>
          <div className={styles.progressLabel}>
            This month:{" "}
            <span className={styles.progressValue}>
              {earned} / {limit}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </div>

        <button className={styles.inviteButton} onClick={onInvite}>
          Invite Now
        </button>

        <button className={styles.closeButton} onClick={onClose} aria-label="Dismiss">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6L18 18M6 18L18 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default observer(InviteBanner);
