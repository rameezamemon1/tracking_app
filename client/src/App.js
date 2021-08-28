import GetUsers from "./Pages/Getusers";
import QrCodeReader from "./Pages/QrCodeReader";
import { Provider } from "react-redux";
import store from "./store";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  withRouter,
} from "react-router-dom";
import "./App.css";

function App() {

  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/">
            <GetUsers />
          </Route>
          <Route exact path="/QrCodeReader">
            <QrCodeReader />
          </Route>
        </Switch>
      </Router>
    </Provider>);
}

export default App;
