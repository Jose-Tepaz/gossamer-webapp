-- Crear tabla para documentos de signals
CREATE TABLE IF NOT EXISTS signal_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para optimizar las consultas
CREATE INDEX IF NOT EXISTS idx_signal_documents_category ON signal_documents(category);
CREATE INDEX IF NOT EXISTS idx_signal_documents_created_at ON signal_documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_signal_documents_title ON signal_documents(title);

-- Crear política RLS (Row Level Security)
ALTER TABLE signal_documents ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a usuarios autenticados
CREATE POLICY "Users can view signal documents" ON signal_documents
    FOR SELECT USING (auth.role() = 'authenticated');

-- Crear bucket de storage para los documentos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('signal-documents', 'signal-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Política de storage para permitir lectura pública de los documentos
CREATE POLICY "Public can view signal documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'signal-documents');

-- Política de storage para permitir upload solo a administradores
CREATE POLICY "Admins can upload signal documents" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'signal-documents' AND 
        auth.role() = 'service_role'
    );

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_signal_documents_updated_at 
    BEFORE UPDATE ON signal_documents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar algunos documentos de ejemplo (opcional)
INSERT INTO signal_documents (title, description, category, file_url, file_name, file_size) VALUES
(
    'Análisis Técnico Semanal - Enero 2024',
    'Análisis técnico completo del mercado con niveles de soporte y resistencia, indicadores técnicos y predicciones para la próxima semana.',
    'Análisis Técnico',
    'analisis-tecnico-enero-2024.pdf',
    'analisis-tecnico-enero-2024.pdf',
    2048576
),
(
    'Reporte Fundamental - Empresas Tech',
    'Análisis fundamental de las principales empresas tecnológicas con métricas financieras, proyecciones y recomendaciones de inversión.',
    'Análisis Fundamental',
    'reporte-fundamental-tech-2024.pdf',
    'reporte-fundamental-tech-2024.pdf',
    1536000
),
(
    'Noticias del Mercado - Semana 3',
    'Resumen de las noticias más relevantes del mercado financiero que pueden impactar las decisiones de trading.',
    'Noticias del Mercado',
    'noticias-mercado-semana-3.pdf',
    'noticias-mercado-semana-3.pdf',
    1024000
),
(
    'Estrategia de Trading - Swing Trading',
    'Guía completa sobre estrategias de swing trading con ejemplos prácticos y gestión de riesgo.',
    'Estrategias',
    'estrategia-swing-trading.pdf',
    'estrategia-swing-trading.pdf',
    3072000
),
(
    'Educación - Gestión de Riesgo',
    'Curso básico sobre gestión de riesgo en trading, incluyendo técnicas de stop loss y position sizing.',
    'Educación',
    'gestion-riesgo-trading.pdf',
    'gestion-riesgo-trading.pdf',
    2560000
);
