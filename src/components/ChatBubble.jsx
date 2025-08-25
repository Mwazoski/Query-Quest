'use client';

import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ChatBubble({ isOpen, onToggle, hasUnreadMessages }) {
  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
      <Button
        onClick={onToggle}
        size="icon"
        className={cn(
          "h-12 w-12 md:h-14 md:w-14 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl",
          "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
          hasUnreadMessages && "animate-bounce"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
        {hasUnreadMessages && !isOpen && (
          <div className="absolute -top-1 -right-1 h-3.5 w-3.5 md:h-4 md:w-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">!</span>
          </div>
        )}
      </Button>
    </div>
  );
}
