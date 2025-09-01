import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { usePersonalization } from '@/utils/personalization';
import './ExercicioModerno.css';

interface Bloco {
  id: string;
  tipo: 'comando' | 'simbolo' | 'texto';
  conteudo: string;
  draggable: boolean;
}

interface Exercicio {
  id: number;
  titulo: string;
  enunciado: string;
  placeholder: string;
  blocosEssenciais: string[];
  blocosContextuais: string[];
  solucao: string[];
  dicaTexto?: string;
}

const EXERCICIOS: { [key: number]: Exercicio } = {
  1: {
    id: 1,
    titulo: "Vamos ensinar o Python a falar com você!",
    enunciado: "Complete o código para o Python dizer olá para você:",
    placeholder: '>>> print("____")',
    blocosEssenciais: ['print', '(', ')', '"'],
    blocosContextuais: ["'Olá!'", "input", "say", '"Oi!"'],
    solucao: ['print', '(', '"Olá!"', ')'],
    dicaTexto: "Use print() para mostrar texto na tela. Coloque o texto entre aspas!"
  },
  2: {
    id: 2,
    titulo: "Agora vamos cumprimentar você pelo nome!",
    enunciado: "Faça o Python dizer seu nome:",
    placeholder: '>>> print("____")',
    blocosEssenciais: ['print', '(', ')', '"'],
    blocosContextuais: ['"Oi, Breno!"', '"Olá!"', 'input', '"Hello!"'],
    solucao: ['print', '(', '"Oi, Breno!"', ')'],
    dicaTexto: "Coloque seu nome dentro das aspas para o Python falar com você!"
  },
  3: {
    id: 3,
    titulo: "Vamos guardar seu nome!",
    enunciado: "Crie uma variável com seu nome:",
    placeholder: '>>> meu_nome = "____"',
    blocosEssenciais: ['meu_nome', '=', '"'],
    blocosContextuais: ['"Breno"', '"João"', '"Maria"', 'print'],
    solucao: ['meu_nome', '=', '"Breno"'],
    dicaTexto: "Variáveis são como caixinhas que guardam informações. Use = para guardar!"
  },
  4: {
    id: 4,
    titulo: "Use a variável para mostrar seu nome!",
    enunciado: "Mostre o nome guardado na variável:",
    placeholder: '>>> print(____)',
    blocosEssenciais: ['print', '(', ')'],
    blocosContextuais: ['meu_nome', '"texto"', 'input', 'nome'],
    solucao: ['print', '(', 'meu_nome', ')'],
    dicaTexto: "Quando usamos uma variável, não colocamos aspas! Só o nome da variável."
  },
  5: {
    id: 5,
    titulo: "Pergunte ao usuário!",
    enunciado: "Faça o Python perguntar a cor favorita:",
    placeholder: '>>> cor = input("____")',
    blocosEssenciais: ['cor', '=', 'input', '(', ')', '"'],
    blocosContextuais: ['"Qual sua cor?"', '"Seu nome?"', 'print', '"Cor favorita?"'],
    solucao: ['cor', '=', 'input', '(', '"Qual sua cor?"', ')'],
    dicaTexto: "input() faz uma pergunta ao usuário. A resposta fica guardada na variável!"
  }
};

const ExercicioModerno: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  
  // Simplified personalization for testing
  const personalizeText = (text: string) => text.replace('[NOME]', 'Breno');
  
  const exercicioId = parseInt(exerciseId || '1');
  const exercicio = EXERCICIOS[exercicioId];
  const totalExercicios = Object.keys(EXERCICIOS).length;
  
  const [codigoMontado, setCodigoMontado] = useState<string[]>([]);
  const [consoleAberto, setConsoleAberto] = useState(false);
  const [saidaConsole, setSaidaConsole] = useState<string>('');
  const [estadoEditor, setEstadoEditor] = useState<'vazio' | 'erro' | 'sucesso'>('vazio');
  const [mostrarDica, setMostrarDica] = useState(false);
  const [tentativasErradas, setTentativasErradas] = useState(0);
  
  if (!exercicio) {
    navigate('/modulos');
    return null;
  }

  const progresso = (exercicioId / totalExercicios) * 100;

  const criarBlocos = (lista: string[], tipo: 'comando' | 'simbolo' | 'texto'): Bloco[] => {
    return lista.map((item, index) => ({
      id: `${tipo}-${index}-${item}`,
      tipo,
      conteudo: item,
      draggable: true
    }));
  };

  const blocosEssenciais = criarBlocos(exercicio.blocosEssenciais, 'comando');
  const blocosContextuais = criarBlocos(exercicio.blocosContextuais, 'texto');

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, bloco: Bloco) => {
    e.dataTransfer.setData('application/json', JSON.stringify(bloco));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const blocoData = JSON.parse(e.dataTransfer.getData('application/json')) as Bloco;
    setCodigoMontado(prev => [...prev, blocoData.conteudo]);
    setEstadoEditor('vazio');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const testarCodigo = () => {
    const codigoCompleto = codigoMontado.join('');
    const solucaoCompleta = exercicio.solucao.join('');
    
    if (codigoCompleto === solucaoCompleta) {
      setEstadoEditor('sucesso');
      setSaidaConsole('✅ Perfeito! Código executado com sucesso!');
      setConsoleAberto(true);
      setTimeout(() => {
        // Avançar para próximo exercício ou voltar aos módulos
        if (exercicioId < totalExercicios) {
          navigate(`/exercicio-moderno/${exercicioId + 1}`);
        } else {
          navigate('/modulos');
        }
      }, 2000);
    } else {
      setEstadoEditor('erro');
      setSaidaConsole('❌ Ops! Algo não está certo. Tente novamente!');
      setConsoleAberto(true);
      setTentativasErradas(prev => prev + 1);
    }
  };

  const limparCodigo = () => {
    setCodigoMontado([]);
    setEstadoEditor('vazio');
    setSaidaConsole('');
    setConsoleAberto(false);
  };

  const voltarExercicio = () => {
    if (codigoMontado.length > 0) {
      setCodigoMontado(prev => prev.slice(0, -1));
      if (codigoMontado.length === 1) {
        setEstadoEditor('vazio');
      }
    }
  };

  // Mostrar FAB pulsante após 2 erros
  useEffect(() => {
    if (tentativasErradas >= 2) {
      const timer = setTimeout(() => {
        const fab = document.getElementById('fab-commitinho');
        if (fab) {
          fab.classList.add('pulse');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [tentativasErradas]);

  return (
    <div className="exercicio-container-moderno">
      {/* 1. HEADER COMPACTO */}
      <div className="header-fixo">
        <button 
          className="btn-fechar" 
          onClick={() => navigate('/modulos')}
          aria-label="Fechar exercício"
        >
          ×
        </button>
        
        <div className="header-content">
          <h1 className="titulo-exercicio">
            {personalizeText(exercicio.titulo)}
          </h1>
          <p className="subtitulo">Exercício {exercicioId} de {totalExercicios}</p>
        </div>
        
        <div className="barra-progresso">
          <div className="progresso-fill" style={{ width: `${progresso}%` }}></div>
        </div>
      </div>

      {/* 2. ENUNCIADO */}
      <div className="enunciado-card">
        <p className="texto-enunciado">{exercicio.enunciado}</p>
        <button 
          className="chip-dica" 
          onClick={() => setMostrarDica(!mostrarDica)}
          aria-label="Ver dica"
        >
          💡 Dica
        </button>
        
        <div className="microtexto">
          Arraste os blocos e toque em <strong>Testar código</strong>.
        </div>
        
        {mostrarDica && (
          <div className="dica-expandida">
            {exercicio.dicaTexto}
          </div>
        )}
      </div>

      {/* 3. EDITOR */}
      <div 
        className={`editor-area ${estadoEditor}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {codigoMontado.length === 0 ? (
          <div className="placeholder-ghost">
            {exercicio.placeholder}
          </div>
        ) : (
          <div className="codigo-montado">
            {'>>> '}{codigoMontado.map((bloco, index) => (
              <span key={index} className="bloco-montado">{bloco}</span>
            ))}
            <div className="cursor-piscando">|</div>
          </div>
        )}
      </div>

      {/* 4. CONSOLE */}
      <div className="console-container">
        <div className="console-header" onClick={() => setConsoleAberto(!consoleAberto)}>
          <span>Saída</span>
          <button className="btn-recolher" aria-label="Recolher console">
            {consoleAberto ? '▲' : '▼'}
          </button>
        </div>
        
        <div className={`console-content ${consoleAberto ? 'aberto' : ''}`}>
          {saidaConsole ? (
            <div className="ultima-execucao">
              {saidaConsole}
            </div>
          ) : (
            <div className="estado-vazio">
              Sem saída ainda. Toque em <strong>Testar código</strong>.
            </div>
          )}
        </div>
      </div>

      {/* 5. BANDEJA DE BLOCOS */}
      <div className="bandeja-container">
        {/* Linha 1: Essenciais */}
        <div className="linha-essenciais">
          <div className="scroll-horizontal">
            {blocosEssenciais.map((bloco) => (
              <div
                key={bloco.id}
                className={`chip ${bloco.tipo}`}
                draggable
                onDragStart={(e) => handleDragStart(e, bloco)}
                role="button"
                tabIndex={0}
                aria-label={`Bloco ${bloco.conteudo}`}
              >
                {bloco.conteudo}
              </div>
            ))}
          </div>
        </div>
        
        {/* Linha 2: Contextuais */}
        <div className="linha-contextuais">
          <div className="scroll-horizontal">
            {blocosContextuais.map((bloco) => (
              <div
                key={bloco.id}
                className={`chip ${bloco.tipo}`}
                draggable
                onDragStart={(e) => handleDragStart(e, bloco)}
                role="button"
                tabIndex={0}
                aria-label={`Bloco ${bloco.conteudo}`}
              >
                {bloco.conteudo}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. BARRA DE AÇÕES */}
      <div className="barra-acoes-sticky">
        <button 
          className="btn-secundario" 
          onClick={voltarExercicio}
          disabled={codigoMontado.length === 0}
          aria-label="Desfazer"
        >
          ↶
        </button>
        
        <button 
          className="btn-secundario" 
          disabled
          aria-label="Refazer"
        >
          ↷
        </button>
        
        <button 
          className={`btn-testar-principal ${estadoEditor === 'sucesso' ? 'sucesso' : ''}`}
          onClick={testarCodigo}
          disabled={codigoMontado.length === 0}
        >
          {estadoEditor === 'sucesso' ? (
            <>🚀 Próximo exercício!</>
          ) : (
            <>▶ Testar código!</>
          )}
        </button>
        
        <button 
          className="btn-secundario" 
          onClick={limparCodigo}
          aria-label="Limpar código"
        >
          ↺
        </button>
      </div>

      {/* 7. FAB COMMITINHO */}
      <div 
        id="fab-commitinho"
        className="fab-commitinho" 
        onClick={() => setMostrarDica(true)}
        role="button"
        tabIndex={0}
        aria-label="Dicas do Commitinho"
      >
        <img src="/assets/commitinho-running.png" alt="Commitinho" />
        {tentativasErradas >= 2 && (
          <div className="ponto-amarelo" id="pontoNotificacao"></div>
        )}
      </div>
    </div>
  );
};

export default ExercicioModerno;