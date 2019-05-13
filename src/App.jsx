import React, { Component } from 'react';
import "./style.css"
import Manager from "./Component/Manager"
import Signup from "./Component/Signup"
import Edit from "./Component/Edit"

import {BrowserRouter, Switch, Route,Router} from 'react-router-dom'

class App extends Component {
  render(){ 
    return (
      <div className = "table-manager">
       
          <BrowserRouter>
              <Switch>
                    
                    <Route exact path = "/" component = {Manager}/>
                    <Route exact path = "/signup" component = {Signup}/>
                    <Route exact path = "/edit/:cmnd" component = {Edit}/>
                    
              </Switch>
          </BrowserRouter>
       
      </div>
    )
  }
}


export default App;
