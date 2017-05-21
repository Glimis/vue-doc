import _ from 'lodash'
import parseDirective from './Directive'
function Combo(el,data){
    var self=this;
    //外层容器
    this.el=el;
    //data,为对外提供交互的模型(vm)
    this.data=data;
    //_data,为vm的存储
    this._data=_.clone(data);
    //parseEl时,收集的所有指令
    this._directives=[];
    //根据data的key相关联的指令结构
    this._dataDirectives={};
    this.parseEl(el,this.data);

    
    this.binging();

    _.map(this._data,function(v,k){
      self.data[k]=v;
    })   
}


Combo.prototype.parseEl=function(el){
  //遍历属性,分析是否为指令
  var self=this;
  _.each(el.attributes,function({name,value}){
      var directive=parseDirective(name,value);
      //关联el,并进行绑定
      if(directive){
        directive.el=el;
        self._directives.push(directive);
        var dirs=self._dataDirectives[directive.expression]=self._dataDirectives[directive.expression]||[];
        dirs.push(directive);
      }
  })
  
  _.each(el.childNodes,function(el_son){    
    self.parseEl(el_son)
  })
}

//转换为vm
Combo.prototype.binging=function(){
  var self=this;
  _.each(this.data,function(v,k){
      var dirs=self._dataDirectives[k]
      Object.defineProperty(self.data,k , {
          get:()=>{
            self._data[k];
          },
          set:(val)=>{
              _.each(dirs,function(dir){
                dir.update(val);
              })
            
            
          }
      })
  })
}

window.Combo=Combo;