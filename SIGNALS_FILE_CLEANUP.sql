-- Script para diagnosticar y limpiar problemas con archivos en Signals

-- 1. Ver todos los documentos actuales
SELECT 
    id,
    title,
    file_url,
    file_name,
    file_size,
    created_at
FROM signal_documents 
ORDER BY created_at DESC;

-- 2. Verificar archivos en el bucket de storage
SELECT 
    name,
    bucket_id,
    created_at,
    updated_at,
    metadata
FROM storage.objects 
WHERE bucket_id = 'signal-documents'
ORDER BY created_at DESC;

-- 3. Encontrar documentos que no tienen archivos correspondientes
SELECT 
    d.id,
    d.title,
    d.file_url,
    d.file_name,
    CASE 
        WHEN o.name IS NULL THEN 'FILE NOT FOUND'
        ELSE 'FILE EXISTS'
    END as status
FROM signal_documents d
LEFT JOIN storage.objects o ON o.name = d.file_url AND o.bucket_id = 'signal-documents'
ORDER BY d.created_at DESC;

-- 4. Limpiar nombres de archivos problemáticos (ejemplo)
-- ⚠️ Solo ejecutar si es necesario
/*
UPDATE signal_documents 
SET file_url = REPLACE(REPLACE(REPLACE(file_url, '%20', ' '), '%', ''), 'https://', '')
WHERE file_url LIKE '%http%' OR file_url LIKE '%%%';
*/

-- 5. Verificar URLs públicas generadas
SELECT 
    title,
    file_url,
    'https://lbymjmoysdwwnpupgckt.supabase.co/storage/v1/object/public/signal-documents/' || file_url as public_url
FROM signal_documents
ORDER BY created_at DESC;

-- 6. Contar archivos por estado
SELECT 
    CASE 
        WHEN o.name IS NULL THEN 'Missing Files'
        ELSE 'Files Exist'
    END as file_status,
    COUNT(*) as count
FROM signal_documents d
LEFT JOIN storage.objects o ON o.name = d.file_url AND o.bucket_id = 'signal-documents'
GROUP BY (o.name IS NULL);
