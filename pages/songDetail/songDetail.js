import PubSub from 'pubsub-js'
import moment, { duration } from 'moment'

import {request} from '../../request/index'
const appInst =  getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    songDetail: {},
    ids: '',
    songLink: '',
    currentTime: '00:00', // 实时时间
    durationTime: '00:00', // 总时长
    currentWidth: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.song)
    // get传参对参数长度有限制
    // const song = JSON.parse(options.song)

    // console.log(options)
    const {ids} = options
    this.setData({
      ids
    })
    // 获取音乐详情
    this.getSongPlayInfo(ids)

    if(appInst.globalData.isSongPlay && appInst.globalData.ids === ids) {
      // 修改当前页面播放状态为true
      this.setData({
        isPlay: true
      })
    }
    // 创建控制音乐播放的实例对象
    this.backAudioManager = wx.getBackgroundAudioManager();
    // 监听音乐暂停/播放/停止
    this.backAudioManager.onPlay(() => {
      // console.log('play')
      // 修改音乐isPlay的状态
     this.changePlayState(true)
     // 修改全局音乐播放状态
     appInst.globalData.ids = ids
    })
    this.backAudioManager.onPause(() => {
      // console.log('pause')
      this.changePlayState(false)
    })
    this.backAudioManager.onStop(() => {
      // console.log('stop')
      this.changePlayState(false)
    })

    // 监听音乐实时播放的进度
    this.backAudioManager.onTimeUpdate(() => {
      // console.log('总时长:', this.backAudioManager.duration)
      // console.log('当前播放时长:', this.backAudioManager.currentTime)
      // 格式化实时的播放时长
      const currentTime = moment(this.backAudioManager.currentTime*1000).format('mm:ss')
      const currentWidth = this.backAudioManager.currentTime/this.backAudioManager.duration*450
      this.setData({
        currentTime,
        currentWidth
      })
    })

    // 监听音乐自然播放结束
    this.backAudioManager.onEnded(() => {
      // 自动切换至下一首音乐，并且自动播放
      console.log(111)
      PubSub.publish('changeSongType', 'next')
      // 将实时进度条的长度还原为0
      this.setData({
        currentWidth: 0,
        currentTime: '00:00'
      })
    })
  },
  // 修改音乐播放状态的功能函数
  changePlayState(isPlay) {
    this.setData({
      isPlay
    })

    // 修改全局音乐播放状态 
    appInst.globalData.isSongPlay = isPlay
  },

  handleMusicPlay() {
    let {songLink} = this.data
    const isPlay = !this.data.isPlay
    // this.setData({
    //   isPlay
    // })
    this.handleMusicControl(isPlay, this.data.ids, songLink)
  },
  async getSongPlayInfo(ids) {
    const {songs} = await request(`/song/detail?ids=${ids}`)
    const durationTime = moment(songs[0].dt).format('mm:ss')
    this.setData({
      songDetail: songs[0],
      durationTime
    })
    // 动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.songDetail.name,
    });
  },
  // 控制音乐播放/暂停的功能函数
  async handleMusicControl(isPlay, ids, songLink) {
    if(isPlay) {  // 音乐播放
      if(!songLink) {
        // 获取音乐播放链接
        const songLinkData = await request(`/song/url?id=${ids}`)
        songLink = songLinkData.data[0].url
        this.setData({
          songLink
        })
      }
      // console.log(songLink)
      this.backAudioManager.src = songLink
      this.backAudioManager.title = this.data.songDetail.name
    } else {    // 音乐暂停
      this.backAudioManager.pause()
    }
  },

  // 点击切换歌曲的回调
  handleChangeSong(e) {
    const type = e.currentTarget.id
    // console.log(type)
    // 关闭当前播放的音乐
    this.backAudioManager.stop()
    // 订阅来自recommendSong的ids
    PubSub.subscribe('ids', (_, ids) => {
      // console.log(ids)
      // 获取音乐详情信息
      this.getSongPlayInfo(ids)
      // 自动播放对应的歌曲
      // 这里不应该传歌曲链接参数
      this.handleMusicControl(true, ids)
      // 取消订阅
      PubSub.unsubscribe('ids')
    })
    // 发布消息给recommendSong页面
    PubSub.publish('changeSongType', type)
  }
})