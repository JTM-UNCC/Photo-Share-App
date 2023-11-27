import React from "react";
import {Redirect} from "react-router";
import {Route} from "react-router-dom";
import UserDetail from "../userDetail/userDetail";
import UserPhotos from "../userPhotos/userPhotos";

class PrivateRoute extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        const RoutedComponent = this.props.RoutedComponent;
        return (
            <Route path={this.props.path} render={(props) => this.props.userIsLoggedIn() ?
                (RoutedComponent ? <RoutedComponent {...props} {...this.props}
                                                    /> : <div/>) :
                <Redirect to="/login-register" from={window.location.href}/>}
            />
        );


    }
}

export default PrivateRoute;