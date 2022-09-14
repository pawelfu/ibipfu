import React from 'react';
import {BrowserRouter, Link, Route} from 'react-router-dom';
import {SeverityLevel} from '@microsoft/applicationinsights-web';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin, withAITracking } from '@microsoft/applicationinsights-react-js';
import './App.css';
import { getAppInsights } from './TelemetryService';
import TelemetryProvider from './telemetry-provider';

const Home = () => (
    <div>
        <h2>Home Page</h2>
    </div>
);

const About = () => (
    <div>
        <h2>About Page</h2>
    </div>
);

const Header = () => (
    <ul>
        <li>
            <Link to="/">Home</Link>
        </li>
        <li>
            <Link to="/about">About</Link>
        </li>
    </ul>
);

const App = () => {
    let appInsights = require("applicationinsights");
    appInsights.setup("InstrumentationKey=5e2eb9b7-9e08-410b-adff-bc4a0461906c;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/;LiveEndpoint=https://westeurope.livediagnostics.monitor.azure.com/").start();
    
    function trackException() {
        appInsights.trackException({ error: new Error('some error'), severityLevel: SeverityLevel.Error });
    }

    function trackTrace() {
        appInsights.trackTrace({ message: 'some trace', severityLevel: SeverityLevel.Information });
    }

    function trackEvent() {
        appInsights.trackEvent({ name: 'some event' });
    }

    function throwError() {
        let foo = {
            field: { bar: 'value' }
        };

        // This will crash the app; the error will show up in the Azure Portal
        return foo.fielld.bar;
    }

    function ajaxRequest() {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://httpbin.org/status/200');
        xhr.send();
    }

    function fetchRequest() {
        fetch('https://httpbin.org/status/200');
    }

    return (
      <BrowserRouter>
        <TelemetryProvider instrumentationKey="5e2eb9b7-9e08-410b-adff-bc4a0461906c" after={() => { appInsights = getAppInsights() }}>
          <div >
            <Header />
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
          </div>
          <div className="App">
            <button onClick={trackException}>Track Exception</button>
            <button onClick={trackEvent}>Track Event</button>
            <button onClick={trackTrace}>Track Trace</button>
            <button onClick={throwError}>Autocollect an Error</button>
            <button onClick={ajaxRequest}>Autocollect a Dependency (XMLHttpRequest)</button>
            <button onClick={fetchRequest}>Autocollect a dependency (Fetch)</button>
          </div>
        </TelemetryProvider>
      </BrowserRouter>
    );
};

export default App;
