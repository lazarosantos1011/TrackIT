from flask import Flask, send_from_directory
from flask_cors import CORS
from config import Config
from models.database import db
from routes.equipamento_routes import equipamento_bp

app = Flask(__name__, static_folder='../assets')
app.config.from_object(Config)
CORS(app)

# Inicializar o banco de dados
db.init_app(app)

# Registrar as rotas
app.register_blueprint(equipamento_bp)

# Criar as tabelas no banco de dados
with app.app_context():
    db.create_all()

# Rota para servir o index.html
@app.route('/')
def index():
    return send_from_directory('../', 'index.html')

# Rota para servir o dashboard.html
@app.route('/dashboard')
def dashboard():
    return send_from_directory('../', 'dashboard.html')

# Rota para servir os arquivos estáticos (CSS, JS, imagens...)
@app.route('/assets/<path:path>')
def serve_assets(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(debug=True)
