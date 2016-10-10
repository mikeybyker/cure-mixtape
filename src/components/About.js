import React     from 'react';
import { Link }  from 'react-router';
import Footer    from './Footer';

import '../css/about.css';

const About = (props, context) => {
  const link = props.params.playlistId ? `/create/${props.params.playlistId}` : '/';
  const linkText = props.params.playlistId ? 'Back' : 'Have a Go';
  const returnButton = <Link className="button expanded" to={link}>{linkText}</Link>;
  const backButton = props.params.playlistId ? '' : <button className="button expanded" onClick={()=>{window.history.back()}}>Back</button>;
  return (
    <div>
      <div className="outer">
        <div className="inner">
          <h3 className="text-center">Cure Mixtape</h3>
          <hr/>
          <p>
            It's a Cure Mix CD really.
          </p>
          <p>
            Pick an album, select a track to add it to your own CD. In my head I think CDs (used) to be limited to 72 minutes long, so although quite possibly wrong, that's the cut-off here too. I might limit the number of tracks too, just so they fit on the cover designs...
          </p>
          <p>
            The data (CDs by The Cure) are from my collection - I do have duplicates, being a bit obsessive and all, so that's why a few albums appear a couple of times. I limited it to CD albums only. If I added vinyl and singles etc. in, we would be here forever. I have lots of Cure records...
          </p>
          <p>
            No real point to the app other than a bit of fun. Ace.
          </p>
          <hr/>
          {returnButton}
          {backButton}
        </div>
      </div>
      <Footer />
    </div>
  );
}

About.contextTypes = {
  router: React.PropTypes.object
}

export default About;
