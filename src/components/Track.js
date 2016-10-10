import React  from 'react';

const Track = (props) => {
  const {data, index} = props;
  return (
    <li>
      <a className="item-track" onClick={()=>props.select(index)}>
      {data.title} | {data.length}
      </a>
    </li>
  )
}

Track.propTypes = {
  data: React.PropTypes.object.isRequired,
  index: React.PropTypes.string.isRequired,
  select: React.PropTypes.func.isRequired
}

export default Track;
