-- Solución rápida: Deshabilitar RLS temporalmente
-- ⚠️ ADVERTENCIA: Esto hace la tabla completamente pública

-- Deshabilitar RLS temporalmente
ALTER TABLE signal_documents DISABLE ROW LEVEL SECURITY;

-- Crear el bucket de storage
INSERT INTO storage.buckets (id, name, public) 
VALUES ('signal-documents', 'signal-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Verificar que todo funciona
SELECT COUNT(*) as document_count FROM signal_documents;
SELECT id, name, public FROM storage.buckets WHERE id = 'signal-documents';

-- Para reactivar RLS más tarde (cuando tengas autenticación configurada):
-- ALTER TABLE signal_documents ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public can view signal documents" ON signal_documents FOR SELECT USING (true);
