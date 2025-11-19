export interface Course {
  id: string;
  title: string;
  category: string;
  price: number;
  formats: string[];
  description: string;
  modules: {
    number: number;
    title: string;
    content: string[];
  }[];
  objectives: string[];
}

export const coursesData: Course[] = [
  // Administração (5 cursos)
  {
    id: "adm-001",
    title: "Gestão de Escritórios",
    category: "Administração",
    price: 2000,
    formats: ["Texto", "Vídeo"],
    description: "Aprenda técnicas essenciais para organizar e gerir um escritório profissional com eficiência.",
    modules: [
      { number: 1, title: "Introdução à Gestão", content: ["Conceitos básicos", "Organização do espaço", "Ferramentas digitais"] },
      { number: 2, title: "Comunicação Efetiva", content: ["Atendimento ao cliente", "Gestão de emails", "Reuniões produtivas"] },
      { number: 3, title: "Avaliação e Melhoria", content: ["KPIs de escritório", "Feedback contínuo", "Certificação final"] }
    ],
    objectives: ["Organizar espaços de trabalho", "Melhorar comunicação interna", "Aumentar produtividade"]
  },
  {
    id: "adm-002",
    title: "Liderança e Equipes",
    category: "Administração",
    price: 3000,
    formats: ["Texto", "Áudio"],
    description: "Desenvolva habilidades de liderança para motivar e gerir equipes de alto desempenho.",
    modules: [
      { number: 1, title: "Fundamentos da Liderança", content: ["Tipos de líder", "Competências essenciais", "Ética profissional"] },
      { number: 2, title: "Gestão de Pessoas", content: ["Motivação de equipes", "Resolução de conflitos", "Delegação eficaz"] },
      { number: 3, title: "Prática e Avaliação", content: ["Casos reais", "Simulações", "Projeto final"] }
    ],
    objectives: ["Liderar com confiança", "Construir equipes eficazes", "Resolver conflitos"]
  },
  {
    id: "adm-003",
    title: "Planejamento Estratégico",
    category: "Administração",
    price: 4000,
    formats: ["Texto", "Vídeo"],
    description: "Domine técnicas de planejamento para definir objetivos e estratégias organizacionais vencedoras.",
    modules: [
      { number: 1, title: "Análise de Cenários", content: ["SWOT", "Análise de mercado", "Tendências"] },
      { number: 2, title: "Definição de Estratégias", content: ["Objetivos SMART", "Planos de ação", "Indicadores"] },
      { number: 3, title: "Implementação", content: ["Execução", "Monitoramento", "Ajustes"] }
    ],
    objectives: ["Criar planos estratégicos", "Analisar mercados", "Implementar estratégias"]
  },
  {
    id: "adm-004",
    title: "Gestão de Projetos",
    category: "Administração",
    price: 5000,
    formats: ["Texto", "Vídeo"],
    description: "Aprenda metodologias para planejar, executar e controlar projetos com sucesso.",
    modules: [
      { number: 1, title: "Fundamentos de Projetos", content: ["Ciclo de vida", "Stakeholders", "Escopo"] },
      { number: 2, title: "Planejamento e Execução", content: ["Cronogramas", "Recursos", "Riscos"] },
      { number: 3, title: "Controle e Encerramento", content: ["Monitoramento", "Qualidade", "Lições aprendidas"] }
    ],
    objectives: ["Gerir projetos complexos", "Controlar prazos e custos", "Garantir qualidade"]
  },
  {
    id: "adm-005",
    title: "Comunicação Corporativa",
    category: "Administração",
    price: 6000,
    formats: ["Texto", "Áudio"],
    description: "Aprimore suas habilidades de comunicação para ambientes corporativos e apresentações executivas.",
    modules: [
      { number: 1, title: "Comunicação Estratégica", content: ["Tipos de comunicação", "Públicos-alvo", "Canais"] },
      { number: 2, title: "Apresentações Executivas", content: ["Storytelling", "Slides eficazes", "Oratória"] },
      { number: 3, title: "Gestão de Crises", content: ["Comunicação de crise", "Porta-voz", "Reputação"] }
    ],
    objectives: ["Comunicar com impacto", "Fazer apresentações convincentes", "Gerir crises"]
  },

  // Tecnologia da Informação (5 cursos)
  {
    id: "ti-001",
    title: "Introdução à Programação",
    category: "Tecnologia da Informação",
    price: 2000,
    formats: ["Texto", "Vídeo"],
    description: "Dê os primeiros passos no mundo da programação com Python e lógica de programação.",
    modules: [
      { number: 1, title: "Lógica de Programação", content: ["Algoritmos", "Variáveis", "Estruturas de controle"] },
      { number: 2, title: "Python Básico", content: ["Sintaxe", "Funções", "Estruturas de dados"] },
      { number: 3, title: "Projeto Prático", content: ["Mini projeto", "Debugging", "Boas práticas"] }
    ],
    objectives: ["Entender lógica de programação", "Criar programas simples", "Resolver problemas"]
  },
  {
    id: "ti-002",
    title: "Desenvolvimento Web",
    category: "Tecnologia da Informação",
    price: 3000,
    formats: ["Texto", "Vídeo"],
    description: "Crie sites modernos e responsivos com HTML, CSS e JavaScript.",
    modules: [
      { number: 1, title: "HTML e CSS", content: ["Estrutura HTML", "Estilização CSS", "Responsividade"] },
      { number: 2, title: "JavaScript Essencial", content: ["DOM", "Eventos", "APIs"] },
      { number: 3, title: "Projeto Web", content: ["Site completo", "Deploy", "Portfólio"] }
    ],
    objectives: ["Criar sites profissionais", "Dominar front-end", "Publicar projetos"]
  },
  {
    id: "ti-003",
    title: "Banco de Dados",
    category: "Tecnologia da Informação",
    price: 4000,
    formats: ["Texto", "Vídeo"],
    description: "Aprenda a modelar e gerir bases de dados relacionais com SQL.",
    modules: [
      { number: 1, title: "Modelagem de Dados", content: ["Entidades", "Relacionamentos", "Normalização"] },
      { number: 2, title: "SQL Avançado", content: ["Consultas complexas", "Joins", "Índices"] },
      { number: 3, title: "Administração", content: ["Backup", "Performance", "Segurança"] }
    ],
    objectives: ["Modelar bases de dados", "Dominar SQL", "Otimizar consultas"]
  },
  {
    id: "ti-004",
    title: "Segurança da Informação",
    category: "Tecnologia da Informação",
    price: 5000,
    formats: ["Texto", "Vídeo"],
    description: "Proteja sistemas e dados contra ameaças cibernéticas com técnicas avançadas.",
    modules: [
      { number: 1, title: "Fundamentos de Segurança", content: ["Ameaças", "Vulnerabilidades", "Defesas"] },
      { number: 2, title: "Criptografia", content: ["Algoritmos", "Certificados", "SSL/TLS"] },
      { number: 3, title: "Segurança Prática", content: ["Testes de penetração", "Firewall", "Auditoria"] }
    ],
    objectives: ["Proteger sistemas", "Implementar criptografia", "Realizar auditorias"]
  },
  {
    id: "ti-005",
    title: "Inteligência Artificial",
    category: "Tecnologia da Informação",
    price: 6000,
    formats: ["Texto", "Vídeo"],
    description: "Explore o futuro da tecnologia com machine learning e IA aplicada.",
    modules: [
      { number: 1, title: "Fundamentos de IA", content: ["História", "Tipos de IA", "Aplicações"] },
      { number: 2, title: "Machine Learning", content: ["Algoritmos", "Treinamento", "Avaliação"] },
      { number: 3, title: "Projeto de IA", content: ["Dataset", "Modelo", "Deployment"] }
    ],
    objectives: ["Entender IA", "Criar modelos de ML", "Aplicar IA em projetos"]
  },

  // Marketing e Vendas (5 cursos)
  {
    id: "mkt-001",
    title: "Marketing Digital",
    category: "Marketing e Vendas",
    price: 2000,
    formats: ["Texto", "Vídeo"],
    description: "Domine estratégias de marketing digital para promover produtos e serviços online.",
    modules: [
      { number: 1, title: "Fundamentos do Marketing", content: ["4Ps", "Jornada do cliente", "Funil de vendas"] },
      { number: 2, title: "Canais Digitais", content: ["Email marketing", "Anúncios", "Content marketing"] },
      { number: 3, title: "Campanha Completa", content: ["Planejamento", "Execução", "Análise"] }
    ],
    objectives: ["Criar campanhas digitais", "Gerar leads", "Aumentar conversões"]
  },
  {
    id: "mkt-002",
    title: "Redes Sociais",
    category: "Marketing e Vendas",
    price: 3000,
    formats: ["Texto", "Vídeo"],
    description: "Aprenda a gerir e criar conteúdo viral para redes sociais.",
    modules: [
      { number: 1, title: "Estratégia de Conteúdo", content: ["Persona", "Calendário editorial", "Formatos"] },
      { number: 2, title: "Plataformas", content: ["Instagram", "Facebook", "TikTok", "LinkedIn"] },
      { number: 3, title: "Engajamento", content: ["Métricas", "Crescimento orgânico", "Comunidade"] }
    ],
    objectives: ["Criar conteúdo viral", "Crescer seguidores", "Engajar audiência"]
  },
  {
    id: "mkt-003",
    title: "SEO e Analytics",
    category: "Marketing e Vendas",
    price: 4000,
    formats: ["Texto", "Vídeo"],
    description: "Otimize sites para motores de busca e analise dados para decisões estratégicas.",
    modules: [
      { number: 1, title: "SEO On-Page", content: ["Palavras-chave", "Meta tags", "Conteúdo otimizado"] },
      { number: 2, title: "SEO Off-Page", content: ["Backlinks", "Autoridade", "Link building"] },
      { number: 3, title: "Google Analytics", content: ["Configuração", "Relatórios", "Insights"] }
    ],
    objectives: ["Ranquear no Google", "Analisar tráfego", "Tomar decisões baseadas em dados"]
  },
  {
    id: "mkt-004",
    title: "Publicidade e Branding",
    category: "Marketing e Vendas",
    price: 5000,
    formats: ["Texto", "Vídeo"],
    description: "Construa marcas fortes e crie campanhas publicitárias memoráveis.",
    modules: [
      { number: 1, title: "Fundamentos de Branding", content: ["Identidade visual", "Posicionamento", "Tom de voz"] },
      { number: 2, title: "Publicidade Criativa", content: ["Copywriting", "Design", "Storytelling"] },
      { number: 3, title: "Gestão de Marca", content: ["Brand equity", "Rebranding", "Proteção"] }
    ],
    objectives: ["Criar marcas fortes", "Desenvolver campanhas", "Gerir reputação"]
  },
  {
    id: "mkt-005",
    title: "Estratégias de Vendas",
    category: "Marketing e Vendas",
    price: 6000,
    formats: ["Texto", "Vídeo"],
    description: "Técnicas avançadas de vendas consultivas e gestão de pipeline comercial.",
    modules: [
      { number: 1, title: "Prospecção", content: ["Lead generation", "Qualificação", "Abordagem"] },
      { number: 2, title: "Negociação", content: ["Técnicas de fechamento", "Objeções", "Proposta de valor"] },
      { number: 3, title: "Pós-Venda", content: ["Follow-up", "Retenção", "Upsell"] }
    ],
    objectives: ["Aumentar vendas", "Fechar negócios", "Fidelizar clientes"]
  },

  // Finanças e Contabilidade (5 cursos)
  {
    id: "fin-001",
    title: "Contabilidade Básica",
    category: "Finanças e Contabilidade",
    price: 2000,
    formats: ["Texto", "Vídeo"],
    description: "Fundamentos de contabilidade para entender demonstrações financeiras.",
    modules: [
      { number: 1, title: "Princípios Contábeis", content: ["Débito e crédito", "Balanço", "DRE"] },
      { number: 2, title: "Lançamentos", content: ["Diário", "Razão", "Balancete"] },
      { number: 3, title: "Relatórios", content: ["Análise vertical", "Análise horizontal", "Índices"] }
    ],
    objectives: ["Entender contabilidade", "Fazer lançamentos", "Analisar relatórios"]
  },
  {
    id: "fin-002",
    title: "Gestão Financeira",
    category: "Finanças e Contabilidade",
    price: 3000,
    formats: ["Texto", "Vídeo"],
    description: "Gerencie finanças empresariais com eficiência e estratégia.",
    modules: [
      { number: 1, title: "Fluxo de Caixa", content: ["Projeções", "Controle", "Análise"] },
      { number: 2, title: "Capital de Giro", content: ["Gestão de estoques", "Contas a receber", "Contas a pagar"] },
      { number: 3, title: "Tomada de Decisão", content: ["Análise de viabilidade", "ROI", "Payback"] }
    ],
    objectives: ["Gerir finanças", "Controlar fluxo de caixa", "Tomar decisões financeiras"]
  },
  {
    id: "fin-003",
    title: "Planejamento Orçamentário",
    category: "Finanças e Contabilidade",
    price: 4000,
    formats: ["Texto", "Vídeo"],
    description: "Crie orçamentos empresariais e pessoais eficazes.",
    modules: [
      { number: 1, title: "Tipos de Orçamento", content: ["Operacional", "Investimento", "Caixa"] },
      { number: 2, title: "Elaboração", content: ["Receitas", "Despesas", "Variações"] },
      { number: 3, title: "Controle", content: ["Acompanhamento", "Desvios", "Ajustes"] }
    ],
    objectives: ["Criar orçamentos", "Controlar gastos", "Planejar investimentos"]
  },
  {
    id: "fin-004",
    title: "Investimentos",
    category: "Finanças e Contabilidade",
    price: 5000,
    formats: ["Texto", "Vídeo"],
    description: "Aprenda a investir com segurança e rentabilidade.",
    modules: [
      { number: 1, title: "Fundamentos", content: ["Tipos de investimento", "Risco e retorno", "Diversificação"] },
      { number: 2, title: "Renda Fixa", content: ["Títulos públicos", "CDB", "LCI/LCA"] },
      { number: 3, title: "Renda Variável", content: ["Ações", "Fundos", "Estratégias"] }
    ],
    objectives: ["Investir com segurança", "Diversificar carteira", "Maximizar retornos"]
  },
  {
    id: "fin-005",
    title: "Análise de Riscos",
    category: "Finanças e Contabilidade",
    price: 6000,
    formats: ["Texto", "Vídeo"],
    description: "Identifique e mitigue riscos financeiros em projetos e investimentos.",
    modules: [
      { number: 1, title: "Tipos de Risco", content: ["Operacional", "Financeiro", "Estratégico"] },
      { number: 2, title: "Análise Quantitativa", content: ["VaR", "Simulações", "Cenários"] },
      { number: 3, title: "Mitigação", content: ["Hedging", "Seguros", "Contingências"] }
    ],
    objectives: ["Identificar riscos", "Analisar impactos", "Criar estratégias de mitigação"]
  },

  // Desenvolvimento Pessoal (5 cursos)
  {
    id: "dev-001",
    title: "Comunicação Efetiva",
    category: "Desenvolvimento Pessoal",
    price: 2000,
    formats: ["Texto", "Vídeo"],
    description: "Aprimore suas habilidades de comunicação interpessoal.",
    modules: [
      { number: 1, title: "Comunicação Verbal", content: ["Clareza", "Tom de voz", "Assertividade"] },
      { number: 2, title: "Comunicação Não-Verbal", content: ["Linguagem corporal", "Expressões", "Postura"] },
      { number: 3, title: "Escuta Ativa", content: ["Atenção plena", "Empatia", "Feedback"] }
    ],
    objectives: ["Comunicar com clareza", "Entender outros", "Construir rapport"]
  },
  {
    id: "dev-002",
    title: "Produtividade e Foco",
    category: "Desenvolvimento Pessoal",
    price: 3000,
    formats: ["Texto", "Vídeo"],
    description: "Maximize sua produtividade e alcance mais com menos esforço.",
    modules: [
      { number: 1, title: "Gestão do Tempo", content: ["Priorização", "Matriz de Eisenhower", "Pomodoro"] },
      { number: 2, title: "Eliminação de Distrações", content: ["Digital detox", "Ambiente ideal", "Hábitos"] },
      { number: 3, title: "Metas e Resultados", content: ["OKRs", "Tracking", "Celebração"] }
    ],
    objectives: ["Aumentar produtividade", "Focar no essencial", "Alcançar metas"]
  },
  {
    id: "dev-003",
    title: "Inteligência Emocional",
    category: "Desenvolvimento Pessoal",
    price: 4000,
    formats: ["Texto", "Vídeo"],
    description: "Desenvolva consciência emocional e relacionamentos saudáveis.",
    modules: [
      { number: 1, title: "Autoconhecimento", content: ["Emoções básicas", "Gatilhos", "Padrões"] },
      { number: 2, title: "Autorregulação", content: ["Controle emocional", "Resiliência", "Mindfulness"] },
      { number: 3, title: "Habilidades Sociais", content: ["Empatia", "Relacionamentos", "Influência"] }
    ],
    objectives: ["Conhecer suas emoções", "Regular respostas", "Melhorar relacionamentos"]
  },
  {
    id: "dev-004",
    title: "Gestão de Conflitos",
    category: "Desenvolvimento Pessoal",
    price: 5000,
    formats: ["Texto", "Vídeo"],
    description: "Resolva conflitos de forma construtiva e crie soluções win-win.",
    modules: [
      { number: 1, title: "Natureza dos Conflitos", content: ["Tipos", "Causas", "Dinâmicas"] },
      { number: 2, title: "Técnicas de Resolução", content: ["Mediação", "Negociação", "Compromisso"] },
      { number: 3, title: "Prevenção", content: ["Comunicação clara", "Expectativas", "Cultura"] }
    ],
    objectives: ["Resolver conflitos", "Criar acordos", "Prevenir problemas"]
  },
  {
    id: "dev-005",
    title: "Negociação e Persuasão",
    category: "Desenvolvimento Pessoal",
    price: 6000,
    formats: ["Texto", "Vídeo"],
    description: "Domine técnicas avançadas de negociação e influência.",
    modules: [
      { number: 1, title: "Preparação", content: ["BATNA", "ZOPA", "Pesquisa"] },
      { number: 2, title: "Táticas", content: ["Ancoragem", "Reciprocidade", "Escassez"] },
      { number: 3, title: "Fechamento", content: ["Acordo", "Documentação", "Follow-up"] }
    ],
    objectives: ["Negociar com sucesso", "Persuadir eticamente", "Criar valor"]
  },

  // Idiomas (5 cursos)
  {
    id: "idi-001",
    title: "Inglês Básico",
    category: "Idiomas",
    price: 2000,
    formats: ["Texto", "Áudio"],
    description: "Inicie sua jornada no inglês com vocabulário e gramática essenciais.",
    modules: [
      { number: 1, title: "Fundamentos", content: ["Alfabeto", "Números", "Cumprimentos"] },
      { number: 2, title: "Gramática Básica", content: ["Verbo to be", "Presente simples", "Artigos"] },
      { number: 3, title: "Conversação", content: ["Apresentações", "Situações diárias", "Vocabulário"] }
    ],
    objectives: ["Entender inglês básico", "Formar frases simples", "Comunicar necessidades"]
  },
  {
    id: "idi-002",
    title: "Inglês Intermediário",
    category: "Idiomas",
    price: 3000,
    formats: ["Texto", "Áudio"],
    description: "Avance no inglês com estruturas mais complexas e fluência.",
    modules: [
      { number: 1, title: "Tempos Verbais", content: ["Passado", "Futuro", "Perfeitos"] },
      { number: 2, title: "Vocabulário Expandido", content: ["Trabalho", "Viagens", "Tecnologia"] },
      { number: 3, title: "Conversação Avançada", content: ["Discussões", "Opiniões", "Debates"] }
    ],
    objectives: ["Falar com fluência", "Entender textos complexos", "Escrever profissionalmente"]
  },
  {
    id: "idi-003",
    title: "Inglês Avançado",
    category: "Idiomas",
    price: 4000,
    formats: ["Texto", "Áudio"],
    description: "Domine o inglês para ambientes profissionais e acadêmicos.",
    modules: [
      { number: 1, title: "Inglês de Negócios", content: ["Apresentações", "Reuniões", "Email formal"] },
      { number: 2, title: "Inglês Acadêmico", content: ["Escrita técnica", "Pesquisa", "Argumentação"] },
      { number: 3, title: "Cultura e Idiomas", content: ["Expressões idiomáticas", "Slang", "Cultura"] }
    ],
    objectives: ["Dominar inglês profissional", "Comunicar em qualquer contexto", "Certificação"]
  },
  {
    id: "idi-004",
    title: "Francês Básico",
    category: "Idiomas",
    price: 5000,
    formats: ["Texto", "Áudio"],
    description: "Aprenda francês do zero com método prático e imersivo.",
    modules: [
      { number: 1, title: "Introdução", content: ["Pronúncia", "Alfabeto", "Saudações"] },
      { number: 2, title: "Gramática Essencial", content: ["Artigos", "Verbos regulares", "Gêneros"] },
      { number: 3, title: "Conversação Básica", content: ["Restaurante", "Hotel", "Transporte"] }
    ],
    objectives: ["Falar francês básico", "Entender conversas simples", "Viajar com confiança"]
  },
  {
    id: "idi-005",
    title: "Espanhol Básico",
    category: "Idiomas",
    price: 6000,
    formats: ["Texto", "Áudio"],
    description: "Domine o espanhol rapidamente com foco em conversação.",
    modules: [
      { number: 1, title: "Primeiros Passos", content: ["Pronúncia", "Vocabulário", "Frases úteis"] },
      { number: 2, title: "Estruturas Básicas", content: ["Verbos ser/estar", "Presente", "Perguntas"] },
      { number: 3, title: "Imersão", content: ["Conversação", "Cultura hispânica", "Prática real"] }
    ],
    objectives: ["Comunicar em espanhol", "Entender nativos", "Viajar pela América Latina"]
  },

  // Saúde e Bem-Estar (5 cursos)
  {
    id: "sau-001",
    title: "Nutrição e Bem-Estar",
    category: "Saúde e Bem-Estar",
    price: 2000,
    formats: ["Texto", "Vídeo"],
    description: "Aprenda princípios de alimentação saudável para vida plena.",
    modules: [
      { number: 1, title: "Fundamentos da Nutrição", content: ["Macronutrientes", "Micronutrientes", "Hidratação"] },
      { number: 2, title: "Planejamento Alimentar", content: ["Dietas balanceadas", "Porções", "Refeições"] },
      { number: 3, title: "Hábitos Saudáveis", content: ["Rotina", "Exercícios", "Sono"] }
    ],
    objectives: ["Comer saudável", "Criar planos alimentares", "Melhorar qualidade de vida"]
  },
  {
    id: "sau-002",
    title: "Primeiros Socorros",
    category: "Saúde e Bem-Estar",
    price: 3000,
    formats: ["Texto", "Vídeo"],
    description: "Saiba como agir em emergências e salvar vidas.",
    modules: [
      { number: 1, title: "Avaliação Inicial", content: ["Sinais vitais", "Consciência", "Chamada de emergência"] },
      { number: 2, title: "Técnicas Essenciais", content: ["RCP", "Engasgamento", "Hemorragias"] },
      { number: 3, title: "Situações Específicas", content: ["Queimaduras", "Fraturas", "Intoxicações"] }
    ],
    objectives: ["Prestar primeiros socorros", "Agir em emergências", "Salvar vidas"]
  },
  {
    id: "sau-003",
    title: "Saúde Mental",
    category: "Saúde e Bem-Estar",
    price: 4000,
    formats: ["Texto", "Vídeo"],
    description: "Cuide da sua saúde mental e desenvolva resiliência emocional.",
    modules: [
      { number: 1, title: "Consciência Mental", content: ["Sinais de alerta", "Saúde vs doença", "Estigma"] },
      { number: 2, title: "Autocuidado", content: ["Mindfulness", "Meditação", "Terapia"] },
      { number: 3, title: "Apoio e Prevenção", content: ["Redes de apoio", "Recursos", "Crise"] }
    ],
    objectives: ["Cuidar da mente", "Prevenir problemas", "Buscar ajuda quando necessário"]
  },
  {
    id: "sau-004",
    title: "Ergonomia",
    category: "Saúde e Bem-Estar",
    price: 5000,
    formats: ["Texto", "Vídeo"],
    description: "Crie ambientes de trabalho saudáveis e previna lesões.",
    modules: [
      { number: 1, title: "Princípios de Ergonomia", content: ["Postura", "Mobiliário", "Iluminação"] },
      { number: 2, title: "Prevenção de Lesões", content: ["LER/DORT", "Pausas", "Alongamentos"] },
      { number: 3, title: "Ambiente Ideal", content: ["Home office", "Escritório", "Avaliação"] }
    ],
    objectives: ["Trabalhar com conforto", "Prevenir dores", "Aumentar produtividade"]
  },
  {
    id: "sau-005",
    title: "Higiene e Segurança",
    category: "Saúde e Bem-Estar",
    price: 6000,
    formats: ["Texto", "Vídeo"],
    description: "Normas de segurança e higiene para ambientes profissionais.",
    modules: [
      { number: 1, title: "Higiene Ocupacional", content: ["Limpeza", "Desinfecção", "EPIs"] },
      { number: 2, title: "Segurança no Trabalho", content: ["Riscos", "Prevenção", "Equipamentos"] },
      { number: 3, title: "Legislação", content: ["Normas", "Responsabilidades", "Fiscalização"] }
    ],
    objectives: ["Manter ambiente seguro", "Prevenir acidentes", "Cumprir normas"]
  },

  // Design e Criatividade (5 cursos)
  {
    id: "des-001",
    title: "Photoshop Básico",
    category: "Design e Criatividade",
    price: 2000,
    formats: ["Texto", "Vídeo"],
    description: "Domine a ferramenta mais usada para edição de imagens.",
    modules: [
      { number: 1, title: "Interface e Ferramentas", content: ["Workspace", "Camadas", "Seleções"] },
      { number: 2, title: "Edição Básica", content: ["Cortes", "Ajustes", "Filtros"] },
      { number: 3, title: "Projeto Prático", content: ["Montagem", "Retoque", "Exportação"] }
    ],
    objectives: ["Editar imagens", "Criar composições", "Produzir conteúdo visual"]
  },
  {
    id: "des-002",
    title: "Illustrator Avançado",
    category: "Design e Criatividade",
    price: 3000,
    formats: ["Texto", "Vídeo"],
    description: "Crie ilustrações vetoriais e logotipos profissionais.",
    modules: [
      { number: 1, title: "Vetorização", content: ["Caneta", "Formas", "Pathfinder"] },
      { number: 2, title: "Tipografia", content: ["Fontes", "Kerning", "Layouts tipográficos"] },
      { number: 3, title: "Identidade Visual", content: ["Logotipos", "Branding", "Mockups"] }
    ],
    objectives: ["Criar vetores", "Desenvolver logos", "Produzir identidades visuais"]
  },
  {
    id: "des-003",
    title: "Design de Interfaces",
    category: "Design e Criatividade",
    price: 4000,
    formats: ["Texto", "Vídeo"],
    description: "Projete interfaces digitais funcionais e bonitas.",
    modules: [
      { number: 1, title: "Fundamentos de UI", content: ["Grid", "Tipografia", "Cores"] },
      { number: 2, title: "Componentes", content: ["Botões", "Formulários", "Navegação"] },
      { number: 3, title: "Prototipagem", content: ["Wireframes", "Mockups", "Interações"] }
    ],
    objectives: ["Criar interfaces", "Prototipar apps", "Entregar designs profissionais"]
  },
  {
    id: "des-004",
    title: "UX/UI Design",
    category: "Design e Criatividade",
    price: 5000,
    formats: ["Texto", "Vídeo"],
    description: "Crie experiências de usuário memoráveis e interfaces intuitivas.",
    modules: [
      { number: 1, title: "Pesquisa de Usuário", content: ["Personas", "Jornadas", "Entrevistas"] },
      { number: 2, title: "Arquitetura de Informação", content: ["Sitemap", "Fluxos", "Card sorting"] },
      { number: 3, title: "Testes de Usabilidade", content: ["Protótipos", "Testes", "Iteração"] }
    ],
    objectives: ["Entender usuários", "Criar experiências", "Validar designs"]
  },
  {
    id: "des-005",
    title: "Branding e Identidade",
    category: "Design e Criatividade",
    price: 6000,
    formats: ["Texto", "Vídeo"],
    description: "Desenvolva identidades visuais completas e memoráveis.",
    modules: [
      { number: 1, title: "Estratégia de Marca", content: ["Posicionamento", "Arquétipo", "Essência"] },
      { number: 2, title: "Sistema Visual", content: ["Logo", "Paleta", "Tipografia", "Elementos"] },
      { number: 3, title: "Manual de Marca", content: ["Guidelines", "Aplicações", "Proteção"] }
    ],
    objectives: ["Criar marcas", "Desenvolver identidades", "Produzir manuais"]
  },

  // Engenharia e Técnicas (5 cursos)
  {
    id: "eng-001",
    title: "AutoCAD",
    category: "Engenharia e Técnicas",
    price: 2000,
    formats: ["Texto", "Vídeo"],
    description: "Domine o software essencial para desenho técnico e projetos.",
    modules: [
      { number: 1, title: "Comandos Básicos", content: ["Interface", "Desenho 2D", "Modificações"] },
      { number: 2, title: "Projetos Técnicos", content: ["Cotas", "Layers", "Blocos"] },
      { number: 3, title: "Projeto Completo", content: ["Planta baixa", "Impressão", "Layout"] }
    ],
    objectives: ["Desenhar em AutoCAD", "Criar projetos técnicos", "Produzir plantas"]
  },
  {
    id: "eng-002",
    title: "Mecânica Básica",
    category: "Engenharia e Técnicas",
    price: 3000,
    formats: ["Texto", "Vídeo"],
    description: "Fundamentos de mecânica para manutenção e reparos.",
    modules: [
      { number: 1, title: "Ferramentas", content: ["Chaves", "Medição", "Segurança"] },
      { number: 2, title: "Sistemas Mecânicos", content: ["Transmissão", "Suspensão", "Freios"] },
      { number: 3, title: "Manutenção", content: ["Diagnóstico", "Reparos", "Preventiva"] }
    ],
    objectives: ["Entender mecânica", "Fazer manutenções", "Diagnosticar problemas"]
  },
  {
    id: "eng-003",
    title: "Engenharia Civil",
    category: "Engenharia e Técnicas",
    price: 4000,
    formats: ["Texto", "Vídeo"],
    description: "Princípios de construção civil e gerenciamento de obras.",
    modules: [
      { number: 1, title: "Materiais de Construção", content: ["Concreto", "Aço", "Alvenaria"] },
      { number: 2, title: "Estruturas", content: ["Fundações", "Vigas", "Lajes"] },
      { number: 3, title: "Gestão de Obras", content: ["Planejamento", "Orçamento", "Execução"] }
    ],
    objectives: ["Entender construção", "Gerir obras", "Calcular estruturas"]
  },
  {
    id: "eng-004",
    title: "Eletrônica",
    category: "Engenharia e Técnicas",
    price: 5000,
    formats: ["Texto", "Vídeo"],
    description: "Circuitos eletrônicos e manutenção de equipamentos.",
    modules: [
      { number: 1, title: "Componentes", content: ["Resistores", "Capacitores", "Transistores"] },
      { number: 2, title: "Circuitos", content: ["Analógicos", "Digitais", "Microcontroladores"] },
      { number: 3, title: "Projetos", content: ["Arduino", "Sensores", "Automação"] }
    ],
    objectives: ["Entender eletrônica", "Montar circuitos", "Criar projetos"]
  },
  {
    id: "eng-005",
    title: "Energias Renováveis",
    category: "Engenharia e Técnicas",
    price: 6000,
    formats: ["Texto", "Vídeo"],
    description: "Tecnologias sustentáveis e energia do futuro.",
    modules: [
      { number: 1, title: "Fontes Renováveis", content: ["Solar", "Eólica", "Hidrelétrica"] },
      { number: 2, title: "Sistemas Fotovoltaicos", content: ["Painéis", "Inversores", "Baterias"] },
      { number: 3, title: "Projetos", content: ["Dimensionamento", "Instalação", "Manutenção"] }
    ],
    objectives: ["Entender energias limpas", "Projetar sistemas", "Instalar painéis solares"]
  },

  // Logística e Produção (5 cursos)
  {
    id: "log-001",
    title: "Gestão de Estoques",
    category: "Logística e Produção",
    price: 2000,
    formats: ["Texto", "Vídeo"],
    description: "Otimize estoques e reduza custos logísticos.",
    modules: [
      { number: 1, title: "Fundamentos", content: ["Tipos de estoque", "Custos", "Inventário"] },
      { number: 2, title: "Controle", content: ["FIFO/LIFO", "Ponto de pedido", "Curva ABC"] },
      { number: 3, title: "Sistemas", content: ["WMS", "ERP", "Automação"] }
    ],
    objectives: ["Gerir estoques", "Reduzir custos", "Otimizar processos"]
  },
  {
    id: "log-002",
    title: "Transporte e Distribuição",
    category: "Logística e Produção",
    price: 3000,
    formats: ["Texto", "Vídeo"],
    description: "Planeje rotas e gerencie frota com eficiência.",
    modules: [
      { number: 1, title: "Modais de Transporte", content: ["Rodoviário", "Marítimo", "Aéreo"] },
      { number: 2, title: "Roteirização", content: ["Otimização", "GPS", "Softwares"] },
      { number: 3, title: "Gestão de Frota", content: ["Manutenção", "Custos", "Rastreamento"] }
    ],
    objectives: ["Planejar rotas", "Gerir frota", "Reduzir custos de transporte"]
  },
  {
    id: "log-003",
    title: "Cadeia de Suprimentos",
    category: "Logística e Produção",
    price: 4000,
    formats: ["Texto", "Vídeo"],
    description: "Integre fornecedores, produção e distribuição.",
    modules: [
      { number: 1, title: "Supply Chain", content: ["Estrutura", "Processos", "Integração"] },
      { number: 2, title: "Gestão de Fornecedores", content: ["Seleção", "Contratos", "Relacionamento"] },
      { number: 3, title: "Performance", content: ["KPIs", "Benchmarking", "Melhoria contínua"] }
    ],
    objectives: ["Gerir cadeia completa", "Integrar processos", "Melhorar performance"]
  },
  {
    id: "log-004",
    title: "Logística Internacional",
    category: "Logística e Produção",
    price: 5000,
    formats: ["Texto", "Vídeo"],
    description: "Domine comércio exterior e logística global.",
    modules: [
      { number: 1, title: "Comércio Exterior", content: ["Importação", "Exportação", "Incoterms"] },
      { number: 2, title: "Documentação", content: ["Alfândega", "Certificados", "Processos"] },
      { number: 3, title: "Logística Global", content: ["Portos", "Armazéns", "Agentes"] }
    ],
    objectives: ["Operar internacionalmente", "Gerir importações", "Exportar com sucesso"]
  },
  {
    id: "log-005",
    title: "Planejamento Logístico",
    category: "Logística e Produção",
    price: 6000,
    formats: ["Texto", "Vídeo"],
    description: "Estratégias avançadas para excelência logística.",
    modules: [
      { number: 1, title: "Planejamento Estratégico", content: ["Análise", "Objetivos", "Estratégias"] },
      { number: 2, title: "Tecnologia e Inovação", content: ["IoT", "IA", "Blockchain"] },
      { number: 3, title: "Sustentabilidade", content: ["Logística verde", "Reversa", "Carbono"] }
    ],
    objectives: ["Planejar estrategicamente", "Inovar processos", "Implementar sustentabilidade"]
  }
];

export const categories = [
  "Todas",
  "Administração",
  "Tecnologia da Informação",
  "Marketing e Vendas",
  "Finanças e Contabilidade",
  "Desenvolvimento Pessoal",
  "Idiomas",
  "Saúde e Bem-Estar",
  "Design e Criatividade",
  "Engenharia e Técnicas",
  "Logística e Produção"
];
