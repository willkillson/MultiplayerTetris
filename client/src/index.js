import React from 'react';
import ReactDOM from 'react-dom';
import Tetris from './tetris/Tetris';
import * as serviceWorker from './serviceWorker';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(

    <React.StrictMode>


        <Container id="myCanvas">
          <Tetris></Tetris>
        </Container>

        <Container fixed='true'>

          <Row>
            <div style={{width: 100}}><Button size="lg" id="button-up" block>Up</Button></div>
            <div style={{width: 100}}><Button size="lg" id="button-down" block>Down</Button></div>
            <div style={{width: 100}}><Button size="lg" id="button-left" block>Left</Button></div>
            <div style={{width: 100}}><Button size="lg" id="button-right" block>Right</Button></div>
          </Row>

        </Container>




    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
