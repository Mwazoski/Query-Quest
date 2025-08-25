import OpenAI from 'openai';
import { CHAT_CONFIG } from '../config/chat-config.js';

class OpenAIService {
  constructor() {
    this.client = null;
    this.initialized = false;
  }

  /**
   * Initialize the OpenAI client
   * @returns {boolean} - Whether initialization was successful
   */
  initialize() {
    if (this.initialized) return true;

    const apiKey = CHAT_CONFIG.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key not configured. Please set OPENAI_API_KEY in your environment variables.');
      return false;
    }

    try {
      this.client = new OpenAI({
        apiKey: apiKey,
      });
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize OpenAI client:', error);
      return false;
    }
  }

  /**
   * Generate a response using OpenAI
   * @param {string} userMessage - The user's message
   * @param {Array} conversationHistory - Previous conversation messages
   * @param {Object} contextData - Additional context about the user/institution
   * @returns {Promise<string>} - The AI response
   */
  async generateResponse(userMessage, conversationHistory = [], contextData = {}) {
    // Initialize client if not already done
    if (!this.initialize()) {
      return "I'm sorry, but my AI service is not properly configured. Please contact your administrator to set up the OpenAI API key.";
    }

    try {
      // Build the system prompt with context
      const systemPrompt = this.buildSystemPrompt(contextData);

      // Build the messages array for OpenAI
      const messages = [
        { role: 'system', content: systemPrompt },
        ...this.formatConversationHistory(conversationHistory),
        { role: 'user', content: userMessage }
      ];

      const response = await this.client.chat.completions.create({
        model: CHAT_CONFIG.OPENAI_MODEL,
        messages,
        max_tokens: CHAT_CONFIG.OPENAI_MAX_TOKENS,
        temperature: CHAT_CONFIG.OPENAI_TEMPERATURE,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      });

      const content = response.choices[0]?.message?.content?.trim();

      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      return content;
    } catch (error) {
      console.error('OpenAI API Error:', error);

      // Fallback responses for common errors
      if (error.code === 'insufficient_quota') {
        return "I'm sorry, but my knowledge base is currently limited due to quota restrictions. Please try again later or contact your administrator.";
      }

      if (error.code === 'invalid_api_key') {
        return "I'm having trouble connecting to my knowledge base. Please check the API configuration.";
      }

      return "I'm sorry, I'm experiencing some technical difficulties. Please try again in a moment.";
    }
  }

  /**
   * Build the system prompt with user context
   * @param {Object} contextData - User and institution data
   * @returns {string} - Formatted system prompt
   */
  buildSystemPrompt(contextData) {
    let prompt = CHAT_CONFIG.SYSTEM_PROMPT;

    // Add user context if available
    if (contextData.userStats) {
      const { userStats } = contextData;
      const userInfo = `
USER CONTEXT:
- Name: ${userStats.name}${userStats.alias ? ` (alias: ${userStats.alias})` : ''}
- Role: ${userStats.isAdmin ? 'Administrator' : userStats.isTeacher ? 'Teacher' : 'Student'}
- Progress: ${userStats.solvedChallenges || 0} challenges solved, ${userStats.totalPoints || 0} total points
- Institution: ${userStats.institution || 'Not affiliated with an institution'}
      `.trim();

      prompt += '\n\n' + userInfo;
    }

    // Add institution context if available
    if (contextData.institutionStats) {
      const { institutionStats } = contextData;
      const institutionInfo = `
INSTITUTION CONTEXT:
- Institution: ${institutionStats.name}
- Total Users: ${institutionStats.totalUsers}
- Total Challenges: ${institutionStats.totalChallenges}
- Total Lessons: ${institutionStats.totalLessons}
      `.trim();

      prompt += '\n\n' + institutionInfo;
    }

    // Add recent challenges if available
    if (contextData.popularChallenges && contextData.popularChallenges.length > 0) {
      const challengeInfo = `
POPULAR CHALLENGES:
${contextData.popularChallenges.slice(0, 3).map((c, i) =>
  `${i + 1}. ${c.statement?.substring(0, 100) || 'Challenge'}... (${c.solves || 0} solves)`
).join('\n')}
      `.trim();

      prompt += '\n\n' + challengeInfo;
    }

    // Add recent lessons if available
    if (contextData.recentLessons && contextData.recentLessons.length > 0) {
      const lessonInfo = `
RECENT LESSONS:
${contextData.recentLessons.slice(0, 3).map((l, i) =>
  `${i + 1}. ${l.title}: ${l.description?.substring(0, 100) || 'No description'}...`
).join('\n')}
      `.trim();

      prompt += '\n\n' + lessonInfo;
    }

    return prompt;
  }

  /**
   * Format conversation history for OpenAI
   * @param {Array} history - Previous conversation messages
   * @returns {Array} - Formatted messages for OpenAI
   */
  formatConversationHistory(history) {
    if (!history || history.length === 0) return [];

    // Limit history to prevent token limit issues
    const recentHistory = history.slice(-CHAT_CONFIG.MAX_HISTORY_LENGTH);

    return recentHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
  }

  /**
   * Get available OpenAI models (for configuration)
   * @returns {Promise<Array>} - List of available models
   */
  async getAvailableModels() {
    try {
      const models = await this.client.models.list();
      return models.data
        .filter(model => model.id.includes('gpt'))
        .map(model => model.id);
    } catch (error) {
      console.error('Error fetching models:', error);
      return ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo-preview'];
    }
  }
}

// Export singleton instance
export const openaiService = new OpenAIService();
export default openaiService;
