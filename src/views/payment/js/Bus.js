//emit作为发布(传递)，on作为订阅(接收)
class Bus {
    constructor() {
      // 初始化list
      this.list = {}
    }
    // 发布事件,..
    emit(name, ...args) {
      // 获取到list里的数据
      let evnentName = this.list[name]
      evnentName.forEach(fn => {
        fn.apply(this, args)
      })
    }
    // 接收事件
    on(name, callback) {
      // 如果是第一次注册，则为空；如果被多次注册，则采用之前注册的名字
      let fn = this.list[name] || []
      fn.push(callback)
      this.list[name] = fn
    }
  }
  // 导出bus
  export default new Bus()
  