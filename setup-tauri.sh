#!/bin/bash

echo "🚀 XivStrat Tauri Setup Script"
echo "=============================="

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust is not installed!"
    echo ""
    echo "Please install Rust first:"
    echo "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    echo ""
    echo "After installation, run: source $HOME/.cargo/env"
    exit 1
fi

echo "✅ Rust is installed"

# Check platform and install dependencies
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Detected macOS"
    echo "Checking for Xcode Command Line Tools..."
    if ! xcode-select -p &> /dev/null; then
        echo "Installing Xcode Command Line Tools..."
        xcode-select --install
    else
        echo "✅ Xcode Command Line Tools installed"
    fi
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Detected Linux"
    echo "Please ensure these packages are installed:"
    echo "sudo apt install libwebkit2gtk-4.0-dev build-essential curl wget libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev"
fi

echo ""
echo "📦 Installing npm dependencies..."
npm install

echo ""
echo "🎨 Generating app icons..."
npm run tauri:icon

echo ""
echo "✅ Setup complete!"
echo ""
echo "You can now run:"
echo "  npm run tauri:dev    - Development mode"
echo "  npm run tauri:build  - Build for production"