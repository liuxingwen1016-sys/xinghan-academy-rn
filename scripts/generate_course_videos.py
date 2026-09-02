"""Generate the small, course-specific MP4 lessons bundled with the demo app."""

from __future__ import annotations

import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from imageio_ffmpeg import get_ffmpeg_exe


ROOT = Path(__file__).resolve().parents[1]
BUILD = ROOT / ".video-build"
OUTPUT = ROOT / "assets" / "videos"
FONT_REGULAR = Path(r"C:\Windows\Fonts\msyh.ttc")
FONT_BOLD = Path(r"C:\Windows\Fonts\msyhbd.ttc")


LESSONS = {
    "rn-positioning.mp4": {
        "course": "React Native 实战入门",
        "lesson": "1.1 RN 的定位与开发模式",
        "accent": "#00C7E5",
        "slides": [
            ("React 描述界面", "用组件、属性和状态表达 UI；同一套业务代码服务 Android 与 iOS。"),
            ("映射原生能力", "View、Text、Pressable 最终映射到平台视图，不是在浏览器里运行网页。"),
            ("完整开发链路", "TypeScript 编写业务 → Metro 调试 → Gradle 打包 → 安装 Android APK。"),
        ],
    },
    "rn-components.mp4": {
        "course": "React Native 实战入门",
        "lesson": "2.1 核心组件与交互",
        "accent": "#00C7E5",
        "slides": [
            ("五个高频组件", "View 组织布局，Text 显示文字，Pressable 响应触摸，TextInput 输入，FlatList 渲染列表。"),
            ("处理完整页面状态", "真实页面需要同时覆盖加载中、空数据、请求失败和正常内容。"),
            ("交互也要可用", "为按钮设置清晰反馈、足够触摸面积与 accessibilityLabel。"),
        ],
    },
    "rn-navigation.mp4": {
        "course": "React Native 实战入门",
        "lesson": "3.1 导航与跨页面状态",
        "accent": "#00C7E5",
        "slides": [
            ("导航只传必要参数", "页面之间传 courseId、lessonId，再从统一数据源读取完整对象。"),
            ("区分局部与全局状态", "输入框、展开收起留在页面；用户、学习进度和主题放入全局状态。"),
            ("进度需要持久化", "完成课时后立即更新界面，并写入 AsyncStorage，重启后仍可恢复。"),
        ],
    },
    "typescript-types.mp4": {
        "course": "TypeScript 从入门到精通",
        "lesson": "1.1 类型与接口",
        "accent": "#6EC6FF",
        "slides": [
            ("类型约束数据边界", "string、number、boolean 等基础类型让错误在开发阶段暴露。"),
            ("接口描述对象结构", "interface Course 明确课程必须具备的字段，并支持复用和扩展。"),
            ("类型不会进入运行时", "TypeScript 编译后仍是 JavaScript；它提供的是静态检查与编辑器提示。"),
        ],
    },
    "javascript-closures.mp4": {
        "course": "JavaScript 核心进阶",
        "lesson": "1.1 作用域与闭包",
        "accent": "#FFE082",
        "slides": [
            ("词法作用域", "函数能访问哪些变量，由它定义的位置决定，而不是调用的位置。"),
            ("闭包保留外层环境", "内部函数离开创建位置后，仍可以读取外层函数中的变量。"),
            ("常见实践", "事件回调、缓存和工厂函数都依赖闭包；不用的监听器要及时清理。"),
        ],
    },
    "node-http.mp4": {
        "course": "Node.js 后端开发实战",
        "lesson": "1.1 创建 HTTP 服务",
        "accent": "#69D38A",
        "slides": [
            ("创建服务", "http.createServer 接收请求回调，request 描述输入，response 负责输出。"),
            ("返回规范响应", "设置正确状态码、Content-Type，并用 JSON.stringify 输出结构化数据。"),
            ("从最小接口开始", "先实现 GET /health，再增加课程列表、详情和学习进度接口。"),
        ],
    },
    "flutter-widgets.mp4": {
        "course": "Flutter 跨平台开发概览",
        "lesson": "1.1 Dart 与 Widget",
        "accent": "#62D5E4",
        "slides": [
            ("一切皆 Widget", "文本、布局、手势和主题都通过 Widget 组合成不可变配置树。"),
            ("状态驱动重建", "状态变化触发 build，框架比较新旧配置并更新需要变化的渲染对象。"),
            ("与 RN 的关键差异", "Flutter 主要由自有渲染引擎绘制；RN 核心组件映射平台原生视图。"),
        ],
    },
    "ai-requirements.mp4": {
        "course": "AI Coding 高效研发",
        "lesson": "1.1 从需求到任务",
        "accent": "#B696FF",
        "slides": [
            ("先定义目标", "说明用户是谁、要解决什么问题，以及完成后可观察到的结果。"),
            ("补齐约束与验收", "明确技术栈、不可修改范围、交互细节和可执行的验收条件。"),
            ("拆成可验证任务", "每一步只解决一个问题，并配套类型检查、测试、构建或界面验证。"),
        ],
    },
}


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_BOLD if bold else FONT_REGULAR), size)


def rounded(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], radius: int, fill: str, outline: str | None = None, width: int = 1) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def create_frame(meta: dict[str, object], index: int, title: str, body: str, target: Path) -> None:
    image = Image.new("RGB", (960, 540), "#071426")
    draw = ImageDraw.Draw(image)
    accent = str(meta["accent"])

    draw.rectangle((0, 0, 960, 8), fill=accent)
    rounded(draw, (54, 42, 906, 494), 28, "#0C2039", "#1D395A", 2)
    rounded(draw, (86, 76, 186, 112), 18, accent)
    draw.text((111, 82), "微课", font=font(18, True), fill="#071426")
    draw.text((210, 78), str(meta["course"]), font=font(21, True), fill="#C6D7EA")
    draw.text((86, 140), str(meta["lesson"]), font=font(27, True), fill="#FFFFFF")

    draw.ellipse((86, 210, 154, 278), fill=accent)
    number = f"{index:02d}"
    bounds = draw.textbbox((0, 0), number, font=font(25, True))
    draw.text((120 - (bounds[2] - bounds[0]) / 2, 244 - (bounds[3] - bounds[1]) / 2 - 3), number, font=font(25, True), fill="#071426")
    draw.text((184, 205), title, font=font(37, True), fill="#FFFFFF")

    body_font = font(23)
    max_width = 650
    lines: list[str] = []
    current = ""
    for char in body:
        candidate = current + char
        if draw.textlength(candidate, font=body_font) > max_width and current:
            lines.append(current)
            current = char
        else:
            current = candidate
    if current:
        lines.append(current)
    for line_index, line in enumerate(lines[:3]):
        draw.text((184, 272 + line_index * 39), line, font=body_font, fill="#B8CBE0")

    for marker in range(3):
        fill = accent if marker <= index - 1 else "#29445F"
        rounded(draw, (86 + marker * 44, 443, 118 + marker * 44, 451), 4, fill)
    draw.text((736, 429), "RN 学堂 · 本地课程资源", font=font(15), fill="#7691AE")
    image.save(target, quality=94)


def generate_video(filename: str, meta: dict[str, object]) -> None:
    lesson_dir = BUILD / Path(filename).stem
    lesson_dir.mkdir(parents=True, exist_ok=True)
    concat_file = lesson_dir / "slides.txt"
    slide_lines: list[str] = []
    slides = list(meta["slides"])
    for index, (title, body) in enumerate(slides, start=1):
        frame = lesson_dir / f"slide-{index}.png"
        create_frame(meta, index, title, body, frame)
        slide_lines.extend([f"file '{frame.as_posix()}'", "duration 6"])
    slide_lines.append(f"file '{(lesson_dir / f'slide-{len(slides)}.png').as_posix()}'")
    concat_file.write_text("\n".join(slide_lines), encoding="utf-8")

    target = OUTPUT / filename
    command = [
        get_ffmpeg_exe(), "-y", "-f", "concat", "-safe", "0", "-i", str(concat_file),
        "-vf", "fps=24,format=yuv420p", "-c:v", "libx264", "-preset", "veryfast",
        "-crf", "23", "-movflags", "+faststart", str(target),
    ]
    subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"generated {target.relative_to(ROOT)} ({target.stat().st_size / 1024:.0f} KiB)")


def main() -> None:
    BUILD.mkdir(exist_ok=True)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for filename, meta in LESSONS.items():
        generate_video(filename, meta)


if __name__ == "__main__":
    main()
