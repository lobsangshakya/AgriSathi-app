/**
 * Production-Ready Chatbot Service
 * Integrates with OpenAI and Gemini APIs with local fallback
 */

import { env } from '@/lib/env';

export interface ChatContext {
  language: 'hindi' | 'english';
  lastMessage?: string;
  sessionId?: string;
  history?: { role: 'user' | 'assistant' | 'system', content: string }[];
}

export interface ChatResponse {
  content: string;
  suggestions?: string[];
  followUpQuestions?: string[];
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

class ChatbotService {
  private conversationHistory: Map<string, ChatMessage[]> = new Map();
  private openaiApiKey: string | null = null;
  private geminiApiKey: string | null = null;

  constructor() {
    this.openaiApiKey = env.VITE_OPENAI_API_KEY || null;
    this.geminiApiKey = env.VITE_GEMINI_API_KEY || null;
  }

  // ... (keep local response methods) ...

  // Keep private methods for keyword detection and local responses
  private isGreeting(message: string): boolean {
    const greetings = ['hello', 'hi', 'namaste', 'नमस्ते', 'hey', 'good morning', 'good evening'];
    return greetings.some(greeting => message.includes(greeting));
  }

  private isWeatherQuery(message: string): boolean {
    const weatherKeywords = ['weather', 'मौसम', 'rain', 'बारिश', 'temperature', 'तापमान', 'climate', 'जलवायु'];
    return weatherKeywords.some(keyword => message.includes(keyword));
  }

  private isDiseaseQuery(message: string): boolean {
    const diseaseKeywords = ['disease', 'बीमारी', 'pest', 'कीट', 'infection', 'संक्रमण', 'virus', 'वायरस', 'fungus', 'फंगस'];
    return diseaseKeywords.some(keyword => message.includes(keyword));
  }

  private isMarketQuery(message: string): boolean {
    const marketKeywords = ['price', 'भाव', 'market', 'बाजार', 'rate', 'दर', 'cost', 'कीमत', 'sell', 'बेचना'];
    return marketKeywords.some(keyword => message.includes(keyword));
  }

  private isFertilizerQuery(message: string): boolean {
    const fertilizerKeywords = ['fertilizer', 'खाद', 'urea', 'यूरिया', 'dap', 'npk', 'nutrient', 'पोषक तत्व'];
    return fertilizerKeywords.some(keyword => message.includes(keyword));
  }

  private getGreetingResponse(language: string): string {
    return language === 'hindi'
      ? '🌾 नमस्ते किसान भाई! मैं आपका कृषि सहायक हूं। मैं आपको फसलों, मौसम, बीमारियों, बाजार भाव और खाद के बारे में जानकारी दे सकता हूं। अपना सवाल पूछें।'
      : '🌾 Hello! I am your farming assistant. I can help you with information about crops, weather, diseases, market prices, and fertilizers. Ask your question.';
  }

  private getWeatherResponse(language: string): string {
    return language === 'hindi'
      ? 'मौसम की जानकारी के लिए, मैं आपको वेदर ऐप का उपयोग करने की सलाह देता हूं। आप अपने शहर का मौसम देख सकते हैं। क्या आप किसी विशेष फसल के लिए मौसम की जानकारी चाहते हैं?'
      : 'For weather information, I recommend checking a weather app for your specific location. Different crops have different weather requirements. Are you looking for weather information for a specific crop?';
  }

  private getDiseaseResponse(language: string): string {
    return language === 'hindi'
      ? 'फसल की बीमारी की पहचान के लिए, आप हमारे डिजीज डिटेक्शन फीचर का उपयोग कर सकते हैं। फसल की फोटो लें और स्कैन करें। सामान्य बीमारियों के लिए: पौधों को अच्छी तरह देखें, पीले पत्ते, दाग, या कीड़े की जांच करें।'
      : 'For crop disease identification, you can use our disease detection feature. Take a photo of crop and scan it. For common diseases: check plants regularly for yellow leaves, spots, or pests.';
  }

  private getMarketResponse(language: string): string {
    return language === 'hindi'
      ? 'बाजार भाव हर दिन बदलते रहते हैं। मंडी की वेबसाइट पर जाकर या कृषि विभाग की वेबसाइट पर भाव देख सकते हैं। आज के औसत भाव: गेहूं ₹2000-2500/क्विंटल, चावल ₹3000-3500/क्विंटल।'
      : 'Market prices change daily. Check mandi websites or agriculture department websites for current prices. Today\'s average prices: Wheat ₹2000-2500/quintal, Rice ₹3000-3500/quintal.';
  }

  private getFertilizerResponse(language: string): string {
    return language === 'hindi'
      ? 'खाद का उपयोग मिट्टी की जांच के अनुसार करें। सामान्य: यूरिया 50-60 किग्रा/हेक्टेयर, DAP 100-120 किग्रा/हेक्टेयर। जैविक खाद का भी उपयोग करें - गोबर की खाद 5-6 टन/हेक्टेयर।'
      : 'Use fertilizers based on soil testing. General: Urea 50-60 kg/hectare, DAP 100-120 kg/hectare. Also use organic fertilizers - cow dung manure 5-6 tons/hectare.';
  }

  private getDefaultResponse(language: string): string {
    return language === 'hindi'
      ? 'मैं आपकी कृषि संबंधी सहायता के लिए यहां हूं। मैं फसलों, मौसम, बीमारियों, बाजार भाव, और खाद के बारे में जानकारी दे सकता हूं। कृपया अपना सवाल विस्तार से बताएं।'
      : 'I am here to help with your farming needs. I can provide information about crops, weather, diseases, market prices, and fertilizers. Please ask your question in detail.';
  }

  private getLocalResponse(message: string, context: ChatContext): ChatResponse {
    const lowerMessage = message.toLowerCase();
    const language = context.language || 'english';

    // Greeting responses
    if (this.isGreeting(lowerMessage)) {
      return {
        content: this.getGreetingResponse(language),
        suggestions: [
          language === 'hindi' ? 'आज का मौसम कैसा है?' : 'What is weather today?',
          language === 'hindi' ? 'फसल की बीमारी कैसे पहचानें?' : 'How to identify crop diseases?',
          language === 'hindi' ? 'गेहूं का भाव क्या है?' : 'What is the price of wheat?'
        ]
      };
    }

    // Weather queries
    if (this.isWeatherQuery(lowerMessage)) {
      return {
        content: this.getWeatherResponse(language),
        suggestions: [
          language === 'hindi' ? 'बारिश कब होगी?' : 'When will it rain?',
          language === 'hindi' ? 'तापमान कितना है?' : 'What is the temperature?'
        ]
      };
    }

    // Disease queries
    if (this.isDiseaseQuery(lowerMessage)) {
      return {
        content: this.getDiseaseResponse(language),
        suggestions: [
          language === 'hindi' ? 'टमाटर की बीमारी' : 'Tomato diseases',
          language === 'hindi' ? 'धान की बीमारी' : 'Rice diseases',
          language === 'hindi' ? 'कीटनाशक कौन सा उपयोग करें?' : 'Which pesticide to use?'
        ]
      };
    }

    // Market queries
    if (this.isMarketQuery(lowerMessage)) {
      return {
        content: this.getMarketResponse(language),
        suggestions: [
          language === 'hindi' ? 'गेहूं का भाव' : 'Wheat price',
          language === 'hindi' ? 'चावल का भाव' : 'Rice price',
          language === 'hindi' ? 'सब्जियों का भाव' : 'Vegetable prices'
        ]
      };
    }

    // Fertilizer queries
    if (this.isFertilizerQuery(lowerMessage)) {
      return {
        content: this.getFertilizerResponse(language),
        suggestions: [
          language === 'hindi' ? 'यूरिया का उपयोग' : 'Urea usage',
          language === 'hindi' ? 'DAP कब लगाएं?' : 'When to apply DAP?',
          language === 'hindi' ? 'जैविक खाद' : 'Organic fertilizer'
        ]
      };
    }

    // Default response
    return {
      content: this.getDefaultResponse(language),
      suggestions: [
        language === 'hindi' ? 'फसल संरक्षण' : 'Crop protection',
        language === 'hindi' ? 'सिंचाई युक्तियाँ' : 'Irrigation tips',
        language === 'hindi' ? 'बीज चयन' : 'Seed selection'
      ]
    };
  }


  private getErrorMessage(language: string): string {
    return language === 'hindi'
      ? 'क्षमा करें, समस्या हुई। कृपया फिर से कोशिश करें।'
      : 'Sorry, there was a problem. Please try again.';
  }

  private buildSystemPrompt(context: ChatContext): string {
    const language = context.language || 'english';

    if (language === 'hindi') {
      return `आप एक कृषि विशेषज्ञ सहायक हैं। आप किसानों को फसलों, मौसम, बीमारियों, बाजार भाव, और खाद के बारे में सटीक जानकारी देते हैं। अपने जवाब हिंदी में दें और उपयोगी सुझाव भी दें।`;
    }

    return `You are an agricultural expert assistant. You help farmers with accurate information about crops, weather, diseases, market prices, and fertilizers. Provide helpful and practical advice.`;
  }

  private generateSuggestions(message: string, context: ChatContext): string[] {
    const language = context.language || 'english';
    const suggestions = [];

    if (language === 'hindi') {
      suggestions.push('फसल संरक्षण', 'सिंचाई युक्तियाँ', 'बीज चयन');
    } else {
      suggestions.push('Crop protection', 'Irrigation tips', 'Seed selection');
    }

    return suggestions;
  }

  private generateFollowUpQuestions(message: string, context: ChatContext): string[] {
    const language = context.language || 'english';
    const questions = [];

    if (language === 'hindi') {
      questions.push('आप किस फसल की बात कर रहे हैं?', 'आपका क्षेत्र कौन सा है?', 'क्या आपको और कोई समस्या है?');
    } else {
      questions.push('Which crop are you referring to?', 'What is your region?', 'Do you have any other problems?');
    }

    return questions;
  }

  async processMessage(message: string, context: ChatContext): Promise<ChatResponse> {
    try {
      // Try OpenAI first with timeout
      if (this.openaiApiKey) {
        try {
          const response = await Promise.race([
            this.callOpenAI(message, context),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error('OpenAI timeout')), 10000))
          ]);
          if (response) {
            return response;
          }
        } catch (error) {
          // Continue to Gemini
        }
      }

      // Try Gemini as fallback with timeout
      if (this.geminiApiKey) {
        try {
          const response = await Promise.race([
            this.callGemini(message, context),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Gemini timeout')), 10000))
          ]);
          if (response) {
            return response;
          }
        } catch (error) {
          // Continue to local fallback
        }
      }

      // Local fallback
      return this.getLocalResponse(message, context);
    } catch (error) {
      return {
        content: this.getErrorMessage(context.language || 'english')
      };
    }
  }

  private async callOpenAI(message: string, context: ChatContext): Promise<ChatResponse | null> {
    if (!this.openaiApiKey) return null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const systemMessage = {
        role: 'system',
        content: this.buildSystemPrompt(context)
      };

      // Construct messages array with history
      const history = context.history || [];
      const messages = [
        systemMessage,
        ...history.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: message }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 500,
          temperature: 0.7
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || this.getErrorMessage(context.language || 'english');

      return {
        content,
        suggestions: this.generateSuggestions(message, context),
        followUpQuestions: this.generateFollowUpQuestions(message, context)
      };
    } catch (error) {
      if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
        throw new Error('OpenAI request timeout');
      }
      return null;
    }
  }

  private async callGemini(message: string, context: ChatContext): Promise<ChatResponse | null> {
    if (!this.geminiApiKey) return null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const history = context.history || [];
      const contents = [
        {
          role: 'user',
          parts: [{ text: this.buildSystemPrompt(context) }]
        },
        {
          role: 'model',
          parts: [{ text: 'Understood. I will act as an agricultural expert assistant.' }]
        },
        ...history.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        })),
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ];

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.candidates[0]?.content?.parts[0]?.text || this.getErrorMessage(context.language || 'english');

      return {
        content,
        suggestions: this.generateSuggestions(message, context),
        followUpQuestions: this.generateFollowUpQuestions(message, context)
      };
    } catch (error) {
      if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
        throw new Error('Gemini request timeout');
      }
      return null;
    }
  }

  clearHistory(sessionId: string): void {
    this.conversationHistory.delete(sessionId);
  }

  getHistory(sessionId: string): ChatMessage[] {
    return this.conversationHistory.get(sessionId) || [];
  }

  addToHistory(sessionId: string, message: ChatMessage): void {
    const history = this.conversationHistory.get(sessionId) || [];
    history.push(message);

    // Keep only last 20 messages
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    this.conversationHistory.set(sessionId, history);
  }
}

export const chatbotService = new ChatbotService();
