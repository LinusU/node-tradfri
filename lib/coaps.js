const execa = require('execa')
const path = require('path')

const bin = path.join(__dirname, '../vendor/coap-client-macos')

class Coaps {
  constructor (ip, identity, preSharedKey) {
    this.ip = ip
    this.identity = identity
    this.preSharedKey = preSharedKey
  }

  _args (method, ...rest) {
    return ['-m', method, '-u', this.identity, '-k', this.preSharedKey, ...rest]
  }

  async get (path) {
    const args = this._args('get', `coaps://${this.ip}:5684/${path}`)
    return JSON.parse((await execa.stdout(bin, args)).split('\n')[3] || 'null')
  }

  async post (path, payload) {
    const body = ['-e', JSON.stringify(payload)]
    const args = this._args('post', ...body, `coaps://${this.ip}:5684/${path}`)
    return JSON.parse((await execa.stdout(bin, args)).split('\n')[3] || 'null')
  }

  async put (path, payload) {
    const body = ['-e', JSON.stringify(payload)]
    const args = this._args('put', ...body, `coaps://${this.ip}:5684/${path}`)
    return JSON.parse((await execa.stdout(bin, args)).split('\n')[3] || 'null')
  }
}

module.exports = Coaps
