#!/bin/bash
set -e
URL="https://aryplus.tv/video/v2/3/6aaeb19765a92de0f19da7e4/6a57868b5bf57c474cc00a50"

echo "1. Analyzing URL..."
ANALYZE_RES=$(curl -s -X POST http://localhost:3000/api/analyze -H "Content-Type: application/json" -d "{\"url\":\"$URL\"}")
echo "Analyze result: $ANALYZE_RES"

TITLE=$(echo $ANALYZE_RES | grep -o '"title":"[^"]*' | cut -d'"' -f4)
echo "Title: $TITLE"

# Pick the lowest quality (last in the array typically, or we can just grab the 240p one)
STREAM_URL=$(echo $ANALYZE_RES | grep -o '"url":"[^"]*' | grep "240p" | head -n 1 | cut -d'"' -f4)
if [ -z "$STREAM_URL" ]; then
  # Fallback to just the first stream found
  STREAM_URL=$(echo $ANALYZE_RES | grep -o '"url":"[^"]*' | head -n 1 | cut -d'"' -f4)
fi
echo "Stream URL: $STREAM_URL"

echo "2. Starting Download..."
DOWNLOAD_RES=$(curl -s -X POST http://localhost:3000/api/download -H "Content-Type: application/json" -d "{\"streamUrl\":\"$STREAM_URL\", \"title\":\"$TITLE\"}")
echo "Download result: $DOWNLOAD_RES"

JOBID=$(echo $DOWNLOAD_RES | grep -o '"jobId":"[^"]*' | cut -d'"' -f4)
echo "JobID: $JOBID"

echo "3. Polling Status..."
while true; do
  STATUS_RES=$(curl -s http://localhost:3000/api/status/$JOBID)
  STATUS=$(echo $STATUS_RES | grep -o '"status":"[^"]*' | cut -d'"' -f4)
  echo "Status: $STATUS_RES"
  
  if [ "$STATUS" = "completed" ]; then
    break
  elif [ "$STATUS" = "error" ]; then
    echo "Download failed!"
    exit 1
  fi
  sleep 3
done

echo "4. Downloading MP4 from server..."
curl -s -o "test_output.mp4" "http://localhost:3000/api/files/$JOBID"
ls -lh test_output.mp4
echo "Test passed."
