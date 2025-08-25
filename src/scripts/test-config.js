#!/usr/bin/env node

/**
 * Test script for Query Quest Chatbot Configuration
 * Run with: node scripts/test-config.js
 */

import { CHAT_CONFIG } from '../config/chat-config.js';

console.log('🔧 Testing Query Quest Chatbot Configuration...\n');

// Test configuration values
console.log('📋 Configuration Values:');
console.log(`✅ OpenAI Model: ${CHAT_CONFIG.OPENAI_MODEL}`);
console.log(`✅ Max Tokens: ${CHAT_CONFIG.OPENAI_MAX_TOKENS}`);
console.log(`✅ Temperature: ${CHAT_CONFIG.OPENAI_TEMPERATURE}`);
console.log(`✅ Max History Length: ${CHAT_CONFIG.MAX_HISTORY_LENGTH}`);
console.log(`✅ Conversation Timeout: ${CHAT_CONFIG.CONVERSATION_TIMEOUT}ms (${Math.round(CHAT_CONFIG.CONVERSATION_TIMEOUT / 60000)} minutes)`);

// Test API key configuration
console.log('\n🔑 API Key Status:');
if (CHAT_CONFIG.OPENAI_API_KEY === 'your_openai_api_key_here') {
  console.log('❌ API Key: Not configured (using default placeholder)');
  console.log('💡 To configure:');
  console.log('   1. Get your OpenAI API key from https://platform.openai.com');
  console.log('   2. Create a .env.local file in your project root');
  console.log('   3. Add: OPENAI_API_KEY=sk-your-actual-key-here');
} else if (CHAT_CONFIG.OPENAI_API_KEY && CHAT_CONFIG.OPENAI_API_KEY.startsWith('sk-')) {
  console.log('✅ API Key: Configured (starts with sk-)');
} else {
  console.log('⚠️  API Key: Partially configured (check format)');
}

// Test system prompt
console.log('\n💬 System Prompt:');
const promptPreview = CHAT_CONFIG.SYSTEM_PROMPT.substring(0, 150) + '...';
console.log(`✅ Length: ${CHAT_CONFIG.SYSTEM_PROMPT.length} characters`);
console.log(`✅ Preview: ${promptPreview}`);

// Test configuration validation
console.log('\n🔍 Configuration Validation:');
const issues = [];

if (CHAT_CONFIG.OPENAI_MAX_TOKENS < 100 || CHAT_CONFIG.OPENAI_MAX_TOKENS > 4000) {
  issues.push('Max tokens should be between 100 and 4000');
}

if (CHAT_CONFIG.OPENAI_TEMPERATURE < 0 || CHAT_CONFIG.OPENAI_TEMPERATURE > 2) {
  issues.push('Temperature should be between 0 and 2');
}

if (CHAT_CONFIG.MAX_HISTORY_LENGTH < 1 || CHAT_CONFIG.MAX_HISTORY_LENGTH > 50) {
  issues.push('Max history length should be between 1 and 50');
}

if (CHAT_CONFIG.CONVERSATION_TIMEOUT < 60000 || CHAT_CONFIG.CONVERSATION_TIMEOUT > 3600000) {
  issues.push('Conversation timeout should be between 1 minute and 1 hour');
}

if (issues.length === 0) {
  console.log('✅ All configuration values are within valid ranges');
} else {
  console.log('⚠️  Configuration issues found:');
  issues.forEach(issue => console.log(`   - ${issue}`));
}

// Test environment variables
console.log('\n🌍 Environment Variables:');
console.log(`✅ NODE_ENV: ${process.env.NODE_ENV || 'Not set (defaults to development)'}`);
console.log(`✅ DATABASE_URL: ${process.env.DATABASE_URL ? 'Configured' : 'Not set'}`);

// Configuration recommendations
console.log('\n💡 Configuration Recommendations:');
console.log('- For development: Use gpt-3.5-turbo (faster, cheaper)');
console.log('- For production: Use gpt-4-turbo-preview (better quality)');
console.log('- Temperature 0.3-0.7: Balanced responses');
console.log('- Max tokens 1000-1500: Good balance of length and cost');
console.log('- Max history 10-15: Prevents token limit issues');

// Next steps
console.log('\n🚀 Next Steps:');
if (CHAT_CONFIG.OPENAI_API_KEY === 'your_openai_api_key_here') {
  console.log('1. Configure your OpenAI API key');
  console.log('2. Test the chatbot with: node scripts/test-chatbot.js');
  console.log('3. Customize the system prompt in config/chat-config.js');
} else {
  console.log('1. Test the full chatbot: node scripts/test-chatbot.js');
  console.log('2. Customize the system prompt in config/chat-config.js');
  console.log('3. Adjust model settings for your use case');
}

console.log('\n🎉 Configuration test completed!');
console.log('\n📁 Configuration file: src/config/chat-config.js');
console.log('📖 Documentation: src/docs/CHATBOT_SETUP.md');
