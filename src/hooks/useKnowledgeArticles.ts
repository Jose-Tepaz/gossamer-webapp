import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface KnowledgeArticle {
  id: string
  title: string
  description: string
  content: string
  category: 'Beginner' | 'Intermediate' | 'Advanced'
  read_time: number
  views: number
  featured: boolean
  tags: string[]
  created_at: string
  updated_at: string
  published: boolean
  author: string
  slug: string
}

export interface KnowledgeArticleFilters {
  searchQuery?: string
  category?: string
  featured?: boolean
}

export const useKnowledgeArticles = (filters?: KnowledgeArticleFilters) => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar artículos desde Supabase
  const loadArticles = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('knowledge_articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error cargando artículos:', error)
        setError('Error al cargar los artículos')
        return
      }

      setArticles(data || [])
    } catch (err) {
      console.error('Error:', err)
      setError('Error inesperado al cargar los artículos')
    } finally {
      setLoading(false)
    }
  }

  // Filtrar artículos usando useMemo
  const filteredArticles = useMemo(() => {
    if (!filters) return articles

    let filtered = [...articles]

    // Filtro por búsqueda
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.description.toLowerCase().includes(searchLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Filtro por categoría
    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter(article => article.category === filters.category)
    }

    // Filtro por featured
    if (filters.featured !== undefined) {
      filtered = filtered.filter(article => article.featured === filters.featured)
    }

    return filtered
  }, [articles, filters?.searchQuery, filters?.category, filters?.featured])

  // Cargar artículos al montar el componente
  useEffect(() => {
    loadArticles()
  }, [])

  // Función para obtener un artículo por slug (memoizada)
  const getArticleBySlug = useCallback(async (slug: string) => {
    try {
      console.log('🔍 Hook: getArticleBySlug called with slug:', slug)
      
      if (!supabase) {
        console.error('❌ Hook: Supabase client not configured')
        throw new Error('Supabase client not configured')
      }

      console.log('🔍 Hook: Querying database for slug:', slug)
      const { data, error } = await supabase
        .from('knowledge_articles')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()

      console.log('📊 Hook: Query result:', { data, error })

      if (error) {
        console.error('❌ Hook: Error obteniendo artículo:', error)
        throw new Error('Artículo no encontrado')
      }

      console.log('✅ Hook: Article found:', data)
      return data
    } catch (error) {
      console.error('❌ Hook: Error:', error)
      throw error
    }
  }, [])

  // Función para incrementar las vistas de un artículo (memoizada)
  const incrementViews = useCallback(async (articleId: string) => {
    try {
      if (!supabase) {
        console.error('Supabase client not configured')
        return
      }

      const { error } = await supabase
        .from('knowledge_articles')
        .update({ views: articles.find(a => a.id === articleId)?.views + 1 || 1 })
        .eq('id', articleId)

      if (error) {
        console.error('Error incrementando vistas:', error)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }, [articles])

  // Función para obtener estadísticas
  const getStats = () => {
    const totalArticles = articles.length
    const categories = [...new Set(articles.map(article => article.category))]
    const featuredArticles = articles.filter(article => article.featured)
    const totalViews = articles.reduce((sum, article) => sum + article.views, 0)
    const averageReadTime = articles.length > 0 
      ? Math.round(articles.reduce((sum, article) => sum + article.read_time, 0) / articles.length)
      : 0

    return {
      totalArticles,
      categories,
      featuredArticles: featuredArticles.length,
      totalViews,
      averageReadTime
    }
  }

  // Función para obtener artículos relacionados (por categoría y tags)
  const getRelatedArticles = (currentArticle: KnowledgeArticle, limit: number = 3) => {
    return articles
      .filter(article => 
        article.id !== currentArticle.id && 
        (article.category === currentArticle.category || 
         article.tags.some(tag => currentArticle.tags.includes(tag)))
      )
      .slice(0, limit)
  }

  return {
    articles,
    filteredArticles,
    loading,
    error,
    loadArticles,
    getArticleBySlug,
    incrementViews,
    getStats,
    getRelatedArticles
  }
}
