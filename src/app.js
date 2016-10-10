import React      from 'react';
import base       from './base';
import TopBar     from './components/TopBar';
import Footer     from './components/Footer';
import AlbumList  from './components/AlbumList';
import Tracks     from './components/Tracks';
import Playlist   from './components/Playlist';
import moment     from 'moment';
import covers     from './covers';
import 'moment-duration-format';

import './css/app.css';
import './css/playlist.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'App';
  }

  state = {
    uid: null
  };

  componentDidMount(){
    this.unsubscribe = base.onAuth((user) => {
      if(user){
        this.authHandler(null, {user});
      } else {
        this.context.router.transitionTo('/');
      }
    });
  }

  componentWillUnmount(){
    if(this.ref){
      base.removeBinding(this.ref);
    }
    if(this.unsubscribe){
      this.unsubscribe();
    }
  }

  authenticate = (provider) =>{
    base.authWithOAuthPopup(provider, this.authHandler);
  };

  authHandler(err, authData){
    if(err || !authData.user || !authData.user.uid){
      // console.error(err);
      this.context.router.transitionTo('/');
      return;
    }

    const discogRef = base.database().ref('artist/The Cure/discog');
    discogRef.orderByChild('format').equalTo('album')
      .once('value', (snapshot) => {
        const discog = snapshot.val() || {};
        // console.log({discog});
        const tracks = {}; // The album tracks
        const playlist = {tracks:{}, cover: 'faith', owner: this.state.uid};
        const mixStatus = {valid:true, minutes:'', over:0 };
        const uid = authData.user.uid;
        const displayName = authData.user.displayName || '';
        const playlistId = this.props.params.playlistId;
        
        this.setState({
            discog,
            tracks,
            playlist,
            mixStatus,
            uid,
            displayName,
            playlistId 
        });

        this.loadPlaylist(this.state.playlistId);
    });

  }

  loadPlaylist(playlistId){
    const discogRef = base.database().ref(`playlists/${playlistId}`);
    const defaultData = {tracks:{}, cover: 'faith', owner: this.state.uid, displayName: this.state.displayName};
    discogRef
      .orderByChild('stamp')
      .once('value', (snapshot) => {
        const data = snapshot.val() || defaultData;
        this.setState({
          playlist: data
        });
        this.syncState(this.state.playlistId);
      });
  }

  syncState(playlistId){
    this.ref = base.syncState(`playlists/${playlistId}`,
    {
      context: this,
      state: 'playlist',
      then: this.updateCDLength,
      queries: {orderByChild: 'stamp'} // doesn't work. limitToLast: 3 does.
    });
    // Seems a little dumb. Should be saved on first sync, but isn't - so force it...
    this.setState({playlist:this.state.playlist});    
  }

  updateCDLength(playlist){
    playlist = playlist && playlist.tracks ? playlist : this.state.playlist;
    const mixStatus = this.getPlaylistLength(playlist);
    this.setState({mixStatus});
  }

  addTrack(track){
    // console.log('addTrack ', track);
    const playlist = {...this.state.playlist};
    track.stamp =  base.database.ServerValue.TIMESTAMP;
    playlist.tracks = playlist.tracks || {};
    playlist.tracks[track.id] = track;
    this.updateCDLength(playlist);
    this.setState({playlist});
  }

  updateCover = (newCover) => {
    const playlist = {...this.state.playlist};
    playlist.cover = newCover;
    this.setState({playlist});
  }

  logout = () => {
    base.unauth();
    this.setState({
      uid: null
    });
    this.context.router.transitionTo('/');
  };

  selectAlbum = (index) => {
    const discogRef = base.database().ref(`tracks/${index}`);
    discogRef
      .once('value', (snapshot) => {
        const tracks = snapshot.val() || {};
        // console.log({tracks});
        this.setState({tracks});
    });
  };

  selectTrack = (index) => {
    const track = this.state.tracks[index];
    if(!this.state.mixStatus.valid){
      console.log('Tooooo many tracks!');
      return;
    }
    this.addTrack(track);
  };

  removeTrack = (index) => {
    // console.log('removeTrack  : index ::: ', index);
    const playlist = {...this.state.playlist};
    playlist.tracks[index] = null;
    this.updateCDLength(playlist);
    this.setState({playlist});
  };

  getPlaylistLength(playlist){
    let tracks = playlist.tracks || {};
    // console.log('getPlaylistLength : ', playlist);
    // console.log('getPlaylistLength tracks : ', tracks);
    let running = Object
      .keys(tracks)
      .reduce((c, v) => {
        let minutes, seconds;
        // We could be sending in before fb has removed and it is just null
        if(!tracks[v]){
          [minutes, seconds]= [0,0];
        } else {
          [minutes, seconds]= tracks[v].length.split(':');
        }
        // console.log({minutes, seconds});
        return c.add({
          minutes: minutes,
          seconds: seconds
        });
      }, moment.duration());
    // 4320 is max on CD. Well, it was once. Probably. It is here.
    let minutes = running.format('mm:ss');
    if(running.as('seconds') > 60 * 72){
      let over = running.subtract(60 * 72 * 1000).format('mm:ss', { trim: false });
      return {valid: false, minutes: minutes, over: over};
    }
    return {valid: true, minutes: minutes, over: 0};
  }

  render() {
    if(!this.state.discog){
      return (
        <div>
          <div className="content">
            <TopBar logout={this.logout} />
            <div></div>
          </div>
          <Footer />
        </div>
      );
    }
    return (
        <div>
          <div className="content">
            <TopBar logout={this.logout} playlistId={this.state.playlistId} />
            <AlbumList discog={this.state.discog} select={this.selectAlbum}/>
            <div className="row">
              <div className="small-12 large-6 columns">
                <Tracks tracks={this.state.tracks} select={this.selectTrack} mixStatus={this.state.mixStatus} />
              </div>
              <div className="small-12 large-6 columns">
                <Playlist playlist={this.state.playlist} removeTrack={this.removeTrack} mixStatus={this.state.mixStatus} updateCover={this.updateCover} covers={covers} />
              </div>
            </div>
          </div>
          <Footer />
        </div>
    );
  }
}

App.contextTypes = {
  router: React.PropTypes.object
}

export default App;
