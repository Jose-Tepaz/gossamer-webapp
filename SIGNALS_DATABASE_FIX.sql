-- Script para arreglar los problemas identificados en Signals

-- 1. Actualizar políticas RLS para permitir acceso público
-- Primero, eliminar las políticas existentes
DROP POLICY IF EXISTS "Users can view signal documents" ON signal_documents;
DROP POLICY IF EXISTS "Public can view signal documents" ON signal_documents;

-- Crear nueva política que permita acceso público
CREATE POLICY "Public can view signal documents" ON signal_documents
    FOR SELECT USING (true);

-- 2. Crear el bucket de storage si no existe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('signal-documents', 'signal-documents', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Crear políticas para el bucket de storage
-- Primero eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Public can view signal documents" ON storage.objects;
DROP POLICY IF EXISTS "Service role can upload signal documents" ON storage.objects;

-- Política para lectura pública
CREATE POLICY "Public can view signal documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'signal-documents');

-- Política para inserción (solo para service role)
CREATE POLICY "Service role can upload signal documents" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'signal-documents' AND 
        auth.role() = 'service_role'
    );

-- 4. Verificar que la tabla tiene datos de ejemplo
-- Si no tienes datos, descomenta las siguientes líneas:

/*
INSERT INTO signal_documents (title, description, category, file_url, file_name, file_size) VALUES
(
    'Technical Analysis Weekly - January 2024',
    'Complete technical analysis of the market with support and resistance levels, technical indicators and predictions for next week.',
    'Technical Analysis',
    'technical-analysis-january-2024.pdf',
    'technical-analysis-january-2024.pdf',
    2048576
),
(
    'Fundamental Analysis Report - Tech Companies',
    'Fundamental analysis of major tech companies with financial metrics, projections and investment recommendations.',
    'Fundamental Analysis',
    'fundamental-analysis-tech-2024.pdf',
    'fundamental-analysis-tech-2024.pdf',
    1536000
),
(
    'Market News - Week 3',
    'Summary of the most relevant financial market news that may impact trading decisions.',
    'Market News',
    'market-news-week-3.pdf',
    'market-news-week-3.pdf',
    1024000
);
*/

-- 5. Verificar la configuración
SELECT 'Table exists:' as check_type, EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'signal_documents'
) as result
UNION ALL
SELECT 'Bucket exists:', EXISTS (
   SELECT FROM storage.buckets 
   WHERE id = 'signal-documents'
)
UNION ALL
SELECT 'Document count:', COUNT(*)::text
FROM signal_documents
UNION ALL
SELECT 'RLS enabled:', (SELECT relrowsecurity FROM pg_class WHERE relname = 'signal_documents');
