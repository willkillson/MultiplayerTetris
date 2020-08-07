import React from 'react';
import ReactDOM from 'react-dom';
import * as ENGINE from './Engine/Engine'

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(

    <React.StrictMode>
            <ENGINE.Engine></ENGINE.Engine>
    </React.StrictMode>,
    document.getElementById('root'),
);
