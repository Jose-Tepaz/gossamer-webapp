"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, TrendingUp, BookOpen, Calendar, User } from "lucide-react"
import { useKnowledgeArticles, type KnowledgeArticle } from "@/hooks/useKnowledgeArticles"
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [article, setArticle] = useState<KnowledgeArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { getArticleBySlug, incrementViews, getRelatedArticles } = useKnowledgeArticles()

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🔍 Loading article with slug:', slug)
        const articleData = await getArticleBySlug(slug)
        console.log('📄 Article data received:', articleData)
        
        setArticle(articleData)
        
        // Incrementar vistas
        if (articleData) {
          console.log('📈 Incrementing views for article:', articleData.id)
          await incrementViews(articleData.id)
        }
      } catch (err) {
        console.error('❌ Error cargando artículo:', err)
        setError('Artículo no encontrado')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      loadArticle()
    } else {
      console.log('⚠️ No slug provided')
      setError('No se proporcionó un slug')
      setLoading(false)
    }
  }, [slug, getArticleBySlug, incrementViews]) // Incluir todas las dependencias

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Beginner": return "bg-green-100 text-green-800"
      case "Intermediate": return "bg-yellow-100 text-yellow-800"
      case "Advanced": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatContent = (content: string) => {
    // Convertir markdown básico a HTML
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-2 mt-4">$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-semibold mb-2 mt-3">$1</h4>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
      .replace(/\n\n/gim, '</p><p class="mb-4">')
      .replace(/\n/gim, '<br>')
      .replace(/^(.*)$/gim, '<p class="mb-4">$1</p>')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="space-y-6">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="flex items-center gap-3 p-6">
            <div>
              <h3 className="text-lg font-medium text-red-400">Artículo no encontrado</h3>
              <p className="text-red-300/70">El artículo que buscas no existe o no está disponible.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const relatedArticles = getRelatedArticles(article, 3)

  return (
    <div className="space-y-6">
      {/* Botón de regreso */}
      <Button 
        variant="outline" 
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a Knowledge Base
      </Button>

      {/* Header del artículo */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">{article.description}</p>
          </div>
          <Badge className={getCategoryColor(article.category)}>
            {article.category}
          </Badge>
        </div>

        {/* Metadatos */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {article.read_time} min de lectura
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            {article.views} vistas
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(new Date(article.created_at), 'dd MMM yyyy', { locale: es })}
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {article.author}
          </div>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Contenido del artículo */}
      <Card>
        <CardContent className="p-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: formatContent(article.content) 
            }}
          />
        </CardContent>
      </Card>

      {/* Artículos relacionados */}
      {relatedArticles.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Artículos Relacionados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedArticles.map((relatedArticle) => (
              <Card 
                key={relatedArticle.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/knowledge-base/${relatedArticle.slug}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{relatedArticle.title}</CardTitle>
                    <Badge className={getCategoryColor(relatedArticle.category)}>
                      {relatedArticle.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{relatedArticle.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {relatedArticle.read_time} min
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {relatedArticle.views} vistas
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Botón de regreso al final */}
      <div className="flex justify-center pt-6">
        <Button 
          variant="outline" 
          onClick={() => router.push('/knowledge-base')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Knowledge Base
        </Button>
      </div>
    </div>
  )
}
