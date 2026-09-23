#!/bin/bash

# Garante que o Postgres.app está aberto
open -a Postgres

# Terminal 1: Backend (Django)
osascript -e 'tell app "Terminal" to do script "cd ~/Documents/task-projeto-moveis/backend && source venv/bin/activate && python manage.py migrate && python manage.py runserver"'

# Terminal 2: Frontend (React / Vite)
osascript -e 'tell app "Terminal" to do script "cd ~/Documents/task-projeto-moveis/frontend && source ~/.zshrc && nvm use 20 2>/dev/null || true; npm run dev"'

# Aguarda 3 segundos e abre os dois no navegador
sleep 3
open "http://localhost:5173"
open "http://127.0.0.1:8000/api/moveis/"
