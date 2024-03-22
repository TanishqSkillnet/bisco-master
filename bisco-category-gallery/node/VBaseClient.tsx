import { IOContext, VBase } from '@vtex/api'

const service: string = process.env.VTEX_APP_NAME as string

export default function VBaseClient(ioContext: IOContext) {
  const client = new VBase(ioContext)
  const fileName = `categoriesTree.txt`

  return {
    saveFile: (data: any) => {
      var Readable = require('stream').Readable
      var s = new Readable()
      s._read = () => undefined
      s.push(JSON.stringify(data))
      s.push(null)

      return client.saveFile(service, fileName, s, false)
    },
    getFile: () => {
      return client.getFile(service, fileName)
    },
  }
}
