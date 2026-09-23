import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Movel {
  id: number;
  nome: string;
  marca: string;
  quantidade: number;
  preco: string;
}

function App() {
  const [moveis, setMoveis] = useState<Movel[]>([]);
  const [novoMovel, setNovoMovel] = useState({ nome: '', marca: '', quantidade: '', preco: '' });
  const [editandoId, setEditandoId] = useState<number | null>(null);

  useEffect(() => {
    carregarMoveis();
  }, []);

  const carregarMoveis = () => {
    axios.get('http://localhost:8000/api/moveis/')
      .then(resposta => setMoveis(resposta.data))
      .catch(erro => console.error('Erro ao carregar móveis:', erro));
  };

  const lidarComMudanca = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNovoMovel({ ...novoMovel, [e.target.name]: e.target.value });
  };

  const salvarMovel = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editandoId) {
      axios.put(`http://localhost:8000/api/moveis/${editandoId}/`, novoMovel)
        .then(resposta => {
          setMoveis(moveis.map(m => m.id === editandoId ? resposta.data : m));
          cancelarEdicao();
        })
        .catch(erro => console.error('Erro ao editar:', erro));
    } else {
      axios.post('http://localhost:8000/api/moveis/', novoMovel)
        .then(resposta => {
          setMoveis([...moveis, resposta.data]);
          setNovoMovel({ nome: '', marca: '', quantidade: '', preco: '' });
        })
        .catch(erro => console.error('Erro ao adicionar:', erro));
    }
  };

  const iniciarEdicao = (movel: Movel) => {
    setNovoMovel({
      nome: movel.nome,
      marca: movel.marca,
      quantidade: String(movel.quantidade),
      preco: movel.preco
    });
    setEditandoId(movel.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicao = () => {
    setNovoMovel({ nome: '', marca: '', quantidade: '', preco: '' });
    setEditandoId(null);
  };

  const apagarMovel = (id: number) => {
    if (window.confirm('Tem certeza de que deseja excluir este móvel?')) {
      axios.delete(`http://localhost:8000/api/moveis/${id}/`)
        .then(() => setMoveis(moveis.filter(movel => movel.id !== id)))
        .catch(erro => console.error('Erro ao apagar:', erro));
    }
  };

  const formatarMoeda = (valor: string | number) => {
    const num = Number(valor) || 0;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Gestão de Inventário de Móveis</h1>
        <p className="subtitle">Cadastre, edite e controle o estoque em tempo real</p>
      </header>

      <section className="card form-card">
        <div className="card-header">
          <h2>{editandoId ? '✏️ Editar Móvel' : '➕ Cadastrar Novo Móvel'}</h2>
          {editandoId && <span className="badge-editing">Modo de Edição</span>}
        </div>

        <form onSubmit={salvarMovel} className="form-grid">
          <div className="input-group">
            <label htmlFor="nome">Nome do Móvel</label>
            <input
              id="nome"
              type="text"
              name="nome"
              placeholder="Ex: Cadeira Ergonômica"
              value={novoMovel.nome}
              onChange={lidarComMudanca}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="marca">Marca</label>
            <input
              id="marca"
              type="text"
              name="marca"
              placeholder="Ex: Herman Miller"
              value={novoMovel.marca}
              onChange={lidarComMudanca}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="quantidade">Estoque (Qtd)</label>
            <input
              id="quantidade"
              type="number"
              min="0"
              name="quantidade"
              placeholder="Ex: 15"
              value={novoMovel.quantidade}
              onChange={lidarComMudanca}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="preco">Preço Unitário (R$)</label>
            <input
              id="preco"
              type="number"
              step="0.01"
              min="0"
              name="preco"
              placeholder="Ex: 1250.00"
              value={novoMovel.preco}
              onChange={lidarComMudanca}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className={editandoId ? 'btn btn-success' : 'btn btn-primary'}>
              {editandoId ? 'Atualizar Dados' : 'Guardar Móvel'}
            </button>

            {editandoId && (
              <button type="button" onClick={cancelarEdicao} className="btn btn-secondary">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <div className="card-header">
          <h2>📦 Itens no Estoque</h2>
          <span className="count-badge">{moveis.length} cadastrados</span>
        </div>

        {moveis.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum móvel cadastrado até o momento.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Marca</th>
                  <th>Quantidade</th>
                  <th>Preço</th>
                  <th style={{ textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {moveis.map(movel => (
                  <tr key={movel.id}>
                    <td>#{movel.id}</td>
                    <td className="item-name">{movel.nome}</td>
                    <td>{movel.marca}</td>
                    <td>
                      <span className={movel.quantidade > 0 ? 'stock-badge in-stock' : 'stock-badge out-stock'}>
                        {movel.quantidade} un.
                      </span>
                    </td>
                    <td className="price-cell">{formatarMoeda(movel.preco)}</td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => iniciarEdicao(movel)} className="btn-icon btn-edit" title="Editar">
                          Editar
                        </button>
                        <button onClick={() => apagarMovel(movel.id)} className="btn-icon btn-delete" title="Excluir">
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="footer">
        <div className="footer-content">
          <p className="footer-brand"><strong>GRAEST</strong> - Educação & Inovação</p>
          <div className="footer-links">
            <a href="http://www.graest.edu.com.br" target="_blank" rel="noreferrer">
              🌐 www.graest.edu.com.br
            </a>
            <a href="mailto:graest@gmail.com">
              ✉️ graest@gmail.com
            </a>
            <a href="tel:+5592981828060">
              📞 +55 (92) 9 8182 8060
            </a>
          </div>
          <p className="footer-copy">© 2026 Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;