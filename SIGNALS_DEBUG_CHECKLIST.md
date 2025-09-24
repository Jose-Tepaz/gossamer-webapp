# Checklist de Depuración - Signals

## 🔍 Pasos para Diagnosticar el Problema

### 1. Verificar Variables de Entorno
Asegúrate de que tienes estas variables en tu archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### 2. Verificar Estructura de la Tabla
En tu dashboard de Supabase, ejecuta esta consulta para verificar la estructura:

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'signal_documents';
```

### 3. Verificar Datos en la Tabla
Ejecuta esta consulta para ver si hay datos:

```sql
SELECT * FROM signal_documents LIMIT 10;
```

### 4. Verificar Políticas RLS
Ejecuta esta consulta para ver las políticas:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'signal_documents';
```

### 5. Verificar Storage Bucket
En el dashboard de Supabase:
- Ve a Storage
- Verifica que existe el bucket `signal-documents`
- Verifica que el bucket es público
- Verifica que hay archivos en el bucket

### 6. Verificar Políticas de Storage
Ejecuta esta consulta para ver las políticas de storage:

```sql
SELECT * FROM storage.policies WHERE bucket_id = 'signal-documents';
```

## 🐛 Posibles Problemas y Soluciones

### Problema 1: Variables de entorno faltantes
**Síntomas**: Error "Supabase client not configured"
**Solución**: Agregar las variables de entorno en `.env.local`

### Problema 2: Tabla no existe
**Síntomas**: Error "relation 'signal_documents' does not exist"
**Solución**: Ejecutar el script `SIGNALS_DATABASE_SETUP.sql`

### Problema 3: Políticas RLS incorrectas
**Síntomas**: Error de permisos o datos vacíos
**Solución**: Verificar y ajustar las políticas RLS

### Problema 4: Bucket de storage no configurado
**Síntomas**: Error al descargar/ver archivos
**Solución**: Crear el bucket y configurar las políticas

### Problema 5: Datos no insertados correctamente
**Síntomas**: No se muestran documentos
**Solución**: Verificar que los datos están en la tabla

## 📋 Consultas de Verificación

### Verificar si la tabla existe:
```sql
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'signal_documents'
);
```

### Verificar políticas RLS:
```sql
SELECT * FROM pg_policies WHERE tablename = 'signal_documents';
```

### Verificar bucket de storage:
```sql
SELECT * FROM storage.buckets WHERE id = 'signal-documents';
```

### Verificar archivos en storage:
```sql
SELECT * FROM storage.objects WHERE bucket_id = 'signal-documents';
```

## 🔧 Comandos de Consola para Verificar

Abre la consola del navegador (F12) y verifica estos logs:

1. **Configuración de Supabase**: Debe mostrar "✅ Configuración de Supabase correcta"
2. **Cliente Supabase**: Debe mostrar un objeto, no null
3. **Query result**: Debe mostrar los datos o el error específico

## 📝 Información a Recopilar

Si el problema persiste, proporciona:

1. **Logs de la consola** del navegador
2. **Estructura de tu tabla** (resultado de la consulta de columnas)
3. **Datos en la tabla** (resultado de SELECT * FROM signal_documents)
4. **Políticas RLS** (resultado de la consulta de políticas)
5. **Configuración del bucket** (si existe y es público)
6. **Variables de entorno** (sin mostrar las keys reales)

## 🚀 Próximos Pasos

1. Ejecuta las consultas de verificación
2. Revisa los logs en la consola del navegador
3. Verifica la configuración de Supabase
4. Reporta los resultados para diagnóstico adicional
