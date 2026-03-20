#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

APK_DIR="app/build/outputs/apk/release"
VERSION_FILE="version.json"

# Navigate to project root (parent of scripts/)
cd "$(dirname "$0")/.."

# Read current version info
VERSION_NAME=$(grep -o '"versionName": *"[^"]*"' "$VERSION_FILE" | cut -d'"' -f4)
VERSION_CODE=$(grep -o '"versionCode": *[0-9]*' "$VERSION_FILE" | grep -o '[0-9]*')

# Auto-increment versionCode
NEW_VERSION_CODE=$((VERSION_CODE + 1))
sed -i "s/\"versionCode\": *$VERSION_CODE/\"versionCode\": $NEW_VERSION_CODE/" "$VERSION_FILE"

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}       Android Development Build        ${NC}"
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Version: ${VERSION_NAME} (${NEW_VERSION_CODE})${NC}"
echo -e "${CYAN}========================================${NC}"

cd android

echo -e "${YELLOW}[1/4] Cleaning old build files...${NC}"
rm -rf app/build app/.cxx .gradle
echo -e "${GREEN}  ✔ Clean done${NC}"

echo -e "${YELLOW}[2/4] Copying .env.development -> .env${NC}"
cp ../.env.development ../.env
echo -e "${GREEN}  ✔ .env ready${NC}"

echo -e "${YELLOW}[3/4] Building release APK...${NC}"
./gradlew assembleRelease

if [ $? -eq 0 ]; then
  echo ""
  echo -e "${GREEN}========================================${NC}"
  echo -e "${GREEN}  ✔ Build SUCCESS!                      ${NC}"
  echo -e "${GREEN}========================================${NC}"
  echo -e "${CYAN}  APK: ${APK_DIR}${NC}"

  # Install APK to connected device
  APK_FILE="${APK_DIR}/app-release.apk"
  echo ""
  echo -e "${YELLOW}[5/4] Installing APK to device...${NC}"
  adb install -r "$APK_FILE"

  if [ $? -eq 0 ]; then
    echo -e "${GREEN}  ✔ Install SUCCESS!${NC}"
  else
    echo -e "${RED}  ✘ Install FAILED! Check device connection.${NC}"
  fi
else
  echo ""
  echo -e "${RED}========================================${NC}"
  echo -e "${RED}  ✘ Build FAILED!                       ${NC}"
  echo -e "${RED}========================================${NC}"
  exit 1
fi
