/* CITATION:
/  Author: @nick-bash
/  Accessed: 12/12/2023 10:08 PM
/  Link: https://github.com/nick-bash/cs142-proj8/blob/7cc66d581265cf362be9208238d00f33bd8af106/components/activityFeed/activityFeed.jsx
*/

import React from 'react';
import { Typography, Divider} from '@material-ui/core';
import './activityFeed.css';
import axios from 'axios';

class ActivityFeed extends React.Component {
  constructor(props) {
    super(props);     
    this.state = {activities: undefined};
    this.refreshButton = this.refreshButton.bind(this);
  }
  
  render() {        
    if(this.props.loggedInUser === undefined || this.state.activities === undefined) return (<></>);
        
    return (
      <div>
        {this.state.activities.map(activity => {
          return (
            <div className="Group4" key={activity._id}>
              <Typography className="Group4-item">{(new Date(activity.date_time)).toISOString()}</Typography>
              <Typography className="Group4-item">{activity.activity}</Typography>
              {
                activity.photo_file_name === null ?
                <></> :
                <img className="Group4-image" src={`../../images/${activity.photo_file_name}`}/>
              }
              <Divider/>
            </div>
          );
        })}
        <button onClick={this.refreshButton}>Refresh</button> 
      </div>
    );
  }  
  
  refreshButton() {
    this.fetchModel();
  }

  fetchModel() {
    var x = axios.get("/activities");
    x.then(response => {              
      this.setState({activities: response.data});
      this.props.updateCurrentView("Activity feed");
      })
      .catch(err => console.error(err));
  }

  componentDidMount() {   
    this.fetchModel();    
  }  
  
  componentDidUpdate() { }
}

export default ActivityFeed;
