import React, { useReducer } from 'react';
import MainGame from './game/MainGame';
import BillMessage1 from './messages/BillMessage1';
import BillMessage2 from './messages/BillMessage2';
import BillMessage3 from './messages/BillMessage3';

function App() {
  const [i, inc] = useReducer(i => ++i, 1);
  return (
    <div>
      {i === 1 && <MainGame onDone={inc} />}
      {i === 2 && <BillMessage1 onDone={inc} />}
      {i === 3 && <BillMessage2 onDone={inc} />}
      {i === 4 && <BillMessage3 onDone={() => {}} />}
    </div>
  );
}

export default App;
