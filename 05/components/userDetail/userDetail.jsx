import React from 'react';
import {
    Box,
    Button,
    TextField
} from '@mui/material';
import './userDetail.css';
import axios from 'axios';

/**
 * Define UserDetail, a React component of project #5
 */
class UserDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined
        };
    }
    componentDidMount() {
        const new_user_id = this.props.match.params.userId;
        this.handleUserChange(new_user_id);
    }

    componentDidUpdate() {
        const new_user_id = this.props.match.params.userId;
        const current_user_id = this.state.user?._id;
        if (current_user_id  !== new_user_id){
            this.handleUserChange(new_user_id);
        }
    }

    handleUserChange(user_id){
        axios.get("/user/" + user_id)
            .then((response) =>
            {
                const new_user = response.data;
                this.setState({
                    user: new_user
                });
                const main_content = "User Details for " + new_user.first_name + " " + new_user.last_name;
                this.props.changeMainContent(main_content);
            });
    }

    render() {
        return this.state.user ? (
            <div>
                <Box component="form" noValidate autoComplete="off">
                    <div>
                        <Button variant="contained" component="a" href={"#/photos/" + this.state.user._id}>
                            User Photos
                        </Button>
                    </div>
                    <div>
                        <TextField id="first_name" label="First Name" variant="outlined" disabled fullWidth
                                   margin="normal"
                                   value={this.state.user.first_name}/>
                    </div>
                    <div>
                        <TextField id="last_name" label="Last Name" variant="outlined" disabled fullWidth
                                   margin="normal"
                                   value={this.state.user.last_name}/>
                    </div>
                    <div>
                        <TextField id="location" label="Location" variant="outlined" disabled fullWidth
                                   margin="normal"
                                   value={this.state.user.location}/>
                    </div>
                    <div>
                        <TextField id="description" label="Description" variant="outlined" multiline rows={4}
                                   disabled
                                   fullWidth margin="normal" value={this.state.user.description}/>
                    </div>
                    <div>
                        <TextField id="occupation" label="Occupation" variant="outlined" disabled fullWidth
                                   margin="normal"
                                   value={this.state.user.occupation}/>
                    </div>
                </Box>
            </div>
        ) : (
            <div/>
        );
    }
}

export default UserDetail;
