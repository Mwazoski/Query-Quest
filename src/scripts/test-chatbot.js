#!/usr/bin/env node

/**
 * Test script for the Query Quest Chatbot
 * Run with: node scripts/test-chatbot.js
 */

import { openaiService } from '../lib/openai-service.js';
import { CHAT_CONFIG } from '../config/chat-config.js';

// Mock user data for testing
const mockContextData = {
  userStats: {
    name: 'Test User',
    alias: 'testuser',
    institution: 'Test University',
    isAdmin: false,
    isTeacher: false,
    solvedChallenges: 5,
    totalPoints: 1250
  },
  institutionStats: {
    name: 'Test University',
    totalUsers: 150,
    totalChallenges: 25,
    totalLessons: 10
  },
  popularChallenges: [
    { statement: 'Write a query to find all students with GPA above 3.5', solves: 45 },
    { statement: 'Create a JOIN query for student-course enrollment', solves: 32 }
  ],
  recentLessons: [
    { title: 'Introduction to SQL', description: 'Learn basic SQL syntax and commands' },
    { title: 'Database Normalization', description: 'Understanding data normalization principles' }
  ]
};

// Test questions
const testQuestions = [
  "What's my progress?",
  "Help me write a SQL query to find students with high scores",
  "Explain the difference between INNER JOIN and LEFT JOIN",
  "What are the most popular challenges?",
  "How do I optimize my SQL queries?"
];

async function testChatbot() {
  console.log('🤖 Testing Query Quest Chatbot...\n');

  // Test configuration
  console.log('📋 Testing Chat Configuration...');
  console.log(`- OpenAI Model: ${CHAT_CONFIG.OPENAI_MODEL}`);
  console.log(`- Max Tokens: ${CHAT_CONFIG.OPENAI_MAX_TOKENS}`);
  console.log(`- Temperature: ${CHAT_CONFIG.OPENAI_TEMPERATURE}`);
  console.log(`- Max History: ${CHAT_CONFIG.MAX_HISTORY_LENGTH}`);
  console.log(`- API Key: ${CHAT_CONFIG.OPENAI_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
  console.log('');

  // Test initialization
  console.log('📋 Testing OpenAI service initialization...');
  if (!openaiService.initialize()) {
    console.error('❌ OpenAI service initialization failed. Please check your API key.');
    console.log('\n🔧 Configuration Issues:');
    console.log('- Check if OPENAI_API_KEY is set in your environment');
    console.log('- Verify the API key is valid and has sufficient credits');
    console.log('- Ensure the model specified is available in your OpenAI account');
    process.exit(1);
  }
  console.log('✅ OpenAI service initialized successfully!\n');

  // Test each question
  for (let i = 0; i < testQuestions.length; i++) {
    const question = testQuestions[i];
    console.log(`❓ Question ${i + 1}: "${question}"`);

    try {
      const response = await openaiService.generateResponse(
        question,
        [], // Empty conversation history for testing
        mockContextData
      );

      console.log(`✅ Response: "${response.substring(0, 100)}${response.length > 100 ? '...' : ''}"\n`);
    } catch (error) {
      console.error(`❌ Error: ${error.message}\n`);
    }

    // Small delay between requests to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('🎉 Chatbot testing completed!');
  console.log('\n💡 Tips:');
  console.log('- If you see API errors, check your OpenAI API key');
  console.log('- Adjust the system prompt in config/chat-config.js for different behavior');
  console.log('- Modify temperature and token settings for different response styles');
  console.log('\n🔧 Configuration File: src/config/chat-config.js');
  console.log('- Edit this file to customize the chatbot behavior');
  console.log('- Update system prompts, model settings, and conversation limits');
  console.log('- Restart the application after making configuration changes');
}

testChatbot().catch(console.error);
