#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"
if ! command -v node &> /dev/null; then
    osascript -e 'display dialog "Node.js is not installed.\n\nGo to nodejs.org, download LTS and install it." with title "Card Vault" buttons {"OK"} default button "OK" with icon caution'
    exit 1
fi
if [ ! -d "node_modules" ]; then
    osascript -e 'display dialog "First time setup — installing dependencies (~30 sec)." with title "Card Vault" buttons {"OK"} default button "OK"'
    npm install
fi
sleep 2
open http://localhost:5173 &
osascript -e 'display notification "Card Vault is starting..." with title "Card Vault"'
npm run dev
