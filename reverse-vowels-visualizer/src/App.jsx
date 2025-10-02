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
      // Move left pointer to find vowel
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

      // Move right pointer to find vowel
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

        // Swap
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
    <div className="w-full max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-2 text-indigo-900">
        Reverse Vowels Algorithm
      </h1>
      <p className="text-center text-gray-600 mb-6">Two-pointer approach to swap vowels</p>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Input String (letters only):
        </label>
        <input
          type="text"
          value={inputString}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500"
          placeholder="Enter a string..."
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-center items-center gap-2 mb-8">
          {currentStep && currentStep.chars.map((char, idx) => {
            const isLeft = idx === currentStep.left;
            const isRight = idx === currentStep.right;
            const isVowel = vowels.includes(char);
            
            let bgColor = 'bg-gray-100';
            if (currentStep.complete) {
              bgColor = isVowel ? 'bg-green-200' : 'bg-gray-100';
            } else if (currentStep.swapping && (isLeft || isRight)) {
              bgColor = 'bg-yellow-300';
            } else if (isLeft && currentStep.leftScanning) {
              bgColor = 'bg-blue-300';
            } else if (isRight && currentStep.rightScanning) {
              bgColor = 'bg-purple-300';
            } else if (isLeft || isRight) {
              bgColor = 'bg-indigo-200';
            }

            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 flex items-center justify-center text-xl font-bold rounded-lg ${bgColor} transition-all duration-300 border-2 ${
                    (isLeft || isRight) ? 'border-indigo-600 scale-110' : 'border-gray-300'
                  }`}
                >
                  {char}
                </div>
                <div className="text-xs mt-1 h-4 font-semibold">
                  {isLeft && <span className="text-blue-600">L</span>}
                  {isRight && <span className="text-purple-600">R</span>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mb-4 h-12 flex items-center justify-center">
          <p className="text-lg font-medium text-gray-700">
            {currentStep ? currentStep.description : ''}
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setStep(0);
              setIsPlaying(false);
            }}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <RotateCcw size={18} />
            Reset
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={step >= steps.length - 1}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 flex items-center gap-2"
          >
            <Play size={18} />
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={() => setStep(Math.min(step + 1, steps.length - 1))}
            disabled={step >= steps.length - 1}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 flex items-center gap-2"
          >
            <SkipForward size={18} />
            Next
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          Step {step + 1} of {steps.length}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="font-bold text-lg mb-3 text-indigo-900">Legend:</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-300 rounded border-2 border-indigo-600"></div>
            <span>Left pointer scanning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-300 rounded border-2 border-indigo-600"></div>
            <span>Right pointer scanning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-300 rounded border-2 border-indigo-600"></div>
            <span>Swapping vowels</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-200 rounded border-2 border-gray-300"></div>
            <span>Final vowel position</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReverseVowelsVisualization;

