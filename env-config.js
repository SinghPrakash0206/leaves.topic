const prod = process.env.NODE_ENV === 'production'

module.exports = {
  'process.env.BASE_URL': prod ? 'http://leaves.anant.us:82/' : 'http://206.189.143.212:100/',
  'process.env.ACCESS_TOKEN': prod ? 'N2Y1YmFlNzY4OTM3ZjE2OGMwODExODQ1ZDhiYmQ5OWYzMjhkZjhiMDgzZWU2Y2YyYzNkYzA5MDQ2NWRhNDIxYw' : 'MjI0MjJlMjQ0ZjY0NzA2ZWIyOTljZTYxZDE1YjM1ZjVmYzU3ODMwMWFlYjgwZDY1MDNlYWJjYTBjNTEwMWE0Mg'
}