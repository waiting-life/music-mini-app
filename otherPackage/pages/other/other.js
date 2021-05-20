import {request} from '../../../request/index'
import {login} from '../../../utils/wxapi'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      userName: 'cpp',
      age: 2
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = {
      userName: 'cjz',
      age: 21
    }
    this.setData({
      userInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 获取openId
  async handleGetOpenId() {
    try {
      // 1. 获取登录凭证
      const {code} = await login()
      console.log(code)
      // 2. 将登录凭证发送给服务器
      const result = await request('/getOpenId', {code})
      console.log(result)
    } catch(err) {
      console.log(err)
    }
  }
})