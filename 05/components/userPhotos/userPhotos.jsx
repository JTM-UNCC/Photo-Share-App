import React from 'react';
import {
  Button, TextField,
  ImageList, ImageListItem
} from '@mui/material';
import './userPhotos.css';
import fetchModel from "../../lib/fetchModelData";


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
    fetchModel("/photosOfUser/" + user_id)
        .then((response) =>
        {
          this.setState({
            user_id : user_id,
            photos: response.data
          });
        });
    fetchModel("/user/" + user_id)
        .then((response) =>
        {
          const new_user = response.data;
          const main_content = "User Photos for " + new_user.first_name + " " + new_user.last_name;
          this.props.changeMainContent(main_content);
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
                            <TextField id="comment" label="No Comments" variant="outlined" disabled fullWidth
                                       margin="normal" />
                          </div>
                      )}
                </div>
            ))}
          </ImageList>
        </div>
    ) : (
        <div/>
    );
  }
}

export default UserPhotos;
