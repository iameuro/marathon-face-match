from PIL import Image, ImageDraw, ImageFont
import os

# 이미지 저장 경로
image_dir = "assets/images/athletes"
os.makedirs(image_dir, exist_ok=True)

# 선수 정보
athletes = [
    ("eliud-kipchoge.jpg", "Eliud Kipchoge"),
    ("benson-kipchoe.jpg", "Benson Kipchoe"),
    ("john-korir.jpg", "John Korir"),
    ("sifan-hassan.jpg", "Sifan Hassan"),
    ("tigst-assefa.jpg", "Tigst Assefa"),
    ("helen-obiri.jpg", "Helen Obiri")
]

# 이미지 생성
for filename, name in athletes:
    # 400x500 이미지 생성 (선수 사진 크기)
    img = Image.new('RGB', (400, 500), color=(70, 130, 180))
    draw = ImageDraw.Draw(img)
    
    # 텍스트 그리기
    text = name
    # 기본 폰트 사용
    try:
        font = ImageFont.truetype("/Library/Fonts/Arial.ttf", 28)
    except:
        font = ImageFont.load_default()
    
    # 텍스트 중앙 배치
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (400 - text_width) // 2
    y = (500 - text_height) // 2
    
    draw.text((x, y), text, fill=(255, 255, 255), font=font)
    draw.text((x, y + 60), "Marathon Runner", fill=(200, 200, 200), font=font)
    
    # 이미지 저장
    filepath = os.path.join(image_dir, filename)
    img.save(filepath)
    print(f"생성됨: {filepath}")

print("모든 선수 이미지가 생성되었습니다.")
