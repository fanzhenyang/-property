'use strict'
let hostUrl = ''
if (process.env.NODE_ENV === 'development') {
  // 本地环境
  // hostUrl = 'http://172.26.1.102/itps/'
  hostUrl = 'http://125.75.36.79:81/itps/'
} else {
  // 线上环境
  hostUrl = 'http://172.26.1.102/itps/'
}

export default {
  hostUrl
}
