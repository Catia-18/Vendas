import subprocess
import os

images = [
    {
        "file": "public/src/assets/images/product_lumora_isolated_1792262011015.jpg",
        "duration": 5,
        "title": "LUMORA · Luminária LED Recarregável",
        "sub": "Design UltraSlim em Alumínio Escovado"
    },
    {
        "file": "public/src/assets/images/hero_lumora_wardrobe_1792262010537.jpg",
        "duration": 5,
        "title": "Sensor de Movimento Inteligente PIR",
        "sub": "Acende no escuro ao abrir o roupeiro ou closet"
    },
    {
        "file": "public/src/assets/images/lumora_magnetic_mount_1792262011714.jpg",
        "duration": 5,
        "title": "Fixação Magnética sem Furos",
        "sub": "Base adesiva de alta fixação · Instalação em segundos"
    },
    {
        "file": "public/src/assets/images/lumora_usbc_charging_1792262012537.jpg",
        "duration": 5,
        "title": "Bateria Recarregável USB-C",
        "sub": "Até 60 dias de autonomia em modo automático"
    },
    {
        "file": "public/src/assets/images/lumora_hallway_lighting_1792262011603.jpg",
        "duration": 5,
        "title": "Luz Suave e Confortável",
        "sub": "Ideal para corredores, quartos, escadas e armários"
    }
]

# Generate intermediate video clips for each scene
clips = []
for i, item in enumerate(images):
    clip_name = f"/tmp/clip_{i}.mp4"
    clips.append(clip_name)
    # ffmpeg zoompan with scale 1280x720, 30fps
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1",
        "-i", item["file"],
        "-t", str(item["duration"]),
        "-vf", (
            "scale=1280:720:force_original_aspect_ratio=increase,"
            "crop=1280:720,"
            f"zoompan=z='min(zoom+0.0008,1.15)':d={item['duration']*30}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1280x720:fps=30,"
            "format=yuv420p"
        ),
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "22",
        clip_name
    ]
    print(f"Generating clip {i}...")
    subprocess.run(cmd, check=True)

# Create concat list
with open("/tmp/concat_list.txt", "w") as f:
    for clip in clips:
        f.write(f"file '{clip}'\n")

output_mp4 = "public/assets/videos/luminaria_lumora_demonstracao.mp4"
# Concat clips and add silent/soft ambient stereo audio
concat_cmd = [
    "ffmpeg", "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", "/tmp/concat_list.txt",
    "-f", "lavfi",
    "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
    "-c:v", "copy",
    "-c:a", "aac",
    "-b:a", "128k",
    "-shortest",
    "-movflags", "+faststart",
    output_mp4
]
print("Concatenating into final MP4...")
subprocess.run(concat_cmd, check=True)

# Copy to public/videos as well for direct route fallback
subprocess.run(["cp", output_mp4, "public/videos/luminaria_lumora_demonstracao.mp4"], check=True)
print("Video successfully generated!")
