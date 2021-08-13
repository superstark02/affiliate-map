import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Zoom from './pages/Zoom';
import Loader from './components/loader';

function App() {
  return (
    <div>
      <Router >
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/zoom' component={Zoom} />
          <Route exact path='/loader' component={Loader} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;