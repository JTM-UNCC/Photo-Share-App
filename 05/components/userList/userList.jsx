import React from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
}
from '@mui/material';
import './userList.css';

/**
 * Define UserList, a React component of project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.user = {
      list:window.models.userListModel()
    }
    this.handleClick = this.handleClick.bind(this);
    console.log('window.models.userListModel', window.models.userListModel);
  }

  handleClick(event) {
    alert('hello');
    alert(this.user.list[0]._id)
  }

  render() {
    return (
      <div>
        <Typography variant="body1">
          This is the user list, which takes up 3/12 of the window.
          You might choose to use <a href="https://mui.com/components/lists/">Lists</a> and <a href="https://mui.com/components/dividers/">Dividers</a> to
          display your users like so:
        </Typography>
        <List component="nav">
          <ListItem>
            <ListItemText
                id="0"
                primary={`${this.user.list[0].first_name} ${this.user.list[0].last_name}`}
                onClick = {(event) => this.handleClick(event)}
            />
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemText primary={`${this.user.list[1].first_name} ${this.user.list[1].last_name}`} />
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemText primary={`${this.user.list[2].first_name} ${this.user.list[2].last_name}`} />
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemText primary={`${this.user.list[3].first_name} ${this.user.list[3].last_name}`} />
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemText primary={`${this.user.list[4].first_name} ${this.user.list[4].last_name}`} />
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemText primary={`${this.user.list[5].first_name} ${this.user.list[5].last_name}`} />
          </ListItem>
          <Divider />
        </List>
        <Typography variant="body1">
          The model comes in from window.models.userListModel()
        </Typography>
      </div>
    );
  }
}

export default UserList;
