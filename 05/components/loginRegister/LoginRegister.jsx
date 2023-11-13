import React from "react";
import axios from "axios";
import {Button, TextField} from "@mui/material";
import { Redirect } from "react-router";

class LoginRegister extends React.Component{

    constructor(props){
        super(props);
        this.props.changeMainContent("Please login to continue");
        this.state = {
            login_name: "",
            password: "",
            invalid_login: false
        }
    }

    login = () => {
        const login_name = this.state.login_name;
        axios.post("/admin/login", { login_name: login_name },
            { withCredentials: true, headers: { 'Content-Type': 'application/json' } })
            .then(response => {
                console.log(response.data);
                this.props.changeMainContent(`Hello, ${response.data.first_name}!`);
                this.props.changeUser(response.data);

            }).catch(err => {
                console.error(err);
                this.setState({invalid_login: true})
        });
    }

    handleFormChange = () => {
        this.setState({
            login_name: document.getElementById("username").value,
            password: document.getElementById("password").value
        });
    }


    render(){
        if (this.props.loginState){
            return <Redirect to="/"></Redirect>;
        }
        return (
            <form noValidate autoComplete="off" onChange={this.handleFormChange}>
                <TextField id="username" variant="outlined" label="Username" fullWidth margin="normal"
                error={this.state.invalid_login} helperText={this.state.invalid_login ? "Invalid credentials" : ""}></TextField>
                <TextField id="password" variant="outlined" label="Password" fullWidth margin="normal"
                           type="password"></TextField>
                <Button variant="contained" component="button" onClick={this.login}>Login</Button>
            </form>
        )

    }


}

export default LoginRegister;