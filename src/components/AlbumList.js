import React     from 'react';
import Album     from './Album';
import moment    from 'moment';
import Carousel  from 'nuka-carousel';

import '../css/sprites.css';

// All this, just to remove dots in the slider :-|
const Decorators = [
  {
    component: React.createClass({
      render() {
        return (
          <button
            style={this.getButtonStyles(this.props.currentSlide === 0)}
            onClick={this.props.previousSlide}>&lt;</button>
        )
      },
      getButtonStyles(disabled) {
        return {
          border: 0,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: 10,
          outline: 0,
          opacity: disabled ? 0.3 : 1,
          cursor: 'pointer'
        }
      }
    }),
    position: 'CenterLeft'
  },
  {
    component: React.createClass({
      render() {
        return (
          <button
            style={this.getButtonStyles(this.props.currentSlide + this.props.slidesToScroll >= this.props.slideCount)}
            onClick={this.props.nextSlide}>&gt;</button>
        )
      },
      getButtonStyles(disabled) {
        return {
          border: 0,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: 10,
          outline: 0,
          opacity: disabled ? 0.3 : 1,
          cursor: 'pointer'
        }
      }
    }),
    position: 'CenterRight'
  }
];

const AlbumList = (props) => {
  const discog = props.discog;
  return (
    <div className="row">
      <div className="large-12 columns">
        <Carousel slideWidth="150px" cellAlign="left" cellSpacing={10} decorators={Decorators}>
          {
            Object
              .keys(discog)
              .sort((a,b) => { // Sort by date (fb sorted/queried on format, can't do both sadly...)
                return moment(discog[a].releaseDate, 'DD-MM-YYYY').unix() - moment(discog[b].releaseDate, 'DD-MM-YYYY').unix()
              })
              .map(key => <Album key={key} index={key} select={props.select}
                  data={discog[key]}
              />)
          }
        </Carousel>
      </div>
    </div>
  );

};

AlbumList.propTypes = {
  discog: React.PropTypes.object.isRequired,
  select: React.PropTypes.func.isRequired
}

export default AlbumList;
