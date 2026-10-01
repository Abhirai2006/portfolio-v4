#!/usr/bin/env bash
# One-time: download the site images/videos/font from your old Lovable site into public/media/.
# Run from the project root while the old site is still online:  bash scripts/fetch-assets.sh
OLD="https://portfolio-abhirai2006.lovable.app/__l5e/assets-v1"
mkdir -p public/media
fail=0
[ -s public/media/ace-loop.mp4 ] || curl -fL --retry 2 -o public/media/ace-loop.mp4 "$OLD/f7b43a44-cba1-477c-b98f-2d8033bdc9ec/ace-loop.mp4" || { echo "FAILED: ace-loop.mp4"; fail=1; }
[ -s public/media/ace.jpg ] || curl -fL --retry 2 -o public/media/ace.jpg "$OLD/b47969c9-7190-4698-b654-0497c743d25c/ace.jpg" || { echo "FAILED: ace.jpg"; fail=1; }
[ -s public/media/ace.mp4 ] || curl -fL --retry 2 -o public/media/ace.mp4 "$OLD/9ceecd37-5075-4cd3-9d29-44399e5dcfae/ace.mp4" || { echo "FAILED: ace.mp4"; fail=1; }
[ -s public/media/aot-loop.mp4 ] || curl -fL --retry 2 -o public/media/aot-loop.mp4 "$OLD/6424e6ba-4ab5-4708-b37f-383cb516afec/aot-loop.mp4" || { echo "FAILED: aot-loop.mp4"; fail=1; }
[ -s public/media/aot.jpg ] || curl -fL --retry 2 -o public/media/aot.jpg "$OLD/1f27180b-6b15-4f0e-a881-59341686636b/aot.jpg" || { echo "FAILED: aot.jpg"; fail=1; }
[ -s public/media/aot.mp4 ] || curl -fL --retry 2 -o public/media/aot.mp4 "$OLD/0067df10-2121-4794-bc22-b45ddc63201e/aot.mp4" || { echo "FAILED: aot.mp4"; fail=1; }
[ -s public/media/asta-loop.mp4 ] || curl -fL --retry 2 -o public/media/asta-loop.mp4 "$OLD/da854f41-ee19-4048-8213-f2785f9916d6/asta-loop.mp4" || { echo "FAILED: asta-loop.mp4"; fail=1; }
[ -s public/media/asta.jpg ] || curl -fL --retry 2 -o public/media/asta.jpg "$OLD/f34cb728-624e-43ae-849c-f2c2923e81c8/asta.jpg" || { echo "FAILED: asta.jpg"; fail=1; }
[ -s public/media/asta.mp4 ] || curl -fL --retry 2 -o public/media/asta.mp4 "$OLD/934f7024-4be6-46e8-b057-caf6d20fba8e/asta.mp4" || { echo "FAILED: asta.mp4"; fail=1; }
[ -s public/media/demonslayer-loop.mp4 ] || curl -fL --retry 2 -o public/media/demonslayer-loop.mp4 "$OLD/8f9fc417-335e-4f9d-8013-3abf6812bbea/demonslayer-loop.mp4" || { echo "FAILED: demonslayer-loop.mp4"; fail=1; }
[ -s public/media/demonslayer.jpg ] || curl -fL --retry 2 -o public/media/demonslayer.jpg "$OLD/25c97c53-d3e9-40b0-bc6c-a7d03fceaafa/demonslayer.jpg" || { echo "FAILED: demonslayer.jpg"; fail=1; }
[ -s public/media/demonslayer.mp4 ] || curl -fL --retry 2 -o public/media/demonslayer.mp4 "$OLD/39012a04-5bfe-40ca-911d-2270651af987/demonslayer.mp4" || { echo "FAILED: demonslayer.mp4"; fail=1; }
[ -s public/media/naruto-loop.mp4 ] || curl -fL --retry 2 -o public/media/naruto-loop.mp4 "$OLD/a7d36ea0-5366-4302-ba4a-e715673d484c/naruto-loop.mp4" || { echo "FAILED: naruto-loop.mp4"; fail=1; }
[ -s public/media/naruto.jpg ] || curl -fL --retry 2 -o public/media/naruto.jpg "$OLD/ac27669b-10cf-48c4-ace5-b8b6c10f666d/naruto.jpg" || { echo "FAILED: naruto.jpg"; fail=1; }
[ -s public/media/naruto.mp4 ] || curl -fL --retry 2 -o public/media/naruto.mp4 "$OLD/ed1a8494-0d91-4b94-8459-420582bb3b10/naruto.mp4" || { echo "FAILED: naruto.mp4"; fail=1; }
[ -s public/media/og-cover.jpg ] || curl -fL --retry 2 -o public/media/og-cover.jpg "$OLD/bd600cea-8d14-4ee4-bc94-680949395fcc/og-cover.jpg" || { echo "FAILED: og-cover.jpg"; fail=1; }
[ -s public/media/one-piece-font.ttf ] || curl -fL --retry 2 -o public/media/one-piece-font.ttf "$OLD/053f8ee2-cc59-4cd8-b35b-a2cf3f47624d/one-piece-font.ttf" || { echo "FAILED: one-piece-font.ttf"; fail=1; }
[ -s public/media/bs-1.png ] || curl -fL --retry 2 -o public/media/bs-1.png "$OLD/c3d0564b-e9b6-4e1f-a67e-4024c48f07e9/bs-1.png" || { echo "FAILED: bs-1.png"; fail=1; }
[ -s public/media/bs-2.png ] || curl -fL --retry 2 -o public/media/bs-2.png "$OLD/24968e74-511b-43b6-9a78-5bd2cc6d6303/bs-2.png" || { echo "FAILED: bs-2.png"; fail=1; }
[ -s public/media/bs-3.png ] || curl -fL --retry 2 -o public/media/bs-3.png "$OLD/9c81a71a-70c1-49a6-b949-dba7f76ffd71/bs-3.png" || { echo "FAILED: bs-3.png"; fail=1; }
[ -s public/media/muse-1.png ] || curl -fL --retry 2 -o public/media/muse-1.png "$OLD/886d6291-e893-4d97-9f29-7f7c9cd80c55/muse-1.png" || { echo "FAILED: muse-1.png"; fail=1; }
[ -s public/media/muse-2.png ] || curl -fL --retry 2 -o public/media/muse-2.png "$OLD/aba22fd1-43f1-4359-a6ef-0afe43739aca/muse-2.png" || { echo "FAILED: muse-2.png"; fail=1; }
[ -s public/media/muse-3.png ] || curl -fL --retry 2 -o public/media/muse-3.png "$OLD/272da648-78af-4007-b9be-8b93c1df0ed7/muse-3.png" || { echo "FAILED: muse-3.png"; fail=1; }
[ -s public/media/sort-1.png ] || curl -fL --retry 2 -o public/media/sort-1.png "$OLD/7fdc2448-d5db-41f6-9776-6a6acb3857e2/sort-1.png" || { echo "FAILED: sort-1.png"; fail=1; }
[ -s public/media/sort-2.png ] || curl -fL --retry 2 -o public/media/sort-2.png "$OLD/1e16aae1-1c9a-40af-9f5c-7f01109f6bcf/sort-2.png" || { echo "FAILED: sort-2.png"; fail=1; }
[ -s public/media/sort-3.png ] || curl -fL --retry 2 -o public/media/sort-3.png "$OLD/a0520801-7cf5-4e6d-acf1-6737b9b65635/sort-3.png" || { echo "FAILED: sort-3.png"; fail=1; }
[ $fail = 0 ] && echo "All assets downloaded." || echo "Some files failed - see above."
