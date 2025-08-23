# 🚀 Supabase Integration Setup

O projeto Commitinho agora suporta **Supabase** para persistência de dados na nuvem, mantendo compatibilidade com localStorage para usuários offline.

## 📋 Configuração Inicial

### 1. Variáveis de Ambiente
Edite o arquivo `.env.local` e substitua pelos seus dados do Supabase:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

### 2. Criação da Tabela
Execute este SQL no painel do Supabase (SQL Editor):

```sql
-- Create user_progress table
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  daily_goal INTEGER DEFAULT 10,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  world INTEGER DEFAULT 1,
  skill INTEGER DEFAULT 1,
  lesson INTEGER DEFAULT 1,
  stars JSONB DEFAULT '{}',
  unlocked JSONB DEFAULT '{"1-1": true}',
  intro_done JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{"reduced_motion": false}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can access their own progress" 
ON user_progress 
FOR ALL 
USING (auth.uid() = user_id);

-- Create policy for anonymous users
CREATE POLICY "Anonymous users can access their own progress"
ON user_progress
FOR ALL
USING (auth.uid() = user_id);
```

### 3. Configurar Autenticação Anônima (Opcional)
No painel do Supabase > Authentication > Settings:
- ✅ Enable "Allow anonymous sign-ins"

## 🔄 Sistema Híbrido

### Como Funciona
- **Usuários com login**: Dados salvos no Supabase + fallback localStorage
- **Usuários anônimos**: Login automático anônimo + dados no Supabase
- **Usuários offline**: Fallback automático para localStorage

### Hooks Disponíveis

#### useSupabaseProgress (Novo)
```typescript
import { useSupabaseProgress } from '@/hooks/useSupabaseProgress'

const { 
  progress, 
  isLoading, 
  user, 
  isAuthenticated,
  completeLessonProgress,
  resetUserProgress 
} = useSupabaseProgress()
```

#### useProgress (Legado)
Continua funcionando apenas com localStorage para compatibilidade.

## 🔧 Migração Automática

O sistema migra automaticamente dados do localStorage para Supabase quando:
1. Usuário faz login pela primeira vez
2. Detecta dados existentes no localStorage
3. Salva no Supabase mantendo localStorage como backup

## 📊 Monitoramento

### Logs no Console
- 🔐 "Auto-signing in anonymously..." - Login automático
- ✅ "Loaded progress from Supabase" - Dados carregados da nuvem  
- 📝 "No progress found in Supabase" - Criando progresso inicial
- 📦 "Found localStorage progress, migrating..." - Migrando dados

### Fallbacks Automáticos
- Supabase offline → localStorage
- Erro de autenticação → localStorage
- Erro de salvamento → localStorage

## 🧪 Testando

1. **Primeiro acesso**: Deve fazer login anônimo automaticamente
2. **Completar lição**: Dados salvos no Supabase
3. **Limpar localStorage**: Recarregar deve carregar do Supabase
4. **Offline**: Deve usar localStorage normalmente

## 🚨 Troubleshooting

### Erro: "Missing Supabase environment variables"
- Verifique se `.env.local` tem as variáveis corretas
- Reinicie o servidor dev após editar `.env.local`

### Erro: "Failed to load progress from Supabase" 
- Verifique se a tabela `user_progress` foi criada
- Verifique se as policies RLS estão configuradas
- Verifique se a autenticação anônima está habilitada

### Dados não sincronizam
- Verifique os logs do console para erros
- Sistema sempre faz fallback para localStorage em caso de erro