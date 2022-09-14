export default {
   type: 'object',
   required: ['MONGO_URL', 'JWT_SECRET'],
   properties: {
      MONGO_URL: {
         type: 'string',
         default: 'mongodb://localhost:27017/pi_code',
      },
      JWT_SECRET: {
         type: 'string',
         default: 'secret',
      },
   },
}
