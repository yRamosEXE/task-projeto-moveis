#!/bin/bash

# Libera as portas se já estiverem presas
kill -9 $(lsof -t -i :8000) 2>/dev/null || true
kill -9 $(lsof -t -i :5173) 2>/dev/null || true

# Garante que o Postgres.app está ativo
open -a Postgres 2>/dev/null || true

echo "====================================================="
echo "   A verificar ambiente Sistema de Gestão de Móveis..."
echo "====================================================="

# Ativa o backend Django
cd ~/Documents/task-projeto-moveis/backend
source venv/bin/activate
python manage.py migrate
python manage.py runserver &
BACKEND_PID=$!

# Ativa o Node 20 e inicia o frontend Vite
cd ~/Documents/task-projeto-moveis/frontend
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20 >/dev/null 2>&1 || true
npm run dev &
FRONTEND_PID=$!

# Aguarda 3 segundos para os servidores subirem
sleep 3

# Abre as páginas corretas no navegador
open "http://localhost:5173"
open "http://127.0.0.1:8000/api/moveis/"

echo "====================================================="
echo "   SISTEMA EM EXECUÇÃO!"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://127.0.0.1:8000/api/moveis/"
echo "====================================================="

# Mantém o script rodando e fecha ambos ao pressionar CTRL+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
