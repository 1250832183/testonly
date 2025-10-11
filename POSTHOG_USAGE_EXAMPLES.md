# PostHog 使用示例

## 基础事件追踪

### 在客户端组件中追踪按钮点击

```tsx
"use client";

import { usePostHog } from 'posthog-js/react';

export function UploadButton() {
  const posthog = usePostHog();

  const handleUpload = (file: File) => {
    // 追踪文件上传事件
    posthog.capture('file_uploaded', {
      file_type: file.type,
      file_size: file.size,
      file_name: file.name,
    });
    
    // 执行上传逻辑...
  };

  return <button onClick={handleUpload}>Upload File</button>;
}
```

## 用户识别

### 用户登录后识别

在 Navbar 或登录组件中：

```tsx
"use client";

import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

export function UserProfile({ user }) {
  const posthog = usePostHog();

  useEffect(() => {
    if (user) {
      // 识别用户
      posthog.identify(user.id, {
        email: user.email,
        name: user.user_metadata?.full_name,
        created_at: user.created_at,
      });

      // 设置用户属性
      posthog.people.set({
        plan: user.plan || 'free',
        last_login: new Date().toISOString(),
      });
    }
  }, [user, posthog]);

  return <div>Welcome {user.email}</div>;
}
```

### 用户登出时重置

```tsx
const handleLogout = async () => {
  // 重置 PostHog
  posthog.reset();
  
  // 执行登出逻辑
  await supabase.auth.signOut();
};
```

## 功能使用追踪

### 追踪功能使用

```tsx
"use client";

import { usePostHog } from 'posthog-js/react';

export function TurnitinChecker() {
  const posthog = usePostHog();

  const startDetection = async (text: string) => {
    // 追踪检测开始
    posthog.capture('turnitin_detection_started', {
      text_length: text.length,
      word_count: text.split(/\s+/).length,
    });

    try {
      const result = await detectPlagiarism(text);
      
      // 追踪检测成功
      posthog.capture('turnitin_detection_completed', {
        similarity_score: result.similarity,
        duration: result.duration,
        success: true,
      });
    } catch (error) {
      // 追踪检测失败
      posthog.capture('turnitin_detection_failed', {
        error: error.message,
        success: false,
      });
    }
  };

  return <button onClick={() => startDetection(text)}>Check</button>;
}
```

## 页面停留时间追踪

### 自动追踪页面停留时间

PostHog 已经自动追踪了 `$pageleave` 事件，你可以在 PostHog 后台查看用户在每个页面的停留时间。

如果需要手动追踪特定操作的时间：

```tsx
"use client";

import { usePostHog } from 'posthog-js/react';
import { useEffect, useRef } from 'react';

export function TimedFeature() {
  const posthog = usePostHog();
  const startTimeRef = useRef<number>();

  const startTimer = () => {
    startTimeRef.current = Date.now();
    posthog.capture('feature_started');
  };

  const stopTimer = () => {
    if (startTimeRef.current) {
      const duration = Date.now() - startTimeRef.current;
      posthog.capture('feature_completed', {
        duration_ms: duration,
        duration_seconds: duration / 1000,
      });
    }
  };

  return (
    <div>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
}
```

## A/B 测试 (Feature Flags)

### 使用功能标志

```tsx
"use client";

import { usePostHog } from 'posthog-js/react';
import { useEffect, useState } from 'react';

export function NewFeature() {
  const posthog = usePostHog();
  const [showNewUI, setShowNewUI] = useState(false);

  useEffect(() => {
    // 检查功能标志
    const flagEnabled = posthog.isFeatureEnabled('new-ui-design');
    setShowNewUI(flagEnabled);
  }, [posthog]);

  if (showNewUI) {
    return <NewUIComponent />;
  }

  return <OldUIComponent />;
}
```

### 使用 PostHog Hook

```tsx
"use client";

import { useFeatureFlagEnabled } from 'posthog-js/react';

export function FeatureComponent() {
  const newFeatureEnabled = useFeatureFlagEnabled('new-feature');

  return (
    <div>
      {newFeatureEnabled ? (
        <div>New Feature is enabled!</div>
      ) : (
        <div>Old experience</div>
      )}
    </div>
  );
}
```

## 订阅计划追踪

### 追踪订阅事件

```tsx
"use client";

import { usePostHog } from 'posthog-js/react';

export function SubscriptionButton({ plan }) {
  const posthog = usePostHog();

  const handleSubscribe = async (planType: string) => {
    // 追踪订阅意向
    posthog.capture('subscription_initiated', {
      plan_type: planType,
      plan_price: getPlanPrice(planType),
    });

    try {
      await subscribeToPlan(planType);
      
      // 追踪订阅成功
      posthog.capture('subscription_completed', {
        plan_type: planType,
        success: true,
      });

      // 更新用户属性
      posthog.people.set({
        plan: planType,
        subscribed_at: new Date().toISOString(),
      });
    } catch (error) {
      // 追踪订阅失败
      posthog.capture('subscription_failed', {
        plan_type: planType,
        error: error.message,
        success: false,
      });
    }
  };

  return (
    <button onClick={() => handleSubscribe(plan)}>
      Subscribe to {plan}
    </button>
  );
}
```

## 错误追踪

### 追踪应用错误

```tsx
"use client";

import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

export function ErrorBoundaryWrapper({ children }) {
  const posthog = usePostHog();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      posthog.capture('javascript_error', {
        error_message: event.message,
        error_stack: event.error?.stack,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
      });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [posthog]);

  return <>{children}</>;
}
```

## 性能追踪

### 追踪 API 响应时间

```tsx
"use client";

import { usePostHog } from 'posthog-js/react';

export function useApiCall() {
  const posthog = usePostHog();

  const callApi = async (endpoint: string, data: any) => {
    const startTime = Date.now();
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      const duration = Date.now() - startTime;
      
      // 追踪成功的 API 调用
      posthog.capture('api_call_completed', {
        endpoint,
        duration_ms: duration,
        status: response.status,
        success: response.ok,
      });
      
      return response.json();
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // 追踪失败的 API 调用
      posthog.capture('api_call_failed', {
        endpoint,
        duration_ms: duration,
        error: error.message,
        success: false,
      });
      
      throw error;
    }
  };

  return { callApi };
}
```

## 最佳实践

1. **事件命名规范**
   - 使用小写字母和下划线：`button_clicked`, `file_uploaded`
   - 使用动词描述动作：`started`, `completed`, `failed`
   - 保持一致性

2. **属性设置**
   - 包含有用的上下文信息
   - 避免包含敏感信息（密码、信用卡号等）
   - 使用标准化的属性名

3. **性能考虑**
   - PostHog 调用是异步的，不会阻塞 UI
   - 避免在循环中频繁调用
   - 使用防抖处理高频事件

4. **隐私保护**
   - 不要追踪个人敏感信息
   - 遵守 GDPR 和其他隐私法规
   - 考虑添加用户同意机制

## 更多资源

- [PostHog 文档](https://posthog.com/docs)
- [PostHog React SDK](https://posthog.com/docs/libraries/react)
- [PostHog 事件最佳实践](https://posthog.com/docs/data/events)

