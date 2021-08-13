import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Zoom from './components/Zoom';

function App() {
  return (
    <div>
      <Router >
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/zoom' component={Zoom} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;