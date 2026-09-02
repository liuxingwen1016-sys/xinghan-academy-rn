# RN学堂 Android Demo

用于课程培训现场演示的 React Native Android 应用。

## 已实现功能

- 首页、课程搜索与分类、课程详情、收藏和学习中心。
- 应用内视频播放、本地图文课程、章节目录和本地学习笔记。
- 学习进度持久化、随堂测验、成绩与答案解析。
- 个人中心、离线资源说明、深色模式和 RN 能力实验室。
- 最近 7 天学习统计；断网时仍可播放微课、浏览正文并完成测验。

## 资源策略

- 课程目录、图文正文、分课程题库、微课视频和学习进度均支持离线使用。
- 8 个视频课时与课程内容逐一对应，直接在 RN 应用内播放，不跳转浏览器。
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

`../build-artifacts/xinghan-academy/rn-academy-v1.1.0-release.apk`

当前 APK 使用 Android 调试证书签名，仅用于本地安装和培训演示；正式发布前需要替换为生产签名。

GitHub 仓库：`https://github.com/liuxingwen1016-sys/xinghan-academy-rn`
