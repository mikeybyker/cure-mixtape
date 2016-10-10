import React  from 'react';
import base   from '../base';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'Login';
  }

  state = {
    uid: null
  };

  componentDidMount(){
    this.unsubscribe = base.onAuth((user) => {
      if(user){
        this.authHandler(null, {user});
      }
    });
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  authenticate = (provider) => {
    this.unsubscribe();
    base.authWithOAuthPopup(provider, this.authHandler);
  };

  authHandler = (err, authData) => {
    if(err){
      console.error('authHandler err', err);
      return;
    }
    this.setState({
      uid: authData.user.uid
    });

    this.initData(authData);
  };

  initData(authData){
    base.fetch(`users/${authData.user.uid}/playlists`, {
      context: this
    }).then(data => {
      if(!data){
        this.startup(this.state.uid);
      } else {
        // MUST BE BETTER WAY!
        let playlistId = Object.keys(data)[0];
        console.log('Start working with: ', playlistId);
        this.context.router.transitionTo(`/create/${playlistId}`);
      }
    }).catch(error => {
      console.error(error);
    })

    /*
      @todo: when i delete track from server (or tracks...) - time not updated... hmmm...
    */

  }

  startup(uid){
    // we know there isn't a playlist stored...so make one
    const ref = base.database().ref(`users/${uid}/playlists`);
    ref.push(true).then(newLocation => {
      // We now can start working with playlist playlistId > which is newLocation.key
      this.context.router.transitionTo(`/create/${newLocation.key}`);
    });
  }

  renderButtons(){
    return (
      <div className="login-buttons" >
        <button className="secondary button" onClick={()=>this.authenticate('google')}>Google</button>
        <button className="secondary button" onClick={()=>this.authenticate('facebook')}>Facebook</button>
      </div>
    );
  }

  render() {
    const buttons = this.state.uid ? '' : this.renderButtons()
    return (
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="large-12 text-center columns">
              <div className="panel login-panel">
                {buttons}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Login.contextTypes = {
  router: React.PropTypes.object
}

export default Login;
