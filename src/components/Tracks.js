import React  from 'react';
import Track  from './Track';

const Tracks = (props) => {
  const tracks = props.tracks;
  const {valid} = props.mixStatus;
  const tracksArray = Object.keys(tracks);
  let albumName = '';
  if(!tracksArray.length){
    return <div><h4>Pick an album...</h4></div>
  }
  albumName = tracks[tracksArray[0]].albumTitle;
  return (
    <div>
      <h4>{albumName}</h4>
      <ol className={'tracks ' + (valid ? '' : 'full')}>
        {
          tracksArray
            .map(key => <Track key={key} index={key} select={props.select}
              data={tracks[key]}
            />)
        }
      </ol>
    </div>
  );
}

Tracks.propTypes = {
  tracks: React.PropTypes.object.isRequired,
  select: React.PropTypes.func.isRequired,
  mixStatus: React.PropTypes.object.isRequired
}

export default Tracks;
