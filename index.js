const uuid = require('uuid')

const Coaps = require('./lib/coaps')

class Tradfri {
  constructor (ip, identity, preSharedKey) {
    this.client = new Coaps(ip, identity, preSharedKey)
  }

  async listGroupIds () {
    return this.client.get('/15004')
  }

  async getGroup (id) {
    const result = await this.client.get(`/15004/${id}`)

    return {
      id: result['9003'],
      name: result['9001'],
      deviceIds: result['9018']['15002']['9003'],
      on: Boolean(result['5850'])
    }
  }

  async getDevice (id) {
    const result = await this.client.get(`/15001/${id}`)

    const info = {
      id: result['9003'],
      name: result['9001'],
      type: result['3']['1']
    }

    // Bulb information
    if (result['3311']) {
      info.on = Boolean(result['3311'][0]['5850'])
      info.color = result['3311'][0]['5706']
      info.brightness = result['3311'][0]['5851']
    }

    return info
  }

  async putGroup (id, patch) {
    const payload = {}

    if (patch.on != null) payload['5850'] = (patch.on ? 1 : 0)
    if (patch.color != null) payload['5706'] = patch.color
    if (patch.brightness != null) payload['5851'] = patch.brightness
    if (patch.transitionTime != null) payload['5712'] = Math.round(patch.transitionTime / 100)

    await this.client.put(`/15004/${id}`, payload)
  }
}

Tradfri.createIdentity = async function (ip, code) {
  const client = new Coaps(ip, 'Client_identity', code)
  const identity = uuid().replace(/-/g, '')
  const result = await client.post('/15011/9063', { 9090: identity })

  return { identity, preSharedKey: result['9091'] }
}

module.exports = Tradfri
