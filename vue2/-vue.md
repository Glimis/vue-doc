## runtime/index
- 1.挂载指令,组件,过滤器
- 2.配置vnode更新dom的核心算法 __patch__ *核心算法
- 3.配置vue.prototype.$mount 原始mount方法
    调用mountComponent【挂载组件】


## core/index
- 1.全局api初始化
    assts
    extend
    mixin
    use
- 2.定义服务端渲染方法

## core/instance/index
构造函数
 - 1.必须使用new 调用
    this instanceof Vue
 - 2.this._init(options

挂载 【基于原型】
    初始化
    状态处理方法
    事件方法
    生命周期
    渲染有关

## core/instance/init
包含vue 实例与组件

- 1.uid --> 每一个实例【此处指vue/组件】都有唯一标识
- 2._isVue --> vue实例标记,不需要响应式处理
- 3.组件 or 实例初始化【增加options】
- 4.初始化实例
    - 生命周期 变量
        core/instance/lifecycle --> 初始化生命周期变量
    - 事件
        core/instance/events --> 初始化事件变量
    - 渲染 --> 初始化创建元素的方法
        core/instance/render

            vm._c 系统创建元素的方法
            vm.$createElement 用户提供render时,创建元素的方法 -->自定义render时的第一个参数
            【都是基于内置的createElement,产生的高级函数】
            【对于自定义render,相当于放弃了模板,自定义ast+数据进行结合，产生vnode】

- 5.触发`beforeCreate`
- 6.初始化注入器initInjections 
- 7.初始化状态数据initState【data,props】
    core/instance/render/state
        - 处理props成员  --> 定义组件对外成员
            1.缓存_props
            2.转换为响应式 -->defineReactive
            3.proxy
        - 处理methods成员
            将methods进行bind处理【绑定上下文】,并传给vm
        - 处理data成员 【initData,使用observe】
            1.处理data为函数
                为函数时,调用了`pushTarget()/popTarget()`,此时还没有模板渲染,故不需要依赖收集
            2.重复定义判断
            3.proxy
            4.响应式 --> observe
        - 处理computed
        - 处理watch
- 8.initProvide
- 9.触发`created`
- 10.组件挂载`mount`,挂载在el上【1-9为组件创建】
    调用mountComponent

## core/instance/state
initWatch  初始化options.watch
    遍历 createWatcher

createWatcher  
    调用$watch【vm,expOrFn】  --> 创建Watcher


initComputed
    1.根据key,创建watcher
    2.调用definedComputed

definedComputed
    - 服务端渲染,内部的值不会涉及到watcher,直接call
    - 浏览器,关联/生成一个watcher

## core/instance/lifecycle
mountComponent
    1.防御,是否包含render
    2.`beforeMount`
    3.生成updatComponent【指expOrFn】
        updatComponent =>{
            vm._update(vm.render())
        }
    其中,render 产生虚拟dom,update调用patch【diff算法】,将vnode与html同步
    4.生成watcher【render watcher 渲染watcher】
        before
            执行 beforeUpdate
    5.mounted        