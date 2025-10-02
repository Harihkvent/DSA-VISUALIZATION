import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, SkipForward } from 'lucide-react';

const ReverseVowelsVisualization = () => {
  const [inputString, setInputString] = useState("hello");
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState([]);

  const vowels = "aeiouAEIOU";

  const generateSteps = (s) => {
    const allSteps = [];
    const chars = s.split('');
    let left = 0;
    let right = s.length - 1;

    allSteps.push({
      chars: [...chars],
      left,
      right,
      description: "Initial state",
      leftScanning: false,
      rightScanning: false,
      swapping: false
    });

    while (left < right) {
      while (left < right && !vowels.includes(chars[left])) {
        allSteps.push({
          chars: [...chars],
          left,
          right,
          description: `Left pointer scanning: '${chars[left]}' is not a vowel`,
          leftScanning: true,
          rightScanning: false,
          swapping: false
        });
        left++;
      }

      while (left < right && !vowels.includes(chars[right])) {
        allSteps.push({
          chars: [...chars],
          left,
          right,
          description: `Right pointer scanning: '${chars[right]}' is not a vowel`,
          leftScanning: false,
          rightScanning: true,
          swapping: false
        });
        right--;
      }

      if (left < right) {
        allSteps.push({
          chars: [...chars],
          left,
          right,
          description: `Found vowels: '${chars[left]}' and '${chars[right]}' - Swapping!`,
          leftScanning: false,
          rightScanning: false,
          swapping: true
        });

        [chars[left], chars[right]] = [chars[right], chars[left]];

        allSteps.push({
          chars: [...chars],
          left,
          right,
          description: `Swapped: '${chars[right]}' ↔ '${chars[left]}'`,
          leftScanning: false,
          rightScanning: false,
          swapping: false
        });

        left++;
        right--;
      }
    }

    allSteps.push({
      chars: [...chars],
      left,
      right,
      description: "Complete! All vowels reversed",
      leftScanning: false,
      rightScanning: false,
      swapping: false,
      complete: true
    });

    return allSteps;
  };

  useEffect(() => {
    setSteps(generateSteps(inputString));
    setStep(0);
  }, [inputString]);

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(step + 1), 800);
      return () => clearTimeout(timer);
    } else if (step >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, step, steps.length]);

  const currentStep = steps[step] || steps[0];

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z]/g, '');
    if (value.length <= 20) {
      setInputString(value);
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-auto">
      <div className="w-full max-w-4xl px-6 py-8 mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 text-white">
            Reverse Vowels Algorithm
          </h1>
          <p className="text-blue-200 text-lg">Two-pointer approach to swap vowels</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl mb-6">
          <label className="block text-sm font-semibold text-white mb-3">
            Input String (letters only):
          </label>
          <input
            type="text"
            value={inputString}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/90 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 text-lg"
            placeholder="Enter a string..."
          />
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl mb-6">
          <div className="flex flex-wrap justify-center items-center gap-3 mb-8">
            {currentStep && currentStep.chars.map((char, idx) => {
              const isLeft = idx === currentStep.left;
              const isRight = idx === currentStep.right;
              const isVowel = vowels.includes(char);
              
              let bgColor = 'bg-slate-700';
              if (currentStep.complete) {
                bgColor = isVowel ? 'bg-green-500' : 'bg-slate-700';
              } else if (currentStep.swapping && (isLeft || isRight)) {
                bgColor = 'bg-yellow-400';
              } else if (isLeft && currentStep.leftScanning) {
                bgColor = 'bg-blue-400';
              } else if (isRight && currentStep.rightScanning) {
                bgColor = 'bg-purple-400';
              } else if (isLeft || isRight) {
                bgColor = 'bg-indigo-400';
              }

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`w-14 h-14 flex items-center justify-center text-2xl font-bold rounded-xl ${bgColor} transition-all duration-300 border-2 ${
                      (isLeft || isRight) ? 'border-white shadow-lg scale-110' : 'border-white/30'
                    } text-white`}
                  >
                    {char}
                  </div>
                  <div className="text-sm mt-2 h-5 font-bold">
                    {isLeft && <span className="text-blue-300">L</span>}
                    {isRight && <span className="text-purple-300">R</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mb-6 min-h-16 flex items-center justify-center px-4">
            <p className="text-xl font-semibold text-white">
              {currentStep ? currentStep.description : ''}
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => {
                setStep(0);
                setIsPlaying(false);
              }}
              className="px-8 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all flex items-center gap-2 text-base font-semibold shadow-lg"
            >
              <RotateCcw size={20} />
              Reset
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={step >= steps.length - 1}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:bg-slate-600 disabled:opacity-50 flex items-center gap-2 text-base font-semibold shadow-lg"
            >
              <Play size={20} />
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={() => setStep(Math.min(step + 1, steps.length - 1))}
              disabled={step >= steps.length - 1}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:bg-slate-600 disabled:opacity-50 flex items-center gap-2 text-base font-semibold shadow-lg"
            >
              <SkipForward size={20} />
              Next
            </button>
          </div>

          <div className="text-center text-white/80 font-medium">
            Step {step + 1} of {steps.length}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl">
          <h3 className="font-bold text-xl mb-4 text-white">Legend:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-400 rounded-lg border-2 border-white shadow-md"></div>
              <span className="text-white font-medium">Left pointer scanning</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-400 rounded-lg border-2 border-white shadow-md"></div>
              <span className="text-white font-medium">Right pointer scanning</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg border-2 border-white shadow-md"></div>
              <span className="text-white font-medium">Swapping vowels</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg border-2 border-white shadow-md"></div>
              <span className="text-white font-medium">Final vowel position</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReverseVowelsVisualization;