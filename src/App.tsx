import React from 'react';
import './App.scss';
import { Switch, Route } from 'react-router-dom';
import { observer } from 'mobx-react';
import Main from './components/Main/Main';
import AboutMe from './components/AboutMe/AboutMe';
import MyWork from './components/MyWork/MyWork';

function App() {
  return (
    <div className='app RootComponent'>
      <Switch>
        <Route path='/about-me' component={AboutMe} exact />
        <Route path='/my-work' component={MyWork} exact />
      </Switch>
      <Route path='/' component={Main} />
    </div>
  );
}

export default observer(App);
