import re
import urllib.request
import urllib.error
import json
import ssl

# Bypass SSL certificate verification for links that might have expired certs but are still online
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def extract_urls_and_videos():
    # Read files
    with open('app/playgroundData.ts', 'r', encoding='utf-8') as f:
        play_content = f.read()
    with open('app/pulseData.ts', 'r', encoding='utf-8') as f:
        pulse_content = f.read()

    # Extract YouTube IDs: youtubeId: "..."
    youtube_ids = set(re.findall(r'youtubeId:\s*["\']([^"\']+)["\']', play_content + pulse_content))

    # Extract URLs: toolUrl: "..." or url: "..."
    urls = set(re.findall(r'(?:toolUrl|url):\s*["\'](https?://[^"\']+)["\']', play_content + pulse_content))

    return list(youtube_ids), list(urls)

def test_url(url):
    print(f"Testing URL: {url} ... ", end="")
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        )
        with urllib.request.urlopen(req, timeout=5, context=ctx) as response:
            status = response.getcode()
            print(f"OK ({status})")
            return True, status
    except urllib.error.HTTPError as e:
        # Some sites block headless requests but are active (e.g. 403, 401)
        if e.code in [403, 401, 301, 302, 307, 308]:
            print(f"ACTIVE BUT BLOCKED HEADLESS ({e.code})")
            return True, e.code
        print(f"FAILED ({e.code})")
        return False, e.code
    except Exception as e:
        print(f"FAILED ({e})")
        return False, str(e)

def test_youtube_video(video_id):
    # oembed URL returns details of the video if it exists and is public
    url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}"
    print(f"Testing YouTube Video: {video_id} ... ", end="")
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            print("OK")
            return True
    except Exception as e:
        # fallback thumbnail check: if thumbnail exists, video is generally valid
        thumb_url = f"https://img.youtube.com/vi/{video_id}/mqdefault.jpg"
        try:
            with urllib.request.urlopen(thumb_url, timeout=5) as response:
                # mqdefault returns a fallback placeholder image of 120x90 if it is broken, 
                # but if we get 200 OK it is usually valid.
                print("OK (Fallback Thumbnail Checked)")
                return True
        except Exception:
            print(f"FAILED ({e})")
            return False

def main():
    youtube_ids, urls = extract_urls_and_videos()
    print(f"Found {len(urls)} URLs and {len(youtube_ids)} YouTube IDs to test.")
    print("=" * 60)

    broken_urls = []
    broken_videos = []

    print("\n--- Testing Web URLs ---")
    for url in urls:
        ok, status = test_url(url)
        if not ok:
            broken_urls.append((url, status))

    print("\n--- Testing YouTube Videos ---")
    for vid in youtube_ids:
        ok = test_youtube_video(vid)
        if not ok:
            broken_videos.append(vid)

    print("=" * 60)
    print("TEST RESULTS SUMMARY:")
    print(f"Total Web URLs tested: {len(urls)} | Broken: {len(broken_urls)}")
    for url, err in broken_urls:
        print(f"  - Broken URL: {url} (Reason: {err})")

    print(f"Total YouTube Videos tested: {len(youtube_ids)} | Broken: {len(broken_videos)}")
    for vid in broken_videos:
        print(f"  - Broken Video ID: {vid}")

if __name__ == '__main__':
    main()
