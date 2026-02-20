#!/bin/bash
set -e

echo "================================================"
echo "  EduAvatar - Development Environment Setup"
echo "================================================"
echo ""

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "Error: Node.js is required. Install from https://nodejs.org"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "Installing pnpm..."; corepack enable && corepack prepare pnpm@latest --activate; }
command -v docker >/dev/null 2>&1 || echo "Warning: Docker not found. You'll need it for database and LiveKit."
command -v python3 >/dev/null 2>&1 || echo "Warning: Python 3 not found. You'll need it for the LiveKit agent."

echo "1. Installing Node.js dependencies..."
pnpm install

echo ""
echo "2. Setting up environment..."
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "   Created .env.local from .env.example"
  echo "   Please edit .env.local with your API keys"
else
  echo "   .env.local already exists, skipping"
fi

echo ""
echo "3. Setting up Python agent environment..."
if [ -d "apps/agent" ]; then
  cd apps/agent
  python3 -m venv .venv 2>/dev/null || echo "   Warning: Could not create Python venv"
  if [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
    pip install -r requirements.txt -q
    echo "   Python dependencies installed"
  fi
  cd ../..
fi

echo ""
echo "4. Generating Prisma client..."
pnpm db:generate 2>/dev/null || echo "   Prisma generate will run when database is ready"

echo ""
echo "================================================"
echo "  Setup complete!"
echo ""
echo "  To start development:"
echo "    1. Start services:  docker compose -f docker/docker-compose.yml up -d"
echo "    2. Push DB schema:  pnpm db:push"
echo "    3. Start frontend:  pnpm dev"
echo "    4. Start agent:     cd apps/agent && python agent.py dev"
echo ""
echo "  Or run everything with Docker:"
echo "    docker compose -f docker/docker-compose.yml up"
echo "================================================"
