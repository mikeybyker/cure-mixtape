import React              from 'react';
import { render }         from 'react-dom';
import { Match,
         Miss,
         BrowserRouter }  from 'react-router';
import App                from './app';
import Login              from './components/Login';
import About              from './components/About';
import View               from './components/View';
import NotFound           from './components/NotFound';

import './css/foundation.css';
import './css/index.css';

const Root = () => {

  return (
    <BrowserRouter>
      <div>
        <Match exactly pattern="/" component={Login}  />
        <Match exactly pattern="/about/:playlistId?" component={About}  />
        <Match exactly pattern="/create/:playlistId" component={App}  />
        <Match exactly pattern="/view/:playlistId" component={View} />
        <Miss component={NotFound}  />
      </div>
    </BrowserRouter>
  )

}

render(<Root/>, document.getElementById('main'));
