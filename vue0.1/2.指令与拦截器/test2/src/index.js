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

    parseEl(el,this.data);

    _.each(this._data,function(v,k){
      self.data[k]=v;
    })
}


function parseEl(el,data){
  //遍历属性,分析是否为指令
  _.each(el.attributes,function({name,value}){
      var directive=parseDirective(name,value);
      //关联el,并进行绑定
      if(directive){
        directive.binging(el,data);
      }
  })
  
  _.each(el.childNodes,function(el_son){    
    parseEl(el_son,data)
  })
}

window.Combo=Combo;