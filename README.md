# Mental Wellness Chat App

A Next.js-based mental wellness application that helps users feel better through AI-powered conversations using Groq API.

## Features

- 🎭 **Feeling Selection**: Choose from 10 different emotional states
- 💬 **AI-Powered Conversations**: Fast responses powered by Groq's LLM API
- 🔒 **Privacy-First**: Session-based memory, no data persistence
- 🚨 **Safety Features**: Built-in crisis detection and resource recommendations
- 📱 **Responsive Design**: Works seamlessly on mobile and desktop
- 🎨 **Calming UI**: Clean, distraction-free interface with soothing colors

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Groq API (llama-3.1-70b-versatile)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Groq API key (get one at [https://console.groq.com](https://console.groq.com))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/renatodap/mood-enhancer.git
cd mood-enhancer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Groq API key to `.env.local`:
```
GROQ_API_KEY=your_actual_groq_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
mental-wellness-app/
├── app/
│   ├── page.tsx                 # Landing page with name input
│   ├── chat/
│   │   └── page.tsx            # Main chat interface
│   └── api/
│       └── chat/
│           └── route.ts        # API endpoint for Groq integration
├── components/
│   ├── FeelingSelector.tsx     # Feeling selection interface
│   ├── ChatInterface.tsx       # Chat conversation interface
│   └── MessageBubble.tsx       # Individual message display
├── lib/
│   ├── groq.ts                 # Groq client configuration
│   ├── prompts.ts              # System prompts for each feeling
│   └── sessionManager.ts       # In-memory session handling
├── types/
│   └── index.ts                # TypeScript type definitions
└── docs/
    └── SYSTEM_PROMPTS.md       # Comprehensive prompt documentation
```

## How It Works

1. **User enters their name** on the landing page
2. **Selects a feeling** from 10 options (overwhelmed, anxious, sad, etc.)
3. **AI engages in conversation**:
   - Asks clarifying questions
   - Helps identify controllable vs uncontrollable factors
   - Provides actionable suggestions
   - Monitors for crisis indicators
4. **Conversation continues** until user feels better or ends session
5. **Page refresh** clears all session data

## System Prompts

The app uses sophisticated system prompts tailored to each emotional state. See `docs/SYSTEM_PROMPTS.md` for the complete framework including:

- Master system prompt template
- Feeling-specific prompt variations (10 different feelings)
- Medical detection logic
- Clarifying questions framework
- Control analysis framework
- Action-oriented guidance framework
- Conversation closing framework

## Safety Features

- ⚠️ **Disclaimer**: Clear messaging that this is not professional mental health care
- 🆘 **Crisis Resources**: 24/7 hotline numbers displayed prominently
- 🚨 **Medical Detection**: Monitors for keywords indicating professional help is needed
- 🛡️ **Professional Recommendations**: Suggests therapy/medical help when appropriate

## Crisis Resources

- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **International Resources**: [IASP Crisis Centres](https://www.iasp.info/resources/Crisis_Centres/)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your `GROQ_API_KEY` environment variable in Vercel project settings
4. Deploy!

### Environment Variables for Production

Make sure to set these in your deployment platform:
- `GROQ_API_KEY`: Your Groq API key

## Customization

### Modifying System Prompts

Edit `lib/prompts.ts` to customize how the AI responds to different feelings. Use the framework in `docs/SYSTEM_PROMPTS.md` as a guide.

### Adding New Feelings

1. Add the feeling type to `types/index.ts`
2. Add the feeling option to `components/FeelingSelector.tsx`
3. Create a corresponding prompt in `lib/prompts.ts`

### Styling

The app uses Tailwind CSS. Customize colors, spacing, and layout in component files or modify `tailwind.config.js`.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Important Notes

- ⚠️ **Not a substitute for professional care**: This app is designed to help users feel better through conversation, but it is NOT a replacement for therapy or medical treatment
- 🔒 **No data persistence**: All conversation data is stored in-memory and cleared on page refresh
- 🔑 **API Key Security**: Never commit your `.env.local` file. Keep your Groq API key secure

## Contributing

Contributions are welcome! Please ensure:
- Safety features remain intact
- User privacy is maintained
- Crisis detection is not weakened
- Professional help recommendations are preserved

## License

MIT License - feel free to use this project for your own purposes.

## Disclaimer

This application is provided for informational and supportive purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a mental health condition. Never disregard professional medical advice or delay in seeking it because of something you have experienced in this app.

If you are in crisis or you think you may have an emergency, call your doctor or 911 immediately. If you're having suicidal thoughts, call the National Suicide Prevention Lifeline at 988 or text HOME to 741741 to reach the Crisis Text Line.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Groq](https://groq.com/)
- Icons by [Lucide](https://lucide.dev/)

---

Made with 💜 for mental wellness
