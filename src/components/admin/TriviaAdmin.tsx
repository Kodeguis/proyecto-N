import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Heart, Trophy } from 'lucide-react';
import { useStore } from '../../stores/appStore';
import { RomanticButton } from '../ui/RomanticButton';
import { TriviaQuestion } from '../pages/Trivia';

export const TriviaAdmin: React.FC = () => {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<TriviaQuestion | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const setCurrentPage = useStore((state) => state.setCurrentPage);

  useEffect(() => {
    // Cargar preguntas desde localStorage o usar las predeterminadas
    const savedQuestions = localStorage.getItem('triviaQuestions');
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    } else {
      // Cargar preguntas predeterminadas si no hay guardadas
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
        }
      ];
      setQuestions(defaultQuestions);
    }
  }, []);

  const saveQuestions = (newQuestions: TriviaQuestion[]) => {
    setQuestions(newQuestions);
    localStorage.setItem('triviaQuestions', JSON.stringify(newQuestions));
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingQuestion({
      id: Date.now(),
      question: '',
      options: ['', '', '', ''],
      correct: 0,
      points: 10,
      difficulty: 'easy'
    });
  };

  const handleEdit = (question: TriviaQuestion) => {
    setEditingQuestion({ ...question });
    setIsAddingNew(false);
  };

  const handleSave = () => {
    if (!editingQuestion) return;

    if (editingQuestion.question.trim() === '' || 
        editingQuestion.options.some(opt => opt.trim() === '')) {
      alert('Por favor completa todos los campos');
      return;
    }

    let newQuestions;
    if (isAddingNew) {
      newQuestions = [...questions, editingQuestion];
    } else {
      newQuestions = questions.map(q => 
        q.id === editingQuestion.id ? editingQuestion : q
      );
    }

    saveQuestions(newQuestions);
    setEditingQuestion(null);
    setIsAddingNew(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta pregunta?')) {
      const newQuestions = questions.filter(q => q.id !== id);
      saveQuestions(newQuestions);
    }
  };

  const handleCancel = () => {
    setEditingQuestion(null);
    setIsAddingNew(false);
  };

  const handleGoBack = () => {
    setCurrentPage('admin');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-rose-500 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-20 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <RomanticButton
            onClick={handleGoBack}
            variant="secondary"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Admin
          </RomanticButton>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white text-shadow-lg flex items-center">
              <Trophy className="w-6 h-6 mr-2" />
              Administrar Trivia
            </h1>
            <p className="text-white/80 text-sm">
              {questions.length} preguntas configuradas
            </p>
          </div>
          <RomanticButton onClick={handleAddNew} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Pregunta
          </RomanticButton>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-romantic">
          {editingQuestion ? (
            /* Formulario de edición */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-800">
                {isAddingNew ? 'Nueva Pregunta' : 'Editar Pregunta'}
              </h2>

              {/* Pregunta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pregunta
                </label>
                <textarea
                  value={editingQuestion.question}
                  onChange={(e) => setEditingQuestion({
                    ...editingQuestion,
                    question: e.target.value
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-romantic-pink focus:border-transparent"
                  rows={2}
                  placeholder="Escribe la pregunta aquí..."
                />
              </div>

              {/* Opciones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opciones de respuesta
                </label>
                {editingQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={editingQuestion.correct === index}
                      onChange={() => setEditingQuestion({
                        ...editingQuestion,
                        correct: index
                      })}
                      className="mr-3 text-romantic-pink"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...editingQuestion.options];
                        newOptions[index] = e.target.value;
                        setEditingQuestion({
                          ...editingQuestion,
                          options: newOptions
                        });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-romantic-pink focus:border-transparent"
                      placeholder={`Opción ${index + 1}`}
                    />
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-1">
                  Marca el círculo de la respuesta correcta
                </p>
              </div>

              {/* Puntos y Dificultad */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Puntos
                  </label>
                  <input
                    type="number"
                    value={editingQuestion.points}
                    onChange={(e) => setEditingQuestion({
                      ...editingQuestion,
                      points: parseInt(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-romantic-pink focus:border-transparent"
                    min="1"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dificultad
                  </label>
                  <select
                    value={editingQuestion.difficulty}
                    onChange={(e) => setEditingQuestion({
                      ...editingQuestion,
                      difficulty: e.target.value as 'easy' | 'medium' | 'hard'
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-romantic-pink focus:border-transparent"
                  >
                    <option value="easy">Fácil</option>
                    <option value="medium">Media</option>
                    <option value="hard">Difícil</option>
                  </select>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 justify-end">
                <RomanticButton onClick={handleCancel} variant="secondary">
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </RomanticButton>
                <RomanticButton onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </RomanticButton>
              </div>
            </motion.div>
          ) : (
            /* Lista de preguntas */
            <div className="space-y-4">
              {questions.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    No hay preguntas configuradas
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Comienza agregando tu primera pregunta de trivia
                  </p>
                  <RomanticButton onClick={handleAddNew}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Pregunta
                  </RomanticButton>
                </div>
              ) : (
                questions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-2xl p-4 border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="bg-romantic-pink text-white text-xs px-2 py-1 rounded-full mr-2">
                            #{index + 1}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty === 'easy' ? 'Fácil' : 
                             question.difficulty === 'medium' ? 'Media' : 'Difícil'}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {question.points} pts
                          </span>
                        </div>
                        <h3 className="font-medium text-gray-800 mb-2">
                          {question.question}
                        </h3>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Respuesta correcta:</span> {question.options[question.correct]}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Opciones: {question.options.join(' • ')}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <RomanticButton
                          onClick={() => handleEdit(question)}
                          variant="secondary"
                          size="sm"
                        >
                          <Edit className="w-4 h-4" />
                        </RomanticButton>
                        <RomanticButton
                          onClick={() => handleDelete(question.id)}
                          variant="danger"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </RomanticButton>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};