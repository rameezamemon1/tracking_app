import { Switch, Route, BrowserRouter } from "react-router-dom";
import GetUsers from "./Pages/Getusers";
import QrCodeReader from "./Pages/QrCodeReader";
import './App.css'
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={GetUsers}></Route>
        {/* <Route exact path="/users" component={GetUsers}></Route> */}
        <Route exact path="/QrCodeReader" component={QrCodeReader}></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
