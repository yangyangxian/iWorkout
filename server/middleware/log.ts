export default defineEventHandler((event) => {
  console.log('Incoming request:', event.node.req.method, event.node.req.url)
}) 