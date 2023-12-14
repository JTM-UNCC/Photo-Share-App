import React from 'react';
import {
    Box, Button, ImageList, ImageListItem, ImageListItemBar, TextField
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
            user: undefined, recentPhoto: undefined, maxCommentPhoto: undefined
        };
    }

    componentDidMount() {
        //console.info("userDetail componentDidMount");
        const new_user_id = this.props.match.params.userId;
        this.handleUserChange(new_user_id);
    }

    componentDidUpdate() {

        const new_user_id = this.props.match.params.userId;
        const current_user_id = this.state.user?._id;
        if (current_user_id !== new_user_id) {
            //console.info(`making http request, new_user_id = ${new_user_id}, current_user_id = ${current_user_id}`);
            this.handleUserChange(new_user_id);
        }
    }

    // handleUserChange(user_id){
    //     //console.info(`handleUserChange called with user_id: ${user_id} in userDetail`);
    //     axios.get("/user/" + user_id)
    //         /* fetchModel("/user/" + user_id) */
    //         .then((response) =>
    //         {
    //             const new_user = response.data;
    //             this.setState({
    //                 user: new_user
    //             });
    //             const main_content = "User Details for " + new_user.first_name + " " + new_user.last_name;
    //             this.props.changeMainContent(main_content);
    //         });
    // }

    handleUserChange(user_id) {
        axios.get("/user/" + user_id)
            .then((response) => {
                const new_user = response.data;
                this.setState({
                    user: new_user
                });
                const main_content = "User Details for " + new_user.first_name + " " + new_user.last_name;
                this.props.changeMainContent(main_content);

                // To fetch most recently uploaded photo
                axios.get(`/photosOfUser/${user_id}/previews`)
                    .then((photoResponse) => {
                        const { recent, mostComments } = photoResponse.data;

                        this.setState({
                            recentPhoto: recent, maxCommentPhoto: mostComments
                        });
                    })
                    .catch((error) => {
                        console.error("Error fetching recent photo:", error);
                    });
            })
            .catch((error) => {
                console.error("Error fetching user details:", error);
            });
    }

    handleDeleteAccount(user_id) {
        console.log("lalala");
        axios.delete("/user/" + user_id)
            .then((response) => {
                console.log("deleter", response.data);
                // figure out how to log out
                let newUser = this.state.user.filter(user => user._id !== user_id);
                this.setState({ user: newUser });
            })
            .catch(error => {
                console.log(`error in handleSubmit: ${error}`);
            });

    }

    render() {

        return this.state.user ? (<div>
            <Box component="form" noValidate autoComplete="off"
                  >
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
                {this.props.currUser._id === this.state.user._id && (<Button
                        user_id={this.props.currUser._id}
                        variant="contained" onClick={() => this.handleDeleteAccount(this.state.user_id)}
                        style={{ "margin": "20px 0", "backgroundColor": "#bf0300" }}
                    >
                        Delete Account
                    </Button>)}

                    <ImageList cols={2} rowHeight={300}>
                        {this.state.recentPhoto && (
                            <ImageListItem>
                                <img
                                    src={`images/${this.state.recentPhoto.file_name}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    srcSet={`images/${this.state.recentPhoto.file_name}?w=164&h=164&fit=crop&auto=format`}
                                    sizes={"(max-width: 8vh)"}
                                    alt={this.state.recentPhoto.file_name}
                                    width="8vh"
                                    loading="lazy"
                                />
                                <ImageListItemBar
                                    title={`Recent photo from ${this.state.user.first_name}`}
                                    subtitle={<span>upload date: {this.state.recentPhoto.date_time}</span>}
                                    position="below"
                                />
                            </ImageListItem>
                        )}


                        {this.state.maxCommentPhoto && this.state.maxCommentPhoto.comments.length > 0 && (
                            <ImageListItem>
                                <img
                                    src={`images/${this.state.maxCommentPhoto.file_name}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    srcSet={`images/${this.state.maxCommentPhoto.file_name}?w=164&h=164&fit=crop&auto=format`}
                                    sizes={"(max-width: 8vh)"}
                                    alt={this.state.maxCommentPhoto.file_name}
                                    width="8vh"
                                    loading="lazy"
                                />

                                <ImageListItemBar
                                    title={`Most commented photo from ${this.state.user.first_name}`}
                                    subtitle={<span>{this.state.maxCommentPhoto.comments.length} comments</span>}
                                    position="below"
                                />
                            </ImageListItem>
                        )}


                    </ImageList>
            </Box>
    </div>
    ) :
        (<div/>);
    }

}

export default UserDetail;