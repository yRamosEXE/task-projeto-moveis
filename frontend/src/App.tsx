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

  useEffect(() => {
    axios.get('http://localhost:8000/api/moveis/')
      .then(resposta => setMoveis(resposta.data))
      .catch(erro => console.error(erro));
  }, []);

  const lidarComMudanca = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNovoMovel({ ...novoMovel, [e.target.name]: e.target.value });
  };

  const adicionarMovel = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/moveis/', novoMovel)
      .then(resposta => {
        setMoveis([...moveis, resposta.data]);
        setNovoMovel({ nome: '', marca: '', quantidade: '', preco: '' });
      })
      .catch(erro => console.error("Erro ao adicionar:", erro));
  };

  // 1. Nova função que faz o pedido de DELETE ao Django
  const apagarMovel = (id: number) => {
    // Atenção à barra no final da URL, o Django exige isso!
    axios.delete(`http://localhost:8000/api/moveis/${id}/`)
      .then(() => {
        // Se o Django devolveu sucesso (status 204), removemos o móvel da lista visual
        setMoveis(moveis.filter(movel => movel.id !== id));
      })
      .catch(erro => console.error("Erro ao apagar:", erro));
  };

  return (
    <div className="App">
      <h1>Sistema de Gestão de Móveis</h1>

      <form onSubmit={adicionarMovel} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #aaa', borderRadius: '8px' }}>
        <h2>Adicionar Novo Móvel</h2>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <input type="text" name="nome" placeholder="Nome" value={novoMovel.nome} onChange={lidarComMudanca} required />
          <input type="text" name="marca" placeholder="Marca" value={novoMovel.marca} onChange={lidarComMudanca} required />
          <input type="number" name="quantidade" placeholder="Quantidade" value={novoMovel.quantidade} onChange={lidarComMudanca} required />
          <input type="number" step="0.01" name="preco" placeholder="Preço" value={novoMovel.preco} onChange={lidarComMudanca} required />
          <button type="submit">Guardar Móvel</button>
        </div>
      </form>
      
      <div className="lista-moveis">
        {moveis.map(movel => (
          <div key={movel.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', textAlign: 'left', position: 'relative' }}>
            <h3>{movel.nome}</h3>
            <p><strong>Marca:</strong> {movel.marca}</p>
            <p><strong>Quantidade:</strong> {movel.quantidade}</p>
            <p><strong>Preço:</strong> {movel.preco} €</p>
            
            {/* 2. O botão que chama a função apagarMovel passando o ID específico */}
            <button 
              onClick={() => apagarMovel(movel.id)} 
              style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Apagar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;