# Pokédex App

A modern web application for exploring Pokémon, built with React, TypeScript, and Vite.

## 🚀 Technologies

- **Frontend**: React 18, TypeScript, Vite
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **SEO**: React Helmet Async
- **Styling**: Pure CSS with CSS variables
- **Testing**: Vitest + React Testing Library

## 📁 Project Structure

```
src/
├── assets/          # SVG icons and images
├── components/      # Reusable components
│   ├── Header.tsx
│   ├── Pagination.tsx
│   └── PokemonCard.tsx
├── contexts/        # React contexts
│   ├── AuthContext.tsx
│   └── FilterContext.tsx
├── pages/           # Application pages
│   ├── LoginPage.tsx
│   ├── HomePage.tsx
│   └── PokemonDetailPage.tsx
├── services/        # API services
│   └── api.ts
├── styles/          # CSS files
├── utils/           # Utility functions
│   └── pokemonTypes.ts
├── App.tsx          # Main component with routes
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🔐 Authentication

The system uses JWT authentication stored in localStorage.

- **Credentials**: `admin` / `admin`
- Routes are protected: unauthenticated users are redirected to `/login`
- Already authenticated users are redirected from `/login` to `/`

## 📱 Features

### Login
- Authentication form with validation
- Visual error feedback
- Session persistence

### Pokémon Listing
- Responsive card grid
- Search by name or number
- Sort by name or number
- Pagination
- Multiple search (separate terms with spaces)

### Pokémon Details
- Complete information (weight, height, abilities)
- Base stats with visual bars
- Pokémon moves
- Alternative forms
- Navigation between Pokémon

## 🎨 Design

The design follows the [official Figma](https://www.figma.com/file/pokemon-design) with desktop adaptations:

- **Colors**: Color system based on Pokémon types
- **Typography**: Poppins as the main font
- **Responsiveness**: Mobile-first with breakpoints at 480px, 768px, and 1024px

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### Test Coverage

- Components: Header, PokemonCard, Pagination
- Pages: LoginPage, HomePage, PokemonDetailPage
- Contexts: AuthContext, FilterContext
- Services: API calls

## 📝 API Endpoints

The frontend communicates with a backend that proxies to PokeAPI:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Authentication |
| `/api/auth/verify` | POST | Verify token |
| `/api/auth/logout` | POST | Logout |
| `/api/pokemons` | GET | List Pokémon (paginated) |
| `/api/pokemons/:id` | GET | Pokémon details |
| `/api/pokemons/number/:number` | GET | Search by number(s) |

### Query Parameters (GET /api/pokemons)

- `limit`: Number of items per page
- `offset`: Offset for pagination
- `search`: Search term (accepts multiple separated by comma)
- `sortBy`: `name` or `number`
- `sortOrder`: `asc` or `desc`

---

# 🤖 GenAI Task: Task Management Table Component

## Prompt Used

```
Create a Table component in React with TypeScript for a task management system with the following features:

1. Full CRUD for tasks
2. Each task has: title, description, status (pending/in_progress/completed), due_date
3. Tasks are associated with a User (assume the User model exists)
4. Include form validations
5. Use React hooks and best practices
6. Add complete TypeScript typing
7. Include error handling and loading states
```

## Generated Code

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
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
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
      errors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.due_date) {
      errors.due_date = 'Due date is required';
    } else if (new Date(formData.due_date) < new Date()) {
      errors.due_date = 'Date cannot be in the past';
    }
    
    if (!formData.user_id) {
      errors.user_id = 'User is required';
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
    if (window.confirm('Are you sure you want to delete this task?')) {
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
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const isOverdue = (dueDate: string, status: TaskStatus) => {
    return status !== 'completed' && new Date(dueDate) < new Date();
  };

  if (isLoading && tasks.length === 0) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="task-table-container">
      <div className="table-header">
        <h2>Task Management</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          New Task
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="task-form">
          <h3>{editingId ? 'Edit Task' : 'New Task'}</h3>
          
          <div className="form-group">
            <label htmlFor="title">Title</label>
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
            <label htmlFor="description">Description</label>
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
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="due_date">Due Date</label>
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
            <label htmlFor="user_id">Assigned User</label>
            <input
              id="user_id"
              type="text"
              value={formData.user_id}
              onChange={(e) => setFormData(prev => ({ ...prev, user_id: e.target.value }))}
              placeholder="User ID"
              className={formErrors.user_id ? 'error' : ''}
            />
            {formErrors.user_id && <span className="error-text">{formErrors.user_id}</span>}
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}

      <table className="task-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={5} className="empty-state">
                No tasks found
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
                  <button onClick={() => handleEdit(task)} className="btn-icon" title="Edit">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(task.id)} className="btn-icon" title="Delete">
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

## Validation and Improvements to Generated Code

### 1. Validations Performed

- **TypeScript Typing**: Verified all types were correct and added more specific types where needed (e.g., `TaskStatus` as union type instead of string)
- **Error Handling**: The generated code had basic error handling; I added more specific messages and visual feedback
- **Loading States**: Implemented loading states for each CRUD operation

### 2. Corrections and Improvements Applied

| Identified Issue | Applied Fix |
|------------------|-------------|
| Past date validation didn't exist | Added validation `new Date(formData.due_date) < new Date()` |
| Missing delete confirmation | Added `window.confirm()` before deleting |
| No visual indication for overdue tasks | Added `overdue` class and styling for past due dates |
| Form didn't reset after error | Fixed to maintain data in case of API error |
| Missing description truncate | Added `description-cell` class with CSS to truncate |

### 3. Edge Cases Handled

1. **Empty list**: Shows "No tasks found" message
2. **API error**: Displays error message and allows retry
3. **Form validation**: Client-side validation before submitting
4. **Overdue tasks**: Visual highlight for past due tasks
5. **Past dates**: Doesn't allow creating tasks with due_date before today
6. **Double-click prevention**: Button disabled during operations

### 4. Performance and Quality Assessment

**Positive Points:**
- Correct use of `useCallback` for function memoization
- Separation of concerns (hook separated from component)
- Complete TypeScript typing
- Loading and error states well managed

**Potential Improvements:**
- Add debounce to frequent operations
- Implement cache with React Query or SWR
- Add unit tests
- Use React.memo to optimize table re-renders

---

## 📋 GenAI Usage During Development

During the development of this Pokédex application, I used GenAI (Cursor with Claude) as a productivity tool to accelerate repetitive tasks and explore architectural solutions. Below are the actual prompts I used, demonstrating strategic and thoughtful use of AI assistance:

### Initial Environment Setup

**Prompt Used:**
```
I need to set up a development environment for a React + TypeScript project on a Windows machine. 
The machine currently doesn't have Node.js or NPM installed. Please:

1. Install NVM (Node Version Manager) for Windows using the most appropriate method
2. Install the latest LTS version of Node.js through NVM
3. Verify the installation and ensure NPM is working correctly
4. Handle any PowerShell execution policy issues that might prevent npm scripts from running
5. Configure the environment variables if needed

Please use best practices for Windows development and ensure all tools are properly configured.
```

**Result**: Environment automatically configured with correct versions and adjusted execution policies.

### UI/UX Refactoring

**Prompt Used:**
```
I need to refactor the login page to improve UX and align with our design system. The current header 
feels disconnected from the rest of the interface. Please implement:

1. A split-screen layout for desktop (≥768px):
   - Left side: Large decorative Pokeball element with brand messaging
   - Right side: Clean authentication form with proper spacing
   
2. A centered card layout for mobile (<768px):
   - Compact Pokeball icon at the top
   - Form below with adequate padding
   
3. Maintain the existing color scheme (red primary: #DC0A2D) and Poppins typography
4. Ensure smooth transitions and responsive behavior
5. Keep all existing validation logic intact

The design should feel modern while maintaining the Pokémon theme consistency.
```

**Result**: Modern and responsive interface that significantly improves user experience.

### Complex Feature Implementation

**Prompt Used:**
```
I need to implement an intelligent search and sorting system for the Pokémon list. Requirements:

1. Create a modal component that opens when clicking the filter/sort button in the header
2. Modal should have radio button options: "Sort by Number" and "Sort by Name"
3. Implement automatic search type detection:
   - When no explicit filter is selected AND user types in search:
     * If input is purely numeric (e.g., "25", "004", "1 4 25"), use number search endpoint
     * If input contains letters, use name search endpoint
4. Support multiple search terms separated by spaces (convert to comma-separated for API)
5. Update the search icon dynamically based on selected filter (searchNumber.svg or searchText.svg)
6. Show filterDefault.svg when no filter is explicitly selected
7. Add a clear button (X icon) to the search input that appears when there's text

Please ensure the state persists across page navigation using React Context.
```

**Result**: Flexible and intuitive search system that improves application usability.

### Architectural Corrections

**Prompt Used:**
```
I need to fix a performance issue I introduced. I moved the filtering logic to the frontend, but 
I forgot the backend already handles pagination efficiently. Please:

1. Revert the frontend filtering approach
2. Restore the API-based search and pagination using the existing backend endpoints
3. Ensure the search parameters are correctly passed to the API
4. Maintain the current UI/UX behavior

Additionally, I noticed that when navigating to a Pokémon detail page and coming back, the search 
and sort filters reset. Please create a React Context to persist:
- The selected sort option (by number or name)
- The current search value

This context should wrap the application and maintain state across route changes.
```

**Result**: More performant application with better navigation experience.

### Validation and Quality Process

For each AI suggestion, I followed a rigorous validation process:

1. **Critical Analysis**: Review of generated code before applying, checking patterns, performance, and security
2. **Manual Testing**: Validation of each functionality in different scenarios and devices
3. **Quality Verification**: Console analysis for errors, warnings, and possible accessibility issues
4. **Refinement**: Manual adjustments to implementation details (styles, behaviors, edge cases)
5. **Automated Testing**: Creation of unit and integration tests to ensure continuous quality

**Philosophy**: GenAI was used as a productivity tool, not as a substitute for critical thinking. All architectural and implementation decisions were validated and refined manually.

---

## 📄 License

This project was developed as a technical exercise.
