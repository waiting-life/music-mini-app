import config from './config'
export const request = (url, data = {}, method="GET") => {
  // const baseUrl = 'http://localhost:3000'
  return new Promise((resolve, reject) => {
    wx.request({
    // 本地host
    url: `${config.host}${url}`,
    // 真机
    // url: `${config.mobileHost}${url}`,
     data,
     method,
     header: {
       cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) : ''
     },
     success:(result) => {
       if(data.isLogin) {
         // 将用户的cookie存储到本地
         wx.setStorage({
           key: 'cookies',
           data: result.cookies
         });
       }
       resolve(result.data)
     },
     fail:(err) => {
       reject(err)
     }
    })
  })
}