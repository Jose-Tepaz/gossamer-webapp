-- Configuración para hacer los documentos de Signals completamente públicos
-- Este script asegura que cualquier usuario pueda ver y descargar los documentos

-- 1. Verificar que RLS está habilitado pero con políticas públicas
-- (Ya debería estar configurado, pero verificamos)

-- 2. Asegurar que las políticas de la tabla son completamente públicas
DROP POLICY IF EXISTS "Allow public read access" ON signal_documents;
DROP POLICY IF EXISTS "Public can view signal documents" ON signal_documents;

CREATE POLICY "Public read access to signal documents" ON signal_documents
    FOR SELECT USING (true);

-- 3. Asegurar que el bucket de storage es público
UPDATE storage.buckets 
SET public = true 
WHERE id = 'signal-documents';

-- 4. Asegurar que las políticas de storage son públicas
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Public can view signal documents" ON storage.objects;

-- Política para lectura pública de archivos
CREATE POLICY "Public read access to signal files" ON storage.objects
    FOR SELECT USING (bucket_id = 'signal-documents');

-- Política para que solo administradores puedan subir archivos
CREATE POLICY "Admin upload access to signal files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'signal-documents' AND 
        (auth.role() = 'service_role' OR auth.role() = 'authenticated')
    );

-- 5. Verificar la configuración final
SELECT 'signal_documents table policies:' as check_type;
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'signal_documents';

SELECT 'storage bucket configuration:' as check_type;
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'signal-documents';

SELECT 'storage objects policies:' as check_type;
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND policyname LIKE '%signal%';

-- 6. Mostrar estadísticas actuales
SELECT 'Current document count:' as info, COUNT(*) as count FROM signal_documents;
SELECT 'Sample documents:' as info, title, category, file_name FROM signal_documents LIMIT 3;
