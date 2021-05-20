import {request} from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    banners: [],
    recommends: [],
    topMusics: []
  },
  //options(Object)
  onLoad: function(options){
    // 获取轮播图数据
    this.getBanners()
    // 获取歌单数据
    this.getRecommends()
    // 获取排行榜数据
    this.getTopMusics()
  },
  onReady: function(){
    
  },
  async getBanners() {
    const {banners} = await request('/banner', { type: 2 })
    // console.log(banners)
    this.setData({
      banners
    })
  },
  async getRecommends() {
    const {result} = await request('/personalized', { limit: 10 })
    // console.log(result)
    this.setData({
      recommends: result
    })
  },
  async getTopMusics() {
    let index = 0
    let newMusics = []
    while(index < 5) {
      const {playlist} = await request('/top/list', {idx: index++})
      // console.log(playlist)
      let topMusicItem = {
        id: playlist.id,
        name: playlist.name,
        tracks: playlist.tracks.slice(0,3)
      }
      newMusics.push(topMusicItem)
      // 在这里用户体验好一点，不需要等到五次请求全部结束才更新，但是渲染次数多
      this.setData({
        topMusics: newMusics
      })
    }

    // 在此处更新数据会导致发送请求的过程中页面长时间白屏，用户体验差
    // this.setData({
    //   topMusics: newMusics
    // })
  },
  toRecommendSong() {
      wx.navigateTo({
        url: '/pages/recommendSong/recommendSong'
      });
  }
});