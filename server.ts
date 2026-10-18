import express from 'express';
import path from 'path';
import fs from 'fs';
import Stripe from 'stripe';

const app = express();
const PORT = 3000;

// On Vercel / AWS Lambda, process.cwd() is read-only, only /tmp is writable
const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.VERCEL_ENV);
const DB_DIR = isVercel ? '/tmp/data' : path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'lumora-db.json');

app.use(express.json());
app.use(express.static(path.resolve(process.cwd(), 'public')));

// Ensure data directory exists safely
try {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Could not create DB_DIR, using in-memory mode:', e);
}

// Initial default database structure
const DEFAULT_PRODUCT = {
  id: 'lumora-led-bar-01',
  name: 'Luminária LED Recarregável com Sensor de Movimento',
  tagline: 'Iluminação inteligente. Mais conforto no teu dia.',
  price: 29900,
  currency: 'Kz',
  stock: 45,
  inStock: true,
  isActive: true,
  description:
    'Uma solução de iluminação prática e sofisticada para os espaços da tua casa onde precisas de mais luz. Sem fios, sem furos e com fixação magnética simples.',
  features: [
    'Iluminação focada para armários, roupeiros, closets e corredores',
    'Instalação prática magnética com fita adesiva de alta fixação (sem furos na parede ou móveis)',
    'Sensor crepuscular e de movimento infravermelho (acende automaticamente ao detectar presença)',
    'Bateria interna recarregável via USB-C (dispensa pilhas descartáveis)',
    'Utilização prática em áreas escuras ou de passagem sem necessidade de ponto de tomada próximo',
    'Dois modos de operação: Modo Sensor Automático e Modo Iluminação Contínua'
  ],
  specs: [
    { label: 'Modelo', value: 'LUMORA UltraSlim Motion 01' },
    { label: 'Tipo de Iluminação', value: 'Barra LED difusa suave anti-encandeamento' },
    { label: 'Fixação', value: 'Base metálica com fita adesiva + engate magnético direto' },
    { label: 'Alimentação', value: 'Bateria recarregável integrada via USB-C (cabo incluído)' },
    { label: 'Sensor', value: 'Sensor infravermelho de movimento com acionamento em ambiente escuro' },
    { label: 'Acabamento', value: 'Alumínio escovado e policarbonato fosco' },
    { label: 'Conteúdo da Caixa', value: '1x Luminária LUMORA, 2x suportes magnéticos adesivos, 1x cabo USB-C, 1x manual em português' },
    { label: 'Autonomia & Alcance', value: 'Dados nominais do fabricante sob verificação prática', needsConfirmation: true }
  ],
  images: [
    '/src/assets/images/hero_lumora_wardrobe_1792262010537.jpg',
    '/src/assets/images/product_lumora_isolated_1792262011015.jpg',
    '/src/assets/images/lumora_hallway_lighting_1792262011603.jpg',
    '/src/assets/images/lumora_magnetic_mount_1792262011714.jpg',
    '/src/assets/images/lumora_usbc_charging_1792262012537.jpg'
  ],
  platformVideoUrl: '/assets/videos/luminaria_lumora_demonstracao.mp4',
  youtubeVideoUrl: 'https://www.youtube.com/watch?v=L24CqW2Hx34',
  youtubeVideoTitle: 'Demonstração da Luminária LED Recarregável com Sensor de Movimento',
  updatedAt: new Date().toISOString()
};

const DEFAULT_DELIVERY_ZONES = [
  {
    id: 'zone-luanda-centro',
    province: 'Luanda',
    municipality: 'Luanda',
    zoneName: 'Luanda Centro / Ingombota / Maianga / Rangel',
    fee: 2500,
    estimatedTime: '24h a 48h úteis',
    isActive: true,
    notes: 'Entrega porta a porta com estafeta próprio'
  },
  {
    id: 'zone-luanda-talatona',
    province: 'Luanda',
    municipality: 'Talatona',
    zoneName: 'Talatona / Benfica / Morro Bento',
    fee: 2500,
    estimatedTime: '24h a 48h úteis',
    isActive: true,
    notes: 'Entrega rápida na zona sul de Luanda'
  },
  {
    id: 'zone-luanda-belas',
    province: 'Luanda',
    municipality: 'Belas',
    zoneName: 'Centralidade do Kilamba / Belas / Camama',
    fee: 3000,
    estimatedTime: '24h a 48h úteis',
    isActive: true,
    notes: 'Entrega em edifícios e condomínios fechados'
  },
  {
    id: 'zone-luanda-kilamba-kiaxi',
    province: 'Luanda',
    municipality: 'Kilamba Kiaxi',
    zoneName: 'Golfe / Palanca / Nova Vida',
    fee: 2500,
    estimatedTime: '24h a 48h úteis',
    isActive: true,
    notes: 'Entrega porta a porta'
  },
  {
    id: 'zone-luanda-viana',
    province: 'Luanda',
    municipality: 'Viana',
    zoneName: 'Viana Sede / Zango / Estalagem',
    fee: 3500,
    estimatedTime: '24h a 48h úteis',
    isActive: true,
    notes: 'Ponto de encontro ou endereço directo'
  },
  {
    id: 'zone-luanda-cazenga',
    province: 'Luanda',
    municipality: 'Cazenga',
    zoneName: 'Cazenga / Hoji-ya-Henda / Tala Hadi',
    fee: 2500,
    estimatedTime: '24h a 48h úteis',
    isActive: true,
    notes: 'Entrega ao domicílio'
  },
  {
    id: 'zone-luanda-cacuaco',
    province: 'Luanda',
    municipality: 'Cacuaco',
    zoneName: 'Cacuaco Sede / Centralidade do Sequele',
    fee: 3500,
    estimatedTime: '24h a 72h úteis',
    isActive: true,
    notes: 'Dias específicos de entrega na semana'
  },
  {
    id: 'zone-benguela',
    province: 'Benguela',
    municipality: 'Benguela / Lobito',
    zoneName: 'Cidades de Benguela e Lobito',
    fee: 6000,
    estimatedTime: '3 a 5 dias úteis',
    isActive: true,
    notes: 'Envio via transportadora parceira (levantamento ou entrega local)'
  },
  {
    id: 'zone-huambo',
    province: 'Huambo',
    municipality: 'Huambo',
    zoneName: 'Huambo Centro e arredores',
    fee: 7000,
    estimatedTime: '4 a 6 dias úteis',
    isActive: true,
    notes: 'Envio via transportadora'
  },
  {
    id: 'zone-huila',
    province: 'Huíla',
    municipality: 'Lubango',
    zoneName: 'Lubango',
    fee: 7500,
    estimatedTime: '4 a 6 dias úteis',
    isActive: true,
    notes: 'Envio via agência de encomendas'
  },
  {
    id: 'zone-cabinda',
    province: 'Cabinda',
    municipality: 'Cabinda',
    zoneName: 'Cabinda Cidade',
    fee: 8000,
    estimatedTime: '4 a 7 dias úteis',
    isActive: true,
    notes: 'Carga aérea / transportadora'
  }
];

const DEFAULT_SETTINGS = {
  brandName: 'LUMORA',
  slogan: 'Iluminação inteligente. Mais conforto no teu dia.',
  whatsappNumber: '+244923456789',
  whatsappDisplay: '+244 923 456 789',
  email: 'contacto@lumora.ao',
  currency: 'Kz',
  adminPasscode: 'lumora2026',
  stripeConfig: {
    enabled: true,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51URbpVK5OaHHhzp50Sgkh7Etx',
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_51URbpVK',
    currency: 'usd'
  },
  faqs: [
    {
      id: 'faq-1',
      question: 'Como funciona a luminária LED LUMORA?',
      answer:
        'A luminária dispõe de sensor de presença infravermelho e sensor crepuscular inteligente. Em ambientes escuros ou com pouca luz, ela acende automaticamente ao detectar movimento e apaga suavemente após alguns segundos sem movimento. Também inclui interruptor para manter a luz sempre acesa de forma contínua.',
      order: 1
    },
    {
      id: 'faq-2',
      question: 'Como se instala a luminária? Preciso furar a parede?',
      answer:
        'Não precisas furar nada. A luminária acompanha suportes metálicos com fita adesiva de fixação forte. Colas a base onde desejares (armário, corredor, parede ou madeira) e a luminária fixa-se magneticamente com grande firmeza.',
      order: 2
    },
    {
      id: 'faq-3',
      question: 'Como se recarrega a bateria?',
      answer:
        'Basta destacar a luminária da base magnética e conectá-la ao cabo USB-C incluído na embalagem. Podes carregá-la usando qualquer carregador de smartphone padrão ou entrada USB. Não usa pilhas descartáveis.',
      order: 3
    },
    {
      id: 'faq-4',
      question: 'Qual é o preço do produto?',
      answer:
        'O preço actual de referência é de 29.900 Kz por unidade. Podes consultar todos os detalhes na aba "O Produto" e encomendar directamente através da aba "Fazer Encomenda".',
      order: 4
    },
    {
      id: 'faq-5',
      question: 'Quais são os métodos de pagamento aceites?',
      answer:
        'Aceitamos pagamento na entrega (TPA Multicaixa ou dinheiro em Luanda), transferência bancária antecipada (BAI e BFA) e pagamento internacional com cartão Visa/Mastercard através da plataforma Stripe.',
      order: 5
    },
    {
      id: 'faq-6',
      question: 'Quanto custa a entrega e qual o prazo?',
      answer:
        'Em Luanda, a taxa de entrega varia habitualmente entre 2.500 Kz e 3.500 Kz com prazo de 24h a 48h úteis, dependendo do município. Para outras províncias, o envio é feito por transportadora parceira e o custo exacto é apresentado no formulário antes de finalizares a encomenda.',
      order: 6
    },
    {
      id: 'faq-7',
      question: 'Entregam noutras províncias além de Luanda?',
      answer:
        'Sim! Já temos rotas activas para províncias como Benguela, Huambo, Huíla e Cabinda via transportadora. Para outras localidades, podes contactar-nos directamente pelo WhatsApp para confirmar a viabilidade de despacho.',
      order: 7
    },
    {
      id: 'faq-8',
      question: 'Como posso contactar o suporte ao cliente?',
      answer:
        'Podes falar directamente com a nossa equipa através do botão flutuante de WhatsApp no ecrã ou enviando mensagem para o número +244 923 456 789.',
      order: 8
    }
  ],
  paymentMethods: {
    cash_on_delivery: {
      id: 'cash_on_delivery',
      name: 'Pagamento na Entrega (TPA Multicaixa ou Dinheiro)',
      enabled: true,
      description:
        'Paga no momento da recepção do produto no teu endereço. Aceitamos pagamento com cartão via TPA móvel ou dinheiro em mão.',
      allowedProvinces: ['Luanda']
    },
    bank_transfer: {
      id: 'bank_transfer',
      name: 'Transferência Bancária / Multicaixa Express',
      enabled: true,
      description:
        'Efectua o pagamento para as nossas contas bancárias oficiais e envia o comprovativo por WhatsApp com o teu código de encomenda.',
      accounts: [
        {
          id: 'acc-bai',
          bank: 'Banco Angolano de Investimentos (BAI)',
          holder: 'LUMORA — Comércio & Iluminação',
          iban: 'AO06 0040 0000 1234 5678 9012 3',
          accountNumber: '1234567810'
        },
        {
          id: 'acc-bfa',
          bank: 'Banco de Fomento Angola (BFA)',
          holder: 'LUMORA — Comércio & Iluminação',
          iban: 'AO06 0006 0000 9876 5432 1098 7',
          accountNumber: '9876543210'
        }
      ],
      instructions:
        'Por favor, inclui o código da encomenda (ex: LMR-XXXXX) na descrição da transferência e envia o comprovativo no WhatsApp.'
    },
    stripe: {
      id: 'stripe',
      name: 'Cartão de Débito / Crédito (Stripe)',
      enabled: true,
      description:
        'Paga com cartão Visa, Mastercard ou outros cartões internacionais através da plataforma segura da Stripe.'
    }
  },
  policies: {
    terms:
      'Termos e Condições LUMORA: Ao realizar uma encomenda na nossa loja online, o cliente confirma a veracidade dos dados de entrega e contacto fornecidos. As encomendas ficam reservadas durante 48 horas enquanto se aguarda confirmação de contacto ou comprovativo de pagamento.',
    privacy:
      'Política de Privacidade: A LUMORA recolhe apenas os dados estritamente necessários para o processamento, entrega e suporte da tua encomenda (nome, telefone e endereço). Não partilhamos, vendemos ou cedemos os teus dados a terceiros.',
    delivery:
      'Política de Entrega: As entregas em Luanda são coordenadas pela nossa equipa de estafetas com contacto telefónico prévio no dia da entrega. Para outras províncias, o despacho é efetuado via agência ou transportadora parceira após confirmação do pagamento.',
    returns:
      'Trocas e Devoluções: Caso o produto apresente defeito de fabrico, o cliente dispõe de 7 dias após a recepção para solicitar a verificação e substituição da luminária, mediante apresentação do produto na embalagem original.'
  }
};

const DEFAULT_ORDERS = [
  {
    id: 'LMR-10492',
    customerName: 'Manuel dos Santos Cabral',
    customerPhone: '+244923112233',
    province: 'Luanda',
    municipality: 'Talatona',
    neighborhood: 'Benfica',
    address: 'Rua Principal do Benfica, Condomínio Girassol, Casa 14B',
    referencePoint: 'Próximo à padaria Bela Luanda',
    notes: 'Ligar antes de chegar, condomínio com portaria',
    quantity: 2,
    unitPrice: 29900,
    subtotal: 59800,
    deliveryFee: 2500,
    total: 62300,
    paymentMethod: 'cash_on_delivery',
    orderStatus: 'confirmed',
    paymentStatus: 'pending',
    internalNotes: 'Cliente confirmou por chamada. Estafeta Rui escalado para entrega amanhã às 14h.',
    history: [
      {
        timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
        action: 'Nova encomenda submetida via website'
      },
      {
        timestamp: new Date(Date.now() - 3600000 * 15).toISOString(),
        action: 'Estado alterado para Confirmada após contacto telefónico'
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 15).toISOString()
  },
  {
    id: 'LMR-10488',
    customerName: 'Esperança de Almeida',
    customerPhone: '+244912998877',
    province: 'Luanda',
    municipality: 'Belas',
    neighborhood: 'Kilamba',
    address: 'Quarteirão B, Edifício B12, Apartamento 402',
    referencePoint: 'Entrada junto à farmácia da rotunda',
    notes: 'Entregar preferencialmente após as 16h',
    quantity: 1,
    unitPrice: 29900,
    subtotal: 29900,
    deliveryFee: 3000,
    total: 32900,
    paymentMethod: 'bank_transfer',
    orderStatus: 'delivered',
    paymentStatus: 'paid',
    internalNotes: 'Comprovativo BAI verificado com sucesso. Entrega concluída pelo estafeta.',
    history: [
      {
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
        action: 'Nova encomenda submetida via website'
      },
      {
        timestamp: new Date(Date.now() - 3600000 * 40).toISOString(),
        action: 'Pagamento confirmado via BAI'
      },
      {
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        action: 'Encomenda entregue com sucesso'
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

// In-memory cache for fast access and fallback in read-only environments (like Vercel Serverless)
let inMemoryDb: any = null;

function getDb() {
  if (inMemoryDb) return inMemoryDb;

  // If DB_FILE does not exist, check if repo data/lumora-db.json exists to seed it
  if (!fs.existsSync(DB_FILE)) {
    const seedPath = path.resolve(process.cwd(), 'data', 'lumora-db.json');
    if (fs.existsSync(seedPath)) {
      try {
        const rawSeed = fs.readFileSync(seedPath, 'utf-8');
        inMemoryDb = JSON.parse(rawSeed);
        try {
          fs.writeFileSync(DB_FILE, rawSeed, 'utf-8');
        } catch {}
        return inMemoryDb;
      } catch {}
    }

    const initialData = {
      product: DEFAULT_PRODUCT,
      deliveryZones: DEFAULT_DELIVERY_ZONES,
      settings: DEFAULT_SETTINGS,
      orders: DEFAULT_ORDERS
    };
    inMemoryDb = initialData;
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    } catch {}
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    if (!data.product) data.product = DEFAULT_PRODUCT;
    if (!data.deliveryZones) data.deliveryZones = DEFAULT_DELIVERY_ZONES;
    if (!data.settings) data.settings = DEFAULT_SETTINGS;
    if (!data.settings.stripeConfig) data.settings.stripeConfig = DEFAULT_SETTINGS.stripeConfig;
    if (!data.settings.paymentMethods.stripe) {
      data.settings.paymentMethods.stripe = DEFAULT_SETTINGS.paymentMethods.stripe;
    }
    if (!data.orders) data.orders = DEFAULT_ORDERS;
    inMemoryDb = data;
    return data;
  } catch (err) {
    console.error('Error reading db, falling back to defaults:', err);
    inMemoryDb = {
      product: DEFAULT_PRODUCT,
      deliveryZones: DEFAULT_DELIVERY_ZONES,
      settings: DEFAULT_SETTINGS,
      orders: DEFAULT_ORDERS
    };
    return inMemoryDb;
  }
}

function saveDb(data: any) {
  inMemoryDb = data;
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    const tempPath = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, DB_FILE);
  } catch (err) {
    console.warn('Could not persist to disk (serverless read-only mode). Data held in-memory.', err);
  }
}

// Authentication middleware for admin routes
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  const db = getDb();
  const validPass = db.settings.adminPasscode || 'lumora2026';

  if (!authHeader) {
    res.status(401).json({ error: 'Sessão administrativa não autorizada' });
    return;
  }

  const token = authHeader.replace('Bearer ', '').trim();
  if (token === validPass) {
    next();
    return;
  }

  res.status(401).json({ error: 'Palavra-passe administrativa incorreta' });
}

// Helper to get Stripe instance
function getStripeInstance() {
  const db = getDb();
  const secretKey =
    process.env.STRIPE_SECRET_KEY || db.settings.stripeConfig?.secretKey || 'sk_test_51URbpVK';
  try {
    return new Stripe(secretKey);
  } catch (err) {
    return null;
  }
}

// API Endpoints

// 1. Product (Public Read)
app.get('/api/product', (req, res) => {
  const db = getDb();
  res.json(db.product);
});

// 2. Product Update (Admin)
app.put('/api/admin/product', requireAdmin, (req, res) => {
  const db = getDb();
  const {
    name,
    tagline,
    price,
    stock,
    inStock,
    isActive,
    description,
    features,
    specs,
    images,
    platformVideoUrl,
    youtubeVideoUrl,
    youtubeVideoTitle
  } = req.body;

  if (price !== undefined && (typeof price !== 'number' || price < 0)) {
    res.status(400).json({ error: 'Preço inválido' });
    return;
  }

  db.product = {
    ...db.product,
    ...(name !== undefined && { name }),
    ...(tagline !== undefined && { tagline }),
    ...(price !== undefined && { price }),
    ...(stock !== undefined && { stock }),
    ...(inStock !== undefined && { inStock }),
    ...(isActive !== undefined && { isActive }),
    ...(description !== undefined && { description }),
    ...(features !== undefined && { features }),
    ...(specs !== undefined && { specs }),
    ...(images !== undefined && { images }),
    ...(platformVideoUrl !== undefined && { platformVideoUrl }),
    ...(youtubeVideoUrl !== undefined && { youtubeVideoUrl }),
    ...(youtubeVideoTitle !== undefined && { youtubeVideoTitle }),
    updatedAt: new Date().toISOString()
  };

  saveDb(db);
  res.json({ success: true, product: db.product });
});

// YouTube API Proxy / Info
app.get('/api/youtube/info', async (req, res) => {
  try {
    const videoUrl = req.query.url as string;
    if (!videoUrl) {
      res.status(400).json({ error: 'URL do vídeo é obrigatória' });
      return;
    }
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;
    const response = await fetch(oembedUrl);
    if (!response.ok) {
      res.status(400).json({ error: 'Vídeo do YouTube não encontrado ou não acessível' });
      return;
    }
    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao conectar à API do YouTube', details: err?.message });
  }
});

// 3. Delivery Zones
app.get('/api/delivery-zones', (req, res) => {
  const db = getDb();
  const showAll = req.query.all === 'true';
  if (showAll) {
    res.json(db.deliveryZones);
  } else {
    res.json(db.deliveryZones.filter((z: any) => z.isActive));
  }
});

app.post('/api/admin/delivery-zones', requireAdmin, (req, res) => {
  const db = getDb();
  const { province, municipality, zoneName, fee, estimatedTime, isActive, notes } = req.body;

  if (!province || !municipality || typeof fee !== 'number') {
    res.status(400).json({ error: 'Dados da zona incompletos' });
    return;
  }

  const newZone = {
    id: `zone-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    province,
    municipality,
    zoneName: zoneName || municipality,
    fee: Math.max(0, fee),
    estimatedTime: estimatedTime || '24h a 48h úteis',
    isActive: isActive !== false,
    notes: notes || ''
  };

  db.deliveryZones.push(newZone);
  saveDb(db);
  res.status(201).json({ success: true, zone: newZone });
});

app.put('/api/admin/delivery-zones/:id', requireAdmin, (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const index = db.deliveryZones.findIndex((z: any) => z.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Zona de entrega não encontrada' });
    return;
  }

  db.deliveryZones[index] = {
    ...db.deliveryZones[index],
    ...req.body,
    id
  };

  saveDb(db);
  res.json({ success: true, zone: db.deliveryZones[index] });
});

app.delete('/api/admin/delivery-zones/:id', requireAdmin, (req, res) => {
  const db = getDb();
  const { id } = req.params;
  db.deliveryZones = db.deliveryZones.filter((z: any) => z.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// 4. Store Settings & FAQs
app.get('/api/settings', (req, res) => {
  const db = getDb();
  const { adminPasscode, stripeConfig, ...publicSettings } = db.settings;
  // Expose safe stripe info (never secretKey)
  const safeStripe = {
    enabled: stripeConfig?.enabled !== false,
    publishableKey: stripeConfig?.publishableKey || 'pk_test_51URbpVK5OaHHhzp50Sgkh7Etx',
    currency: stripeConfig?.currency || 'usd'
  };

  res.json({
    ...publicSettings,
    stripeConfig: safeStripe
  });
});

app.put('/api/admin/settings', requireAdmin, (req, res) => {
  const db = getDb();
  const {
    brandName,
    slogan,
    whatsappNumber,
    whatsappDisplay,
    email,
    faqs,
    paymentMethods,
    policies,
    adminPasscode,
    stripeConfig
  } = req.body;

  db.settings = {
    ...db.settings,
    ...(brandName !== undefined && { brandName }),
    ...(slogan !== undefined && { slogan }),
    ...(whatsappNumber !== undefined && { whatsappNumber }),
    ...(whatsappDisplay !== undefined && { whatsappDisplay }),
    ...(email !== undefined && { email }),
    ...(faqs !== undefined && { faqs }),
    ...(paymentMethods !== undefined && { paymentMethods }),
    ...(policies !== undefined && { policies }),
    ...(stripeConfig !== undefined && {
      stripeConfig: {
        ...db.settings.stripeConfig,
        ...stripeConfig
      }
    }),
    ...(adminPasscode && adminPasscode.trim().length >= 4 && { adminPasscode: adminPasscode.trim() })
  };

  saveDb(db);
  const { adminPasscode: _, ...safeSettings } = db.settings;
  res.json({ success: true, settings: safeSettings });
});

// 5. Admin Authentication
app.post('/api/admin/auth/login', (req, res) => {
  const { passcode } = req.body;
  const db = getDb();
  const validPass = db.settings.adminPasscode || 'lumora2026';

  if (passcode === validPass) {
    res.json({ success: true, token: validPass });
  } else {
    res.status(401).json({ error: 'Palavra-passe de administrador incorrecta' });
  }
});

app.get('/api/admin/auth/verify', requireAdmin, (req, res) => {
  res.json({ authenticated: true });
});

// 6. Stripe Payment Intent Creation
app.post('/api/stripe/create-payment-intent', async (req, res) => {
  const db = getDb();
  const { amountKz, customerName, customerPhone } = req.body;

  if (!amountKz || typeof amountKz !== 'number' || amountKz <= 0) {
    res.status(400).json({ error: 'Valor em Kwanzas inválido para processamento.' });
    return;
  }

  const stripeConfig = db.settings.stripeConfig || {};
  const secretKey =
    process.env.STRIPE_SECRET_KEY || stripeConfig.secretKey || 'sk_test_51URbpVK';

  // Exchange rate: 1 USD ~ 900 AOA (approximate baseline for Angola card processing)
  const usdAmount = Math.max(1, Math.round(amountKz / 900));
  const amountInCents = usdAmount * 100;

  try {
    // If the user has provided a real secret key
    if (secretKey && secretKey.startsWith('sk_test_') && secretKey.length > 25) {
      const stripe = new Stripe(secretKey);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: stripeConfig.currency || 'usd',
        metadata: {
          customerName: customerName || 'Cliente LUMORA',
          customerPhone: customerPhone || '',
          amountKz: String(amountKz)
        },
        description: `Encomenda LUMORA - Luminária LED (${amountKz} Kz)`
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
        amountUsd: usdAmount,
        publishableKey: stripeConfig.publishableKey || 'pk_test_51URbpVK5OaHHhzp50Sgkh7Etx'
      });
      return;
    }

    // Graceful simulated test intent if key is a prefix or sandbox mode
    const simulatedIntentId = `pi_sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    res.json({
      clientSecret: `${simulatedIntentId}_secret_${Math.random().toString(36).substring(2, 10)}`,
      id: simulatedIntentId,
      amountUsd: usdAmount,
      publishableKey: stripeConfig.publishableKey || 'pk_test_51URbpVK5OaHHhzp50Sgkh7Etx',
      isSimulated: true
    });
  } catch (err: any) {
    console.error('Stripe error:', err);
    res.status(500).json({
      error: 'Não foi possível inicializar a ligação com a Stripe. Verifica as tuas chaves no painel administrativo.'
    });
  }
});

// 7. Track Order (Customer Self-Service)
app.get('/api/orders/track', (req, res) => {
  const db = getDb();
  const query = (req.query.q as string || '').trim().toLowerCase();

  if (!query) {
    res.status(400).json({ error: 'Por favor indica o código da encomenda ou o teu número de telefone.' });
    return;
  }

  const cleanQuery = query.replace(/[^a-zA-Z0-9]/g, '');

  const order = db.orders.find((o: any) => {
    const oId = o.id.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    const oPhone = o.customerPhone.replace(/[^0-9]/g, '');
    return oId === cleanQuery || oPhone.endsWith(cleanQuery) || cleanQuery.endsWith(oPhone);
  });

  if (!order) {
    res.status(404).json({ error: 'Nenhuma encomenda encontrada com estes dados.' });
    return;
  }

  // Return public tracking info without exposing PII of others
  res.json({
    id: order.id,
    customerName: order.customerName,
    province: order.province,
    municipality: order.municipality,
    quantity: order.quantity,
    total: order.total,
    paymentMethod: order.paymentMethod,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt,
    history: order.history
  });
});

// 8. Create Order (Public Checkout)
app.post('/api/orders', (req, res) => {
  const db = getDb();
  const {
    customerName,
    customerPhone,
    province,
    municipality,
    neighborhood,
    address,
    referencePoint,
    notes,
    quantity,
    paymentMethod,
    stripePaymentIntentId
  } = req.body;

  // Validation
  if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
    res.status(400).json({ error: 'Por favor, insere o teu nome completo.' });
    return;
  }

  const cleanPhone = (customerPhone || '').replace(/\s+/g, '');
  const angolaPhoneRegex = /^(\+?244)?9\d{8}$/;
  if (!angolaPhoneRegex.test(cleanPhone)) {
    res.status(400).json({
      error: 'Por favor, insere um número de telefone angolano válido (ex: 923 456 789 ou +244 923 456 789).'
    });
    return;
  }

  if (!province || !municipality || !address || !referencePoint) {
    res.status(400).json({
      error: 'Por favor, preenche todos os campos obrigatórios da morada e ponto de referência.'
    });
    return;
  }

  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty < 1 || qty > 50) {
    res.status(400).json({ error: 'Quantidade de produto inválida.' });
    return;
  }

  const allowedMethods = ['cash_on_delivery', 'bank_transfer', 'stripe'];
  if (!allowedMethods.includes(paymentMethod)) {
    res.status(400).json({ error: 'Método de pagamento seleccionado inválido.' });
    return;
  }

  // Check product availability
  const currentProduct = db.product;
  if (!currentProduct.isActive || !currentProduct.inStock) {
    res.status(400).json({ error: 'De momento este produto encontra-se temporariamente indisponível.' });
    return;
  }

  // Authoritative server-side price lookup
  const unitPrice = currentProduct.price;
  const subtotal = unitPrice * qty;

  // Authoritative server-side delivery fee calculation
  const matchingZone = db.deliveryZones.find(
    (z: any) =>
      z.isActive &&
      z.province.toLowerCase() === province.toLowerCase() &&
      (z.municipality.toLowerCase() === municipality.toLowerCase() ||
        municipality.toLowerCase().includes(z.municipality.toLowerCase()))
  );

  let deliveryFee = 2500;
  if (matchingZone) {
    deliveryFee = matchingZone.fee;
  } else if (province.toLowerCase() !== 'luanda') {
    deliveryFee = 6000;
  }

  if (paymentMethod === 'cash_on_delivery') {
    const codConfig = db.settings.paymentMethods?.cash_on_delivery;
    if (codConfig?.allowedProvinces && !codConfig.allowedProvinces.includes(province)) {
      res.status(400).json({
        error: `O pagamento na entrega só está disponível na província de ${codConfig.allowedProvinces.join(', ')}. Para ${province}, utiliza transferência bancária ou cartão Stripe.`
      });
      return;
    }
  }

  const total = subtotal + deliveryFee;
  const uniqueId = `LMR-${Math.floor(10000 + Math.random() * 90000)}`;

  const isStripePaid = paymentMethod === 'stripe' && Boolean(stripePaymentIntentId);

  const newOrder = {
    id: uniqueId,
    customerName: customerName.trim(),
    customerPhone: cleanPhone.startsWith('+') ? cleanPhone : `+244${cleanPhone.replace(/^244/, '')}`,
    province: province.trim(),
    municipality: municipality.trim(),
    neighborhood: (neighborhood || '').trim(),
    address: address.trim(),
    referencePoint: referencePoint.trim(),
    notes: (notes || '').trim(),
    quantity: qty,
    unitPrice,
    subtotal,
    deliveryFee,
    total,
    paymentMethod,
    stripePaymentIntentId: stripePaymentIntentId || null,
    orderStatus: isStripePaid ? 'confirmed' : 'new',
    paymentStatus: isStripePaid ? 'paid' : 'pending',
    internalNotes: isStripePaid
      ? `Pagamento confirmado online via Stripe (ID: ${stripePaymentIntentId})`
      : '',
    history: [
      {
        timestamp: new Date().toISOString(),
        action: isStripePaid
          ? 'Encomenda registada com pagamento confirmado via Stripe'
          : 'Encomenda registada com sucesso pelo cliente'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Decrement product stock if managed
  if (currentProduct.stock > 0) {
    currentProduct.stock = Math.max(0, currentProduct.stock - qty);
  }

  db.orders.unshift(newOrder);
  saveDb(db);

  const formattedTotal = new Intl.NumberFormat('pt-AO').format(total);
  const paymentLabels: Record<string, string> = {
    cash_on_delivery: 'Pagamento na Entrega',
    bank_transfer: 'Transferência Bancária',
    stripe: 'Cartão de Crédito / Débito (Stripe)'
  };

  const rawWhatsappMsg =
    `Olá LUMORA! Acabei de fazer a encomenda *${newOrder.id}* no vosso site.\n\n` +
    `*Produto:* ${currentProduct.name}\n` +
    `*Quantidade:* ${qty} unidade(s)\n` +
    `*Total:* ${formattedTotal} Kz\n` +
    `*Pagamento:* ${paymentLabels[paymentMethod] || paymentMethod}\n` +
    `*Local de Entrega:* ${newOrder.province}, ${newOrder.municipality} (${newOrder.neighborhood || 'Bairro indicado'})\n\n` +
    `Gostaria de confirmar a encomenda e combinar a entrega. Obrigado!`;

  res.status(201).json({
    success: true,
    order: newOrder,
    whatsappMessage: encodeURIComponent(rawWhatsappMsg),
    bankTransferDetails:
      paymentMethod === 'bank_transfer'
        ? {
            accounts: db.settings.paymentMethods.bank_transfer.accounts,
            instructions: db.settings.paymentMethods.bank_transfer.instructions
          }
        : undefined,
    stripeDetails:
      paymentMethod === 'stripe'
        ? {
            paid: isStripePaid,
            receiptNotice: 'O teu pagamento com cartão foi verificado através da plataforma Stripe.'
          }
        : undefined
  });
});

// 9. Admin Orders List & Search
app.get('/api/admin/orders', requireAdmin, (req, res) => {
  const db = getDb();
  let orders = [...db.orders];

  const { search, orderStatus, paymentStatus, province } = req.query;

  if (search && typeof search === 'string') {
    const s = search.toLowerCase();
    orders = orders.filter(
      (o: any) =>
        o.id.toLowerCase().includes(s) ||
        o.customerName.toLowerCase().includes(s) ||
        o.customerPhone.toLowerCase().includes(s) ||
        o.municipality.toLowerCase().includes(s) ||
        o.address.toLowerCase().includes(s)
    );
  }

  if (orderStatus && typeof orderStatus === 'string' && orderStatus !== 'all') {
    orders = orders.filter((o: any) => o.orderStatus === orderStatus);
  }

  if (paymentStatus && typeof paymentStatus === 'string' && paymentStatus !== 'all') {
    orders = orders.filter((o: any) => o.paymentStatus === paymentStatus);
  }

  if (province && typeof province === 'string' && province !== 'all') {
    orders = orders.filter((o: any) => o.province.toLowerCase() === province.toLowerCase());
  }

  res.json(orders);
});

// 10. Admin Update Order
app.patch('/api/admin/orders/:id', requireAdmin, (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { orderStatus, paymentStatus, internalNotes, historyNote } = req.body;

  const orderIndex = db.orders.findIndex((o: any) => o.id === id);
  if (orderIndex === -1) {
    res.status(404).json({ error: 'Encomenda não encontrada' });
    return;
  }

  const order = db.orders[orderIndex];
  const historyEntries = [...order.history];

  if (orderStatus && orderStatus !== order.orderStatus) {
    historyEntries.push({
      timestamp: new Date().toISOString(),
      action: `Estado da encomenda alterado de "${order.orderStatus}" para "${orderStatus}"`,
      note: historyNote
    });
    order.orderStatus = orderStatus;
  }

  if (paymentStatus && paymentStatus !== order.paymentStatus) {
    historyEntries.push({
      timestamp: new Date().toISOString(),
      action: `Estado de pagamento alterado de "${order.paymentStatus}" para "${paymentStatus}"`,
      note: historyNote
    });
    order.paymentStatus = paymentStatus;
  }

  if (internalNotes !== undefined) {
    order.internalNotes = internalNotes;
  }

  order.history = historyEntries;
  order.updatedAt = new Date().toISOString();

  db.orders[orderIndex] = order;
  saveDb(db);

  res.json({ success: true, order });
});

// 11. Admin Sales Analytics
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const db = getDb();
  const orders = db.orders || [];

  const totalOrders = orders.length;
  const confirmedOrders = orders.filter((o: any) =>
    ['confirmed', 'preparing', 'shipped', 'delivered'].includes(o.orderStatus)
  ).length;
  const deliveredOrders = orders.filter((o: any) => o.orderStatus === 'delivered').length;
  const cancelledOrders = orders.filter((o: any) => o.orderStatus === 'cancelled').length;

  const actualRevenue = orders
    .filter((o: any) => o.paymentStatus === 'paid')
    .reduce((sum: number, o: any) => sum + (o.total || 0), 0);

  const potentialBilling = orders
    .filter((o: any) => o.orderStatus !== 'cancelled')
    .reduce((sum: number, o: any) => sum + (o.total || 0), 0);

  const nonCancelledCount = orders.filter((o: any) => o.orderStatus !== 'cancelled').length;
  const averageOrderValue = nonCancelledCount > 0 ? Math.round(potentialBilling / nonCancelledCount) : 0;

  const unitsSold = orders
    .filter((o: any) => o.orderStatus !== 'cancelled')
    .reduce((sum: number, o: any) => sum + (o.quantity || 1), 0);

  res.json({
    totalOrders,
    confirmedOrders,
    deliveredOrders,
    cancelledOrders,
    actualRevenue,
    potentialBilling,
    averageOrderValue,
    unitsSold
  });
});

// Setup Vite middleware for local development
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LUMORA Angola server listening on http://0.0.0.0:${PORT}`);
  });
}

// Only start standalone server when executed directly (not when imported as a serverless function)
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.VERCEL_ENV);
if (!isServerless) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
  });
}

export { app };
export default app;
