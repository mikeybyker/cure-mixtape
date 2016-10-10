import React  from 'react';
import '../css/about.css';

const NotFound = (props) =>{
  return (
    <div>
      <div className="outer">
        <div className="inner">
          <h3 className="text-center">404</h3>
          <hr/>
          <p className="text-center">
            Page Not Found
          </p>
          <hr/>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
