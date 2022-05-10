import { Route, Redirect } from "react-router-dom";
import storageService from "../utils/storageService";

const PrivateRoute = ({ component: Component, authRoute, ...rest }: any) => {
  const token = storageService.getItem('jwtToken') ? storageService.getItem('jwtToken') : storageService.getItem('guestToken');
  const routeScreen = authRoute ? !token : token;
  return (
    <Route
      {...rest}
      render={props =>
        routeScreen ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: authRoute ? "/" : "/signup",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;