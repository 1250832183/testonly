# PostHog 集成配置

## 概述

项目已经集成了 PostHog 用于产品分析和用户行为追踪。

## 环境变量配置

在项目根目录创建 `.env.local` 文件并添加以下环境变量：

```env
# PostHog Configuration
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# 如果使用自托管实例，修改 HOST 为你的实例地址
# NEXT_PUBLIC_POSTHOG_HOST=https://your-posthog-instance.com
```

## 如何获取 PostHog Key

1. 访问 [PostHog](https://posthog.com/) 并创建账号
2. 创建新项目或选择现有项目
3. 在项目设置中找到 **Project API Key**
4. 将 API Key 复制到 `NEXT_PUBLIC_POSTHOG_KEY` 环境变量

## 功能特性

### 自动追踪
- ✅ 页面浏览 (Page Views)
- ✅ 页面离开 (Page Leave)
- ✅ 路由变化追踪

### React Hooks
项目使用 `posthog-js/react`，你可以在客户端组件中使用以下 hooks：

```tsx
"use client";

import { usePostHog } from 'posthog-js/react';

export function MyComponent() {
  const posthog = usePostHog();

  const handleClick = () => {
    posthog.capture('button_clicked', {
      button_name: 'my_button',
      // 自定义属性...
    });
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

### 用户识别

```tsx
// 用户登录后识别用户
posthog.identify(
  userId, // 唯一用户 ID
  {
    email: user.email,
    name: user.name,
    // 其他用户属性...
  }
);

// 用户登出时重置
posthog.reset();
```

## 集成组件

### PostHogProvider
位于 `/components/PostHogProvider/index.tsx`，负责初始化 PostHog 实例。

### PostHogPageView
位于 `/components/PostHogPageView/index.tsx`，自动追踪页面浏览和路由变化。

### AnalyticsProvider
位于 `/components/AnalyticsProvider/index.tsx`，整合多个分析工具（Clarity, PostHog 等）。

## 注意事项

- 环境变量必须以 `NEXT_PUBLIC_` 开头才能在客户端使用
- PostHog 仅在客户端组件中可用（`"use client"` 指令）
- 首次部署时，确保在 Vercel/部署平台中配置相同的环境变量

## 更多资源

- [PostHog 文档](https://posthog.com/docs)
- [PostHog Next.js 集成](https://posthog.com/docs/libraries/next-js)
- [PostHog React Hooks](https://posthog.com/docs/libraries/react)

