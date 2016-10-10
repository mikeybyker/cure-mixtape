import React               from 'react';
import CSSTransitionGroup  from 'react-addons-css-transition-group';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'Playlist';
  }
  
  state = {
    active: false
  };

  prevCover = () => {
    const cover = this.props.playlist.cover || 'faith';
    const index = this.props.covers.findIndex((str) => str === cover);
    if(index !== -1 && index > 0){
      this.changeCover(index-1);
    }
  };

  nextCover = () => {
    const cover = this.props.playlist.cover || 'faith';
    const index = this.props.covers.findIndex((str) => str === cover);
    if(index !== -1 && index < this.props.covers.length - 1){
      this.changeCover(index+1);
    }
  };

  changeCover = (index) => {
    const newCover = this.props.covers[index];
    this.props.updateCover(newCover);
    this.setState({active:true});
    /*
      Small hack :-) Although it doesn't break as such if user changes the cover before the
      animation completes, it does often look ugly. So forcing disabled state on buttons
      for a little longer than the animation runs...
    */
    setTimeout(() => this.setState({active:false}), 1100);
  };

  renderCoverButtons(cover){
    const index = this.props.covers.indexOf(cover);
    const disable = {'disabled':'disabled'};
    const previousProps = (index === 0 || this.state.active) ? {...disable} : {};
    const nextProps = (index === this.props.covers.length-1 || this.state.active) ? {...disable} : {};
    return (
      <div className="text-right">
        <button className='button tiny hollow' {...previousProps} title="change cover" onClick={this.prevCover}>&lt;</button>
        <button className='button tiny hollow' {...nextProps} title="change cover" onClick={this.nextCover}>&gt;</button>
      </div>
    );
  }

  renderTrack = (key) => {
    const tracks = this.props.playlist.tracks;
    return (
      <li key={key}>
        <a onClick={()=>{this.props.removeTrack(key)}}>{tracks[key].title}</a>
      </li>
    );
  };

  renderCDLength(valid, minutes, over){
    let overDiv = valid ? '' : <div><small>Over by {over}</small></div>
    return (
      <div className={'totalLength ' + (valid ? '' : 'warning')}>
        Length: {minutes}
        {overDiv}
      </div>
    );
  }

  render() {
    const {tracks = {}, cover = 'faith'} = this.props.playlist;
    const {valid, minutes, over} = this.props.mixStatus;
    const lengthDisplay = this.renderCDLength(valid, minutes, over);
    const playClass = `playlist ${cover}`;
    const coverButtons = this.renderCoverButtons(cover);

    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <h4>Your Mix CD</h4>
          </div>
        </div>
        <div className="playlist-group">
          {coverButtons}
          <CSSTransitionGroup
              component='div'
              transitionName='covergroup'
              className={playClass}
              transitionEnterTimeout={1000}
              transitionLeaveTimeout={1000}
          >
            <span key={playClass}>
              {lengthDisplay}
              <ol className={valid ? '' : 'full'}>
                {
                  Object
                    .keys(tracks)
                    .sort((a,b) => {
                      return tracks[a].stamp - tracks[b].stamp;
                    })
                    .map(this.renderTrack)
                }
              </ol>
           </span>
          </CSSTransitionGroup>
        </div>
      </div>
    );
  }

  static propTypes = {
    playlist: React.PropTypes.object.isRequired,
    removeTrack: React.PropTypes.func.isRequired,
    mixStatus: React.PropTypes.object.isRequired,
    updateCover: React.PropTypes.func.isRequired,
    covers: React.PropTypes.array.isRequired
  };
}

export default Playlist;

/*
  @todo
  limit to 18? 16?...Purely for number of tracks to fit in cover images...  
*/