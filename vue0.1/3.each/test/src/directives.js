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
            //原节点为参照,不可污染
            var node = this.el.cloneNode(true);
            //解析
            var s=new Combo(node, data);
            this.childSeeds.push(s)
            this.container.insertBefore(node, this.marker);
            
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