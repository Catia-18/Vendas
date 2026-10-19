import subprocess
import os

VIDEOS_CONFIG = [
    {
        "filename": "luminaria_video_1_apresentacao.mp4",
        "title": "Apresentação & Design da Luminária LED Recarregável",
        "category": "Demonstração do Produto",
        "scenes": [
            {
                "img": "public/assets/images/product_lumora_isolated_1792262011015.jpg",
                "dur": 4,
                "zoom": "zoom+0.0006",
                "tag": "LUMINÁRIA LED RECARREGÁVEL COM SENSOR",
                "headline": "Design UltraSlim em Alumínio Fosco",
                "sub": "Corpo de 9mm de espessura · Acabamento Premium fosco"
            },
            {
                "img": "public/assets/images/lumora_modes_display_1792359745079.jpg",
                "dur": 4,
                "zoom": "zoom+0.0005",
                "tag": "AJUSTE DE TONALIDADE",
                "headline": "3 Temperaturas de Cor: 3000K, 4000K e 6000K",
                "sub": "Luz Quente Aconchegante · Neutra Natural · Branca Fria"
            },
            {
                "img": "public/assets/images/hero_lumora_wardrobe_1792262010537.jpg",
                "dur": 4,
                "zoom": "zoom+0.0007",
                "tag": "SENSOR DE MOVIMENTO PIR",
                "headline": "Acendimento Automático ao Abrir Armários",
                "sub": "Luz difusa anti-encandeamento sem sombras"
            }
        ]
    },
    {
        "filename": "luminaria_video_2_instalacao.mp4",
        "title": "Instalação Magnética em 5 Segundos sem Furos",
        "category": "Guia de Instalação",
        "scenes": [
            {
                "img": "public/assets/images/lumora_magnetic_mount_1792262011714.jpg",
                "dur": 4,
                "zoom": "zoom+0.0007",
                "tag": "INSTALAÇÃO SEM OBRAS",
                "headline": "Fixação Magnética em 5 Segundos",
                "sub": "Suportes adesivos 3M de alta resistência incluídos"
            },
            {
                "img": "public/assets/images/product_lumora_isolated_1792262011015.jpg",
                "dur": 4,
                "zoom": "zoom+0.0006",
                "tag": "ZERO FUROS NA PAREDE",
                "headline": "Encaixe e Remoção Fácil com 1 Mão",
                "sub": "Basta puxar a luminária para recarregar quando necessário"
            },
            {
                "img": "public/assets/images/hero_lumora_wardrobe_1792262010537.jpg",
                "dur": 4,
                "zoom": "zoom+0.0007",
                "tag": "VERSATILIDADE TOTAL",
                "headline": "Fixa em Armários, Paredes, Madeira e Metal",
                "sub": "Instale em roupeiros, closets, sapateiras e despensas"
            }
        ]
    },
    {
        "filename": "luminaria_video_3_sensor_bateria.mp4",
        "title": "Teste do Sensor PIR no Escuro & Bateria USB-C",
        "category": "Tecnologia & Bateria",
        "scenes": [
            {
                "img": "public/assets/images/lumora_usbc_charging_1792262012537.jpg",
                "dur": 4,
                "zoom": "zoom+0.0006",
                "tag": "BATERIA RECARREGÁVEL",
                "headline": "Bateria de Lítio Recarregável USB-C",
                "sub": "Dispensa pilhas descartáveis · Cabo USB incluído na caixa"
            },
            {
                "img": "public/assets/images/hero_lumora_wardrobe_1792262010537.jpg",
                "dur": 4,
                "zoom": "zoom+0.0007",
                "tag": "SENSOR DE PRESENÇA NO ESCURO",
                "headline": "Detecção de Movimento até 3 Metros",
                "sub": "Ângulo de 120° · Acende em 0,1 segundo no escuro"
            },
            {
                "img": "public/assets/images/lumora_modes_display_1792359745079.jpg",
                "dur": 4,
                "zoom": "zoom+0.0005",
                "tag": "ECONOMIA & AUTONOMIA",
                "headline": "Até 60 Dias de Autonomia em Modo Sensor",
                "sub": "Desliga automaticamente após 20 segundos sem movimento"
            }
        ]
    },
    {
        "filename": "luminaria_video_4_cozinha_bancada.mp4",
        "title": "Iluminação Prática de Cozinha e Bancadas",
        "category": "Cozinha & Sob Armários",
        "scenes": [
            {
                "img": "public/assets/images/lumora_kitchen_undercabinet_1792359686505.jpg",
                "dur": 4,
                "zoom": "zoom+0.0007",
                "tag": "UNDER-CABINET LIGHTING",
                "headline": "Iluminação Sob Armários de Cozinha",
                "sub": "Luz focal potente para preparação de alimentos sem sombras"
            },
            {
                "img": "public/assets/images/product_lumora_isolated_1792262011015.jpg",
                "dur": 4,
                "zoom": "zoom+0.0006",
                "tag": "SEM FIOS NA BANCADA",
                "headline": "Sem Fios Pendurados nem Obras Elétricas",
                "sub": "Não necessita de ponto de tomada perto da bancada"
            },
            {
                "img": "public/assets/images/lumora_modes_display_1792359745079.jpg",
                "dur": 4,
                "zoom": "zoom+0.0005",
                "tag": "MODO CONTÍNUO OU SENSOR",
                "headline": "Comutador Fácil: Modo Contínuo ou Sensor",
                "sub": "Deixe ligada enquanto cozinha ou automática para a noite"
            }
        ]
    },
    {
        "filename": "luminaria_video_5_escadas_corredor.mp4",
        "title": "Luz de Segurança Noturna para Escadas e Corredores",
        "category": "Segurança Noturna",
        "scenes": [
            {
                "img": "public/assets/images/lumora_staircase_night_1792359733537.jpg",
                "dur": 4,
                "zoom": "zoom+0.0006",
                "tag": "SEGURANÇA NOTURNA",
                "headline": "Degraus e Escadas Iluminados Automaticamente",
                "sub": "Detecta os passos no escuro e acende instantaneamente"
            },
            {
                "img": "public/assets/images/lumora_hallway_lighting_1792262011603.jpg",
                "dur": 4,
                "zoom": "zoom+0.0006",
                "tag": "PROTEÇÃO PARA A FAMÍLIA",
                "headline": "Corredores Seguros para Crianças e Idosos",
                "sub": "Luz suave que orienta o caminho sem ofuscar a visão"
            },
            {
                "img": "public/assets/images/hero_lumora_wardrobe_1792262010537.jpg",
                "dur": 4,
                "zoom": "zoom+0.0007",
                "tag": "CONFORTO NOTURNO",
                "headline": "Desliga Sozinha após a Passagem",
                "sub": "Praticidade total para noites tranquilas e seguras"
            }
        ]
    }
]

font_bold = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
os.makedirs("public/assets/videos", exist_ok=True)
os.makedirs("public/videos", exist_ok=True)

for vid_idx, vid in enumerate(VIDEOS_CONFIG):
    print(f"\n==========================================")
    print(f"Gerando Vídeo {vid_idx+1}/{len(VIDEOS_CONFIG)}: {vid['title']}")
    print(f"==========================================")

    clip_paths = []
    for sc_idx, sc in enumerate(vid["scenes"]):
        clip_out = f"/tmp/v_{vid_idx}_clip_{sc_idx}.mp4"
        clip_paths.append(clip_out)

        dur = sc["dur"]
        tag_text = sc["tag"].replace(":", "\\:").replace("'", "\\'")
        head_text = sc["headline"].replace(":", "\\:").replace("'", "\\'")
        sub_text = sc["sub"].replace(":", "\\:").replace("'", "\\'")

        # Complex video filter with zoompan, bottom gradient overlay and drawtext in Portuguese
        vf = (
            f"scale=1280:720:force_original_aspect_ratio=increase,"
            f"crop=1280:720,"
            f"zoompan=z='min({sc['zoom']},1.15)':d={dur*25}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1280x720:fps=25,"
            # Semi-transparent dark banner at bottom
            f"drawbox=y=ih-170:color=black@0.75:width=iw:height=170:t=fill,"
            # Top badge
            f"drawtext=fontfile='{font_bold}':text='{tag_text}':fontcolor=0xC6A66B:fontsize=18:x=40:y=h-145,"
            # Main Headline
            f"drawtext=fontfile='{font_bold}':text='{head_text}':fontcolor=white:fontsize=28:x=40:y=h-115,"
            # Subtitle
            f"drawtext=fontfile='{font_bold}':text='{sub_text}':fontcolor=0xE0E0E0:fontsize=18:x=40:y=h-75,"
            f"format=yuv420p"
        )

        cmd = [
            "ffmpeg", "-y",
            "-loop", "1",
            "-i", sc["img"],
            "-t", str(dur),
            "-vf", vf,
            "-c:v", "libx264",
            "-preset", "veryfast",
            "-crf", "22",
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

print("\nTODOS OS 5 VÍDEOS DA LUMINÁRIA LED RECARREGÁVEL FORAM GERADOS COM SUCESSO!")
