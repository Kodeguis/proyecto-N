import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Trophy, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { useStore } from '../../stores/appStoreDB';
import { RomanticButton } from '../ui/RomanticButton';
import { AnimatedBackground } from '../ui/AnimatedBackground';
import { FloatingHearts } from '../ui/FloatingHearts';

export interface TriviaQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const defaultQuestions: TriviaQuestion[] = [
  {
    id: 1,
    question: "¿Cuál es mi comida favorita?",
    options: ["Pizza", "Hamburguesa", "Ceviche", "Pollo a la brasa"],
    correct: 2,
    points: 10,
    difficulty: 'easy'
  },
  {
    id: 2,
    question: "¿En qué mes nos conocimos?",
    options: ["Enero", "Febrero", "Marzo", "Abril"],
    correct: 1,
    points: 10,
    difficulty: 'easy'
  },
  {
    id: 3,
    question: "¿Cuál es mi deporte favorito?",
    options: ["Fútbol", "Básquet", "Vóley", "Natación"],
    correct: 1,
    points: 10,
    difficulty: 'easy'
  },
  {
    id: 4,
    question: "¿Qué película me gusta más?",
    options: ["Titanic", "The Notebook", "Avengers", "Interestelar"],
    correct: 3,
    points: 10,
    difficulty: 'medium'
  },
  {
    id: 5,
    question: "¿Cuál es mi color favorito?",
    options: ["Rojo", "Azul", "Rosa", "Negro"],
    correct: 2,
    points: 10,
    difficulty: 'medium'
  },
  {
    id: 6,
    question: "¿Qué me gusta hacer en mi tiempo libre?",
    options: ["Leer", "Videojuegos", "Dibujar", "Ver series"],
    correct: 1,
    points: 10,
    difficulty: 'medium'
  },
  {
    id: 7,
    question: "¿Cuál es mi mayor miedo?",
    options: ["Arañas", "Alturas", "Perderte", "Oscuridad"],
    correct: 2,
    points: 15,
    difficulty: 'hard'
  },
  {
    id: 8,
    question: "¿Qué es lo que más amo de ti?",
    options: ["Tu sonrisa", "Tus ojos", "Tu forma de ser", "Todo"],
    correct: 3,
    points: 15,
    difficulty: 'hard'
  },
  {
    id: 9,
    question: "¿Cuál es nuestro lugar especial?",
    options: ["El parque", "La playa", "El café", "Donde estemos juntos"],
    correct: 3,
    points: 15,
    difficulty: 'hard'
  },
  {
    id: 10,
    question: "¿Qué canción me recuerda a ti?",
    options: ["Perfect", "Thinking Out Loud", "All of Me", "Todas las anteriores"],
    correct: 3,
    points: 20,
    difficulty: 'hard'
  }
];

export const Trivia: React.FC = () => {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const userData = useStore((state) => state.userData);
  const addPoints = useStore((state) => state.addPoints);
  const setCurrentPage = useStore((state) => state.setCurrentPage);

  useEffect(() => {
    // Cargar preguntas desde localStorage o usar las predeterminadas
    const savedQuestions = localStorage.getItem('triviaQuestions');
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    } else {
      setQuestions(defaultQuestions);
    }
    
    // Verificar si el juego ya fue completado
    if (userData.triviaCompleted.length === defaultQuestions.length) {
      setGameCompleted(true);
    }
  }, [userData.triviaCompleted]);

  const handleAnswerSelect = async (answerIndex: number) => {
    if (selectedAnswer !== null) return; // Prevenir doble clic
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    const currentQuestion = questions[currentQuestionIndex];
    if (answerIndex === currentQuestion.correct) {
      setScore(score + 1);
      setTotalPoints(totalPoints + currentQuestion.points);
      await addPoints(currentQuestion.points);
    }
    
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      } else {
        setGameCompleted(true);
      }
    }, 2000);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTotalPoints(0);
    setGameCompleted(false);
    setShowExplanation(false);
  };

  const handleGoBack = () => {
    setCurrentPage('menu');
  };

  if (questions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (gameCompleted) {
    const percentage = (score / questions.length) * 100;
    let resultEmoji = '😢';
    let resultTitle = '¡Sigue intentando!';
    let resultMessage = 'La práctica hace al maestro. ¡Inténtalo de nuevo!';
    
    if (percentage >= 80) {
      resultEmoji = '🎉';
      resultTitle = '¡Excelente!';
      resultMessage = '¡Me conoces perfectamente! Eres mi alma gemela.';
    } else if (percentage >= 60) {
      resultEmoji = '💖';
      resultTitle = '¡Muy bien!';
      resultMessage = 'Me conoces bastante bien. ¡Sigue aprendiendo más sobre mí!';
    } else if (percentage >= 40) {
      resultEmoji = '💝';
      resultTitle = '¡Bien hecho!';
      resultMessage = 'Estás en el camino correcto. ¡Sigue conociéndome mejor!';
    }

    return (
      <div className="min-h-screen bg-romantic-gradient bg-[length:400%_400%] animate-gradient-shift relative overflow-hidden">
        <AnimatedBackground />
        <FloatingHearts />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-romantic text-center max-w-md w-full"
          >
            <div className="text-6xl mb-4">{resultEmoji}</div>
            <h2 className="text-3xl font-bold text-romantic-pink mb-4">
              {resultTitle}
            </h2>
            <div className="text-2xl font-bold text-gray-700 mb-2">
              Puntuación: {score}/{questions.length}
            </div>
            <div className="text-lg text-romantic-pink mb-4">
              ¡Ganaste {totalPoints} puntos! 🎉
            </div>
            <p className="text-gray-600 mb-6">{resultMessage}</p>
            
            <div className="flex gap-3 justify-center">
              <RomanticButton onClick={handleRestart} variant="secondary">
                <RotateCcw className="w-4 h-4 mr-2" />
                Jugar de nuevo
              </RomanticButton>
              <RomanticButton onClick={handleGoBack}>
                <Heart className="w-4 h-4 mr-2" />
                Volver al menú
              </RomanticButton>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-romantic-gradient bg-[length:400%_400%] animate-gradient-shift relative overflow-hidden">
      <AnimatedBackground />
      <FloatingHearts />
      
      {/* Header */}
      <div className="relative z-20 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <RomanticButton
            onClick={handleGoBack}
            variant="secondary"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Menú
          </RomanticButton>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white text-shadow-lg">
              ¿Cuánto me conoces? 💕
            </h1>
            <p className="text-white/80 text-sm">
              Pregunta {currentQuestionIndex + 1} de {questions.length}
            </p>
          </div>
          <div className="text-right">
            <div className="text-white font-bold text-shadow">{score} ✅</div>
            <div className="text-white/80 text-sm">{totalPoints} pts</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 mb-6">
        <div className="bg-white/20 backdrop-blur-sm rounded-full h-3 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-pink-400 to-rose-500 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-romantic"
            >
              {/* Question Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-br from-purple-400 to-pink-500 p-3 rounded-full text-white">
                    <Trophy className="w-8 h-8" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-romantic-pink mb-2">
                  {currentQuestion.question}
                </h2>
                <div className="text-sm text-gray-500">
                  Dificultad: {currentQuestion.difficulty} • {currentQuestion.points} puntos
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQuestion.correct;
                  const showResult = selectedAnswer !== null;
                  
                  let buttonClass = 'w-full p-4 rounded-2xl text-left transition-all duration-300 border-2 ';
                  
                  if (!showResult) {
                    buttonClass += 'bg-gray-50 border-gray-200 hover:bg-pink-50 hover:border-romantic-pink';
                  } else if (isSelected && isCorrect) {
                    buttonClass += 'bg-green-100 border-green-400 text-green-800';
                  } else if (isSelected && !isCorrect) {
                    buttonClass += 'bg-red-100 border-red-400 text-red-800';
                  } else if (isCorrect) {
                    buttonClass += 'bg-green-50 border-green-300 text-green-700';
                  } else {
                    buttonClass += 'bg-gray-100 border-gray-300 text-gray-600';
                  }

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={selectedAnswer !== null}
                      className={buttonClass}
                      whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                      whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option}</span>
                        {showResult && (
                          <div>
                            {isSelected && isCorrect && <CheckCircle className="w-6 h-6 text-green-600" />}
                            {isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-600" />}
                            {!isSelected && isCorrect && <CheckCircle className="w-6 h-6 text-green-600" />}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4"
                >
                  <div className="flex items-center text-blue-800">
                    <Heart className="w-5 h-5 mr-2" />
                    <span className="font-medium">
                      {selectedAnswer === currentQuestion.correct
                        ? '¡Correcto! Me conoces muy bien 💕'
                        : `La respuesta correcta era: ${currentQuestion.options[currentQuestion.correct]}`
                      }
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Next Button */}
              {selectedAnswer !== null && currentQuestionIndex < questions.length - 1 && (
                <div className="text-center">
                  <RomanticButton onClick={handleNextQuestion}>
                    Siguiente pregunta →
                  </RomanticButton>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};