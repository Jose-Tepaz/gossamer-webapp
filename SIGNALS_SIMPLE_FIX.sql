-- Script simple para arreglar Signals - sin conflictos

-- 1. Crear el bucket de storage
INSERT INTO storage.buckets (id, name, public) 
VALUES ('signal-documents', 'signal-documents', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Eliminar todas las políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Users can view signal documents" ON signal_documents;
DROP POLICY IF EXISTS "Public can view signal documents" ON signal_documents;
DROP POLICY IF EXISTS "Public can view signal documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload signal documents" ON storage.objects;
DROP POLICY IF EXISTS "Service role can upload signal documents" ON storage.objects;

-- 3. Crear nuevas políticas limpias
-- Para la tabla signal_documents
CREATE POLICY "Allow public read access" ON signal_documents
    FOR SELECT USING (true);

-- Para storage objects
CREATE POLICY "Allow public read access" ON storage.objects
    FOR SELECT USING (bucket_id = 'signal-documents');

-- 4. Insertar datos de ejemplo
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
)
ON CONFLICT DO NOTHING;

-- 5. Verificar que todo está funcionando
SELECT 'Setup completed successfully' as status;
SELECT COUNT(*) as document_count FROM signal_documents;
SELECT id, name, public FROM storage.buckets WHERE id = 'signal-documents';
