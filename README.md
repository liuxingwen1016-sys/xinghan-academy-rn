# 星瀚学堂 Android Demo

用于课程培训现场演示的 React Native Android 应用。

## 已实现功能

- 首页、课程搜索与分类、课程详情、收藏和学习中心。
- 在线视频入口、本地图文课程、章节目录和本地学习笔记。
- 学习进度持久化、随堂测验、成绩与答案解析。
- 个人中心、离线资源说明、深色模式和 RN 能力实验室。
- 网络状态提示；断网时仍可浏览课程正文并继续记录进度。

## 资源策略

- 课程目录、图文正文、题库和学习进度支持离线使用。
- 视频通过网络加载；网络异常时自动显示本地图文兜底内容。
- 应用数据为原创 Mock 数据，不依赖真实后台。

## 本地运行

```powershell
npm install
npm run typecheck
npm run android
```

## Android 发布构建

```powershell
npm run build:android
```

发布 APK 位于 `android/app/build/outputs/apk/release/`。

已验证的 Demo APK 另存于：

`../build-artifacts/xinghan-academy/xinghan-academy-v1.0.0-release.apk`

当前 APK 使用 Android 调试证书签名，仅用于本地安装和培训演示；正式发布前需要替换为生产签名。

当前阶段仅在本地开发和验证，不推送远端仓库。
