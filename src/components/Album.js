import React from 'react';

class Album extends React.Component {

  render() {
    const {data, index} = this.props;
    // const cover = require(`../img/covers/${data.coverFront}`); // This works...
    // But using a spritesheet instead of 50+ image requests...
    const coverClass = `cover sprites ${data.coverFront.slice(0, -4)}`;
    return (
      <div className="slide">
        <a onClick={()=>this.props.select(index)}>
          <div className={coverClass}>
            
          </div>
          <div className="title">
            <span>{data.title}</span>
          </div>
          <div className="releaseDate">
            <span>{data.releaseDate}</span>
          </div>
        </a>
      </div>
    )
  }

  static propTypes = {
    data: React.PropTypes.object.isRequired,
    index: React.PropTypes.string.isRequired,
    select: React.PropTypes.func.isRequired
  }
}

export default Album;

// Or : Seperate images...But many of them, so not ideal. Used a sprite instead...
// <img src={cover} alt="" width="150" height="150" />
