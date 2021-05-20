/**
 * 登录流程
 * 1. 收集表单项数据
 * 2. 前端验证
 *    2.1 验证用户信息(账号、密码)是否合法
 *    2.2 前端验证不通过就提示用户，不需要给后端发请求
 *    2.3 前端验证通过了，发请求(携带账号、密码)给服务器
 * 3. 后端验证
 *    3.1 验证用户是否存在
 *      a. 用户存在：验证密码是否正确
 *      密码正确：返回数据给前端，提示用户登录成功(会携带用户的相关信息)
 *      密码不正确：返回数据给前端，提示密码不正确
 *      b. 用户不存在：直接返回，告诉前端用户不存在
 */

import {request} from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime';
import { showToast} from '../../utils/wxapi'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //  表单项的内容发生改变时的回调 
  handleInput(e) {
    // let type = e.currentTarget.id 
    // console.log(type, e.detail.value)
    let type = e.currentTarget.dataset.type
    this.setData({
      [type]: e.detail.value
    })
  },
  // 登录
  async login() {
    // 1. 收集表单项数据
    const {phone, password} = this.data
    // 2. 前端验证
    /**
     * 手机号验证
     * 1. 内容为空
     * 2. 手机号格式不正确
     * 3. 手机号格式正确，验证通过
     */
    if(!phone) {
      // 提示用户
      showToast({ title: '手机号不能为空', icon: 'none'})
      return
    }
    // 定义正则表达式
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if(!phoneReg.test(phone)) {
      showToast({title: '手机号格式错误', icon: 'none'})
      return 
    }
    if(!password) {
      showToast({title: '密码不能为空', icon: 'none'})
      return
    }
    // 后端验证
    const {code, profile} = await request('/login/cellphone', { phone, password, isLogin: true})
    console.log(profile)
    if(code === 200) {
      showToast({title: '登陆成功'})
      // wx.switchTab不会销毁和重建
      // wx.switchTab({
      //   url: '/pages/personal/personal',
      // });

      wx.reLaunch({
        url: '/pages/personal/personal',
      });
      wx.setStorageSync('userInfo', JSON.stringify(profile));
        
    } else if(code === 400) {
      showToast({title: '手机号错误', icon: 'none'})
    } else if(code === 502) {
      showToast({title: '密码出错误', icon: 'none'})
    } else {
      showToast({title: '登陆失败，请重新登录', icon: 'none'})
    }
  }
})