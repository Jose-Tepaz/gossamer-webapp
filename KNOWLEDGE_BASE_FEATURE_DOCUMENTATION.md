# Funcionalidad de Knowledge Base - Documentación

## Descripción General

La página de Knowledge Base permite a los usuarios leer artículos educativos sobre inversiones, gestión de portafolios y estrategias de trading. Los artículos están organizados por categorías y nivel de dificultad.

## Características Principales

### 1. Listado de Artículos
- **Vista de artículos destacados**: Los artículos marcados como "featured" aparecen en la parte superior
- **Vista completa**: Lista de todos los artículos disponibles
- **Información detallada**: Título, descripción, categoría, tiempo de lectura y vistas

### 2. Sistema de Filtrado
- **Búsqueda por texto**: Busca en títulos, descripciones y tags
- **Filtro por categoría**: 
  - Beginner (Verde)
  - Intermediate (Amarillo)
  - Advanced (Rojo)

### 3. Lectura de Artículos
- **Página individual**: Cada artículo tiene su propia página
- **Contenido en Markdown**: Soporte para formato markdown básico
- **Metadatos**: Tiempo de lectura, vistas, fecha, autor
- **Artículos relacionados**: Sugerencias basadas en categoría y tags
- **Navegación**: Botones para regresar a la lista

### 4. Estadísticas
- **Contador de artículos**: Total vs filtrados
- **Artículos destacados**: Cantidad de artículos featured
- **Vistas totales**: Suma de todas las vistas
- **Tiempo promedio**: Tiempo promedio de lectura

## Estructura de Base de Datos

### Tabla: `knowledge_articles`
```sql
- id: UUID (Primary Key)
- title: VARCHAR(255) - Título del artículo
- description: TEXT - Descripción breve
- content: TEXT - Contenido completo en markdown
- category: VARCHAR(50) - Nivel de dificultad (Beginner/Intermediate/Advanced)
- read_time: INTEGER - Tiempo estimado de lectura en minutos
- views: INTEGER - Número de vistas
- featured: BOOLEAN - Si es artículo destacado
- tags: TEXT[] - Array de tags/tags
- created_at: TIMESTAMP - Fecha de creación
- updated_at: TIMESTAMP - Fecha de última actualización
- published: BOOLEAN - Si está publicado
- author: VARCHAR(100) - Autor del artículo
- slug: VARCHAR(255) - URL amigable (único)
```

## Archivos Creados

### 1. Base de Datos
- **Ubicación**: `KNOWLEDGE_BASE_DATABASE_SETUP.sql`
- **Funcionalidad**: Script SQL para crear tabla, políticas y datos de ejemplo

### 2. Hook Personalizado
- **Ubicación**: `src/hooks/useKnowledgeArticles.ts`
- **Funcionalidad**: Lógica de negocio para manejo de artículos

### 3. Página Principal
- **Ubicación**: `src/app/(protected)/knowledge-base/page.tsx`
- **Funcionalidad**: Lista de artículos con filtros y búsqueda

### 4. Página de Artículo Individual
- **Ubicación**: `src/app/(protected)/knowledge-base/[slug]/page.tsx`
- **Funcionalidad**: Lectura completa de artículos

## Cómo Usar

### Para Usuarios
1. Navegar a la página "Knowledge Base" desde el sidebar
2. Usar la búsqueda para encontrar artículos específicos
3. Filtrar por categoría (Beginner, Intermediate, Advanced)
4. Hacer clic en cualquier artículo para leerlo
5. En la página del artículo, ver contenido completo y artículos relacionados

### Para Administradores
1. Insertar artículos en la tabla `knowledge_articles`
2. Usar el campo `slug` para URLs amigables
3. Marcar artículos como `featured` para destacarlos
4. Usar markdown en el campo `content` para formato

## Ejemplo de Inserción de Artículo

```sql
INSERT INTO knowledge_articles (
    title, 
    description, 
    content, 
    category, 
    read_time, 
    views, 
    featured, 
    tags, 
    slug,
    author
) VALUES (
    'Mi Nuevo Artículo',
    'Descripción del artículo',
    '# Título\n\nContenido en **markdown**...',
    'Beginner',
    5,
    0,
    false,
    ARRAY['tag1', 'tag2'],
    'mi-nuevo-articulo',
    'Autor'
);
```

## Formato de Contenido

El contenido de los artículos soporta markdown básico:

### Encabezados
```markdown
# Título Principal
## Subtítulo
### Sub-subtítulo
```

### Texto
```markdown
**Texto en negrita**
*Texto en cursiva*
```

### Listas
```markdown
- Item 1
- Item 2
- Item 3

1. Primer paso
2. Segundo paso
3. Tercer paso
```

### Párrafos
Los párrafos se separan con líneas vacías.

## Características Técnicas

### URLs Amigables
- Los artículos se acceden por `/knowledge-base/[slug]`
- El slug se genera automáticamente del título
- URLs únicas y legibles

### Rendimiento
- **Lazy loading**: Los artículos se cargan bajo demanda
- **Filtrado optimizado**: Usa `useMemo` para evitar re-renders
- **Caché**: Los datos se mantienen en memoria durante la sesión

### Seguridad
- **RLS habilitado**: Solo artículos publicados son visibles
- **Políticas públicas**: Lectura pública, escritura solo para administradores
- **Validación**: Categorías restringidas a valores específicos

## Consideraciones de Seguridad

1. **RLS (Row Level Security)**: Habilitado con políticas públicas
2. **Acceso de lectura**: Público para artículos publicados
3. **Acceso de escritura**: Solo para service role (administradores)
4. **Validación de datos**: Categorías y campos requeridos
5. **Slugs únicos**: Previene conflictos de URLs

## Futuras Mejoras

- [ ] Sistema de favoritos para artículos
- [ ] Comentarios y ratings
- [ ] Búsqueda avanzada con filtros múltiples
- [ ] Historial de lectura
- [ ] Sistema de tags más avanzado
- [ ] Artículos en múltiples idiomas
- [ ] Exportación a PDF
- [ ] Compartir artículos
- [ ] Sistema de notificaciones para nuevos artículos
- [ ] Editor WYSIWYG para administradores

## Troubleshooting

### Error: "Artículo no encontrado"
- Verificar que el slug existe en la base de datos
- Comprobar que el artículo está marcado como `published = true`
- Verificar políticas RLS

### Error: "No se cargan artículos"
- Verificar configuración de Supabase
- Comprobar variables de entorno
- Verificar que la tabla `knowledge_articles` existe

### Problemas de formato
- Verificar que el contenido markdown es válido
- Comprobar que los caracteres especiales están correctamente escapados
- Verificar que las etiquetas HTML se renderizan correctamente

## Configuración Requerida

### Variables de Entorno
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Dependencias
- `@supabase/supabase-js` - Cliente de Supabase
- `date-fns` - Manejo de fechas
- `lucide-react` - Iconos
- `next/navigation` - Navegación de Next.js
