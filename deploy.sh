#!/bin/bash
cd /c/Users/Administrator/Projects/bead-game

# 安装 Vercel CLI
npm install -g vercel --registry=https://registry.npmmirror.com 2>&1 | tail -5

echo "=== Vercel CLI 安装完成 ==="
vercel --version 2>&1
