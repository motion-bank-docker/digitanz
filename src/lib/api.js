import feathers from '@feathersjs/feathers'
import rest from '@feathersjs/rest-client'
import auth from '@feathersjs/authentication-client'
import superagent from 'superagent'

function createClient (host) {
  const client = feathers()
  client.configure(rest(host).superagent(superagent))
  client.configure(auth({
    storage: window.localStorage
  }))
  return client
}
export {
  createClient
}
