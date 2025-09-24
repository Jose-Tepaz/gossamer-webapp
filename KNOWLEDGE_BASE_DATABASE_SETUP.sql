-- Crear tabla para artículos de Knowledge Base
CREATE TABLE IF NOT EXISTS knowledge_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Beginner', 'Intermediate', 'Advanced')),
    read_time INTEGER NOT NULL DEFAULT 5, -- en minutos
    views INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published BOOLEAN DEFAULT true,
    author VARCHAR(100) DEFAULT 'Gossamer Team',
    slug VARCHAR(255) UNIQUE NOT NULL -- para URLs amigables
);

-- Crear índices para optimizar las consultas
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_category ON knowledge_articles(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_featured ON knowledge_articles(featured);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_published ON knowledge_articles(published);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_created_at ON knowledge_articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_slug ON knowledge_articles(slug);

-- Habilitar RLS (Row Level Security)
ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública a todos los usuarios
CREATE POLICY "Public can view published articles" ON knowledge_articles
    FOR SELECT USING (published = true);

-- Política para permitir inserción solo a administradores (service role)
CREATE POLICY "Admins can insert articles" ON knowledge_articles
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Política para permitir actualización solo a administradores
CREATE POLICY "Admins can update articles" ON knowledge_articles
    FOR UPDATE USING (auth.role() = 'service_role');

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_knowledge_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_knowledge_articles_updated_at 
    BEFORE UPDATE ON knowledge_articles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_knowledge_articles_updated_at();

-- Función para generar slug automáticamente
CREATE OR REPLACE FUNCTION generate_article_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := lower(replace(replace(NEW.title, ' ', '-'), '''', ''));
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para generar slug
CREATE TRIGGER generate_article_slug_trigger
    BEFORE INSERT OR UPDATE ON knowledge_articles
    FOR EACH ROW
    EXECUTE FUNCTION generate_article_slug();

-- Insertar artículos de ejemplo (uno por uno para evitar errores)
INSERT INTO knowledge_articles (title, description, content, category, read_time, views, featured, tags, slug) VALUES
(
    'Getting Started with Portfolio Management',
    'Learn the basics of creating and managing your investment portfolio',
    '# Getting Started with Portfolio Management

## Introduction
Portfolio management is the art and science of making decisions about investment mix and policy.

## Key Concepts
- Asset Allocation
- Risk Management  
- Diversification

## Getting Started Steps
1. Define Your Goals
2. Assess Your Risk Tolerance
3. Choose Your Investment Strategy

Start with the basics and gradually build your knowledge.',
    'Beginner',
    5,
    1240,
    true,
    ARRAY['portfolio', 'basics', 'getting-started'],
    'getting-started-portfolio-management'
);

INSERT INTO knowledge_articles (title, description, content, category, read_time, views, featured, tags, slug) VALUES
(
    'Understanding Investment Models',
    'How to create and apply investment models to your portfolio',
    '# Understanding Investment Models

## What are Investment Models?
Investment models are systematic approaches to making investment decisions.

## Types of Models
- Fundamental Analysis Models
- Technical Analysis Models
- Quantitative Models

Start simple and gradually build more sophisticated approaches.',
    'Intermediate',
    8,
    890,
    false,
    ARRAY['models', 'investment', 'strategy'],
    'understanding-investment-models'
);

INSERT INTO knowledge_articles (title, description, content, category, read_time, views, featured, tags, slug) VALUES
(
    'Connecting Your Brokerage Account',
    'Step-by-step guide to securely connect your broker',
    '# Connecting Your Brokerage Account

## Why Connect Your Broker?
Connecting allows you to sync portfolio data and track performance.

## Supported Brokers
- Interactive Brokers
- TD Ameritrade
- E*TRADE
- Charles Schwab

## Security
All connections use bank-level encryption and read-only access.',
    'Beginner',
    3,
    2100,
    true,
    ARRAY['broker', 'connection', 'security'],
    'connecting-brokerage-account'
);

INSERT INTO knowledge_articles (title, description, content, category, read_time, views, featured, tags, slug) VALUES
(
    'Advanced Portfolio Rebalancing',
    'Master the art of portfolio rebalancing for optimal returns',
    '# Advanced Portfolio Rebalancing

## What is Rebalancing?
Portfolio rebalancing is realigning asset weights to maintain target allocation.

## Why Rebalance?
- Risk Management
- Disciplined Investing
- Buy Low, Sell High

## Advanced Strategies
- Threshold-Based Rebalancing
- Tax-Efficient Rebalancing
- Momentum-Based Rebalancing

Start with simple strategies and gradually incorporate advanced techniques.',
    'Advanced',
    12,
    456,
    false,
    ARRAY['rebalancing', 'advanced', 'optimization'],
    'advanced-portfolio-rebalancing'
);

INSERT INTO knowledge_articles (title, description, content, category, read_time, views, featured, tags, slug) VALUES
(
    'Risk Management Strategies',
    'Essential risk management techniques for investors',
    '# Risk Management Strategies

## Understanding Investment Risk
Investment risk is the possibility that actual returns differ from expected returns.

## Types of Risk
- Market Risk
- Credit Risk
- Liquidity Risk
- Inflation Risk

## Risk Management Framework
1. Risk Assessment
2. Risk Mitigation
3. Risk Monitoring

Effective risk management is essential for long-term success.',
    'Intermediate',
    10,
    678,
    false,
    ARRAY['risk', 'management', 'strategy'],
    'risk-management-strategies'
);

-- Verificar la configuración
SELECT 'Knowledge Base setup completed successfully' as status;
SELECT COUNT(*) as article_count FROM knowledge_articles;
SELECT category, COUNT(*) as count FROM knowledge_articles GROUP BY category;
