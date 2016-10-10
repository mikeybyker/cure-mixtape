import React     from 'react';
import { Link }  from 'react-router';
import logo      from '../img/the-cure-logo.png';

class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'TopBar';
    }

    getViewUrl = (playlistId) => {
      const parser = document.createElement('a');
      parser.href = window.location.href;
      const {protocol, host} = parser;
      const shareUrl = `${protocol}//${host}/view/${playlistId}`;
      return shareUrl;
    };

    renderMailTo = (playlistId) => {
      const view = this.getViewUrl(playlistId);
      const mt = `mailto:&subject=Cure Mix Tape&body=Check out my super Cure Mixtape!%0D%0A${view}%0D%0A%0D%0ACheers!`;
      return (
        <li>
          <a href={mt}>Share</a>
        </li>
      );
    };

    render() {
      const aboutLink = this.props.playlistId ? `/about/${this.props.playlistId}` : '/about';  
      const img = <img src={logo} className="cure-logo" width="160" height="62" alt="home" />;
      const logoLink = this.props.playlistId ? img : <Link to="/">{img}</Link>;
      const mailTo = this.props.playlistId ? this.renderMailTo(this.props.playlistId) : '';
      return (
        <div className="top-bar">
          <div className="top-bar-left">
            <ul className="dropdown menu">
              <li className="logo">
                {logoLink}
              </li>
              {mailTo}       
            </ul>
          </div>

          <div className="top-bar-right">
            <ul className="menu">
              <li><Link to={aboutLink} activeClassName="active">About</Link></li>
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
