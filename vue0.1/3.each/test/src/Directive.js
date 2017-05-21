import directives from './directives'
 

function Directive(directiveName, expression){
  //指令名称
  this.directiveName=directiveName;
  //指令表达式
  this.expression=expression;
  //指令函数
  this.dirFn=directives[directiveName];
  //表达式解析
  var sp=expression.split(' ');
  this.key=sp.pop();
  if(sp.length>1){
    this.arg=sp[0];
  }
  //过滤器函数
  this.filterFn=function(){};
}


//指令修改
Directive.prototype.update=function(val){
  this.dirFn.update.call(this,this.el,val)
}


export default function parse(directiveName,expression){
  if(!directives[directiveName])
      return null;
  return new Directive (directiveName, expression);
}