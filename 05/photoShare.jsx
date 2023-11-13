import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Route, Switch
} from 'react-router-dom';
import {
  Grid, Paper
} from '@mui/material';
import './styles/main.css';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserPhotos from './components/userPhotos/userPhotos';
import LoginRegister from "./components/loginRegister/LoginRegister";
import {Redirect} from "react-router";

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      main_content: undefined,
      user: undefined
    };
    this.changeMainContent = this.changeMainContent.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  changeMainContent = (main_content) => {
    this.setState({ main_content: main_content });
  };

  userIsLoggedIn = () => {
    return this.state.user !== undefined;
  }

  changeUser = (user) => {
    this.setState({user: user});
  }


  render() {

    return (



        <HashRouter>
          <div>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <TopBar main_content={this.state.main_content} changeUser={this.changeUser} loggedIn={this.userIsLoggedIn}/>
              </Grid>
              <div className="main-topbar-buffer"/>
              <Grid item sm={3}>
                <Paper className="main-grid-item">
                  {
                    this.userIsLoggedIn() ?
                    <UserList/> :
                        <div/>
                  }
                </Paper>
              </Grid>
              <Grid item sm={9}>
                <Paper className="main-grid-item">
                        <Switch>
                          {
                            this.userIsLoggedIn() ?
                                <Route path="/users/:userId" render={ props => <UserDetail {...props} changeMainContent={this.changeMainContent}/> }/>
                                :
                                <Redirect path="/users/:userId" to="/login-register" />
                          }
                          {
                            this.userIsLoggedIn() ?
                                <Route path="/photos/:userId" render ={ props => <UserPhotos {...props} changeMainContent={this.changeMainContent}/> }/>
                                :
                                <Redirect path="/photos/:userId" to="/login-register" />
                          }
                          {
                            this.userIsLoggedIn() ?
                                <Route path="/" render={() => (<div/>)}/>
                                :
                                <Route path="/login-register" render ={ props => <LoginRegister {...props} changeUser={this.changeUser} changeMainContent={this.changeMainContent}/> } />
                          }
                          {
                            this.userIsLoggedIn() ?
                                <Route path="/" render={() => (<div/>)}/>
                                :
                                <Route path="/" render ={ props => <LoginRegister {...props} changeUser={this.changeUser} changeMainContent={this.changeMainContent}/> } />
                          }
                        </Switch>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </HashRouter>
    );
  }
}

ReactDOM.render(
    <PhotoShare/>,
    document.getElementById('photoshareapp')
);