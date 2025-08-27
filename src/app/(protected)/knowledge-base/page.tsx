"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, Star, Clock, TrendingUp } from "lucide-react"


const ARTICLES = [
  {
    id: 1,
    title: "Getting Started with Portfolio Management",
    description: "Learn the basics of creating and managing your investment portfolio",
    category: "Beginner",
    readTime: "5 min",
    views: 1240,
    featured: true,
    tags: ["portfolio", "basics", "getting-started"]
  },
  {
    id: 2,
    title: "Understanding Investment Models",
    description: "How to create and apply investment models to your portfolio",
    category: "Intermediate",
    readTime: "8 min",
    views: 890,
    featured: false,
    tags: ["models", "investment", "strategy"]
  },
  {
    id: 3,
    title: "Connecting Your Brokerage Account",
    description: "Step-by-step guide to securely connect your broker",
    category: "Beginner",
    readTime: "3 min",
    views: 2100,
    featured: true,
    tags: ["broker", "connection", "security"]
  },
  {
    id: 4,
    title: "Advanced Portfolio Rebalancing",
    description: "Master the art of portfolio rebalancing for optimal returns",
    category: "Advanced",
    readTime: "12 min",
    views: 456,
    featured: false,
    tags: ["rebalancing", "advanced", "optimization"]
  },
  {
    id: 5,
    title: "Risk Management Strategies",
    description: "Essential risk management techniques for investors",
    category: "Intermediate",
    readTime: "10 min",
    views: 678,
    featured: false,
    tags: ["risk", "management", "strategy"]
  }
]

const CATEGORIES = ["All", "Beginner", "Intermediate", "Advanced"]

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredArticles = ARTICLES.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Beginner": return "bg-green-100 text-green-800"
      case "Intermediate": return "bg-yellow-100 text-yellow-800"
      case "Advanced": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div>
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Knowledge Base</h1>
                <p className="text-muted-foreground">
                  Learn about portfolio management, investment strategies, and more
                </p>
              </div>

              {/* Search and Filters */}
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Featured Articles */}
              {filteredArticles.filter(a => a.featured).length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Featured Articles
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredArticles
                      .filter(article => article.featured)
                      .map((article) => (
                        <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-lg">{article.title}</CardTitle>
                              <Badge className={getCategoryColor(article.category)}>
                                {article.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{article.description}</p>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {article.readTime}
                                </span>
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="w-4 h-4" />
                                  {article.views} views
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )}

              {/* All Articles */}
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  All Articles
                </h2>
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{article.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{article.description}</p>
                            <div className="flex items-center gap-2">
                              <Badge className={getCategoryColor(article.category)}>
                                {article.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {article.readTime}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {article.views} views
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredArticles.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No articles found matching your search.</p>
                  </div>
                )}
              </div>
    </div>
  )
}
