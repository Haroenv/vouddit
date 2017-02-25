import React, {Component, PropTypes} from 'react';
import ReactPlayer from 'react-player';
import {connect} from 'react-redux';

import {
  togglePlayer, toggleControls,
  setVolume, updatePlayed,
  seek, setDuration
} from '../redux/actions/playerActions';

import icons from '../icons';

import {
  Wrapper,
  ControlBar,
  Progress,
  ProgressFilled,
  Time,
  Controls,
  Toggle,
  Volume,
  PrevButton,
  NextButton
} from './PlayerStyles';

import {secToFormat} from '../lib/utils';

class Player extends Component {
  componentWillReceiveProps(nextProps) {
    // checks if a new video is being loaded
    if(nextProps.url !== this.props.url) {
      // reset the progress and time
      this.props.dispatch(updatePlayed(0));
      this.props.dispatch(setDuration(0));
    }
  }

  toggleControls(e) {
    if(e.type === 'mouseenter') {
      this.props.dispatch(toggleControls());    
    } else {
      this.props.dispatch(toggleControls());
    }
  }

  scrub(e) {
    const seekTo = parseFloat(e.nativeEvent.offsetX / e.target.parentNode.offsetWidth);
    this.player.seekTo(seekTo);
    this.props.dispatch(updatePlayed(seekTo));
  }

  render() {
    // redux variables
    const {
      playing,
      played,
      volume,
      seeking,
      showControls,
      duration,
      dispatch,
      getPrevNextPost,
      url,
      isFirst,
      hideControls,
      showSettings
    } = this.props;

    // functions
    const {
      toggleControls,
      scrub
    } = this;

    return (
      <Wrapper 
        onMouseEnter={toggleControls.bind(this)}
        onMouseLeave={toggleControls.bind(this)}
        // check playerstyles to find out why this is passed
        showSettings={showSettings}>
        <ReactPlayer 
          ref={player => {this.player = player}}
          url={url}
          playing={playing}
          volume={volume}
          // this is pretty dodgy because this means we're updating
          // the state alot, but it does give us a smooth bar
          progressFrequency={duration < 1000 ? duration : 1000}
          onPlay={() => (dispatch(togglePlayer(true)))} 
          onPause={() => dispatch(togglePlayer(false))}
          onProgress={({played}) => !seeking && dispatch(updatePlayed(played))}
          onDuration={(duration) => dispatch(setDuration(duration))}
          onEnded={() => {
            // reset the player and start the next post
            dispatch(updatePlayed(0));
            getPrevNextPost(true);
          }}
          width="100%"
          height="100%"
          // this doesn't work with the default showinfo=0 option
          // thank google for that but it's either the title bar or small logo
          youtubeConfig={{playerVars: {modestbranding: 1}}} />
        <ControlBar visible={showControls} hideCompletely={hideControls}>
          <Progress
            extend={showControls}
            onClick={scrub.bind(this)}
            onMouseMove={seeking && scrub.bind(this)}
            onMouseDown={() => {
              dispatch(seek(true));
              dispatch(togglePlayer(false));
            }}
            onMouseUp={() => {
              dispatch(seek(false));
              dispatch(togglePlayer(true));
            }}
            onMouseLeave={() => seeking && dispatch(seek(false), togglePlayer(true))}
            >
            <ProgressFilled played={played} />
          </Progress>
          <Controls>
            <Toggle 
              src={playing ? icons.pause : icons.play_arrow}
              onClick={() => dispatch(togglePlayer())}
            />
            <Time>{secToFormat(played * duration)} / {secToFormat(duration)}</Time>
            <Volume
              onChange={(e) => dispatch(setVolume(parseFloat(e.target.value)))}
              type="range"
              name="volume"
              min={0} max={1} step={0.05} 
              value={volume} />
          </Controls>
        </ControlBar>
        <PrevButton
          visible={!isFirst && showControls}
          onClick={() => getPrevNextPost(false)}
          src={icons.chevron_left} />
        <NextButton 
          visible={showControls}
          onClick={() => getPrevNextPost(true)}
          src={icons.chevron_right} />
      </Wrapper>
    );
  }
}

Player.propTypes = {
  playing: PropTypes.bool.isRequired,
  played: PropTypes.number.isRequired,
  volume: PropTypes.number.isRequired,
  seeking: PropTypes.bool.isRequired,
  showControls: PropTypes.bool.isRequired,
  duration: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

const mapStateToProps = ({player}, ownProps) => {
  return {
    playing: player.playing,
    played: player.played,
    volume: player.volume,
    seeking: player.seeking,
    showControls: player.showControls,
    duration: player.duration,
  }
}

export default connect(mapStateToProps)(Player);
