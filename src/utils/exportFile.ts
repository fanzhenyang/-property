import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default class fileSaver {
  static getExcel (res: any, name: string, type = 'application/vnd.ms-excel', typeName = 'xlsx'): void {
    const blob = new Blob([res], {
      type
    })
    FileSaver.saveAs(blob, `${name}.${typeName}`)
  }

  static getImgUrl (url:string, name: string): void {
    const last = url.substring(url.lastIndexOf('.'), url.length)
    FileSaver.saveAs(url, `${name}${last}`)
  }

  static getDownLoadImg (res: any, filename: string, filetype = 'jpeg'): void {
    const blob = new Blob([res], { type: `image/${filetype}` })
    FileSaver.saveAs(blob, `${filename}.${filetype}`)
  }

  static exportExcel (id: string, name: string, type : string): any {
    const xlsxParam = { raw: true } // 导出的内容只做解析，不进行格式转换
    debugger
    const wb = XLSX.utils.table_to_book(document.querySelector(id), xlsxParam)
    const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
    try {
      fileSaver.getExcel(wbout, name, type)
    } catch (e) {
      if (typeof console !== 'undefined') { console.log(e, wbout) }
    }
    return wbout
  }
}
