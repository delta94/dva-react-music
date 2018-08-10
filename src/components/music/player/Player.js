import React from 'react';
import {Slider} from 'antd';
import styles from './Player.css';
import {formatTime} from "../../../utils/tool";
import Lyric from '../lyric/Lyric';
import Playlist from '../playlist/Playlist';

class Volume extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <i onClick={this.props.switchMuted}
           className={`iconfont ${this.props.muted ? 'icon-jingyin' : 'icon-shengyin'} ${styles.shengyin}`}></i>
        <Slider className={styles.volBar}
                tipFormatter={null}
                defaultValue={this.props.volume}
                max={1}
                min={0}
                step={0.01}
                onChange={this.props.volumeChange}/>
      </>
    )
  }
}

class Loop extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let loopClass = null;
    switch (this.props.loopType) {
      case 0:
        loopClass = 'icon-danquxunhuan';
        break;
      case 1:
        loopClass = 'icon-xunhuan';
        break;
      case 2:
        loopClass = 'icon-suijibofang';
        break;
    }
    return (
      <i onClick={this.props.onPlayLoop} className={`${styles.loop} iconfont  ${loopClass}`}></i>
    )
  }
}

class ListIcon extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return (
        <span onClick={this.props.onPlaylistShow} className={styles.listIconWrapper}>
          <i className={`${styles.list} iconfont icon-bofangliebiao`}></i>
          {this.props.count}
        </span>
    )
  }
}

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.handleSwitchMuted = this.handleSwitchMuted.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.handleCurrentTimeChange = this.handleCurrentTimeChange.bind(this);
    this.handlePlaylistShow = this.handlePlaylistShow.bind(this);
    this.state = {
      currentTime: 0,
      duration: 0,
      percent: 0,
      volume: 0.5,
      isShowPlaylist: false,
      muted: false,
      lyricActiveNo: 0,
    }
  }

  handlePlay() {
    if (this.props.player.isPlay) {
      this.player.play();
    } else {
      this.player.pause();
    }
  }
  handleSwitchMuted(){
    this.setState({muted:!this.state.muted},()=>{
        this.player.muted = this.state.muted;
    });
  }
  handleVolumeChange(volume) {
    this.setState({muted: false, volume},()=>{
      this.player.muted = this.state.muted;
      this.player.volume = volume;
    });
  }
  handleCurrentTimeChange(v) {
    this.player.currentTime = (v/100)*(this.player.duration);
  }
  onTimeUpdate(e) {
    let T = e.target.currentTime;
    let No = this.state.lyricActiveNo;
    let lyricActiveNo = 0;
    let lyricArr = this.props.player.lyric;
    if(lyricArr){
      if(lyricArr[No].time && lyricArr[No].time<= T && lyricArr[No+1].time && T<=lyricArr[No+1].time){
        lyricActiveNo = No;
      }else{
        lyricActiveNo = No+1;
      }
      this.setState({
        lyricActiveNo,
      });
    }
  }
  handlePlaylistShow(){
    this.setState({
      isShowPlaylist: !this.state.isShowPlaylist,
    });
    this.props.onGetLyric();
  }
  componentDidUpdate() {
    this.handlePlay();
  }

  componentDidMount() {
    const _player = this.player;
    setInterval(() => {
      this.setState({
        currentTime: _player.currentTime,
        percent: _player.currentTime * 100 / (this.props.player.songDetail.dt / 1000)
      })
    }, 1000)
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.controlContainer}>
            <i onClick={this.props.onPlayPrev}
               className={`iconfont icon-shangyishou ${styles.shangyishou}`}>
            </i>
            <i onClick={this.props.onPlay}
               className={
                 `iconfont
                ${!this.props.player.isPlay ? 'icon-bofang ' + styles.bofang : 'icon-zanting ' + styles.zanting}`}>
            </i>
            <i onClick={this.props.onPlayNext}
               className={`iconfont icon-xiayishou ${styles.xiayishou}`}>
            </i>
          </div>
          <div className={styles.durationContainer}>
            <div className={styles.picWrapper}>
              <img className={styles.pic} src={this.props.player.songDetail.picUrl} alt=""/>
            </div>
            <div className={styles.songName}>
              {this.props.player.songDetail.songName}
              <span className={styles.singerName}>{this.props.player.songDetail.singer}</span>
            </div>
            <div className={styles.progressContainer}>
              <Slider className={styles.progress}
                      tipFormatter={null}
                      value={this.state.percent || 0}
                      step={1}
                      onChange={this.handleCurrentTimeChange}
              />
              <div
                className={styles.dt}>{formatTime(this.state.currentTime) + '/ ' + formatTime(this.props.player.songDetail.dt / 1000)}</div>
            </div>
          </div>
          <Loop loopType={this.props.player.loopType} onPlayLoop={this.props.onPlayLoop}/>
          <Volume volume={this.state.volume} muted={this.state.muted} switchMuted={this.handleSwitchMuted} volumeChange={this.handleVolumeChange}/>
          <ListIcon onPlaylistShow={this.handlePlaylistShow} count={this.props.player.playlist.length||0}/>
          {
            this.state.isShowPlaylist &&
            <>
              <Playlist playlist={this.props.player.playlist}
                        onPlaylistPlay={this.props.onPlaylistPlay}
              />
              {<Lyric lyric={this.props.player.lyric}  lyricActiveNo={this.state.lyricActiveNo}/>}
            </>
          }
        </div>
        <audio ref={player => this.player = player}
               onEnded={this.props.onPlayEnded}
               onTimeUpdate={this.onTimeUpdate}
               src={this.props.player.currentSongUrl}
               controls="controls">
          您的浏览器不支持 audio 标签。
        </audio>
      </div>
    )
  }
}

export default Player;
