import { releaserIdentity, getReleaserInfo } from '../../../utils/api/addReleaser.js'

Page({
  data: {
    user: {}
  },
  submit(e) {
    // 子组件传递过来的表格元组数据
    let formData = e.detail

    wx.getStorage({
      key: 'user',
      success: function (res) {
        let id = res.data.id.toString()

        console.log(formData)

        if (getReleaserInfo(id)) {
          formData.user_id = id
          
          console.log(formData)

          let resData = releaserIdentity(formData)

          console.log(resData)
        }else{
          wx.showToast({
            title: '你已经提交过申请。',
            icon: 'none',
            duration: 500
          })
        }
      }
    })
    
  }
})