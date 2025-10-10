# Static Assets Setup

This project requires certain static assets to be copied from the `answer-ai` project. Please follow these steps:

## Required Assets

### 1. Turnitin Images

Copy the following images from `answer-ai/public/images/turnitin/` to `public/images/turnitin/`:

- `Upload.png` - Upload icon
- `Download.png` - Download icon
- `arrow-right.png` - Arrow right icon
- `arrow-left.png` - Arrow left icon (for My Tasks back button)
- `ai.png` - AI watermark icon (optional)

### 2. PDF Icons

Copy from `answer-ai/public/images/pdf/` to `public/images/pdf/`:

- `ic_pdf_s.png` - PDF icon for file display

### 3. Lottie Animations

Copy from `answer-ai/public/lotties/` to `public/lotties/`:

- `turnitin-detecting.json` - Detection in progress animation
- `turnitin-complete.json` - Detection completed animation

### 4. Fonts (Optional)

If you want to use the Rethink Sans font, copy from `answer-ai/public/fonts/` to `public/fonts/`:

- `RethinkSans-Regular.ttf`
- `RethinkSans-Medium.ttf`
- `RethinkSans-SemiBold.ttf`
- `RethinkSans-Bold.ttf`

## Quick Copy Commands

If you have access to the `answer-ai` project directory, you can use these commands:

\`\`\`bash

# From the turnitin-checker directory

ANSWER_AI_PATH="../answer-ai"

# Copy Turnitin images

mkdir -p public/images/turnitin
cp $ANSWER_AI_PATH/public/images/turnitin/\*.png public/images/turnitin/

# Copy PDF icons

mkdir -p public/images/pdf
cp $ANSWER_AI_PATH/public/images/pdf/ic_pdf_s.png public/images/pdf/

# Copy Lottie animations

mkdir -p public/lotties
cp $ANSWER_AI_PATH/public/lotties/turnitin-\*.json public/lotties/

# Copy fonts

mkdir -p public/fonts
cp $ANSWER_AI_PATH/public/fonts/RethinkSans-\*.ttf public/fonts/
\`\`\`

## Alternative: Placeholder Assets

If you don't have access to the original assets, you can use placeholders:

1. **Images**: Use emoji or simple SVG icons as replacements
2. **Lottie animations**: Use simple CSS animations or find similar free animations from [LottieFiles](https://lottiefiles.com/)
3. **Fonts**: The app will fall back to system fonts if custom fonts are not available

## Verification

After copying the assets, verify they are in place:

\`\`\`bash
ls -la public/images/turnitin/
ls -la public/images/pdf/
ls -la public/lotties/
ls -la public/fonts/
\`\`\`

All required assets should be visible in these directories.
