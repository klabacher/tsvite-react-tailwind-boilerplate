// Always import this css file first
import './App.css';
import { getThemeState, toggleTheme } from './Redux/Slice';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Import logos
import reactLogo from './assets/react.svg';
import reactRouterLogo from './assets/react-router.svg';
import reduxLogo from './assets/redux-toolkit-logo.svg';
import tailwindLogo from './assets/tailwind.svg';
import viteLogo from './assets/vite.svg';
import eslintLogo from './assets/eslint-old.svg';
import prettierLogo from './assets/prettier.svg';
import typescriptLogo from './assets/typescript.svg';

function App() {
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();

  // Get the current theme from Redux store
  const theme = useSelector(getThemeState);

  // useEffect showcase - auto increment counter
  const [autoCount, setAutoCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        setAutoCount((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  function handleToggleTheme() {
    dispatch(toggleTheme());
  }

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
          : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'
      }`}
    >
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={handleToggleTheme}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer ${
            isDark
              ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
              : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-5xl">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <h1
            className={`text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent ${
              isDark
                ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400'
                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
            }`}
          >
            React Boilerplate
          </h1>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            A modern, fast, and elegant starting point for your React projects
          </p>
        </header>

        {/* Main Stack Logos */}
        <section className="mb-20">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="group">
              <div
                className={`p-4 rounded-2xl transition-all duration-300 hover:scale-110 ${
                  isDark
                    ? 'bg-gray-800/50 hover:bg-gray-700/50'
                    : 'bg-white hover:bg-gray-50 shadow-lg'
                }`}
              >
                <img src={reactLogo} alt="React" className="w-14 h-14 animate-spin-slow" />
              </div>
            </a>

            <span className={`text-3xl font-light ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
              +
            </span>

            <a
              href="https://reactrouter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div
                className={`p-4 rounded-2xl transition-all duration-300 hover:scale-110 ${
                  isDark
                    ? 'bg-gray-800/50 hover:bg-gray-700/50'
                    : 'bg-white hover:bg-gray-50 shadow-lg'
                }`}
              >
                <img src={reactRouterLogo} alt="React Router" className="w-14 h-14" />
              </div>
            </a>

            <span className={`text-3xl font-light ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
              +
            </span>

            <a
              href="https://redux-toolkit.js.org"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div
                className={`p-4 rounded-2xl transition-all duration-300 hover:scale-110 ${
                  isDark
                    ? 'bg-gray-800/50 hover:bg-gray-700/50'
                    : 'bg-white hover:bg-gray-50 shadow-lg'
                }`}
              >
                <img src={reduxLogo} alt="Redux Toolkit" className="w-14 h-14" />
              </div>
            </a>

            <span className={`text-3xl font-light ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
              +
            </span>

            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div
                className={`p-4 rounded-2xl transition-all duration-300 hover:scale-110 ${
                  isDark
                    ? 'bg-gray-800/50 hover:bg-gray-700/50'
                    : 'bg-white hover:bg-gray-50 shadow-lg'
                }`}
              >
                <img src={tailwindLogo} alt="Tailwind CSS" className="w-14 h-14" />
              </div>
            </a>
          </div>
        </section>

        {/* Powered By Section */}
        <section className="mb-20 text-center">
          <p
            className={`text-sm uppercase tracking-widest mb-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
          >
            Powered by
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href="https://vitejs.dev"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                isDark
                  ? 'bg-gray-800/30 hover:bg-gray-700/50'
                  : 'bg-white/80 hover:bg-white shadow-md'
              }`}
            >
              <img src={viteLogo} alt="Vite" className="w-6 h-6" />
              <span className="font-medium">Vite</span>
            </a>

            <a
              href="https://eslint.org"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                isDark
                  ? 'bg-gray-800/30 hover:bg-gray-700/50'
                  : 'bg-white/80 hover:bg-white shadow-md'
              }`}
            >
              <img src={eslintLogo} alt="ESLint" className="w-6 h-6" />
              <span className="font-medium">ESLint</span>
            </a>

            <a
              href="https://prettier.io"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                isDark
                  ? 'bg-gray-800/30 hover:bg-gray-700/50'
                  : 'bg-white/80 hover:bg-white shadow-md'
              }`}
            >
              <img src={prettierLogo} alt="Prettier" className="w-6 h-6" />
              <span className="font-medium">Prettier</span>
            </a>

            <a
              href="https://www.typescriptlang.org"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                isDark
                  ? 'bg-gray-800/30 hover:bg-gray-700/50'
                  : 'bg-white/80 hover:bg-white shadow-md'
              }`}
            >
              <img src={typescriptLogo} alt="TypeScript" className="w-6 h-6" />
              <span className="font-medium">TypeScript</span>
            </a>
          </div>
        </section>

        {/* Showcases */}
        <section className="grid md:grid-cols-2 gap-8 mb-20">
          {/* useState Showcase */}
          <div
            className={`p-8 rounded-3xl transition-all duration-300 ${
              isDark
                ? 'bg-gray-800/50 border border-gray-700/50'
                : 'bg-white shadow-xl border border-gray-100'
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">useState Hook</h3>
            </div>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Click the button to increment the counter
            </p>
            <div className="text-center">
              <div
                className={`text-6xl font-bold mb-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
              >
                {count}
              </div>
              <button
                onClick={() => setCount((c) => c + 1)}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25 cursor-pointer"
              >
                Increment
              </button>
            </div>
          </div>

          {/* useEffect Showcase */}
          <div
            className={`p-8 rounded-3xl transition-all duration-300 ${
              isDark
                ? 'bg-gray-800/50 border border-gray-700/50'
                : 'bg-white shadow-xl border border-gray-100'
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-xl">
                <svg
                  className="w-6 h-6 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">useEffect Hook</h3>
            </div>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Auto-incrementing timer using useEffect
            </p>
            <div className="text-center">
              <div
                className={`text-6xl font-bold mb-6 font-mono ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`}
              >
                {String(Math.floor(autoCount / 60)).padStart(2, '0')}:
                {String(autoCount % 60).padStart(2, '0')}
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`px-6 py-3 font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-lg cursor-pointer ${
                    isRunning
                      ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-red-500/25'
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:shadow-green-500/25'
                  }`}
                >
                  {isRunning ? 'Stop' : 'Start'}
                </button>
                <button
                  onClick={() => setAutoCount(0)}
                  className={`px-6 py-3 font-semibold rounded-full transition-all duration-300 hover:scale-105 cursor-pointer ${
                    isDark
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Redux Theme Selector */}
        <section
          className={`p-8 rounded-3xl mb-20 transition-all duration-300 ${
            isDark
              ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20'
              : 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <img src={reduxLogo} alt="Redux" className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Redux Theme Selector</h3>
          </div>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Theme state managed by Redux Toolkit
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => theme !== 'light' && handleToggleTheme()}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer ${
                theme === 'light'
                  ? 'bg-white text-gray-900 shadow-lg scale-105'
                  : isDark
                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ☀️ Light Mode
            </button>
            <button
              onClick={() => theme !== 'dark' && handleToggleTheme()}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-gray-900 text-white shadow-lg scale-105'
                  : isDark
                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🌙 Dark Mode
            </button>
          </div>
          <p className={`mt-6 text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Current theme:{' '}
            <code className={`px-2 py-1 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
              {theme}
            </code>
          </p>
        </section>

        {/* Footer */}
        <footer className="text-center">
          <div
            className={`inline-block px-8 py-6 rounded-2xl ${
              isDark ? 'bg-gray-800/30' : 'bg-white shadow-lg'
            }`}
          >
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Made with ❤️ by
            </p>
            <a
              href="https://github.com/klabacher"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xl font-bold hover:underline ${
                isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
              }`}
            >
              João Vitor Klabacher
            </a>
            <div className="mt-4">
              <a
                href="https://github.com/klabacher"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
