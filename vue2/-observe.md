## core/observe

### array.js
创建,含有重写数组方法的数组,让所有数组,继承该内容
拦截数组函数,包括
    push
    pop
    shift
    unshift
    split
    sort
    reverse 


- 根据`Object.create(Array.prototype)`,生成中间原型
    此处为Objecy.create的常用用法,代理/重写prototype
- 拦截函数
    内部使用def,进行七类方法的拦截
    - 内部调用了__ob__ [observe]

### dep
dep类
    属性
        target:目标?
        id:唯一id
        subs:关联watchers
    方法
        notify    

每一个【响应式】属性,都会包含一个dep实例
dep会记录参与计算的watcher

### index
observe类 及其 工厂函数
    observe函数 -> 将value转换为响应式 
        - 防御,不满足响应式条件【非对象或vnode】,退出
        - 已包含【存在__ob__，且属于Observe实例 】,调用存在的__ob__
        - 创建Observe【`__ob__ = new Observe(value)`】
        
    Observe类 -》 实例
        属性
            value:参数
            dep:解决子属性依赖
            vmCounts:计数
        构造函数
            1.`def(value,'__ob__',this)`  -》 `value.__ob__ = this`
            2. 响应化核心
                数组 -》 observeArray  //遍历数组元素,进行递归observe
                    2.1 判断浏览器是否包支持__prop__ 【`hasProto ='__proto__'  in {}`】
                            支持,使用原型链修改,使得数组为响应式
                            不支持,混合,直接修改属性方法
                    2.2 循环数组,对每个元素进行observe    
                对象 -》  walk  //遍历对象属性,进行递归observe
                    2.3 对属性,进行defineReactive 
        defineReactive 
            1.创建dep
            2.获得对象的属性描述`Object.getOwnPropertyDescriptor` 【writable,enumerable】 --> 如果不能配置,就退出【冻结优化】
            3.get/set处理,有get用get,没get用value --> 允许主动设置get/set
                依赖收集
                    1.收集本身
                    2.收集属性的子属性【特指对象】
                    3.收集数组的每一个属性
                派发更新
                    1.数据无变化,退出
                    2.对新值响应式化
                    3.派发更新
            4.对value进行observe  --> 保证数据修改后【指修改为非原生类型】,依然是响应式
## scheduler
任务调度的工具,watch执行的核心【异步调用】
    内部属性
        queue  -> 事件队列
        waiting  --> 异步等待状态
        flushing --> 开始渲染,清空队列,执行队列中的run
    函数
        resetSchedulerState 初始化,清空队列
        flushSchedulerQueue
            1.排序 【按照id】
            2.循环
                2.1 调用before
                2.2 调用run
        queueWatcher 异步调用run
            1.加入queue
            2.nextTick(flushSchedulerQueue)

nextTick【微任务】 --> 希望实现process.nextTick【宏任务和微任务】
    使用promise.resolve代替,mutationObserve，setImmediate
    不支持,使用setTimeout处理
            
## traverse
递归遍历响应式数据 触发依赖收集
    set --> 用于去重
- 防御 ,如果数据不是响应式【不是数组,对象,或者冻结,或者vnode】,则不需要递归   
- 判断是否包含__ob__ 【observe,响应对象标记】
- 加入depId【通过set保证唯一,保证循环引用,不会递归遍历】
- 数组or对象 递归
## watcher
watcher类
    uid --> 唯一标记
    属性
        vm:关联组件【vue实例】
        expression:关联表达式或渲染方法体【调试查看】
        cb:构造函数中,传入的watch
        before:生命周期
        lazy:计算属性,和watch  控制watcher不要立刻执行【惰性求值】
        deps/depIds :ids保证watcher的唯一,归档
        newDeps/newDepIds : 执行
            二次提交 【dirty】
                每次渲染或计算时,会进行依赖收集,以关联watcher和dep
                数据更新时,根据dep,找到watch，一次调用update,执行完成后清空watcher
        getter:【expOrFn】
            渲染函数【模板或组件的渲染】
                render
            计算函数【watch】  --> 路劲描述函数,解析‘a.b’的函数
                ```javascript
                    watch:{
                        'a.b':()=>{}
                    }
                ```    
        value:计算的值  ,渲染无效
    构造函数    
        1.初始化
        2.lazy什么都不做 or 立刻求值 【执行getter】
    cleanupDeps 归档,让新旧deps保持一致
        1.循环deps,如果不在newdeps中,删除
        2.同步 `this.deps = this.newdeps`
    update 分三种更新
        1.lazy  -> dirty = true,一般用于求值计算
        2.同步【sync】 -> 执行run -> 服务端渲染【SSR】  
        3.正常 -> queueWatcher 异步运行 【即异步执行run】
    run 
        1.新旧值不相等,进行cb调用,传入的watch