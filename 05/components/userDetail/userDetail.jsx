import React from 'react';
import {
    Divider, List, ListItem, ListItemText,
    Typography
} from '@mui/material';
import './userDetail.css';


/**
 * Define UserDetail, a React component of project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.user = {
        detail:window.models.userModel(this.props.match.params.userId)
    }
  }

  render() {
    return (
        <div>
            <Typography variant="body1">
                This should be the UserDetail view of the PhotoShare app. Since
                it is invoked from React Router the params from the route will be
                in property match. So this should show details of user:
                {this.props.match.params.userId}. You can fetch the model for the
                user from window.models.userModel(userId).
            </Typography>
                <List>
                    <ListItem>
                        <ListItemText> {`Name: ${this.user.detail.first_name} ${this.user.detail.last_name}`}</ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText>{`Location: ${this.user.detail.location}`}</ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText>{`Description: ${this.user.detail.description}`}</ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText>{`Occupation: ${this.user.detail.occupation}`}</ListItemText>
                    </ListItem>
                </List>
                <Typography>
                    Test
                </Typography>
        </div>
    );
  }
}

export default UserDetail;
