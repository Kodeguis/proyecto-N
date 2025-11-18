import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingHeart {
  id: number;
  x: number;
  emoji: string;
  duration: number;
  delay: number;
}

const heartEmojis = ['💖', '💗', '💕', '💓', '💝', '💞'];

export const FloatingHearts = () => {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart: FloatingHeart = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
        duration: Math.random() * 5 + 8,
        delay: Math.random() * 2,
      };
      
      setHearts(prev => [...prev, newHeart]);
      
      // Remove heart after animation
      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== newHeart.id));
      }, (newHeart.duration + newHeart.delay) * 1000);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute text-2xl"
            initial={{ 
              y: window.innerHeight + 50,
              x: `${heart.x}%`,
              opacity: 0,
              rotate: 0
            }}
            animate={{ 
              y: -100,
              opacity: [0, 0.6, 0.6, 0],
              rotate: 360
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              ease: "linear",
              opacity: {
                times: [0, 0.1, 0.9, 1]
              }
            }}
          >
            {heart.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};