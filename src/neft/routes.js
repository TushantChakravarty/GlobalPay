async function neftRoutes (fastify, options) {
    fastify.get('/', async (request, reply) => {
      return { hello: 'neft' }
    })
  }
  
export default neftRoutes;