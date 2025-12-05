# Pokédex App

Uma aplicação web moderna para explorar Pokémon, construída com React, TypeScript e Vite.

## 🚀 Tecnologias

- **Frontend**: React 18, TypeScript, Vite
- **Roteamento**: React Router DOM v6
- **HTTP Client**: Axios
- **SEO**: React Helmet Async
- **Estilização**: CSS puro com variáveis CSS
- **Testes**: Vitest + React Testing Library

## 📁 Estrutura do Projeto

```
src/
├── assets/          # Ícones SVG e imagens
├── components/      # Componentes reutilizáveis
│   ├── Header.tsx
│   ├── Pagination.tsx
│   └── PokemonCard.tsx
├── contexts/        # Contextos React
│   ├── AuthContext.tsx
│   └── FilterContext.tsx
├── pages/           # Páginas da aplicação
│   ├── LoginPage.tsx
│   ├── HomePage.tsx
│   └── PokemonDetailPage.tsx
├── services/        # Serviços de API
│   └── api.ts
├── styles/          # Arquivos CSS
├── utils/           # Funções utilitárias
│   └── pokemonTypes.ts
├── App.tsx          # Componente principal com rotas
├── main.tsx         # Entry point
└── index.css        # Estilos globais
```

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar testes
npm test

# Rodar testes com cobertura
npm run test:coverage
```

## 🔐 Autenticação

O sistema usa autenticação via JWT armazenado no localStorage.

- **Credenciais**: `admin` / `admin`
- As rotas são protegidas: usuários não autenticados são redirecionados para `/login`
- Usuários já autenticados são redirecionados de `/login` para `/`

## 📱 Funcionalidades

### Login
- Formulário de autenticação com validação
- Feedback visual de erros
- Persistência de sessão

### Listagem de Pokémon
- Grid responsivo de cards
- Busca por nome ou número
- Ordenação por nome ou número
- Paginação
- Busca múltipla (separar termos por espaço)

### Detalhes do Pokémon
- Informações completas (peso, altura, habilidades)
- Estatísticas base com barras visuais
- Moves do Pokémon
- Forms alternativos
- Navegação entre Pokémon

## 🎨 Design

O design segue o [Figma oficial](https://www.figma.com/file/pokemon-design) com adaptações para desktop:

- **Cores**: Sistema de cores baseado nos tipos de Pokémon
- **Tipografia**: Poppins como fonte principal
- **Responsividade**: Mobile-first com breakpoints em 480px, 768px e 1024px

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Modo watch
npm run test:watch

# Com cobertura
npm run test:coverage
```

### Cobertura de Testes

- Componentes: Header, PokemonCard, Pagination
- Páginas: LoginPage, HomePage, PokemonDetailPage
- Contextos: AuthContext, FilterContext
- Serviços: API calls

## 📝 API Endpoints

O frontend se comunica com um backend que faz proxy para a PokeAPI:

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/auth/login` | POST | Autenticação |
| `/api/auth/verify` | POST | Verificar token |
| `/api/auth/logout` | POST | Logout |
| `/api/pokemons` | GET | Listar Pokémon (paginado) |
| `/api/pokemons/:id` | GET | Detalhes do Pokémon |
| `/api/pokemons/number/:number` | GET | Buscar por número(s) |

### Parâmetros de Query (GET /api/pokemons)

- `limit`: Número de itens por página
- `offset`: Offset para paginação
- `search`: Termo de busca (aceita múltiplos separados por vírgula)
- `sortBy`: `name` ou `number`
- `sortOrder`: `asc` ou `desc`

---

# 🤖 Tarefa GenAI: Task Management Table Component

## Prompt Utilizado

```
Crie um componente Table em React com TypeScript para um sistema de gerenciamento de tarefas com as seguintes funcionalidades:

1. CRUD completo de tarefas
2. Cada tarefa tem: title, description, status (pending/in_progress/completed), due_date
3. Tarefas são associadas a um User (assuma que o modelo User existe)
4. Inclua validações de formulário
5. Use React hooks e boas práticas
6. Adicione tipagem TypeScript completa
7. Inclua tratamento de erros e estados de loading
```

## Código Gerado

```typescript
// types/task.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  due_date: string;
  user_id: string;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  status: TaskStatus;
  due_date: string;
  user_id: string;
}

export interface UpdateTaskDTO extends Partial<CreateTaskDTO> {
  id: string;
}
```

```typescript
// hooks/useTasks.ts
import { useState, useCallback } from 'react';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/task';

interface UseTasksReturn {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskDTO) => Promise<boolean>;
  updateTask: (data: UpdateTaskDTO) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = useCallback(async (data: CreateTaskDTO): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create task');
      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (data: UpdateTaskDTO): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tasks/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updatedTask = await response.json();
      setTasks(prev => prev.map(t => t.id === data.id ? updatedTask : t));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');
      setTasks(prev => prev.filter(t => t.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { tasks, isLoading, error, fetchTasks, createTask, updateTask, deleteTask };
}
```

```tsx
// components/TaskTable.tsx
import { useState, useEffect } from 'react';
import { Task, TaskStatus, CreateTaskDTO } from '../types/task';
import { useTasks } from '../hooks/useTasks';

const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pendente',
  in_progress: 'Em Progresso',
  completed: 'Concluída',
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  pending: '#FFA500',
  in_progress: '#3B82F6',
  completed: '#22C55E',
};

interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  due_date: string;
  user_id: string;
}

const initialFormData: TaskFormData = {
  title: '',
  description: '',
  status: 'pending',
  due_date: '',
  user_id: '',
};

export function TaskTable() {
  const { tasks, isLoading, error, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
  const [formData, setFormData] = useState<TaskFormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<TaskFormData>>({});

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const validateForm = (): boolean => {
    const errors: Partial<TaskFormData> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Título é obrigatório';
    } else if (formData.title.length < 3) {
      errors.title = 'Título deve ter pelo menos 3 caracteres';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Descrição é obrigatória';
    }
    
    if (!formData.due_date) {
      errors.due_date = 'Data de vencimento é obrigatória';
    } else if (new Date(formData.due_date) < new Date()) {
      errors.due_date = 'Data não pode ser no passado';
    }
    
    if (!formData.user_id) {
      errors.user_id = 'Usuário é obrigatório';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const success = editingId
      ? await updateTask({ id: editingId, ...formData })
      : await createTask(formData as CreateTaskDTO);

    if (success) {
      setFormData(initialFormData);
      setEditingId(null);
      setShowForm(false);
      setFormErrors({});
    }
  };

  const handleEdit = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      due_date: task.due_date.split('T')[0],
      user_id: task.user_id,
    });
    setEditingId(task.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      await deleteTask(id);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setShowForm(false);
    setFormErrors({});
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isOverdue = (dueDate: string, status: TaskStatus) => {
    return status !== 'completed' && new Date(dueDate) < new Date();
  };

  if (isLoading && tasks.length === 0) {
    return <div className="loading">Carregando tarefas...</div>;
  }

  return (
    <div className="task-table-container">
      <div className="table-header">
        <h2>Gerenciamento de Tarefas</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Nova Tarefa
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="task-form">
          <h3>{editingId ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>
          
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={formErrors.title ? 'error' : ''}
            />
            {formErrors.title && <span className="error-text">{formErrors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className={formErrors.description ? 'error' : ''}
            />
            {formErrors.description && <span className="error-text">{formErrors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as TaskStatus }))}
              >
                <option value="pending">Pendente</option>
                <option value="in_progress">Em Progresso</option>
                <option value="completed">Concluída</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="due_date">Data de Vencimento</label>
              <input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                className={formErrors.due_date ? 'error' : ''}
              />
              {formErrors.due_date && <span className="error-text">{formErrors.due_date}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="user_id">Usuário Responsável</label>
            <input
              id="user_id"
              type="text"
              value={formData.user_id}
              onChange={(e) => setFormData(prev => ({ ...prev, user_id: e.target.value }))}
              placeholder="ID do usuário"
              className={formErrors.user_id ? 'error' : ''}
            />
            {formErrors.user_id && <span className="error-text">{formErrors.user_id}</span>}
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Salvando...' : editingId ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      )}

      <table className="task-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descrição</th>
            <th>Status</th>
            <th>Vencimento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={5} className="empty-state">
                Nenhuma tarefa encontrada
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task.id} className={isOverdue(task.due_date, task.status) ? 'overdue' : ''}>
                <td>{task.title}</td>
                <td className="description-cell">{task.description}</td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: STATUS_COLORS[task.status] }}
                  >
                    {STATUS_LABELS[task.status]}
                  </span>
                </td>
                <td className={isOverdue(task.due_date, task.status) ? 'overdue-date' : ''}>
                  {formatDate(task.due_date)}
                </td>
                <td className="actions-cell">
                  <button onClick={() => handleEdit(task)} className="btn-icon" title="Editar">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(task.id)} className="btn-icon" title="Excluir">
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
```

## Validação e Melhorias do Código Gerado

### 1. Validações Realizadas

- **Tipagem TypeScript**: Verifiquei se todos os tipos estavam corretos e adicionei tipos mais específicos onde necessário (ex: `TaskStatus` como union type em vez de string)
- **Tratamento de Erros**: O código gerado tinha tratamento básico, adicionei mensagens mais específicas e feedback visual
- **Estados de Loading**: Implementei estados de loading em cada operação CRUD

### 2. Correções e Melhorias Aplicadas

| Problema Identificado | Correção Aplicada |
|----------------------|-------------------|
| Validação de data no passado não existia | Adicionei validação `new Date(formData.due_date) < new Date()` |
| Faltava confirmação no delete | Adicionei `window.confirm()` antes de deletar |
| Não havia indicação visual de tarefas atrasadas | Adicionei classe `overdue` e estilo para datas vencidas |
| Formulário não resetava após erro | Corrigido para manter dados em caso de erro de API |
| Faltava truncate na descrição | Adicionei classe `description-cell` com CSS para truncar |

### 3. Edge Cases Tratados

1. **Lista vazia**: Mostra mensagem "Nenhuma tarefa encontrada"
2. **Erro de API**: Exibe mensagem de erro e permite retry
3. **Validação de formulário**: Validação client-side antes de submeter
4. **Tarefas atrasadas**: Destaque visual para tarefas vencidas
5. **Datas no passado**: Não permite criar tarefas com due_date anterior a hoje
6. **Double-click prevention**: Botão desabilitado durante operações

### 4. Avaliação de Performance e Qualidade

**Pontos Positivos:**
- Uso correto de `useCallback` para memoização de funções
- Separação de concerns (hook separado do componente)
- Tipagem TypeScript completa
- Estados de loading e error bem gerenciados

**Melhorias Potenciais:**
- Adicionar debounce em operações frequentes
- Implementar cache com React Query ou SWR
- Adicionar testes unitários
- Usar React.memo para otimizar re-renders da tabela

---

## 📋 Prompts Usados Durante o Desenvolvimento

Durante o desenvolvimento desta aplicação Pokédex, utilizei GenAI (Cursor com Claude) para auxiliar em diversas tarefas. Abaixo estão alguns dos prompts mais significativos:

### Configuração de Ambiente
```
esse notebook n tem nd para rodar esse projeto, configura pra mim, baixe o nvm e depois o node e tal, oq for melhor na vdd
```

### Estilização e UI
```
esse cabeçalho ta mt esquisito, remove ele, que tal fazer um card assim sei la, se for desktop, vc vai deixar do lado esquerdo uma pokebola e tal algo bonito e do lado direito as credenciais, se for mobile vc pensa em algo ai
```

```
olhe a imagem e ajuste o details pra isso, detalhe para a pokebola posicionada q ta diferente, o separador unico ali nos stats
```

### Funcionalidades
```
clicando no botao de hashtag abra esse modal com select
```

```
se n tiver filtro selecionado, e for um numero inputado, faça a busca pelo numero e caso seja letras pelas letras ok?
```

```
agr posso fazer multipla pesquisa, consegue pra mim ? talvez dar um espaço
```

### Correções
```
volta ao get q tinha antes da api, esqueci q tinha paginação no backend
```

```
crie um contexto para guardar o select, pq quando vou pra details e volto, ele reseta o valor
```

### Processo de Validação

Para cada sugestão do AI, segui o processo:
1. **Revisar o código gerado** antes de aplicar
2. **Testar manualmente** cada funcionalidade
3. **Verificar console** por erros e warnings
4. **Ajustar detalhes** conforme necessário (cores, espaçamentos, comportamentos)

---

## 📄 Licença

Este projeto foi desenvolvido como exercício técnico.

