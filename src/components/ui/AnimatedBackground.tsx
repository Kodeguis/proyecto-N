import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedItem {
  id: number;
  type: 'heart' | 'panda' | 'star';
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export const AnimatedBackground: React.FC = () => {
  const [items, setItems] = useState<AnimatedItem[]>([]);

  useEffect(() => {
    const generateItem = (): AnimatedItem => {
      const types: ('heart' | 'panda' | 'star')[] = ['heart', 'panda', 'star'];
      return {
        id: Math.random(),
        type: types[Math.floor(Math.random() * types.length)],
        x: Math.random() * 100,
        y: -10,
        size: Math.random() * 30 + 20,
        duration: Math.random() * 10 + 15,
        delay: Math.random() * 5,
      };
    };

    const interval = setInterval(() => {
      setItems(prev => [...prev, generateItem()]);
    }, 1000);

    // Generar items iniciales
    const initialItems = Array.from({ length: 5 }, generateItem);
    setItems(initialItems);

    return () => clearInterval(interval);
  }, []);

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const renderItem = (item: AnimatedItem) => {
    const baseVariants = {
      initial: { 
        x: `${item.x}vw`, 
        y: `${item.y}vh`,
        opacity: 0,
        scale: 0
      },
      animate: { 
        x: `${item.x + (Math.random() * 20 - 10)}vw`, 
        y: '110vh',
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0.8],
        rotate: Math.random() * 360
      },
      exit: { 
        opacity: 0,
        scale: 0
      }
    };

    const commonProps = {
      key: item.id,
      className: "pointer-events-none absolute z-0",
      initial: "initial",
      animate: "animate",
      exit: "exit",
      variants: baseVariants,
      transition: {
        duration: item.duration,
        delay: item.delay,
        ease: "linear" as const,
        opacity: { times: [0, 0.1, 0.9, 1] },
        scale: { times: [0, 0.1, 0.9, 1] }
      },
      onAnimationComplete: () => removeItem(item.id)
    };

    switch (item.type) {
      case 'heart':
        return (
          <motion.div {...commonProps}>
            <div 
              className="text-pink-300 opacity-60"
              style={{ fontSize: `${item.size}px` }}
            >
              💖
            </div>
          </motion.div>
        );
      case 'panda':
        return (
          <motion.div {...commonProps}>
            <div 
              className="text-white opacity-40"
              style={{ fontSize: `${item.size}px` }}
            >
              🐼
            </div>
          </motion.div>
        );
      case 'star':
        return (
          <motion.div {...commonProps}>
            <div 
              className="text-yellow-300 opacity-50"
              style={{ fontSize: `${item.size}px` }}
            >
              ⭐
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <AnimatePresence>
        {items.map(item => renderItem(item))}
      </AnimatePresence>
    </div>
  );
};