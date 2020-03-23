import React from 'react';
import './App.scss';
import { Switch, Route } from 'react-router-dom';
import { observer } from 'mobx-react';
import Main from './components/Main/Main';
import AboutMe from './components/AboutMe/AboutMe';

function App() {
  return (
    <div className='app RootComponent'>
      <Switch>
        <Route path='/about-me' component={AboutMe} exact />
      </Switch>

      <Route path='/' component={Main} />
    </div>
  );
}

export default observer(App);
