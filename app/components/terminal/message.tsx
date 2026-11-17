'use client';

import { memo } from 'react';

type MessageProps = {
  text: string;
  sender: 'user' | 'assistant';
};

export const Message = memo(({ text, sender }: MessageProps) => {
  return (
    <div style={{ contentVisibility: 'auto' }}>
      {sender === 'user' ? (
        <div className="flex items-start gap-2">
          <span className="text-accent">❯</span>
          <span className="text-foreground">{text}</span>
        </div>
      ) : (
        <div
          className="text-muted-foreground font-mono"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {text}
        </div>
      )}
    </div>
  );
});

Message.displayName = 'Message';
