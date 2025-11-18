import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
}

const colors = ['#ff6699', '#ffb6d9', '#ffd700', '#ff85b8', '#ffd6e8', '#ffffff'];

export const Confetti = ({ isActive }: { isActive: boolean }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const newPieces: ConfettiPiece[] = [];
      for (let i = 0; i < 100; i++) {
        newPieces.push({
          id: Date.now() + i,
          x: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 2,
          duration: Math.random() * 2 + 2,
          size: Math.random() * 8 + 4,
        });
      }
      setPieces(newPieces);

      // Clean up after animation
      const timeout = setTimeout(() => {
        setPieces([]);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [isActive]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {pieces.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute rounded-full"
            style={{
              backgroundColor: piece.color,
              width: piece.size,
              height: piece.size,
            }}
            initial={{ 
              y: -20,
              x: `${piece.x}%`,
              opacity: 1,
              rotate: 0
            }}
            animate={{ 
              y: window.innerHeight + 20,
              opacity: [1, 1, 0],
              rotate: Math.random() * 720 - 360
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: piece.duration,
              delay: piece.delay,
              ease: "linear",
              opacity: {
                times: [0, 0.8, 1]
              }
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};