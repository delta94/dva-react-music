import React from 'react';
import {connect} from 'dva';
import TopListDesc from '../components/music/topList/TopListDesc';
import Playlist from '../components/music/playList/Playlist';
import Player from '../components/music/player/Player';
const MusicPage = ({dispatch, topListDesc, playlist, player}) => {
  function handleClickTopList(){
    let id = 0;
    dispatch({
      type: 'music/topListId',
      payload: id
    })
  }
  function handleFetchTopList(){
    dispatch({
      type: 'music/fetchTopList',
      payload: 0
    })
  }
  function handlePlayAll(){
    alert('播放全部')
  }
  function handlePlay(id){
    dispatch({
      type: 'music/fetchSongDetail',
      payload: id
    });
  }
  function handlePlayerPlay(){
    dispatch({
      type:'music/playerPlay'
    })
  }
  function handlePlayerPrev(){
    dispatch({
      type:'music/fetchPlayerPrev'
    })
  }
  function handlePlayerNext(){
    dispatch({
      type:'music/fetchPlayerNext'
    })
  }
  function handlePlayerLoop(){
    dispatch({
     type:'music/loop',
    })
  }
  function handlePlayerEnded(){
    console.log('music/ended');
    dispatch({
      type:'music/fetchPlayerNext',
    })
  }
  return(
    <div>
      <TopListDesc topListDesc={topListDesc} onPlayAll={handlePlayAll}/>
      <div>
        <button onClick={handleClickTopList}>点击获取id</button>
        <button onClick={handleFetchTopList}>点击获取列表</button>
      </div>
      <Playlist playlist={playlist} onPlay={handlePlay}/>
      <Player player={player}
              onPlay={handlePlayerPlay}
              onPlayPrev={handlePlayerPrev}
              onPlayNext={handlePlayerNext}
              onPlayLoop={handlePlayerLoop}
              onPlayEnded={handlePlayerEnded}
       />
    </div>
  )
}

function mapStateToProps(state){
  return {
    topListDesc: state.music.topListDesc,
    playlist: state.music.playlist,
    player: state.music.player
  }
}

export default connect(mapStateToProps)(MusicPage);
