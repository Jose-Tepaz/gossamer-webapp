-- Crear tabla para asignar modelos a brokers
CREATE TABLE IF NOT EXISTS broker_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  broker_id TEXT NOT NULL,
  model_id UUID NOT NULL REFERENCES user_models(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Asegurar que un usuario solo puede tener un modelo por broker
  UNIQUE(user_id, broker_id)
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_broker_models_user_id ON broker_models(user_id);
CREATE INDEX IF NOT EXISTS idx_broker_models_broker_id ON broker_models(broker_id);
CREATE INDEX IF NOT EXISTS idx_broker_models_model_id ON broker_models(model_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE broker_models ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo puedan ver sus propias asignaciones
CREATE POLICY "Users can view their own broker model assignments" ON broker_models
  FOR SELECT USING (user_id = auth.jwt() ->> 'sub');

-- Política para que los usuarios solo puedan insertar sus propias asignaciones
CREATE POLICY "Users can insert their own broker model assignments" ON broker_models
  FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');

-- Política para que los usuarios solo puedan actualizar sus propias asignaciones
CREATE POLICY "Users can update their own broker model assignments" ON broker_models
  FOR UPDATE USING (user_id = auth.jwt() ->> 'sub');

-- Política para que los usuarios solo puedan eliminar sus propias asignaciones
CREATE POLICY "Users can delete their own broker model assignments" ON broker_models
  FOR DELETE USING (user_id = auth.jwt() ->> 'sub');
