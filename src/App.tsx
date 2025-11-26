// Always import this css file first
import './App.css';
import { getThemeState, toggleTheme } from './Redux/Slice';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
// import Redux svg
// import tailwind svg
function App() {
  const [count, setCount] = useState(0);

  // Get the current theme from Redux store
  const theme = useSelector(getThemeState);

  function handleToggleTheme() {
    // Dispatch the toggleTheme action
    toggleTheme();
  }

  return (
    <>
      <div></div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <button onClick={handleToggleTheme}>Current Theme: {theme}</button>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
