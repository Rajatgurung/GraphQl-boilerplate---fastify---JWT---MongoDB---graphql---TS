///file handling

import { createWriteStream } from 'fs'
import path from 'path'

export default async (c: any) => {
   const fileName = `${Math.random() * (9999 - 1000) + 1000}.${c.filename
      .split('.')
      .pop()}`

   const fileLocation = path.join(__dirname, '../../assets/', fileName)

   const fileStream = c.createReadStream()

   const writeStream = createWriteStream(fileLocation)

   fileStream.pipe(writeStream)

   await new Promise((resolve, rejects) => {
      writeStream.on('finish', resolve)
      writeStream.on('error', rejects)
      fileStream.on('error', rejects)
   })

   return {
      fileName,
      location: fileLocation,
   }
}
