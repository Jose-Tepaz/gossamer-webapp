-- Script para agregar la columna plan_type a la tabla user_data
-- Ejecutar en el SQL Editor de Supabase

-- Agregar la columna plan_type
ALTER TABLE user_data 
ADD COLUMN plan_type TEXT;

-- Agregar un comentario para documentar la columna
COMMENT ON COLUMN user_data.plan_type IS 'Plan seleccionado por el usuario (Free, Pro, Premium)';

-- Opcional: Crear un índice si planeas hacer consultas frecuentes por plan
-- CREATE INDEX idx_user_data_plan_type ON user_data(plan_type);

-- Verificar que la columna se creó correctamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_data' 
AND column_name = 'plan_type';
