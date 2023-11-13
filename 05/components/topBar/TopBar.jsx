import React from 'react';
import {
    AppBar, Button, Toolbar, Typography
} from '@mui/material';
import './TopBar.css';
import axios from 'axios';

/**
 * Define TopBar, a React componment of project #5
 */
class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            app_info: undefined
        };
        this.logout = this.logout.bind(this);
        this.handleNewPhoto = this.handleNewPhoto.bind(this);

    }

    componentDidMount() {
        this.handleAppInfoChange();
    }


    logout = () =>{
        axios.post("/admin/logout", { withCredentials: true }).then(() => {
            this.props.changeUser(undefined);
        }).catch(error => {
            console.error(error);
        });
    }

    handleNewPhoto = (e) => {
        e.preventDefault();
        if (this.uploadInput.files.length > 0) {
            const domForm = new FormData();
            domForm.append('uploadedphoto', this.uploadInput.files[0]);
            axios.post("/photos/new", domForm)
                .then((response) => {
                    this.setState({
                        photo_upload_show: true,
                        photo_upload_error: false,
                        photo_upload_success: true
                    });
                })
                .catch(error => {
                    this.setState({
                        photo_upload_show: true,
                        photo_upload_error: true,
                        photo_upload_success: false
                    });
                    console.log(error);
                });
        }
    }
    handleAppInfoChange(){
        const app_info = this.state.app_info;
        if (app_info === undefined){
            axios.get("/test/info")
           /* fetchModel("/test/info") */
                .then((response) =>
                {
                    this.setState({
                        app_info: response.data
                    });
                });
        }
    }

    render() {
        return this.state.app_info ? (
            <AppBar className="topbar-appBar" position="absolute">
                <Toolbar>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>ITSC 3155 Group 4</Typography>

                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }} color="inherit">{this.props.main_content}</Typography>
                    <Typography variant="h5" component="div" color="inherit">Version: {this.state.app_info.__v}</Typography>
                    {
                        this.props.loggedIn() ?
                        <Button variant="contained" onClick={this.logout}>Logout</Button> :
                            <div/>
                    }
                    {
                        <Button
                            component = "label"
                            variant = "contained"
                        >
                            Add Photo
                            <input
                                type="file"
                                accept = "image/*"
                                hidden
                                ref={(domFileRef) => { this.uploadInput = domFileRef; }}
                                onChange={this.handleNewPhoto}
                            />
                        </Button>
                    }
                </Toolbar>
            </AppBar>
        ) : (
            <div/>
        );
    }
}

export default TopBar;
