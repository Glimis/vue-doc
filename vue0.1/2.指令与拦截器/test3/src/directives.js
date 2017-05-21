const config={
    'c-text':(el,val)=>{
       el.textContent=val;
    },
    'c-value':()=>{
      
    },
    'c-checked':(el,val)=>{
      debugger
        el.checked=val;   
    },
}

export default config