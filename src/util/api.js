import Fly from './flyio';

const api = {

  
  //注册
  register: (paramObj) => Fly.post("wxMiNiApp/register", paramObj),

  //登录
  getAuth: (paramObj) => Fly.post("wxMiNiApp/login/new", paramObj),

  //游客登录登
  visitorAuth: (paramObj) => Fly.post("wxMiNiApp/mobileCode", paramObj),

  //刷新token
  refreshToken: () => Fly.post("api/refresh"),

  //获取短信验证码
  getSmsCode: (mobile) => Fly.get("wxMiNiApp/registerSmsSend/" + mobile),

  //文件上传接口
  fileUpload: (paramObj) => Fly.post("basic/file/upload", paramObj),

  //首页轮播图
  getHomeAdBanner: () => Fly.get("wxMiNiApp/queryAdvert"),

  //首页机构分页列表
  getHomeInstitution: (paramObj) => Fly.post("wxMiNiApp/page/list", paramObj),

  //首页产品列表
  getProductList: (id) => Fly.get("wxMiNiApp/product/info/" + id),

  //获取兑换流程
  getExchangeStep: (id) => Fly.get("homepage/path/info/" + id),

  //提交申请兑换
  submitApply: (paramObj) => Fly.post("homepage/add", paramObj),

  //获取兑换列表
  getOrderList: (paramObj) => Fly.post("homepage/record/list", paramObj),

  //获取兑换记录详情
  getOrderDetail: (id) => Fly.get("homepage/info/" + id),

}

export default api

