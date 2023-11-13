import React from 'react';
import {
  Button, TextField,
  ImageList, ImageListItem
} from '@mui/material';
import './userPhotos.css';
import axios from 'axios';



/**
 * Define UserPhotos, a React componment of project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id : undefined,
      photos: undefined
    };
  }

  componentDidMount() {
    const new_user_id = this.props.match.params.userId;
    this.handleUserChange(new_user_id);
  }

  componentDidUpdate() {
    const new_user_id = this.props.match.params.userId;
    const current_user_id = this.state.user_id;
    if (current_user_id  !== new_user_id){
      this.handleUserChange(new_user_id);
    }
  }

  handleUserChange(user_id){
    axios.get("/photosOfUser/" + user_id)
    /* fetchModel("/photosOfUser/" + user_id) */
        .then((response) =>
        {
          this.setState({
            user_id : user_id,
            photos: response.data
          });
        });
        axios.get("/user/" + user_id)
    /* fetchModel("/user/" + user_id) */
        .then((response) =>
        {
          const new_user = response.data;
          const main_content = "User Photos for " + new_user.first_name + " " + new_user.last_name;
          this.props.changeMainContent(main_content);
        });
  }
  handleNewCommentChange = (event) => {
        this.setState({
            new_comment: event.target.value
        });
    }

    handleShowAddComment = (event) => {
        const photo_id = event.target.attributes.photo_id.value;
        this.setState({
            add_comment: true,
            current_photo_id: photo_id
        });
    }

    handleCancelAddComment = () => {
        this.setState({
            add_comment: false,
            new_comment: undefined,
            current_photo_id: undefined
        });
    }

    handleSubmitAddComment = () => {
        const currentState = JSON.stringify({comment: this.state.new_comment});
        const photo_id = this.state.current_photo_id;
        const user_id = this.state.user_id;
        axios.post("/commentsOfPhoto/" + photo_id,
            currentState,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((response) =>
            {
                this.setState({
                    add_comment : false,
                    new_comment: undefined,
                    current_photo_id: undefined
                });
                axios.get("/photosOfUser/" + user_id)
                    .then((response) =>
                    {
                        this.setState({
                            photos: response.data
                        });
                    });
            })
            .catch( error => {
                console.log(error);
            });
    }
  render() {
    return this.state.user_id ? (
        <div>
          <div>
            <Button variant="contained" component="a" href={"#/users/" + this.state.user_id}>
              User Detail
            </Button>
          </div>
          <ImageList variant="masonry" cols={1} gap={8}>
            {this.state.photos.map((item) => (
                <div key={item._id}>
                  <TextField id="date" label="Photo Date" variant="outlined" disabled fullWidth margin="normal"
                             value={item.date_time} />
                  <ImageListItem key={item.file_name}>
                    <img
                        src={`images/${item.file_name}`}
                        srcSet={`images/${item.file_name}`}
                        alt={item.file_name}
                        loading="lazy"
                    />
                  </ImageListItem>
                  {item.comments ?
                      item.comments.map((comment) => (
                          <div key={comment._id}>
                            <TextField id="date" label="Comment Date" variant="outlined" disabled fullWidth
                                       margin="normal" value={comment.date_time} />
                            <TextField id="user" label="User" variant="outlined" disabled fullWidth
                                       margin="normal"
                                       value={comment.user.first_name + " " + comment.user.last_name}
                                       component="a" href={"#/users/" + comment.user._id}/>
                            <TextField id="comment" label="Comment" variant="outlined" disabled fullWidth
                                       margin="normal" multiline rows={4} value={comment.comment} />
                          </div>
                      ))
                      : (
                          <div>
                                        <Typography>No Comments</Typography>
                                    </div>
                                )}
                                <Button photo_id={item._id} variant="contained" onClick={this.handleShowAddComment}>
                                    Write Comment
                                </Button>
                            </div>
                        </div>
                    )) : (
                        <div>
                            <Typography>No Photos</Typography>
                        </div>
                    )}
                </ImageList>
                <Dialog open={this.state.add_comment}>
                    <DialogTitle>Write Comment</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter New Comment for Photo
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="comment"
                            label="Comment"
                            multiline rows={4}
                            fullWidth
                            variant="standard"
                            onChange={this.handleNewCommentChange}
                            defaultValue={this.state.new_comment}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {this.handleCancelAddComment()}}>Cancel</Button>
                        <Button onClick={() => {this.handleSubmitAddComment()}}>Add</Button>
                    </DialogActions>
                </Dialog>
        </div>
    ) : (
        <div/>
    );
  }
}

export default UserPhotos;
