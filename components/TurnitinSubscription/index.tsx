"use client";

import React from "react";
import { Modal, Button } from "antd";
import styles from "./index.module.scss";

interface TurnitinSubscriptionProps {
  isShow: boolean;
  onClose: () => void;
  onSubscribe: (productId: string, month: number, isTrial: boolean) => void;
  loading?: boolean;
}

const TurnitinSubscription: React.FC<TurnitinSubscriptionProps> = ({
  isShow,
  onClose,
  onSubscribe,
  loading = false,
}) => {
  return (
    <Modal
      open={isShow}
      onCancel={onClose}
      footer={null}
      width={600}
      className={styles.subscriptionModal}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Upgrade to Premium</h2>
        <p className={styles.description}>
          Get unlimited Turnitin checks and more features
        </p>

        <div className={styles.priceCard}>
          <div className={styles.priceHeader}>
            <h3>Monthly Plan</h3>
            <div className={styles.price}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>9.99</span>
              <span className={styles.period}>/month</span>
            </div>
          </div>

          <ul className={styles.features}>
            <li>✓ Unlimited Turnitin checks</li>
            <li>✓ Priority support</li>
            <li>✓ Detailed reports</li>
            <li>✓ No ads</li>
          </ul>

          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={() => onSubscribe("monthly", 1, false)}
            className={styles.subscribeButton}
          >
            Subscribe Now
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TurnitinSubscription;
