import _ from 'lodash'
const config={
    'c-text':{
        update(el,val){
            el.textContent=val||'';
        }
    },
    'c-each':{
        bind(){
            this.el['block'] = true
            // this.prefixRE = new RegExp('^' + this.arg + '.')
            var ctn = this.container = this.el.parentNode
            //节点占位,否则el.childNodes循环时,会报null
            this.marker = document.createComment('marker')
            ctn.insertBefore(this.marker, this.el)
            ctn.removeChild(this.el)

            //防止重复解析
            this.el.attributes.removeNamedItem('c-each');
            this.childSeeds=[];
        },
        update(el,val){
            //删除以前的数据
            if (this.childSeeds.length) {
                this.childSeeds.forEach(function (child) {
                    child.destroy()
                })
                this.childSeeds = []
            }
            var self=this;
            watchArray(val,function(method,array){
                //更新指令
                self.update(array)
            });
            val.forEach(function (item, i) {
               self.dirFn.buildItem.call(self,item, i, val)
            })
        },
        buildItem(data,index,collection){
            var node = this.el.cloneNode(true);
            //解析,传递额外参数
            var s=new Combo(node, data,{
                each:true
            });
            this.childSeeds.push(s)
            this.container.insertBefore(node, this.marker);
            
        }
    },
    'c-on':{
        bind: function(){
            //指令的作用域下获取是否为each
            if(this.scope.options.each){
                //each下的时间,代理至其根节点处
                this.delegator = this.scope.el;
                //保证只代理/绑定一次；
                this.selector=Date.now();
            }else{

            }
        },
        update: function (el,fn) {
            if(!fn){
                return;
            }
            var self  = this,
                event = this.key,
                selector  = this.selector,
                delegator = this.delegator;
            //删掉以前的
            if (this.fn) {
                this.el.removeEventListener(event, this.fn)
            }
            //绑定事件
            debugger
            if (delegator) {
                //冒个泡
               if(!delegator[selector]){
                    delegator[selector] = function (e) {
                      debugger
                      fn(e);
                    }
                    debugger
                    delegator.addEventListener(event, delegator[selector])
               }

            }else{
                this.el.addEventListener(event, fn.bind(this))
                this.fn = fn
            }
        },
        unbind: function () {
            var event = this.key
            if (this.fn) {
                this.el.removeEventListener(event, this.fn)
            }
        }
    }
}

//拦截/监听array相关的变更方法
var watchMethods = [
    'pop',
    'push',
    'reverse',
    'shift',
    'unshift',
    'splice',
    'sort'
];

function watchArray(array,callback){
    _.each(watchMethods,function(method){
        //记录本身的函数
        //此处不使用Array.prototype，Array可能会多次被嵌套
        var proto =array[method];
        array[method] = function () {
            //执行原本意义
            proto.apply(array, arguments);
            //拦截,用以触发修改
            callback(method, array)
        }
    })
}
export default config