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
  
  // 1. Estado para saber qual móvel estamos a editar. Se for null, estamos a criar.
  const [editandoId, setEditandoId] = useState<number | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/moveis/')
      .then(resposta => setMoveis(resposta.data))
      .catch(erro => console.error(erro));
  }, []);

  const lidarComMudanca = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNovoMovel({ ...novoMovel, [e.target.name]: e.target.value });
  };

  // 2. A função foi renomeada para salvarMovel porque agora serve para Criar e Editar
  const salvarMovel = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editandoId) {
      // MODO EDIÇÃO (PUT)
      axios.put(`http://localhost:8000/api/moveis/${editandoId}/`, novoMovel)
        .then(resposta => {
          // Atualiza apenas o móvel editado na lista visual
          setMoveis(moveis.map(m => m.id === editandoId ? resposta.data : m));
          cancelarEdicao(); // Limpa o formulário e sai do modo de edição
        })
        .catch(erro => console.error("Erro ao editar:", erro));
    } else {
      // MODO CRIAÇÃO (POST)
      axios.post('http://localhost:8000/api/moveis/', novoMovel)
        .then(resposta => {
          setMoveis([...moveis, resposta.data]);
          setNovoMovel({ nome: '', marca: '', quantidade: '', preco: '' });
        })
        .catch(erro => console.error("Erro ao adicionar:", erro));
    }
  };

  // 3. Preenche o formulário com os dados do móvel que queremos alterar
  const iniciarEdicao = (movel: Movel) => {
    setNovoMovel({
      nome: movel.nome,
      marca: movel.marca,
      quantidade: String(movel.quantidade),
      preco: movel.preco
    });
    setEditandoId(movel.id); // Liga o modo de edição
  };

  // 4. Limpa tudo se nos arrependermos de editar
  const cancelarEdicao = () => {
    setNovoMovel({ nome: '', marca: '', quantidade: '', preco: '' });
    setEditandoId(null);
  };

  const apagarMovel = (id: number) => {
    axios.delete(`http://localhost:8000/api/moveis/${id}/`)
      .then(() => setMoveis(moveis.filter(movel => movel.id !== id)))
      .catch(erro => console.error("Erro ao apagar:", erro));
  };

  return (
    <div className="App">
      <h1>Sistema de Gestão de Móveis</h1>

      <form onSubmit={salvarMovel} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #aaa', borderRadius: '8px' }}>
        {/* O título muda dependendo do modo */}
        <h2>{editandoId ? 'Editar Móvel' : 'Adicionar Novo Móvel'}</h2>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <input type="text" name="nome" placeholder="Nome" value={novoMovel.nome} onChange={lidarComMudanca} required />
          <input type="text" name="marca" placeholder="Marca" value={novoMovel.marca} onChange={lidarComMudanca} required />
          <input type="number" name="quantidade" placeholder="Quantidade" value={novoMovel.quantidade} onChange={lidarComMudanca} required />
          <input type="number" step="0.01" name="preco" placeholder="Preço" value={novoMovel.preco} onChange={lidarComMudanca} required />
          
          <button type="submit" style={{ backgroundColor: editandoId ? '#28a745' : '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}>
            {editandoId ? 'Atualizar' : 'Guardar Móvel'}
          </button>
          
          {/* Botão de cancelar só aparece quando estamos a editar */}
          {editandoId && (
            <button type="button" onClick={cancelarEdicao} style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}>
              Cancelar
            </button>
          )}
        </div>
      </form>
      
      <div className="lista-moveis">
        {moveis.map(movel => (
          <div key={movel.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', textAlign: 'left', position: 'relative' }}>
            <h3>{movel.nome}</h3>
            <p><strong>Marca:</strong> {movel.marca}</p>
            <p><strong>Quantidade:</strong> {movel.quantidade}</p>
            <p><strong>Preço:</strong> {movel.preco} €</p>
            
            {/* Agrupamento dos botões Editar e Apagar */}
            <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px' }}>
              <button onClick={() => iniciarEdicao(movel)} style={{ backgroundColor: '#ffc107', color: 'black', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                Editar
              </button>
              <button onClick={() => apagarMovel(movel.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                Apagar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;