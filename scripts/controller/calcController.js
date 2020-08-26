class CalcController {

    constructor(){
        this.lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR'; //como sera usado em varios locais criamos um atributo 
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");       
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
    }

    initialize(){     
       
       // this._dateEl.innerHTML = "01/05/2020"; tirar pq a partir de agora será automático
        //this._timeEl.innerHTML = "20:20";

        this.setDisplayDateTime(); // colocar antes tambem para não dar aquele delay

        setInterval(()=>{
            this.setDisplayDateTime();           
        },1000); // a cada milisegundos sera executado esta function (1s)

        this.setLastNumberToDisplay();
       
     } // tudo que quiser que aconteca qndo iniciar a calculadora coloca aqui dentro

     addEventListenerAll(element, events, fn){ // transformar o events em array e colocar no foreach
        events.split(' ').forEach( event =>{
            element.addEventListener(event, fn, false); // nome do evento, funcão que quer adicionar, false para não contaabilizar dois clicks (do texto e do botão)
        });

     }

     //limpar tudo 
     clearAll(){
         this._operation = [];
         this.setLastNumberToDisplay();
     }
 //pop elimina o último 
     clearEntry(){
         this._operation.pop();
         this.setLastNumberToDisplay();
     }

     getLastOperation(){
        return this._operation[this._operation.length-1]
    }

    setLastOperation(value){
        this._operation[this._operation.length -1] = value;
    }
//o indexOf vai verificar se o value esta dentro do array, se estiver vai retornar o index dele se não retorna o -1
//(se index encontrado é maior que -1)
    isOperator(value){
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1); //p simplificar (vai retornar ou o index ou o -1)
        /*
        if (['+', '-', '*', '%', '/'].indexOf(value) > -1) { // verificar se o value esta dentro do array, se estiver vai retornar o index dele se não retorna o -1 ()
            return true; 
        } else{
            return false;
        }
    }*/
    }
//push adiciona mais um valor ao array
    pushOperation(value){
        this._operation.push(value);
        if (this._operation.length > 3){
            this.calc();                      
        }
    }

    getResult(){
        return eval(this._operation.join(""));
    }

    calc(){
        let last = '';
        if(this._operation.length > 3){
            last = this._operation.pop(); 
            this._lastNumber = this.getResult();

        }
        let result = this.getResult();
        
        if(last == '%') {
//jeito convencional: result = result / 100; (qndo uma variavel é igual a ela mesma e mais uma operação)
            result /= 100;
            this._operation = [result];
            
        }else{            
            this._operation = [result]; // agora o operation vai receber o result e o ultimo operador
            if(last) this._operation.push(last);
        }
        //if last for diferente de vazio faz o this

        this.setLastNumberToDisplay();
    }

    //metodo para aparecer no displai os numeros digitados
    setLastNumberToDisplay(){
        let lastNumber;

        for(let i = this._operation.length -1; i >= 0; i--){
            if(!this.isOperator(this._operation[i])){
                lastNumber = this._operation[i];
                break;
            }
        }

        if(!lastNumber) lastNumber = 0; 

        this.displayCalc = lastNumber;
        
    }

     addOperation(value){
//isNaN: se não for um número
         if(isNaN(this.getLastOperation() )){ //pegar a última posição do array se não for um número
             //string
             if(this.isOperator(value)){
                 //trocar o perador se for digitado dois ou mais operadores seguidos
                 this.setLastOperation(value); //o último item será igual ao operador do momento
                 // vai substituir um novo operador ao invés de adicionar
             }else if(isNaN(value)){
                 // outra coisa
                 console.log(value);
             } else{
                 // se cair aqui provavelmente é um numero e faz um push dele pro array
                 this.pushOperation(value);

                 this.setLastNumberToDisplay();
             }
         } else{

            if(this.isOperator(value)){
                    //se o operador for um valor
                    this.pushOperation(value); 

            } else{

                //converter o valor para string para ser possivél a concatenação (ao invés de somar númers seguido)
                let newValue = this.getLastOperation().toString() + value.toString();
             this.setLastOperation(parseInt(newValue)); //adicionar o novo valor dentro do array

             //atualizar display
             this.setLastNumberToDisplay();
            }  
            
        }
        console.log(this._operation);
        
         
     }

     

     setError(){
         this.displayCalc = "Errou";
     }

     execBtn(value){
         switch (value){
             case 'ac':
                 this.clearAll();
                 break;
             case 'ce':
                 this.clearEntry();
                 break;

             case 'soma':
                 this.addOperation('+');
                 break;

             case 'subtracao':
                 this.addOperation('-');
                 break;

             case 'divisao':
                 this.addOperation('/');
                 break;

             case 'multiplicacao':
                this.addOperation('*');
                break;
                case 'porcento':
                    this.addOperation('%');
                    break;
             case 'igual':
                 this.calc();
                
                 break;

             case 'ponto':
                this.addOperation('.');
                 break;

             case '0':
             case '1':
             case '2':
             case '3':
             case '4':
             case '5':
             case '6':
             case '7':
             case '8':
             case '9':
                 this.addOperation(parseInt(value));
                 break;                  
             default:
                 this.setError();
                 break;
         }
     }


     initButtonsEvents(){
         //document.querySelector("#buttons > g, #pats > g"); //selecionar primeira tags g filha de buttons
         let buttons = document.querySelectorAll("#buttons > g, #parts > g");

       
         buttons.forEach((btn, index)=>{ //percorrer cada button- um parametro não precisa de parentes

            this.addEventListenerAll(btn,"click drag", e=>{
                let textBtn = btn.className.baseVal.replace("btn-", ""); //pegar o nome da class - replace (retira, o que colocar no lugar)
                this.execBtn(textBtn);
            }); //recebe até dois parâmertro(quual o evento q vc quer, e o que deve ser feito)

            
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e =>{
                btn.style.cursor = "pointer";
            });

         });

        
     }

     setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit", 
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
     }


     get displayTime(){
         return this._timeEl.innerHTML;
     }

     set displayTime(value){
         return this._timeEl.innerHTML = value;
     }

     get displayDate(){
         return this._dateEl.innerHTML;
     }

     set displayDate(value){
         return this._dateEl.innerHTML = value;
     }

    get displayCalc(){ // qndo for chamado vai verificar se tem esse get e se tiver vai retornar o que esta dentro
        return this._displayCalcEl.innerHTML; // no caso este valor
    }

    set displayCalc(value){
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(value){
        this._currentDate = value;
    }
    
}

/**
 * split: coloca algo entre os valore
 * join: une o array em string (vazio) string com as virgulas ("aspa") tira as virgulas
 * pop: tira o último valor do array
 * push coloca um valor no array
 */