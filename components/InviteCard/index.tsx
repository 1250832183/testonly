"use client";

import React from "react";
import styles from "./index.module.scss";
import { observer } from "mobx-react";

interface InviteCardProps {
  /** Whether the user is logged in — toggles the CTA copy/behavior */
  isLogin?: boolean;
  /** Click handler for the primary CTA */
  onAction?: () => void;
  /** Max rewards per month, shown in footer note */
  monthlyLimit?: number;
}

const GiftBoxIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

const InviteCard: React.FC<InviteCardProps> = ({
  isLogin = false,
  onAction,
  monthlyLimit = 10,
}) => {
  return (
    <div className={styles.inviteCard}>
      <div className={styles.cardHeader}>
        <div className={styles.giftIcon}>
          <GiftBoxIcon />
        </div>
        <div className={styles.cardHeading}>
          <h3 className={styles.cardTitle}>Invite Friends, Get Free Checks</h3>
          <p className={styles.cardDescription}>
            Share your referral link. When a friend completes their first paid Standard
            Check, you get 1 free Standard Check.
          </p>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.benefitPill}>
          Your friend gets $1 off their first Standard Check.
        </div>
        <button className={styles.actionButton} onClick={onAction}>
          {isLogin ? "Invite Now" : "Log in to Invite"}
        </button>
      </div>

      <p className={styles.footnote}>Up to {monthlyLimit} rewards per month.</p>
    </div>
  );
};

export default observer(InviteCard);
