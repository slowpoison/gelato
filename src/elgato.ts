import { Bonjour, Service } from 'bonjour-service'
const bonjour = new Bonjour()

export default class Elgato {
  private static _instance = new Elgato()

  private service: Service | null = null
  private host: string | null = null
  private port: number = 0

  private constructor() {
    this.manageDiscovery()
  }

  public static get() {
    return Elgato._instance
  }

  private manageDiscovery() {
    if (this.service)
      return

    // start discovery and if it fails, try again in random intervals
    try {
      this.discoverDevices()
    } catch (error) {
      setTimeout(() => this.manageDiscovery(), Math.random() * 10 * 1000)
    }
  }

  private discoverDevices() {
    let self = this
    bonjour.find({ type: 'elg' }, (service) => {
      if (service == null) {
        throw new Error('Service is null')
      }
      self.service = service
      console.log("service", service)

      this.host = self.service?.addresses?.[0] ?? null
      this.port = self.service.port ?? 0;

      if (this.validHost(this.host) && this.validPort(this.port)) {
        console.log('Found elgato device at', this.host, this.port)
        return
      }

      throw new Error('No elgato device found' + service)
    })
  }

  private validHost(host: string | null): boolean {
    return host!= null && host.length > 0
  }

  private validPort(port: number): boolean {
    return port > 0
  }
}
