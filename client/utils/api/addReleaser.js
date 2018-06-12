// 参考 https://doc.minapp.com/js-sdk/schema/create-record.html#%E6%B7%BB%E5%8A%A0%E6%99%AE%E9%80%9A%E6%95%B0%E6%8D%AE
let query = new wx.BaaS.Query()
let tableID = 39554
let Product = new wx.BaaS.TableObject(tableID)
let product = Product.create()

function releaserIdentity (data) {
  product.set(data).save().then(res=>{
    console.log(res)
    return res.data
  },err=>{
    wx.showToast({
      title: '提交失败',
      icon: 'none',
      duration: 500
    })
  })
}

function getReleaserInfo(user_id) {

  // 此处created_by字段对应该用户的唯一id
  Product.setQuery(query.contains('user_id', user_id)).find().then(res => {
    // success
    console.log(res)

    return res.data.objects.length>0

  }, err => {
    // err
    console.log('查询失败。')
  })
}

function p_rightConfirm () {

}

module.exports = {
  releaserIdentity,
  getReleaserInfo
}