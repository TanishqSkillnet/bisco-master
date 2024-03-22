import { VBase } from '@vtex/api'

const service: string = process.env.VTEX_APP_NAME as string

export default function VBaseClient(ioContext: ReqContext, locale?: string) {

  if(!locale) {
    locale = 'en'
  }

  const client = new VBase(ioContext)
  const fileName = `categoriesTree.txt`
  const fileNamewithLocale = `categoriesTree${locale}.txt`

  return {
    saveFile: (data: any) => {
        var Readable = require('stream').Readable;
        var s = new Readable()
        s._read = () => undefined
        s.push(JSON.stringify(data))
        s.push(null)

        return client.saveFile(service, fileName, s, false)
    },
    getFile: () => {
        return client.getFile(service, fileNamewithLocale)
    },
    saveTranslatedFile: (data: any, translatedContent: any) => {
      const recursiveIterate =(response: any)=>{
        response.forEach((element: {
          children: any
          hasChildren: boolean, id: any; name: any
        }) => {
          if(element.hasChildren){
             recursiveIterate(element.children)
          }
          element.name = Object.values(translatedContent.find((itm: { [x: string]: any })=> itm[element.id])).toString()
        });
      }
      recursiveIterate(data?.categories)
      var Readable = require('stream').Readable;
      var s = new Readable()
      s._read = () => undefined
      s.push(JSON.stringify(data))
      s.push(null)
      return client.saveFile(service, fileNamewithLocale, s, false)
   }
  }
}

