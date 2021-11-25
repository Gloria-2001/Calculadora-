const numeros = document.querySelectorAll(".numbers");
const operadores=document.querySelectorAll(".operations");
const borradores=document.querySelectorAll(".erase");
var checkBox=document.getElementById("mode"); 
const calculadora=document.getElementById("calculadora"); 
const pantalla=document.getElementById("pantalla");
const igual=document.getElementById("igual");
const body=document.getElementById("body");
const titulo=document.getElementById("h1-claro");
const texto=document.getElementById("texto-claro");

class Stack{
    constructor(){
        this.array = new Array();
    }

    push(element){
        this.array.push(element);
    }

    pop(){
        if(this.array.length === 0)
            return null
        return this.array.pop();
    }

    peek(){
        return this.array[this.array.length - 1]; //se visualiza el ultimo elemento metido en la pila
    }

    set(arr){
        this.array = arr
    }
}

elementosTeclado=[];

function meterElementosTeclado(){
    elementosTeclado=[]; 
    numeros.forEach(numero=>{
        elementosTeclado.push(numero);
    })
    operadores.forEach(operador=>{
        elementosTeclado.push(operador);
    })
    borradores.forEach(borrador=>{
        elementosTeclado.push(borrador);
    })
    elementosTeclado.push(igual);
}

checkBox.addEventListener("click",e=>{
    e.preventDefault;
    meterElementosTeclado();
    if(checkBox.checked==true){
        calculadora.setAttribute("id","calculadora-oscura");
        pantalla.setAttribute("id","pantalla-oscura");
        elementosTeclado.forEach(elemento=>{
            elemento.style.backgroundColor="orange";
            elemento.style.borderColor="orange";
        })
        body.style.backgroundColor="black";
        titulo.setAttribute("id","h1-oscuro");
        texto.setAttribute("id","texto-oscuro");
    }else{
        calculadora.setAttribute("id","calculadora");
        pantalla.setAttribute("id","pantalla");
        elementosTeclado.forEach(elemento=>{
            elemento.style.backgroundColor="lightgreen";
            elemento.style.borderColor="lightgreen";
        })
        body.style.backgroundColor="white";
        titulo.setAttribute("id","h1-claro");
        texto.setAttribute("id","texto-claro");
    }
})

meterElementosTeclado(); 

borradores.forEach(borrador=>{
    borrador.addEventListener("click",e=>{
        e.preventDefault;
        if(borrador.getAttribute("value")=="AC"){
            pantalla.textContent="";
            vaciarPila();
        }else{
            let auxiliar = pantalla.textContent;
            let nuevoValor=auxiliar.substring(0,auxiliar.length-1);
            pantalla.textContent=nuevoValor;
            vaciarPila();
        }
    })
})

var stack=new Stack();
var lista=new Array();

var operators=[]
operadores.forEach(operador=>{
    operators.push(operador.getAttribute("value"));
})

function isOperador(op){
    if(operators.includes(op))
        return true;
    else
        return false;
}

function prioridad(c){
    switch (c) {
        case '+': case '-':
            return 1;
        case 'x': case '/':
            return 2;
        case '^':
            return 3;
        default:
            return 0;
    }
}

function vaciarPila(){
    var aux=stack.pop();
    while(aux!=null){
        lista.push(aux);
        aux=stack.pop();
        if(aux=="(")
            break;
    }
}

function agregar(numero, operador){
    if(numero.length > 0)
        lista.push(parseFloat(numero));
    stack.push(operador);
}

function cambiarOperador(numero,operador){
    if(numero.length>0)
        lista.push(parseFloat(numero));
    lista.push(stack.pop());
    stack.push(operador);
}

function sacaOperadores(numero,operador){
    if(numero.length>0)
        lista.push(parseFloat(numero));
    vaciarPila();
    stack.push(operador);
}

function operaciones(a,b,op){
    switch(op){
        case '+':
            return a+b;  
        break;
        case '-':
            return a-b;
        break; 
        case 'x':
            return a*b;
        break;
        case '/':
            return a/b;
        break; 
    }
}

function solucion(){
    lista.forEach(element=>{
        if(isOperador(element)){
            let b=stack.pop();
            let a=stack.pop();
            stack.push(operaciones(a,b,element));
        }else{
            stack.push(element); 
        }
    })
}

function infijoPosfijo(operacion){
    const cadenaSeparada=operacion.split("");
    lista=[];
    var num="";
    cadenaSeparada.forEach(caracter=>{
        if(isOperador(caracter)){
            if(caracter==')'){
                lista.push(parseFloat(num));
                vaciarPila();
            }else if(prioridad(caracter)>prioridad(stack.peek()) || caracter=='('){
                agregar(num,caracter);
            }else if(prioridad(caracter)==prioridad(stack.peek())){
                cambiarOperador(num,caracter);
            }else if(prioridad(caracter<prioridad(stack.peek()))){
                sacaOperadores(num,caracter);
            }
            num="";
        }else{
            num+=caracter;
        }
    });
    lista.push(parseFloat(num));
    vaciarPila();
    stack.set([]);
    solucion();
}

function mostrarElementosPantalla(){
    elementosTeclado.forEach(elemento=>{
    elemento.addEventListener("click",e=>{
        e.preventDefault;
        let valor=elemento.getAttribute("value");
        if(valor!="AC" && valor!=null && valor!="="){  
            let auxiliar = pantalla.textContent;
            pantalla.textContent=auxiliar+=valor;
        }
        igual.addEventListener("click",e=>{
            e.preventDefault();
            infijoPosfijo(pantalla.textContent);
            console.log(lista);
            pantalla.textContent="";
            pantalla.textContent=stack.peek(); 
        })
      })
   })
}

mostrarElementosPantalla();







