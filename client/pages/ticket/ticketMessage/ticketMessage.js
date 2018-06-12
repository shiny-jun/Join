// pages/ticket/ticketMessage/ticketMessage.js
import { changeLove } from '../../../utils/api/user.js'
import { getJoined } from '../../../utils/api/Joined.js'
let _show = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:[],
    loved:false,
    joined:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let show = JSON.parse(options.show);
    let joined = getJoined(show.userIds)
    _show = show
    this.setData({
      show: show,
      loved:show.loved,
      joined: joined
    })
    // 显示分享按钮
    wx.showShareMenu(); 
  },
  onShareAppMessage: (res) => {
    // 转化为json   
    let show = JSON.stringify(_show);
    console.log(show)
    return {
      title: 'Join',
      desc: '校园活动，一键报名！',
      path: '/pages/ticket/ticketMessage/ticketMessage?show=' + show,
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },
  changeLove() {
    let show = this.data.show
    let love = !this.data.loved
    this.setData({
      loved: love
    })
    let id = show.id
    changeLove(love, 'show', id)
  },
  ticketFrom(){
    let type = 'ticket'
    let id = this.data.show.id
    wx.navigateTo({
      url: '../../applyForm/applyForm?type=' + type + '&id=' + id,
    })
  }
})