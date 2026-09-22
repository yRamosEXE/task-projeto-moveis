#!/bin/bash

# Garante o diretório correto
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "====================================================="
echo "   A verificar ambiente Adequi Móveis..."
echo "====================================================="

# Verificar se o venv do python está disponível no sistema
python3 -m venv --help >/dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Erro: O pacote python3-venv não está instalado no Ubuntu."
    echo "💡 Execute no terminal: sudo apt update && sudo apt install python3-venv python3-pip"
    read -p "Pressione Enter para fechar..."
    exit 1
fi

# 1. Configurar e Subir Backend
cd "$DIR/backend"
if [ ! -d "venv" ]; then
    echo "⚙️ A criar ambiente virtual Python..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt --quiet
python manage.py migrate --noinput

echo "🚀 A iniciar servidor Django..."
python manage.py runserver &
PID_BACK=$!

# 2. Configurar e Subir Frontend
cd "$DIR/frontend"
if [ ! -d "node_modules" ]; then
    echo "📦 A instalar dependências do Frontend (npm install)..."
    npm install --quiet
fi

echo "🚀 A iniciar servidor Vite..."
npm run dev &
PID_FRONT=$!

sleep 3
xdg-open http://localhost:5173 2>/dev/null || sensible-browser http://localhost:5173 2>/dev/null || true

echo "====================================================="
echo "   SISTEMA EM EXECUÇÃO!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://127.0.0.1:8000"
echo "   (Feche esta janela para encerrar os servidores)"
echo "====================================================="

trap "kill $PID_BACK $PID_FRONT 2>/dev/null" EXIT
wait