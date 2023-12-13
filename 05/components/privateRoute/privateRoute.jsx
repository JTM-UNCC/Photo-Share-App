import React from "react";
import {Redirect} from "react-router";
import {Route} from "react-router-dom";
import UserDetail from "../userDetail/userDetail";
import UserPhotos from "../userPhotos/userPhotos";

/**
 * Higher-order component wrapper for Routes. Will redirect to /login-register
 * if authentication fails
 *
 * @props
 *  - RoutedComponent: the component to be displayed upon authentication
 *  - auth: pass userIsLoggedIn() method from photoshare.jsx here
 *  - any other props passed will be passed down to the RoutedComponent provided
 *
 */
class PrivateRoute extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        // not sure why i have to pass props 3 times. i give up
        let { RoutedComponent, ...rest } = this.props;
        return (
            <Route {...this.props} render={(props) => this.props.auth() ?
                (RoutedComponent ? <RoutedComponent {...rest} {...props}
                /> : <div/>) :
                <Redirect to="/login-register" from={window.location.href}/>}
            />
        );


    }
}


export default PrivateRoute;