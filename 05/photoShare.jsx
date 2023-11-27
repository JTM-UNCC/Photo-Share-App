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
import {Redirect, withRouter} from "react-router";
import axios from "axios";
import PrivateRoute from "./components/privateRoute/privateRoute";

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      main_content: undefined,
      user: undefined
    };
    this.changeMainContent = this.changeMainContent.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.userIsLoggedIn = this.userIsLoggedIn.bind(this);
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
  checkAuth(){

    axios.post("/auth", {}, { withCredentials: true })
        .then(response => {
          if(response.status !== 200){
            return;
          }
          this.changeUser(response.data);
        }).catch(err => console.error(err));

  }
  handleLoad(){
    if (this.state.user != undefined){
      return;
    }
    this.checkAuth();
  }

  componentDidMount() {
    setTimeout(() => this.handleLoad(), 50);
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
                          {/*{*/}
                          {/*  this.userIsLoggedIn() ?*/}
                          {/*      <Route path="/users/:userId" render={ props => <UserDetail {...props}*/}
                          {/*                                                                 currUser={this.state.user} changeMainContent={this.changeMainContent}/> }/>*/}
                          {/*      :*/}
                          {/*      <Redirect path="/users/:userId" to="/login-register" />*/}
                          {/*}*/}
                          {/*{*/}
                          {/*  this.userIsLoggedIn() ?*/}
                          {/*      <Route path="/photos/:userId" render ={ props => <UserPhotos {...props}*/}
                          {/*                                                                   currUser={this.state.user} changeMainContent={this.changeMainContent}/> }/>*/}
                          {/*      :*/}
                          {/*      <Redirect path="/photos/:userId" to="/login-register" />*/}
                          {/*}*/}
                          {/*/!*{*!/*/}
                          {/*/!*  this.userIsLoggedIn() ?*!/*/}
                          {/*/!*      <Route path="/" render={() => (<div/>)}/>*!/*/}
                          {/*/!*      :*!/*/}
                          {/*/!*      <Route path="/login-register" render ={ props => <LoginRegister {...props} changeUser={this.changeUser} changeMainContent={this.changeMainContent}/> } />*!/*/}
                          {/*/!*}*!/*/}
                          {/*{*/}
                          {/*  this.userIsLoggedIn() ?*/}
                          {/*      <Route path="/" render={() => (<div/>)}/>*/}
                          {/*      :*/}
                          {/*      <Route path="/" render ={ props => <LoginRegister {...props} changeUser={this.changeUser} changeMainContent={this.changeMainContent}/> } />*/}
                          {/*}*/}

                          <Route path="/login-register" render={props => {
                            return !this.userIsLoggedIn() ?
                                <LoginRegister {...props} changeUser={this.changeUser}
                                               changeMainContent={this.changeMainContent}/> :
                                <Redirect to="/" from="/login-register"/>
                          }}/>

                              <PrivateRoute path="/users/:userId" currUser={this.state.user}
                                            changeMainContent={this.changeMainContent}
                                            userIsLoggedIn={this.userIsLoggedIn}
                                            RoutedComponent={UserDetail}
                              />

                              <PrivateRoute path="/photos/:userId" currUser={this.state.user}
                                            changeMainContent={this.changeMainContent}
                                            userIsLoggedIn={this.userIsLoggedIn}
                                            RoutedComponent={UserPhotos}
                              />

                              <PrivateRoute path="/" userIsLoggedIn={this.userIsLoggedIn}/>

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