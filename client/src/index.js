import React from 'react';
import ReactDOM from 'react-dom';
import Tetris from './tetris/Tetris'
import * as serviceWorker from './serviceWorker';
import { render } from '@testing-library/react';
import './css/index.css'

function ButtonFrame(){
  return (
    <div>
      <div class="flex-container-vertical">

        <div id="root-container-lhs">
          <button id="button-out" class="button-vertical">Out</button>
          <button id="button-ccw" class="button-vertical">CCW</button>
          <button id="button-left" class="button-vertical">Left</button>
        </div>

        <div id="root-container-center">
            <Tetris></Tetris>
            <button id="button-up">Up</button>
            <button id="button-down">Down</button>
        </div>

        <div id="root-container-rhs">
          <button id="button-in" class="button-vertical">in</button>
          <button id="button-cw" class="button-vertical">cw</button>
          <button id="button-right" class="button-vertical">right</button>
        </div>

      </div>
    </div>
  );
}

ReactDOM.render(

  <React.StrictMode>
    <ButtonFrame></ButtonFrame>
    
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
