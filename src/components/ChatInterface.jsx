'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

function Message({ message, isTyping = false }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      "flex gap-2 md:gap-3 mb-3 md:mb-4",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <div className={cn(
        "flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-sm",
        isUser ? "bg-gradient-to-br from-blue-500 to-blue-600" : "bg-gray-400"
      )}>
        {isUser ? (
          <User className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
        ) : (
          <Bot className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
        )}
      </div>
      <div className={cn(
        "flex-1 max-w-[85%] md:max-w-[80%]",
        isUser ? "text-right" : "text-left"
      )}>
        <div className={cn(
          "inline-block px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl text-sm shadow-sm",
          isUser
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
            : "bg-white text-gray-800 rounded-bl-md border border-gray-200"
        )}>
          {isTyping ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
              <span className="text-xs md:text-sm">Typing...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-xs md:text-sm leading-relaxed">{message.content}</div>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1 px-1 opacity-75">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

export default function ChatInterface({
  isOpen,
  messages,
  onSendMessage,
  isLoading,
  onToggle
}) {
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Mobile viewport handling
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when chat is open
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      // Restore body scroll when chat is closed
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    // Only close if clicking directly on the backdrop (not on the chat content)
    if (e.target === e.currentTarget && onToggle) {
      onToggle();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={handleBackdropClick}
      />

      {/* Chat Content */}
      <Card className="fixed bottom-4 right-4 left-4 md:bottom-20 md:right-6 md:left-auto md:w-[480px] h-[calc(100vh-120px)] md:h-[650px] max-h-[650px] shadow-2xl z-50 flex flex-col bg-white border border-gray-200/60 rounded-xl overflow-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100/50">
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <Bot className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-xs md:text-sm text-gray-900 truncate">Query Quest Assistant</h3>
              <p className="text-xs text-gray-500 hidden md:block">Online • Ready to help</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-7 w-7 md:h-8 md:w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg flex-shrink-0 ml-2"
          >
            <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-3 md:p-4 bg-gray-50/30">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 md:px-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg mb-3 md:mb-4">
                <Bot className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Welcome to Query Quest Assistant</h4>
              <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6 max-w-sm">
                I&apos;m here to help you with SQL queries, database concepts, and your learning journey. Ask me anything!
              </p>
              <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
                <div className="p-2 md:p-3 bg-white border border-gray-200 rounded-lg text-xs md:text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                  💡 &ldquo;How do I write a JOIN query?&rdquo;
                </div>
                <div className="p-2 md:p-3 bg-white border border-gray-200 rounded-lg text-xs md:text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                  📊 &ldquo;What&apos;s my progress this week?&rdquo;
                </div>
                <div className="p-2 md:p-3 bg-white border border-gray-200 rounded-lg text-xs md:text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                  🎯 &ldquo;Show me popular challenges&rdquo;
                </div>
              </div>
            </div>
          ) : (
          messages.map((message, index) => (
            <Message
              key={message.id || index}
              message={message}
              isTyping={isLoading && index === messages.length - 1 && message.role === 'assistant'}
            />
          ))
        )}
      </ScrollArea>

        {/* Input */}
        <div className="p-3 md:p-4 border-t border-gray-100 bg-white">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-end gap-2 md:gap-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="pr-10 md:pr-12 py-2.5 md:py-3 bg-gray-50 border-gray-200 text-gray-900 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg md:rounded-xl resize-none min-h-[42px] md:min-h-[48px] focus:outline-none"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1.5 md:right-2 top-1/2 -translate-y-1/2 h-7 w-7 md:h-8 md:w-8 bg-blue-600 hover:bg-blue-700 rounded-md md:rounded-lg shadow-sm"
                >
                  {isLoading ? (
                    <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                  ) : (
                    <Send className="h-3 w-3 md:h-4 md:w-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>
          <p className="text-xs text-gray-400 mt-2 text-center hidden md:block">
            Press Enter to send • AI responses may not always be accurate
          </p>
        </div>
      </Card>
    </>
  );
}
