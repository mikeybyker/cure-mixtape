import React     from 'react';
import base      from '../base';
import { Link }  from 'react-router';
import Footer    from './Footer';
import logo      from '../img/the-cure-logo.png';

import '../css/view.css';

class View extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'View';
  }

  state = {
    playlist: {}
  };

  componentDidMount(){
    this.loadPlaylist(this.props.params.playlistId);
  }

  loadPlaylist(playlistId){
    // base.fetch doesn't set up bindings - so a bit like 'once'
    base.fetch(`playlists/${playlistId}`, {
      context: this,
      queries: {
        orderByChild: 'stamp'
      }
    }).then(data => {
      this.setState({
        playlist: data
      });
    }).catch(error => {
      
    })
  }

  renderTopBar(displayName = ''){
    const title = displayName ? `A Mix Tape by ${displayName}` : '';
    return (
      <div className="top-bar">
        <div className="top-bar-left">
          <ul className="dropdown menu">
            <li>
              <Link to="/">
                <img src={logo} className="cure-logo" width="160" height="62" alt="home" />
              </Link>
            </li>
            <li className="menu-text">{title}</li>           
          </ul>
        </div>
        <div className="top-bar-right">
          <ul className="menu">
            <li className="menu-text">
              <Link to="/about" activeClassName="active">About</Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  renderTracks(tracks){
    return (
      <ol>
        {
          Object
            .keys(tracks)
            .sort((a,b) => {
              return tracks[a].stamp - tracks[b].stamp;
            })
            .map(this.renderTrack)
        }
      </ol>
    );
  }

  renderTrack = (key) => {
    const tracks = this.state.playlist.tracks;
    return (
      <li key={key}>
        {tracks[key].title}
      </li>
    );
  };

  render() {
    const {tracks = {}, cover = 'faith', displayName = ''} = this.state.playlist;
    const loaded = this.state.playlist.owner ? '' : 'waiting';
    const playClass = `playlist view ${cover} ${loaded}`;
    const header = this.renderTopBar(displayName);
    const trackList = this.renderTracks(tracks);
    return (
      <div>
        <div className="content view">
          {header}
          <div className="row align-center">
            <div className="small-8 column text-center">
              <div className="playlist-group text-left">
                <div className={playClass}>
                  {trackList}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default View;

// Rather than base.fetch, can access fb directly and use once, like this:
// const discogRef = base.database().ref(`playlists/${playlistId}`);
// discogRef.orderByChild('stamp').once('value', (snapshot) => {
//   const data = snapshot.val() || {};
//   this.setState({
//     playlist: data
//   });
// });
