# Funcionalidad de Signals - Documentación

## Descripción General

La página de Signals permite a los usuarios ver, filtrar, visualizar y descargar documentos PDF relacionados con análisis de trading. Estos documentos se suben semanalmente y están organizados por categorías.

## Características Principales

### 1. Visualización de Documentos
- Lista de todos los documentos PDF disponibles
- Información detallada: título, descripción, categoría, fecha y tamaño
- Diseño responsive con tarjetas modernas

### 2. Sistema de Filtrado
- **Búsqueda por texto**: Busca en títulos y descripciones
- **Filtro por categoría**: 
  - Análisis Técnico
  - Análisis Fundamental
  - Noticias del Mercado
  - Reportes Semanales
  - Estrategias
  - Educación
- **Filtro por período**:
  - Última semana
  - Último mes
  - Último trimestre

### 3. Funcionalidades de Archivo
- **Visualización**: Abre PDFs en nueva pestaña
- **Descarga**: Descarga archivos localmente
- **Información de archivo**: Muestra tamaño y fecha de creación

### 4. Estadísticas
- Contador de documentos totales vs filtrados
- Fecha de última actualización
- Estado de carga y manejo de errores

## Estructura de Base de Datos

### Tabla: `signal_documents`
```sql
- id: UUID (Primary Key)
- title: VARCHAR(255) - Título del documento
- description: TEXT - Descripción opcional
- category: VARCHAR(100) - Categoría del documento
- file_url: TEXT - URL del archivo en Supabase Storage
- file_name: VARCHAR(255) - Nombre del archivo
- file_size: INTEGER - Tamaño en bytes
- created_at: TIMESTAMP - Fecha de creación
- updated_at: TIMESTAMP - Fecha de última actualización
```

### Storage Bucket: `signal-documents`
- Configurado como público para lectura
- Solo administradores pueden subir archivos
- Políticas RLS configuradas

## Archivos Creados

### 1. Página Principal
- **Ubicación**: `src/app/(protected)/signals/page.tsx`
- **Funcionalidad**: Interfaz principal de la página de signals

### 2. Hook Personalizado
- **Ubicación**: `src/hooks/useSignalDocuments.ts`
- **Funcionalidad**: Lógica de negocio para manejo de documentos

### 3. Configuración de Base de Datos
- **Ubicación**: `SIGNALS_DATABASE_SETUP.sql`
- **Funcionalidad**: Script SQL para crear tabla y políticas

### 4. Actualización de Navegación
- **Archivo**: `src/components/layout/Sidebar.tsx`
- **Cambio**: Agregado enlace "Signals" con icono TrendingUp

## Cómo Usar

### Para Usuarios
1. Navegar a la página "Signals" desde el sidebar
2. Usar los filtros para encontrar documentos específicos
3. Hacer clic en "Ver" para abrir el PDF en nueva pestaña
4. Hacer clic en "Descargar" para guardar el archivo localmente

### Para Administradores
1. Subir archivos PDF al bucket `signal-documents` en Supabase Storage
2. Insertar registros en la tabla `signal_documents` con la información del archivo
3. Los archivos aparecerán automáticamente en la interfaz para todos los usuarios

**Nota**: Los documentos son completamente públicos y accesibles para todos los usuarios sin necesidad de autenticación.

## Ejemplo de Inserción de Documento

```sql
INSERT INTO signal_documents (title, description, category, file_url, file_name, file_size) 
VALUES (
    'Análisis Técnico Semanal - Enero 2024',
    'Análisis técnico completo del mercado con niveles de soporte y resistencia.',
    'Análisis Técnico',
    'analisis-tecnico-enero-2024.pdf',
    'analisis-tecnico-enero-2024.pdf',
    2048576
);
```

## Configuración Requerida

### Variables de Entorno
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (para operaciones administrativas)

### Dependencias
- `@supabase/supabase-js` - Cliente de Supabase
- `date-fns` - Manejo de fechas
- `lucide-react` - Iconos

## Consideraciones de Seguridad

1. **RLS (Row Level Security)**: Habilitado en la tabla con políticas públicas
2. **Políticas de acceso**: Acceso público para lectura, escritura solo para administradores
3. **Storage policies**: Lectura pública, escritura solo para service role y usuarios autenticados
4. **Validación**: Los archivos deben ser PDFs
5. **Acceso público**: Los documentos son visibles para todos los usuarios sin autenticación

## Futuras Mejoras

- [ ] Sistema de favoritos para documentos
- [ ] Notificaciones para nuevos documentos
- [ ] Búsqueda avanzada con filtros múltiples
- [ ] Historial de descargas
- [ ] Sistema de comentarios en documentos
- [ ] Vista previa de PDFs integrada
- [ ] Sistema de tags adicionales
- [ ] Estadísticas de uso por usuario

## Troubleshooting

### Error: "No se encontraron documentos"
- Verificar que la tabla `signal_documents` existe
- Comprobar que hay registros en la tabla
- Verificar políticas RLS

### Error: "Error al cargar documentos"
- Verificar configuración de Supabase
- Comprobar variables de entorno
- Verificar conexión a internet

### Error: "Error al descargar archivo"
- Verificar que el archivo existe en el bucket
- Comprobar políticas de storage
- Verificar permisos del usuario
