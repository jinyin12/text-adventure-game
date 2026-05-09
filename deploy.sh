#!/bin/bash
cd /d/wjsswjss/text-adventure-game/client
npm run build
cd dist
npx vercel --prod
