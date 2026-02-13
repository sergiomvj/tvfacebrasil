import os
import subprocess
import json
import time

def generate_subtitles(script_blocks, output_srt):
    """
    Generates an SRT file from script blocks.
    In a real scenario, we might use whisper to get exact timings,
    but here we estimate based on word count.
    """
    with open(output_srt, "w", encoding="utf-8") as f:
        current_time = 0.0
        for i, block in enumerate(script_blocks):
            content = block.get("content", "")
            duration = len(content.split()) * 0.5  # Rough estimate: 2 words per second
            
            start_h = int(current_time // 3600)
            start_m = int((current_time % 3600) // 60)
            start_s = int(current_time % 60)
            start_ms = int((current_time * 1000) % 1000)
            
            end_time = current_time + duration
            end_h = int(end_time // 3600)
            end_m = int((end_time % 3600) // 60)
            end_s = int(end_time % 60)
            end_ms = int((end_time * 1000) % 1000)
            
            f.write(f"{i+1}\n")
            f.write(f"{start_h:02}:{start_m:02}:{start_s:02},{start_ms:03} --> {end_h:02}:{end_m:02}:{end_s:02},{end_ms:03}\n")
            f.write(f"{content}\n\n")
            
            current_time = end_time

def assemble_video(audio_path, video_path, output_path, logo_path=None, srt_path=None, bg_media=None):
    """
    Assembles a video with audio, logo, subtitles (burn-in), and background stock media.
    """
    print(f"🚀 Starting advanced assembly: {output_path}")
    
    # 1. Base command
    ffmpeg_cmd = ['ffmpeg', '-y']
    
    # Inputs
    ffmpeg_cmd.extend(['-i', video_path]) # 0: Avatar
    ffmpeg_cmd.extend(['-i', audio_path]) # 1: Audio
    
    input_count = 2
    logo_idx = -1
    bg_idx = -1
    
    if logo_path and os.path.exists(logo_path):
        ffmpeg_cmd.extend(['-i', logo_path]) # 2: Logo
        logo_idx = input_count
        input_count += 1
        
    if bg_media and os.path.exists(bg_media):
        ffmpeg_cmd.extend(['-i', bg_media]) # 3: Background
        bg_idx = input_count
        input_count += 1

    # Filter Complex Construction
    filters = []
    
    # Start with avatar video
    current_v = "[0:v]"
    
    # Background integration (if provided)
    if bg_idx != -1:
        # Scale background to match and overlay avatar on top (pip or background)
        # Assuming background is the main canvas
        filters.append(f"[{bg_idx}:v]scale=1920:1080[bg]")
        filters.append(f"{current_v}scale=640:-1[avatar_small]")
        filters.append(f"[bg][avatar_small]overlay=main_w-overlay_w-40:main_h-overlay_h-40[v_composed]")
        current_v = "[v_composed]"
    
    # Logo overlay
    if logo_idx != -1:
        filters.append(f"{current_v}[temp_v]; [{logo_idx}:v]scale=200:-1[logoscale]; [temp_v][logoscale]overlay=40:40[v_logo]")
        current_v = "[v_logo]"
        
    # Subtitles burn-in
    if srt_path and os.path.exists(srt_path):
        # Escape path for ffmpeg filter
        srt_path_esc = srt_path.replace("\\", "/").replace(":", "\\:")
        filters.append(f"{current_v}subtitles='{srt_path_esc}':force_style='FontName=Arial,FontSize=24,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=2'[v_sub]")
        current_v = "[v_sub]"

    if filters:
        ffmpeg_cmd.extend(['-filter_complex', ";".join(filters)])
        ffmpeg_cmd.extend(['-map', current_v, '-map', '1:a'])
    else:
        ffmpeg_cmd.extend(['-map', '0:v', '-map', '1:a'])
        
    ffmpeg_cmd.extend([
        '-c:v', 'libx264', '-preset', 'fast', '-crf', '22',
        '-c:a', 'aac', '-b:a', '192k',
        '-shortest',
        output_path
    ])
    
    try:
        start_time = time.time()
        subprocess.run(ffmpeg_cmd, check=True)
        end_time = time.time()
        
        print(f"✅ Video assembled successfully in {end_time - start_time:.2f}s: {output_path}")
        
        # Output usage for cost monitoring
        usage = {
            "service": "media-engine",
            "duration": end_time - start_time,
            "status": "success"
        }
        return usage
    except subprocess.CalledProcessError as e:
        print(f"❌ Error during assembly: {e}")
        return None

if __name__ == "__main__":
    # Test values
    script_mock = [
        {"content": "Olá, esta é uma notícia importante da TV Facebrasil."},
        {"content": "Estamos testando o novo sistema de legendas automáticas."},
        {"content": "Não se esqueça de se inscrever para mais novidades."}
    ]
    
    os.makedirs("temp", exist_ok=True)
    generate_subtitles(script_mock, "temp/subtitles.srt")
    
    print("Media Engine updated with subtitle and stock support.")
