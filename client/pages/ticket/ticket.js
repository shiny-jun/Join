// pages/ticket/ticket.js
import { getShowList, getHotList, droploadShowList ,getAllShowList} from '../../utils/api/show.js'
let offset = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hots: [],
    shows: [],
    show: true,
    searchShows: [],
    nomore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 显示分享按钮
    wx.showShareMenu(); 
    this.getShowList()
    getAllShowList()
    offset = 0
  },
  /**
* 页面相关事件处理函数--监听用户下拉动作
*/
  onPullDownRefresh: function () {
    this.onLoad()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '玩命加载中',
    })
    offset++
    droploadShowList(offset, (nomore, shows) => {
      console.log(nomore)
      if (nomore) {
        console.log('here')
        this.setData({
          nomore: nomore
        })
      } else {
        this.setData({
          shows: shows
        })
      }
      wx.hideLoading();      
    })
  },
  onShareAppMessage: (res) => {
    return {
      title: 'Join',
      desc: '校园活动，一键报名！',
      path: '/pages/ticket/ticket',
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },
  getShowList() {
    getShowList((shows) => {
      this.setData({
        shows: shows,
        nomore: false
      })
      this.getHotList()
    })
  },
  getHotList() {
    getHotList((hots) => {
      this.setData({
        hots: hots
      })
    })
  },
  goMessage(e) {
    let show = e.currentTarget.dataset.show
    // 转化为json
    console.log(show)
    show = JSON.stringify(show);
    wx.navigateTo({
      url: './ticketMessage/ticketMessage?show=' + show,
    })
  },
  searchTicket(e) {
    if (e.detail) {
      this.setData({
        show: false,
      })
    } else {
      this.setData({
        show: true,
      })
    }
    console.log(e.detail + "本函数在list")
    let title = e.detail
    let shows = wx.getStorageSync('allShows')
    var arr = []
    for (var i = 0; i < shows.length; i++) {
      var m = shows[i];
      if (m.title.indexOf(title) > -1) {
        arr.push(m);
      }
    }
    this.setData({ searchShows: arr });
  }
})