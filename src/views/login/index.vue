<script lang="tsx">
import { defineComponent, reactive, readonly, ref } from 'vue'
import CryptoJS from 'crypto-js'
import { ILoginData } from '@/interface/user'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

interface IFormData extends ILoginData {
  [modalTypeVisible: string]: string
}

// 点击眼睛
const useChangeEye = () => {
  // 点击眼睛
  const textType = ref('password')
  const handleChangeEye = () => {
    if (textType.value === 'text') {
      textType.value = 'password'
    } else {
      textType.value = 'text'
    }
  }
  return { textType, handleChangeEye }
}
export default defineComponent({
  name: 'Login',
  setup () {
    const store = useStore()
    const router = useRouter()
    const form:Omit<IFormData, 'grant_type'> = reactive({
      username: '',
      password: '',
      client_id: 'GSTT',
      client_secret: 'cdtye2019'
    })

    const rules = readonly({
      username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
    })

    const loading = ref(false)

    // 加密
    const encrypt = (value:string):string => {
      // 如果是32位在java后端解密会报错 AES获取Cipher异常：Illegal key size 16位就不会
      // const key = CryptoJS.enc.Utf8.parse('61DC779D88F539478E45C55452AF9DBB')
      const key = CryptoJS.enc.Utf8.parse('61DC779D88F53947')
      const iv = CryptoJS.enc.Utf8.parse('1b76d0c6af4bcb56')
      const encrypted = CryptoJS.AES.encrypt(value, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString()
      return encrypted
    }

    // 点击登录提交
    const formRef = ref<HTMLFormElement | null>(null)
    const handleLogin = () => {
      const formData = new FormData()
      Object.keys(form).forEach(key => {
        formData.append(key, encrypt(form[key]))
      })
      formData.append('grant_type', 'password')

      const dom = formRef.value as HTMLFormElement

      dom.validate((vaild: boolean) => {
        if (vaild) {
          loading.value = true
          store.dispatch('user/login', formData).then((res) => {
            console.log('%c 🍈 res: ', 'font-size:20px;background-color: #F5CE50;color:#fff;', res)
            loading.value = false
            if (res) {
              router.push({ path: '/' })
            }
          }).catch(() => {
            loading.value = false
          })
        } else {
          return false
        }
      })
    }
    // 点击眼睛
    const { textType, handleChangeEye } = useChangeEye()

    return () => (
      <section class="login-wapper">
        <h1 class="login-wapper-h1">铁路投资建设智慧管控平台</h1>
        <el-form ref={formRef} model={form} class="login-wapper-form form-transparent" rules={rules}>
          <h2 class="login-wapper-h2">用户登录</h2>
          <el-form-item prop='username'>
            <el-input vModel_trim={form.username} placeholder="请输入用户名">
              { propSolt('icon-yonghutianchong') }
            </el-input>
          </el-form-item>
          <el-form-item prop='password'>
            <el-input vModel_trim={form.password} type={textType.value} placeholder="请输入密码" onKeyup={(arg: { keyCode: number }) => arg.keyCode === 13 && handleLogin()}>
              { propSolt('icon-3denglumima', textType, handleChangeEye, true) }
            </el-input>
          </el-form-item>
          <el-button type="primary" loading={loading.value} class="login-wapper-btns" onClick={handleLogin}>登录</el-button>
        </el-form>
      </section>
    )
  }
})

// iconfont
const propSolt = (cls: string, textType?: any, handleChangeEye?: () => void, isEye?: boolean) => {
  if (isEye) {
    return {
      prefix: () => <i key={cls} class={`iconfont ${cls}`}></i>,
      suffix: () => <i class={`iconfont ${textType.value === 'text' ? 'icon-mimakejian' : 'icon-buxianshimima'} iconfont-eye`} onClick={handleChangeEye}></i>
    }
  }
  return { prefix: () => <i key={cls} class={`iconfont ${cls}`}></i> }
}
</script>

<style lang="scss" scoped>
.login-wapper {
  @include flex-center(flex-start, center, nowrap, column);
  background: url("/img/login_bg.jpeg") no-repeat center center;
  background-size: 100% 100%;
  height: 100vh;
  width: 100vw;
  &-h1 {
    margin: 0;
    padding-top: 15rem;
    text-align: center;
    font-size: 3.6rem;
    font-weight: bold;
    letter-spacing: .5rem;
    background: linear-gradient(0deg, #26abdf, #fbfdfe 22%);
    color: transparent;
    -webkit-background-clip: text;
  }
  &-h2 {
    font-size: 2rem;
    color: #eee;
    margin: 0px auto 4rem auto;
    text-align: center;
    font-weight: bold;
    letter-spacing: 1rem;
  }
  &-form {
    background: url("../../assets/img/login/login_form.png") no-repeat center center;
    background-size: 100% 100%;
    position: relative;
    width: 52rem;
    height: 37rem;
    box-sizing: border-box;
    padding: 4.5rem 9rem;
  }
  &-btns {
    width: 100%;
  }
}
.iconfont-eye {
  cursor: pointer;
  right: 0;
}
.iconfont {
  @include vertically(topCenter);
}
</style>
