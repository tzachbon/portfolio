import React from 'react';
import './App.scss';
import { Switch, Route } from 'react-router-dom';
import { observer } from 'mobx-react';
import Main from './components/Main/Main';

function App() {
  return (
    <div className="app">
      <Switch>
        <Route path='/' component={Main} />
      </Switch>
    </div>
  );
}

export default observer(App);
