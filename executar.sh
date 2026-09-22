#!/bin/bash
set -e

# Garante que o script roda a partir da raiz do projeto
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "====================================================="
echo "   Iniciando Sistema Adequi Móveis"
echo "====================================================="

# 1. Configurar e Subir o Backend (Django)
echo "🐍 [1/2] Verificando ambiente Python (Django)..."
cd "$DIR/backend"

if [ ! -d "venv" ]; then
    echo "⚙️ Criando ambiente virtual Python (primeira execução)..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt --quiet
python manage.py migrate --noinput

echo "🚀 Rodando servidor Django em segundo plano..."
python manage.py runserver &
PID_BACK=$!

# 2. Configurar e Subir o Frontend (React / Vite)
echo "⚛️ [2/2] Verificando dependências Node (React)..."
cd "$DIR/frontend"

if [ ! -d "node_modules" ]; then
    echo "📦 Instalando pacotes do frontend (primeira execução)..."
    npm install --quiet
fi

echo "🚀 Rodando Frontend Vite..."
npm run dev &
PID_FRONT=$!

# Abre o navegador automaticamente na página do sistema
sleep 3
xdg-open http://localhost:5173 2>/dev/null || true

echo "====================================================="
echo "   SISTEMA NO AR!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://127.0.0.1:8000"
echo "   (Feche esta janela para encerrar o sistema)"
echo "====================================================="

# Ao fechar a janela ou dar Ctrl+C, encerra os dois servidores juntos
trap "kill $PID_BACK $PID_FRONT 2>/dev/null" EXIT
wait