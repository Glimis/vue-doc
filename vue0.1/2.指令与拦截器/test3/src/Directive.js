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

Directive.prototype.update=function(val){
  this.dirFn(this.el,val)
}
export default function parse(directiveName,expression){
  if(!directives[directiveName])
      return null;
  return new Directive (directiveName, expression);
}