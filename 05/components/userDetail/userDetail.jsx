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
            user: undefined,
            recentPhoto: undefined,
            mostCommentedPhoto: undefined,
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
        if (current_user_id  !== new_user_id){
            //console.info(`making http request, new_user_id = ${new_user_id}, current_user_id = ${current_user_id}`);
            this.handleUserChange(new_user_id);
        }
    }

    /* handleUserChange(user_id) {
        //console.info(`handleUserChange called with user_id: ${user_id} in userDetail`);
        axios.get("/user/" + user_id)
            .then((response) => {
                const new_user = response.data;
                this.setState({
                    user: new_user
                });
                const main_content = "User Details for " + new_user.first_name + " " + new_user.last_name;
                this.props.changeMainContent(main_content);
            });
    }
    */

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
                axios.get(`/photosOfUser/${user_id}`)
                    .then((photoResponse) => {
                        const photos = photoResponse.data;
                        const recentPhoto = photos.length > 0 ? photos[0] : null;
                        this.setState({
                            recentPhoto: recentPhoto,
                        });
                    })
                    .catch((error) => {
                        console.error("Error fetching recent photo:", error);
                    });

                // To fetch photo with the most comments
                axios.get(`/photosOfUser/${user_id}`)
                    .then((photoResponse) => {
                        const photos = photoResponse.data;
                        const mostCommentedPhoto = photos.reduce((max, photo) =>
                                photo.comments.length > max.comments.length ? photo : max
                            , photos[0]);
                        this.setState({
                            mostCommentedPhoto: mostCommentedPhoto,
                        });
                    })
                    .catch((error) => {
                        console.error("Error fetching most commented photo:", error);
                    });
            })
            .catch((error) => {
                console.error("Error fetching user details:", error);
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
                <div>
                    <h2>Recent Photo</h2>
                    {this.state.recentPhoto && (
                        <div>
                            <img
                                src={`images/${this.state.recentPhoto.file_name}`}
                                alt={this.state.recentPhoto.file_name}
                                width="100"
                            />
                            <p>Date Uploaded: {this.state.recentPhoto.date_time}</p>
                        </div>
                    )}
                </div>

                <div>
                    <h2>Most Commented Photo</h2>
                    {this.state.mostCommentedPhoto && this.state.mostCommentedPhoto.comments.length > 0 &&(
                        <div>
                            <img
                                src={`images/${this.state.mostCommentedPhoto.file_name}`}
                                alt={this.state.mostCommentedPhoto.file_name}
                                width="100"
                            />
                            <p>Comments Count: {this.state.mostCommentedPhoto.comments.length}</p>
                        </div>
                    )}

                </div>
            </div>
        ) : (
            <div/>
        );
    }
}

export default UserDetail;
