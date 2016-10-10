import React     from 'react';
import { Link }  from 'react-router';
import logo      from '../img/the-cure-logo.png';

class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'TopBar';
    }
    render() {
      const aboutLink = props.playlistId ? `/about/${props.playlistId}` : '/about';  
      const img = <img src={logo} className="cure-logo" width="160" height="62" alt="home" />;
      const logoLink = props.playlistId ? img : <Link to="/">{img}</Link>;
      return (
        <div className="top-bar">
          <div className="top-bar-left">
            <ul className="dropdown menu">
              <li className="logo">
                {logoLink}
              </li>          
            </ul>
          </div>

          <div className="top-bar-right">
            <ul className="menu">
              <li className="menu-text"><Link to={aboutLink} activeClassName="active">About</Link></li>
              <li>
                <button type="button" className="button hollow" onClick={this.props.logout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      );
    }
}

TopBar.propTypes = {
  logout: React.PropTypes.func.isRequired
}

export default TopBar;
