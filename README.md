# SurveyJS Spike

Proof of concept per la creazione e gestione di survey dinamici utilizzando SurveyJS con React.

## Panoramica

Questo progetto dimostra come integrare SurveyJS in un'applicazione React per:
- **Creare survey** tramite un editor visuale (SurveyJS Creator)
- **Visualizzare e compilare survey** tramite un renderer (SurveyJS React UI)
- **Persistere i survey** su cloud storage (Supabase Storage)
- **Supportare multilingua** con traduzioni gestibili dall'editor

## Architettura

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React + Vite)               │
├─────────────────────────────────────────────────────────────┤
│  /                    │  Lista survey salvati                │
│  /creator             │  Editor visuale per creare survey    │
│  /creator/:id         │  Modifica survey esistente           │
│  /survey/:id          │  Visualizza/compila survey           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Storage                          │
│                    (bucket: surveys)                         │
│                    File JSON dei survey                      │
└─────────────────────────────────────────────────────────────┘
```

### Struttura del progetto

```
src/
├── components/
│   └── SurveyList.tsx        # Pagina lista survey
├── creator/
│   ├── SurveyCreatorPage.tsx # Editor visuale
│   └── theme.json            # Tema personalizzato Creator
├── renderer/
│   ├── SurveyRenderer.tsx    # Componente survey
│   ├── SurveyRendererPage.tsx# Pagina visualizzazione
│   └── theme.json            # Tema personalizzato Renderer
├── services/
│   └── surveyStorage.ts      # CRUD survey su Supabase
├── lib/
│   └── supabase.ts           # Client Supabase
├── App.tsx                   # Routing
├── main.tsx                  # Entry point
└── index.css                 # Stili globali
```

## Stack tecnologico

- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **SurveyJS** - Libreria survey (Creator + React UI)
- **Supabase Storage** - Persistenza file JSON
- **React Router** - Routing client-side

## Funzionalità

### Creator
- Editor drag & drop per creare survey
- Tipi di domande: testo, email, dropdown, radio, checkbox, rating, matrix, ecc.
- Logica condizionale (mostra/nascondi domande)
- Validazione built-in e custom
- Tab traduzioni per supporto multilingua
- Preview integrata con stili del renderer

### Renderer
- Visualizzazione survey responsive
- Navigazione multi-pagina con progress bar
- Validazione in tempo reale
- Supporto temi personalizzati
- Log eventi per debug (onValueChanged, onComplete)

### Lingue supportate
- English, Italiano, Français, Deutsch, Español
- 中文 (简体), 日本語, العربية

## Setup locale

### Prerequisiti
- Node.js 18+
- Account Supabase (gratuito)

### Configurazione Supabase

1. Crea un progetto su [supabase.com](https://supabase.com)
2. Vai in **Storage** → **New bucket**
3. Nome: `surveys`, abilita **Public bucket**
4. Vai in **Storage** → **Policies** e crea policy per SELECT, INSERT, UPDATE, DELETE con `true` come condizione

### Installazione

```bash
# Clona il repository
git clone <repo-url>
cd survey-spike

# Installa dipendenze
npm install

# Configura variabili ambiente
cp .env.example .env
# Modifica .env con le tue credenziali Supabase
```

### Variabili ambiente

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Avvio

```bash
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`

## Deploy

### Vercel (consigliato)

1. Collega il repository a Vercel
2. Configura le variabili ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy automatico ad ogni push

## Licenza

Questo è uno spike/proof of concept. SurveyJS richiede licenza commerciale per uso in produzione.
