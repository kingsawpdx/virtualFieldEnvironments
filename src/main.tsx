//import React from 'react';
import ReactDOM from 'react-dom';
//import App from './App.tsx'
import PhotoSphereViewerComponent from './PhotoSphereViewerComponent.tsx';
import './index.css'

const App = () => {
    return <PhotoSphereViewerComponent />;
};

ReactDOM.render(<App />, document.getElementById('root'));
