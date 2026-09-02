"""Create the Android launcher and compatibility icon assets from the v2 source."""

from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "rn-academy-icon-v2.png"


def save(image: Image.Image, target: Path, size: int) -> None:
    resized = image.resize((size, size), Image.Resampling.LANCZOS)
    target.parent.mkdir(parents=True, exist_ok=True)
    resized.save(target, optimize=True)
    print(f"generated {target.relative_to(ROOT)} ({size}x{size})")


def launcher_icon(source: Image.Image, size: int, round_icon: bool = False) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    if round_icon:
      mask_draw.ellipse((0, 0, size - 1, size - 1), fill=255)
    else:
      mask_draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=round(size * 0.22), fill=255)
    background = Image.new("RGBA", (size, size), "#071F5D")
    canvas.paste(background, (0, 0), mask)

    alpha_box = source.getchannel("A").getbbox() or (0, 0, source.width, source.height)
    cropped = source.crop(alpha_box)
    mark_size = round(size * 0.92)
    cropped.thumbnail((mark_size, mark_size), Image.Resampling.LANCZOS)
    left = (size - cropped.width) // 2
    top = (size - cropped.height) // 2
    canvas.alpha_composite(cropped, (left, top))
    return canvas


def main() -> None:
    source = Image.open(SOURCE).convert("RGBA")
    save(launcher_icon(source, 1024), ROOT / "assets" / "icon.png", 1024)
    save(launcher_icon(source, 1024), ROOT / "assets" / "adaptive-icon.png", 1024)
    save(source, ROOT / "assets" / "splash-icon.png", 512)
    save(source, ROOT / "android" / "app" / "src" / "main" / "res" / "drawable-nodpi" / "rn_academy_icon.png", 512)
    densities = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}
    for density, size in densities.items():
        directory = ROOT / "android" / "app" / "src" / "main" / "res" / f"mipmap-{density}"
        save(launcher_icon(source, size), directory / "ic_launcher.webp", size)
        save(launcher_icon(source, size, round_icon=True), directory / "ic_launcher_round.webp", size)


if __name__ == "__main__":
    main()
