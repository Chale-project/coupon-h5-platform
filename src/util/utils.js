import { Toast, Notify } from 'vant';
import api from "@/util/api";
const util = {
  title: (title) => {
    title = title || '伟业腾达';
    window.document.title = title;
  },

  showToast: (text) => {
    Toast(text)
  },

  showToastError: (text = '操作失败！') => {
    Toast.fail(text);
  },

  showToastSuccess: (text = '操作成功！') => {
    Toast.success(text);
  },

  notifyError: (text) => {
    Notify({
      message: text,
      background: '#ff4444'
    });
  },

  notifySuccess: (text) => {
    Notify({
      message: text,
      background: '#1989fa'
    });
  },

  loading: (text) => {
    Toast.loading({
      mask: true,
      message: text || '加载中...'
    });
  },

  formatPrice: (price) => {
    return "¥" + (price / 100).toFixed(2);
  },

  setStorage: (key, value) => {
    localStorage.setItem(key, value);
  },

  getStorage: (key) => {
    return localStorage.getItem(key);
  },

  removeStorage: (key) => {
    localStorage.removeItem(key);
  },

  formatTime: (timeStamp) => {
    var date = new Date(timeStamp)
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return [year, month, day].map(util.formatNumber).join('-');
    //return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
  },

  formatNumber: (n) => {
    n = n.toString();
    return n[1] ? n : '0' + n;
  },

  timeStamp: (str) => {
    return new Date(str).getTime()
  },

  //文件上传接口调用
  fileUpload: (file) => {
    let formData = new FormData();
    formData.append('file', file);
    return new Promise((resolve, reject) => {
      api.fileUpload(formData).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

};



export default util;
