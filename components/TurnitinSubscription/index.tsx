"use client";

import React, { useState } from "react";
import styles from "./index.module.scss";
import clsx from "classnames";
import { observer } from "mobx-react";

interface TurnitinSubscriptionProps {
  isShow: boolean;
  onClose?: () => void;
  onSubscribe?: (productId: string, month: number, isTrial: boolean) => void;
  loading?: boolean;
}

const TurnitinSubscription: React.FC<TurnitinSubscriptionProps> = ({
  isShow,
  onClose,
  onSubscribe,
  loading = false,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<"single" | "pack">("pack");

  // 定价数据
  const singleCheckPrice = 4.99;
  const packPrice = 19.99;
  const packDiscount = 20; // 20% off

  const handleSubscribe = () => {
    if (loading) return;

    // 订阅逻辑
    onSubscribe?.(
      selectedPlan === "pack" ? "turnitin_pack" : "turnitin_single",
      selectedPlan === "pack" ? 5 : 1,
      false
    );
  };

  const handleClose = () => {
    onClose?.();
  };

  const handlePlanSelect = (plan: "single" | "pack") => {
    setSelectedPlan(plan);
  };

  if (!isShow) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalWrapper} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal}>
          {/* Close button */}
          <button className={styles.closeButton} onClick={handleClose}>
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
            <h1 className={styles.title}>Get Instant Turnitin Reports!</h1>
            <p className={styles.subtitle}>
              Ensure originality and submit with confidence. Choose the option
              that fits your needs.
            </p>
          </div>

          {/* Pricing cards */}
          <div className={styles.pricingCards}>
            {/* Single Check Card */}
            <div
              className={clsx(styles.pricingCard, {
                [styles.selected]: selectedPlan === "single",
              })}
              onClick={() => handlePlanSelect("single")}
            >
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Single Check</h3>
                <p className={styles.cardDescription}>
                  Perfect for one-time use.
                </p>
                <div className={styles.price}>$ {singleCheckPrice}</div>
                <button
                  className={styles.buyButton}
                  onClick={handleSubscribe}
                  disabled={loading}
                >
                  {loading && selectedPlan === "single"
                    ? "Processing..."
                    : "Buy Now"}
                </button>
              </div>
            </div>

            {/* 5-Check Pack Card */}
            <div
              className={clsx(styles.pricingCard, styles.packCard, {
                [styles.selected]: selectedPlan === "pack",
              })}
              onClick={() => handlePlanSelect("pack")}
            >
              <div className={styles.discountTag}>
                <img src="/images/turnitin/save.png" alt="discount" />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>5-Check Pack</h3>
                <p className={styles.cardDescription}>
                  Best value for multiple assignments.
                </p>
                <div className={styles.price}>$ {packPrice}</div>
                <button
                  className={styles.buyButton}
                  onClick={handleSubscribe}
                  disabled={loading}
                >
                  {loading && selectedPlan === "pack"
                    ? "Processing..."
                    : "Buy Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(TurnitinSubscription);
