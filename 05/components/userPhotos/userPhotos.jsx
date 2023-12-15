import React from 'react';
import {
    Button, TextField,
    ImageList, ImageListItem, DialogActions, Dialog, DialogContent, DialogContentText, Typography, DialogTitle, Paper
} from '@mui/material';
import {MentionsInput, Mention} from 'react-mentions';
import './userPhotos.css';
import axios from 'axios';
import defaultStyle from './defaultStyle';
import defaultMentionStyle from "./defaultMentionStyle";

let container;


/**
 * Define UserPhotos, a React componment of project #5
 */
class UserPhotos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            new_comment: '',
            add_comment: false,
            user_id: undefined,
            photos: undefined,
            mentions: [],
            mentionCount: 0
        };
        this.setState = this.setState.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleNewCommentChange = this.handleNewCommentChange.bind(this);
        this.handleShowAddComment = this.handleShowAddComment.bind(this);
        this.handleSubmitAddComment = this.handleSubmitAddComment.bind(this);
        this.handleCancelAddComment = this.handleCancelAddComment.bind(this);
        this.addMention = this.addMention.bind(this);
    }

    componentDidMount() {
        const new_user_id = this.props.match.params.userId;
        console.info(`new_user_id: ${new_user_id}`);
        this.handleUserChange(new_user_id);
    }

    componentDidUpdate() {
        const new_user_id = this.props.match.params.userId;
        const current_user_id = this.state.user_id;
        if (current_user_id !== new_user_id) {
            this.handleUserChange(new_user_id);
        }
    }

    handleUserChange(user_id) {

        axios.get("/photosOfUser/" + user_id)
            /* fetchModel("/photosOfUser/" + user_id) */
            .then((response) => {
                this.setState({
                    user_id: user_id,
                    photos: response.data
                });
            }).catch(error => {
            this.setState({ user_id: user_id });
            console.error(`error in userphotos ${error}`);
        });

        axios.get("/user/" + user_id)
            /* fetchModel("/user/" + user_id) */
            .then((response) => {
                const new_user = response.data;
                const main_content = "User Photos for " + new_user.first_name + " " + new_user.last_name;
                this.props.changeMainContent(main_content);
            });
    }

    handleNewCommentChange = (event) => {
        this.setState({ new_comment: '' });
    }

    handleShowAddComment = (event) => {
        const photo_id = event.target.attributes.photo_id.value;
        this.getMentionOptions();

        this.setState({
            add_comment: true,
            current_photo_id: photo_id
        });
    }

    handleCancelAddComment = () => {
        this.setState({
            add_comment: false,
            new_comment: '',
            current_photo_id: undefined,
            mentionCount: 0
        });
    }
    getMentionOptions = () => {

        axios.get(`/mentions/users/list`,
            { withCredentials: true, responseType: "json" })
            .then(response => {
                if (response.status !== 200 || response.data.length === 0) {
                    console.info("data.length === 0");
                    return;
                }
                this.setState({ userList: response.data })
            }).catch(error => {
            console.error(`error in mention query ${error}`);
            return [];
        });

    }

    handleSubmitAddComment = () => {
        const mentions = this.state.mentionCount;
        const currentState = JSON.stringify({ comment: this.state.new_comment, mentions: mentions });
        const photo_id = this.state.current_photo_id;
        const user_id = this.state.user_id;
        axios.post("/commentsOfPhoto/" + photo_id,
            currentState,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => {
                this.setState({
                    add_comment: false,
                    new_comment: '',
                    current_photo_id: undefined,
                    mentionCount: 0
                });
                axios.get("/photosOfUser/" + user_id)
                    .then((response) => {
                        this.setState({
                            photos: response.data
                        });
                    });
            })
            .catch(error => {
                console.log(`error in handleSubmit: ${error}`);
            });
    }


    handleDeleteComment = (photo_id, comment_id) => {
        axios.delete("/comment/" + photo_id+"/"+comment_id)
            .then((response) => {
                console.log("deleter", response.data);
                axios.get("/photosOfUser/" + this.state.user_id)
                    .then((response) =>
                    {
                        const newState = [];
                        for(let photo of this.state.photos){
                            if (photo._id === photo_id){
                                photo.comments = photo.comments.filter(cmt => cmt._id !== comment_id);
                            }
                            newState.push(photo);
                        }
                        this.setState({ photos: newState });
                    });
                    })
                .catch( error => {
                    console.log(`error in handleSubmit: ${error}`);
                });

    }

    handleDeletePhoto = (user_id, photo_id) => {
      axios.delete("/photo/" + user_id + "/" + photo_id)
            .then((response) => {
                console.log("deleter", response.data);
                let newPhotos = this.state.photos.filter(pic => pic._id !== photo_id);
                this.setState({ photos: newPhotos });
            })
          .catch( error => {
              console.log(`error in handleSubmit: ${error}`);
          });

    }

    addMention = () => {
        this.state.mentionCount++;
    }





    render(){
        const setState = this.setState;
        const users = this.state.userList;


        return this.state.user_id ? (
            <div>
                <div>
                    <Button variant="contained" component="a" href={"#/users/" + this.state.user_id}>
                        User Detail
                    </Button>
                </div>
                <ImageList variant="masonry" cols={1} gap={8}>
                    {this.state.photos ? this.state.photos.map((item) => (
                        <div key={item._id}>
                            <TextField label="Photo Date" variant="outlined" disabled fullWidth margin="normal"
                                       value={item.date_time}/>
                            <ImageListItem key={item.file_name}>
                                <img
                                    src={`images/${item.file_name}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    srcSet={`images/${item.file_name}?w=164&h=164&fit=crop&auto=format`}
                                    alt={item.file_name}
                                    loading="lazy"
                                />

                            <div>
                                {this.props.currUser._id === this.state.user_id && (
                                    <Button
                                        photo_id={item._id} variant="contained" onClick={() => this.handleDeletePhoto(this.state.user_id, item._id)}
                                            style={{"margin": "20px 0"}}
                                    >
                                        Delete Photo
                                    </Button>
                                )}
                            </div>
                            </ImageListItem>
                            <div>
                            {item.comments ?
                                item.comments.map((comment) => (
                                    <Paper key={comment._id} elevation={3} style={{ marginTop: "8px",
                                        marginBottom: "8px",
                                        marginLeft: "3px",
                                        marginRight: "3px"
                                    }}>
                                    <div style={{ marginLeft: "4px", marginRight: "4px"}}>
                                        <TextField label="Comment Date" variant="outlined" disabled fullWidth
                                                   margin="normal" value={comment.date_time} />
                                        <TextField label="User" variant="outlined" disabled fullWidth
                                                   margin="normal"
                                                   value={comment.user.first_name + " " + comment.user.last_name}
                                                   component="a" href={"#/users/" + comment.user._id}>
                                        </TextField>
                                        <TextField label="Comment" variant="outlined" disabled fullWidth
                                                   margin="normal" multiline rows={4} value={comment.comment} />
                                        {this.props.currUser._id === comment.user._id && (
                                            <Button comment_id={comment._id} variant="contained" onClick={() => this.handleDeleteComment(item._id, comment._id)}
                                            style={{"margin": "20px 0"}}
                                            >
                                                Delete Comment
                                            </Button>
                                        )}


                                    </div>
                                    </Paper>
                                )) : (
                                    <div>
                                        <Typography>No Comments</Typography>
                                    </div>
                                )}
                                <Button photo_id={item._id} variant="contained" onClick={this.handleShowAddComment}>
                                    Add Comment
                                </Button>

                            </div>
                        </div>
                    )) : (
                        <div>
                            <Typography>No Photos</Typography>
                        </div>
                    )}
                </ImageList>
                <Dialog id={"commentpane"} scroll={"paper"}
                        open={this.state.add_comment} ref={ele => container = ele}>
                    <div>
                        <DialogTitle>Add Comment</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Enter New Comment for Photo
                            </DialogContentText>
                            <MentionsInput singleLine={false}
                                           placeholder={"Mention people with '@'"}
                                           id="comment" label="Comment"
                                           fullwidth="true"
                                           rows={4}
                                           value={this.state.new_comment}
                                           onChange={(ev) => {
                                               setState({ new_comment: ev.target.value })
                                           }}
                                           a11ySuggestionsListLabel={"Suggested Users"}
                                           allowSuggestionsAboveCursor
                                           style={defaultStyle}
                                           suggestionsPortalHost={container}
                            >
                                <Mention
                                    onAdd={this.addMention}
                                    data={users}
                                    markup="@!{([__id__])}[(user:__display__)]!@"
                                    displayTransform={(user, display) => `@${display}`}
                                    style={defaultMentionStyle}
                                    appendSpaceOnAdd
                                />
                            </MentionsInput>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                this.handleCancelAddComment()
                            }}>Cancel</Button>
                            <Button onClick={() => {
                                this.handleSubmitAddComment()
                            }}>Add</Button>
                        </DialogActions>
                    </div>
                </Dialog>
            </div>
        ) : (
            <div/>
        );
    }
}

export default UserPhotos;
