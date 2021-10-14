export function openDailog (params:type): any {
  const dialogVisible = ref<boolean>(false)

  /**
   *  @param value 打开弹窗
   */
  function openAction () {
    dialogVisible.value = true
  }
  /**
   *  @param value 取消弹窗
   */
  function cancel () {
    dialogVisible.value = false
  }
  return { openAction, cancel }
}
