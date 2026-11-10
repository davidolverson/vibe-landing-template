'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { CHAT_MESSAGES } from '@/lib/constants';

const REACTION_EMOJIS: Record<string, string> = {
  angry: '\u{1F621}',
  hundred: '\u{1F4AF}',
  weary: '\u{1F629}',
  fire: '\u{1F525}',
  skull: '\u{1F480}',
};

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block w-2 h-2 rounded-full bg-gold/70"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function AgentAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0">
      {initials}
    </div>
  );
}

function VibeAvatar() {
  return (
    <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-xs font-black text-dark shrink-0 gold-glow">
      V
    </div>
  );
}

type ChatMessageType = (typeof CHAT_MESSAGES)[number];

function ChatBubble({
  msg,
  index,
}: {
  msg: ChatMessageType;
  index: number;
}) {
  const isVibe = msg.sender === 'VIBE';
  const [showTyping, setShowTyping] = useState(isVibe);
  const [showMessage, setShowMessage] = useState(!isVibe);

  useEffect(() => {
    if (isVibe) {
      const timer = setTimeout(() => {
        setShowTyping(false);
        setShowMessage(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isVibe]);

  const reactions = 'reactions' in msg ? (msg as ChatMessageType & { reactions: Record<string, number> }).reactions : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.6, ease: 'easeOut' }}
      className={`flex gap-3 ${isVibe ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {isVibe ? <VibeAvatar /> : <AgentAvatar name={msg.sender} />}

      <div className={`max-w-[75%] ${isVibe ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isVibe && (
          <div className="mb-1 ml-1">
            <span className="text-sm font-semibold text-gray-800">{msg.sender}</span>
            {msg.role && (
              <span className="text-xs text-gray-500 ml-2">{msg.role}</span>
            )}
          </div>
        )}
        {isVibe && (
          <div className="mb-1 mr-1 text-right">
            <span className="text-sm font-bold text-gold-dark">VIBE</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {showTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl bg-gold/15 border border-gold/30"
            >
              <TypingIndicator />
            </motion.div>
          )}
          {showMessage && (
            <motion.div
              key="message"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                isVibe
                  ? 'bg-gold/15 border border-gold/30 text-gray-800'
                  : 'bg-gray-100 border border-gray-200 text-gray-800'
              }`}
            >
              {msg.message}
            </motion.div>
          )}
        </AnimatePresence>

        {reactions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.6 + 0.5 }}
            className="flex gap-2 mt-1.5 ml-1"
          >
            {Object.entries(reactions).map(([key, count]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 text-xs bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5 text-gray-600"
              >
                <span>{REACTION_EMOJIS[key] || key}</span>
                <span>{count}</span>
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function ChatSection() {
  const { ref, inView } = useInView(0.15);
  const [visibleCount, setVisibleCount] = useState(0);

  const revealNext = useCallback(() => {
    setVisibleCount((prev) => {
      if (prev < CHAT_MESSAGES.length) return prev + 1;
      return prev;
    });
  }, []);

  useEffect(() => {
    if (!inView) return;

    // Start revealing messages one by one
    const intervals: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < CHAT_MESSAGES.length; i++) {
      const timer = setTimeout(() => {
        revealNext();
      }, i * 900); // stagger by 900ms each
      intervals.push(timer);
    }

    return () => intervals.forEach(clearTimeout);
  }, [inView, revealNext]);

  return (
    <section
      ref={ref}
      className="section-light py-20 md:py-28 px-4"
      id="chat"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            We didn&apos;t make this up.{' '}
            <span className="text-gold-dark">You said it.</span>
          </h2>
          <p className="text-gray-500 text-lg">Real conversations. Real pain. Real solution.</p>
        </motion.div>

        <div className="space-y-5">
          {CHAT_MESSAGES.slice(0, visibleCount).map((msg, i) => (
            <ChatBubble key={i} msg={msg} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
