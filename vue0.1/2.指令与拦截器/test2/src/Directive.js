import directives from './directives'
 

function Directive(directiveName, expression){
  //指令名称
  this.directiveName=directiveName;
  //指令表达式
  this.expression=expression;
  //指令函数
  this.dirFn=directives[directiveName];
  //过滤器函数
  this.filterFn=function(){};
}

//根据vm,分析expression,拦截get/set
Directive.prototype.binging=function(el,vm){
  var self=this;
  this.el=el;
  
  var key=this.expression;
  var fn=vm.__lookupSetter__(key);
  Object.defineProperty(vm,key , {
      get:()=>{
        //无法有效获取全局的_data
        // return self._data;
      },
      set:(val)=>{
        fn&&fn(val);
        self.dirFn(el,val);
        //
      }
  })
}

export default function parse(directiveName,expression){
  if(!directives[directiveName])
      return null;
  return new Directive (directiveName, expression);
}