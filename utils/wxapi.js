export const showToast = ({title, icon=''}) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title,
      icon,
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    });
  })
}

export const showModal = ({title='提示', content=''}) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      content,
      success: (result) => {
        resolve(result)
      },
      fail: (err)=>{
        reject(err)
      }
    });
  })
}