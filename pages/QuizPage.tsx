import { useState, useMemo } from 'react';
import { Quiz, Question } from '../types';
import { Card } from '../components/Card';
import { PointsIcon } from '../components/icons/PointsIcon';
import { TrophyIcon } from '../components/icons/TrophyIcon';

interface QuizPageProps {
  quizzes: Quiz[];
  onCompleteQuiz: (quizId: string, score: number, totalQuestions: number) => void;
}

type QuizState = 'selection' | 'taking' | 'results';

export const QuizPage = ({ quizzes, onCompleteQuiz }: QuizPageProps) => {
  const [quizState, setQuizState] = useState<QuizState>('selection');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);

  const subjects = useMemo(() => [...new Set(quizzes.map(q => q.subject))], [quizzes]);
  const chapters = useMemo(() => {
    if (!selectedSubject) return [];
    return [...new Set(quizzes.filter(q => q.subject === selectedSubject).map(q => q.chapter))];
  }, [quizzes, selectedSubject]);

  const handleStartQuiz = () => {
    const quiz = quizzes.find(q => q.subject === selectedSubject && q.chapter === selectedChapter);
    if (quiz) {
      setActiveQuiz(quiz);
      setQuizState('taking');
      setCurrentQuestionIndex(0);
      setAnswers({});
    }
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;
    let correctAnswers = 0;
    activeQuiz.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    onCompleteQuiz(activeQuiz.id, correctAnswers, activeQuiz.questions.length);
    setQuizState('results');
  };

  const resetQuiz = () => {
    setQuizState('selection');
    setSelectedSubject('');
    setSelectedChapter('');
    setActiveQuiz(null);
  };

  const currentQuestion: Question | undefined = activeQuiz?.questions[currentQuestionIndex];

  if (quizState === 'taking' && activeQuiz && currentQuestion) {
    const progress = ((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100;
    return (
      <Card className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">{activeQuiz.subject}: {activeQuiz.chapter}</h2>
        <div className="w-full bg-slate-200 rounded-full h-2.5 mb-6">
          <div className="bg-[var(--color-primary)] h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
        
        <p className="text-lg font-semibold mb-4">{currentQuestionIndex + 1}. {currentQuestion.text}</p>
        
        <div className="space-y-3">
          {currentQuestion.options.map(option => (
            <label key={option} className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors ${answers[currentQuestion.id] === option ? 'border-[var(--color-primary)] bg-indigo-100' : 'border-slate-300'}`}>
              <input
                type="radio"
                name={currentQuestion.id}
                value={option}
                checked={answers[currentQuestion.id] === option}
                onChange={() => handleAnswerSelect(currentQuestion.id, option)}
                className="hidden"
              />
              {option}
            </label>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button 
            onClick={() => setCurrentQuestionIndex(p => p - 1)}
            disabled={currentQuestionIndex === 0}
            className="font-semibold py-2 px-6 rounded-lg bg-slate-200 disabled:opacity-50"
          >
            Previous
          </button>
          {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
            <button 
              onClick={() => setCurrentQuestionIndex(p => p + 1)}
              className="font-semibold py-2 px-6 rounded-lg text-white bg-[var(--color-primary)]"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              className="font-semibold py-2 px-6 rounded-lg text-white bg-[var(--color-accent-secondary)]"
              style={{color: 'var(--color-text-main)'}}
            >
              Submit Quiz
            </button>
          )}
        </div>
      </Card>
    );
  }

  if (quizState === 'results' && activeQuiz) {
    const pointsEarned = score * activeQuiz.pointsPerQuestion;
    return (
        <Card className="max-w-2xl mx-auto text-center animate-scale-in">
            <TrophyIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-primary)' }}/>
            <h2 className="text-3xl font-bold">Quiz Complete!</h2>
            <p className="text-lg mt-2" style={{color: 'rgba(var(--color-text-main-rgb), 0.7)'}}>You scored:</p>
            <p className="text-6xl font-bold my-4" style={{ color: 'var(--color-primary)' }}>{score} <span className="text-3xl font-semibold">/ {activeQuiz.questions.length}</span></p>
            <div className="flex items-center justify-center gap-2 font-bold text-2xl mb-8 p-3 rounded-lg" style={{backgroundColor: 'rgba(var(--color-accent-secondary-rgb), 0.2)', color: 'var(--color-accent-secondary)'}}>
                <PointsIcon className="w-8 h-8"/>
                <span>+{pointsEarned} Points Earned!</span>
            </div>
            <button
                onClick={resetQuiz}
                className="w-full font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-transform active:scale-95"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-text)' }}
            >
                Take Another Quiz
            </button>
        </Card>
    );
  }

  return (
    <div>
        <h1 className="text-3xl sm:text-4xl font-bold">Test Your Knowledge</h1>
        <p className="text-lg mt-1 mb-6" style={{color: 'rgba(var(--color-text-main-rgb), 0.7)'}}>Select a subject and chapter to start a quiz.</p>
        <Card className="max-w-lg mx-auto">
            <div className="space-y-4">
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                    <select id="subject" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300">
                        <option value="">Select a Subject</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="chapter" className="block text-sm font-medium mb-1">Chapter</label>
                    <select id="chapter" value={selectedChapter} onChange={e => setSelectedChapter(e.target.value)} disabled={!selectedSubject} className="w-full p-3 rounded-lg border border-slate-300 disabled:bg-slate-100">
                        <option value="">Select a Chapter</option>
                        {chapters.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <button
                    onClick={handleStartQuiz}
                    disabled={!selectedSubject || !selectedChapter}
                    className="w-full font-semibold py-3 px-4 rounded-lg text-white disabled:bg-slate-400"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                >
                    Start Quiz
                </button>
            </div>
        </Card>
    </div>
  );
};