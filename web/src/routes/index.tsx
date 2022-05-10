import routes from "./routesData";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import PrivateRoute from "./privateRoute";
import Header from "../common/header/index";
import ScrollToTop from "../common/scrollToTop";
import CustomNotification from "../common/customNotification";

const Routes = () => {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <CustomNotification />
      <Switch>
        {routes.map((route: any) => {
          if (route.redirectTO) {
            return <Redirect to={route.redirectTO} key={route.path} />;
          }
          if (route.privateRoute) {
            // return <PrivateRoute path={route.path} component={route.component} />
            return <PrivateRoute {...route} key={route.path} />;
          }
          if (route.authRoute) {
            // return <PrivateRoute path={route.path} Component={route.component} authRoute />
            return <PrivateRoute {...route} key={route.path} />;
          }
          return (
            <Route
              path={route.path}
              component={route.component}
              exact={route.exact}
              key={route.path}
            />
          );
        })}
        {/* <Redirect from='*' to='/' /> */}
      </Switch>
    </Router>
  );
};

export default Routes;
