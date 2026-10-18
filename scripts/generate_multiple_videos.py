import subprocess
import os

VIDEOS_CONFIG = [
    {
        "filename": "luminaria_video_1_apresentacao.mp4",
        "title": "Apresentação & Visão Geral da Luminária LUMORA",
        "category": "Demonstração Geral",
        "scenes": [
            ("public/assets/images/product_lumora_isolated_1792262011015.jpg", 4, "zoom+0.0007", "LUMORA · Design UltraSlim em Alumínio"),
            ("public/assets/images/lumora_modes_display_1792359745079.jpg", 4, "zoom+0.0006", "3 Tonalidades de Luz: 3000K, 4000K e 6000K"),
            ("public/assets/images/hero_lumora_wardrobe_1792262010537.jpg", 4, "zoom+0.0007", "Acendimento Automático ao Abrir Portas")
        ]
    },
    {
        "filename": "luminaria_video_2_instalacao.mp4",
        "title": "Instalação Magnética em 5 Segundos Sem Furos",
        "category": "Guia de Instalação",
        "scenes": [
            ("public/assets/images/lumora_magnetic_mount_1792262011714.jpg", 4, "zoom+0.0008", "Fixação Magnética sem Furar a Parede"),
            ("public/assets/images/product_lumora_isolated_1792262011015.jpg", 4, "zoom+0.0006", "Encaixe e Desencaixe Fácil para Recarga"),
            ("public/assets/images/hero_lumora_wardrobe_1792262010537.jpg", 4, "zoom+0.0007", "Fixa em Armários, Paredes, Madeiras e Metais")
        ]
    },
    {
        "filename": "luminaria_video_3_sensor_bateria.mp4",
        "title": "Sensor Inteligente PIR & Bateria Recarregável USB-C",
        "category": "Tecnologia & Bateria",
        "scenes": [
            ("public/assets/images/lumora_usbc_charging_1792262012537.jpg", 4, "zoom+0.0007", "Bateria de Lítio Recarregável USB-C"),
            ("public/assets/images/hero_lumora_wardrobe_1792262010537.jpg", 4, "zoom+0.0008", "Sensor PIR: Detecção de Presença até 3 Metros"),
            ("public/assets/images/lumora_modes_display_1792359745079.jpg", 4, "zoom+0.0006", "Até 60 Dias de Autonomia em Modo Sensor")
        ]
    },
    {
        "filename": "luminaria_video_4_cozinha_bancada.mp4",
        "title": "Iluminação Prática na Cozinha e Bancadas",
        "category": "Cozinha & Gourmet",
        "scenes": [
            ("public/assets/images/lumora_kitchen_undercabinet_1792359686505.jpg", 4, "zoom+0.0008", "Iluminação Sob Armários de Cozinha"),
            ("public/assets/images/product_lumora_isolated_1792262011015.jpg", 4, "zoom+0.0006", "Luz Homogénea sem Ofuscar a Visão"),
            ("public/assets/images/lumora_modes_display_1792359745079.jpg", 4, "zoom+0.0007", "Regulação de Brilho e Temperatura")
        ]
    },
    {
        "filename": "luminaria_video_5_escadas_corredor.mp4",
        "title": "Luz de Segurança Noturna para Escadas e Corredores",
        "category": "Segurança Noturna",
        "scenes": [
            ("public/assets/images/lumora_staircase_night_1792359733537.jpg", 4, "zoom+0.0007", "Degraus Iluminados com Segurança à Noite"),
            ("public/assets/images/lumora_hallway_lighting_1792262011603.jpg", 4, "zoom+0.0007", "Corredores e Rodapés com Luz Suave Anti-Queda"),
            ("public/assets/images/hero_lumora_wardrobe_1792262010537.jpg", 4, "zoom+0.0008", "Conforto Total para Toda a Família")
        ]
    }
]

os.makedirs("public/assets/videos", exist_ok=True)
os.makedirs("public/videos", exist_ok=True)

for vid_idx, vid in enumerate(VIDEOS_CONFIG):
    print(f"\n==========================================")
    print(f"Gerando Vídeo {vid_idx+1}/{len(VIDEOS_CONFIG)}: {vid['title']}")
    print(f"==========================================")

    clip_paths = []
    for sc_idx, (img_path, duration, zoom_expr, scene_title) in enumerate(vid["scenes"]):
        clip_out = f"/tmp/v_{vid_idx}_clip_{sc_idx}.mp4"
        clip_paths.append(clip_out)

        # ffmpeg zoompan 1280x720, 25fps, fast preset
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1",
            "-i", img_path,
            "-t", str(duration),
            "-vf", (
                "scale=1280:720:force_original_aspect_ratio=increase,"
                "crop=1280:720,"
                f"zoompan=z='min({zoom_expr},1.15)':d={duration*25}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1280x720:fps=25,"
                "format=yuv420p"
            ),
            "-c:v", "libx264",
            "-preset", "veryfast",
            "-crf", "23",
            clip_out
        ]
        subprocess.run(cmd, check=True)

    concat_file = f"/tmp/concat_{vid_idx}.txt"
    with open(concat_file, "w") as f:
        for p in clip_paths:
            f.write(f"file '{p}'\n")

    out_public_assets = os.path.join("public/assets/videos", vid["filename"])
    out_public_videos = os.path.join("public/videos", vid["filename"])

    concat_cmd = [
        "ffmpeg", "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", concat_file,
        "-f", "lavfi",
        "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "128k",
        "-shortest",
        "-movflags", "+faststart",
        out_public_assets
    ]
    subprocess.run(concat_cmd, check=True)
    subprocess.run(["cp", out_public_assets, out_public_videos], check=True)
    print(f"Vídeo pronto: {out_public_assets}")

# Keep original luminaria_lumora_demonstracao.mp4 synced with video 1
subprocess.run(["cp", "public/assets/videos/luminaria_video_1_apresentacao.mp4", "public/assets/videos/luminaria_lumora_demonstracao.mp4"], check=True)
subprocess.run(["cp", "public/assets/videos/luminaria_video_1_apresentacao.mp4", "public/videos/luminaria_lumora_demonstracao.mp4"], check=True)

print("\nTODOS OS 5 VÍDEOS FORAM GERADOS COM SUCESSO!")
