$(function(){

    //Componente Jogo da Memória
    let c1 = app.getComponente('c1');
    console.log(c1);
    let $ctrl = c1.$ctrl;

    $ctrl.JogoDaMemoria = function (){

    	var divContainer = document.getElementById("container");

        //Div Game Interface
    	var divInterface = document.createElement("div");
    	divInterface.setAttribute("id", "interface");
    	divContainer.appendChild(divInterface);

    	//Botao de Novo Jogo
    	var btNovoJogo = document.createElement("button");
    	btNovoJogo.setAttribute("id", "novoJogo");
    	btNovoJogo.setAttribute("type", "submit");
    	var texto_btNovoJogo = document.createTextNode("Novo Jogo");

    	btNovoJogo.appendChild(texto_btNovoJogo);
    	divInterface.appendChild(btNovoJogo);

    	//Botao de Reiniciar Jogo
    	var btReiniciarJogo = document.createElement("button");
    	btReiniciarJogo.setAttribute("id", "reiniciarJogo");
    	btReiniciarJogo.setAttribute("type", "submit");
    	var texto_btReiniciarJogo = document.createTextNode("Reiniciar Jogo");

    	btReiniciarJogo.appendChild(texto_btReiniciarJogo);
    	divInterface.appendChild(btReiniciarJogo);

        //Icone do Timer
        var iconTimer = document.createElement("img");
        iconTimer.setAttribute("id", "timerImg");
        iconTimer.setAttribute("src","_images/timer.png");
        divInterface.appendChild(iconTimer);

        //Div Timer
        var divTimer = document.createElement("div");
        divTimer.setAttribute("id","timer");
        divInterface.appendChild(divTimer);
        document.getElementById("timer").innerHTML = localStorage.getItem("Melhor tempo de jogo");

    	var cont = 0;
    	var clickCont = 0;
    	var acertos = 0;
    	var arrayCartas = [];
        var verificaCartas = [];
        var arrayNetos = [];
        var inicio = undefined;
        var fim = undefined;


        //Criação Dinâmica de divs 
        for(var a = 1; a < 5; a++){

        	$('#pai').append('<div id="filho'+a+'"></div>');

        	for(var b = 1; b<5;b++){

        		cont++;
         		$("#filho"+a).append('<div id ="neto'+cont+'", class = "neto clicavel"></div>');
        	}

        }

        //Preenchimento do Array de cartas, com 8 elementos.
        for(var j = 1; j <= 8; j++){
            arrayCartas.push("card"+j);
        }

        //Duplicação dos Elementos do Array
        arrayCartas = arrayCartas.concat(arrayCartas);

        //Ordenar Array de cartas Em Pares
        arrayCartas.sort();

        //Preenchimento das divs com as cartas em pares.
        for(var j = 1; j <= 16; j++){

            $("#neto"+j).css("background-image", 'url(' + '_images/'+arrayCartas[j-1]+'.png' + ')');
        }

        //Função que embaralha Arrays
        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

          return array;
        }

        //Função para animar a div com evento de click
        function animationClick(element, animation){
            
            element = $(element);
            element.click(
                function() {

                    var i = element.attr('id');
                    clickCont++;

                    //Unbind em todos
    	   			$('.neto').unbind('click');
                    
                    element.addClass('animated ' + animation);

                    verificaCartas.push(arrayCartas[ i.slice(4) - 1]);
                    console.log(verificaCartas);
                    arrayNetos.push(element);

                    //Espera animação terminar (0.6seg) para...
                    window.setTimeout( function(){
                        element.removeClass('animated ' + animation);

                        //Troca de Imagem
                        $("#"+i).css("background-image", 'url(' + '_images/'+arrayCartas[ i.slice(4) - 1]+'.png' + ')');

                        //Encadeamento de segunda animacao
                        element.addClass('animated ' + 'flipInY');

                    }, 600);

                    //Espera segunda animação terminar (1.2seg) para...
                    window.setTimeout( function(){

                        element.removeClass('animated ' + 'flipInY');

                        if(verificaCartas.length < 2){
                        	//Restaura o clique apenas das cartas com classe clicavel
    					    $('.clicavel').each(function() {
    					        animationClick(this, 'flipOutY');
    					    });
                        }
                        
                    }, 1200);

                    if (verificaCartas.length === 2) {

                        if (verificaCartas[0] === verificaCartas[1] && arrayNetos[0].attr('id') != arrayNetos[1].attr('id')) {
                            console.log('As Cartas Sao iguais');

                            acertos++;

                            //Espera segunda animação terminar (1.6seg) para...
    		                window.setTimeout( function(){
    		                	
    		                    //Se as cartas forem iguais, as transformam em douradas.
    	                        $('#'+arrayNetos[0].attr('id')).css("background-image", 'url(' + '_images/'+arrayCartas[ i.slice(4) - 1]+'g'+'.png' + ')');
    	                        $('#'+arrayNetos[1].attr('id')).css("background-image", 'url(' + '_images/'+arrayCartas[ i.slice(4) - 1]+'g'+'.png' + ')');

    	                        console.log(arrayNetos);

    	                        //Animacao de transformar em dourada
    	                        $('#'+arrayNetos[0].attr('id')).addClass('animated ' + 'tada');
    	                        $('#'+arrayNetos[1].attr('id')).addClass('animated ' + 'tada');

    	                        //Remover a possibilidade de clicar nestas cartas
    	                        $('#'+arrayNetos[0].attr('id')).removeClass('clicavel');
                            	$('#'+arrayNetos[1].attr('id')).removeClass('clicavel');

    	                        //Término da animação de dourada
    	                        window.setTimeout( function(){

    			                    $('#'+arrayNetos[0].attr('id')).removeClass('animated ' + 'tada');
    	                        	$('#'+arrayNetos[1].attr('id')).removeClass('animated ' + 'tada');

    	                        	//Impede que cartas acertadas possam ser reviradas
    	                        	arrayNetos[0].unbind('click');
    	                        	arrayNetos[1].unbind('click');

    	                        	//Remove primeira e segunda posições dos arrays
    	                        	arrayNetos.splice(0,2);
    	                        	verificaCartas.splice(0,2);

    	                        	//Restaura o clique apenas das cartas com classe clicavel
    							    $('.clicavel').each(function() {
    							        animationClick(this, 'flipOutY');
    							    });

                                    //Final do Jogo
                                    if(acertos === 8){

                                        window.alert('Fim de Jogo! Parabéns!');

                                    }
    			                    
    			                }, 750);

    		                }, 1500);

                            if(acertos === 8){
                                fim = new Date();
                                var decorrido = (fim.getTime() - inicio.getTime())/1000;
                                console.log(decorrido);

                                if(localStorage.getItem("Melhor tempo de jogo") === null){
                                    localStorage.setItem("Melhor tempo de jogo", decorrido);
                                    document.getElementById("timer").innerHTML = localStorage.getItem("Melhor tempo de jogo");
                                }

                                else if(localStorage.hasOwnProperty("Melhor tempo de jogo") && decorrido < localStorage.getItem("Melhor tempo de jogo")){
                                    localStorage.setItem("Melhor tempo de jogo", decorrido);
                                    document.getElementById("timer").innerHTML = localStorage.getItem("Melhor tempo de jogo");
                                }
                            }
                            
                        }

                        else{

                            console.log('As cartas sao diferentes');

                            window.setTimeout( function(){

    		                    //Desvira as cartas erradas.
    	                        $('#'+arrayNetos[0].attr('id')).css("background-image", 'url(' + '_images/cardback2.png' + ')');
    	                        $('#'+arrayNetos[1].attr('id')).css("background-image", 'url(' + '_images/cardback2.png' + ')');
    	                        

    	                        //Animação de desvirar.
    	                        $('#'+arrayNetos[0].attr('id')).addClass('animated ' + 'shake');
    	                        $('#'+arrayNetos[1].attr('id')).addClass('animated ' + 'shake');
    	                        

    	                        window.setTimeout( function(){
    	                            $('#'+arrayNetos[0].attr('id')).removeClass('animated ' + 'shake');
    	                            $('#'+arrayNetos[1].attr('id')).removeClass('animated ' + 'shake');
    	                            
    	                            console.log("removendo.");

    	                            //Remove primeira e segunda posições dos arrays
    				            	arrayNetos.splice(0,2);
    				            	verificaCartas.splice(0,2);

    				            	//Restaura o clique apenas das cartas com classe clicavel
    							    $('.clicavel').each(function() {
    							        animationClick(this, 'flipOutY');
    							    });

    	                        }, 750);
    		                    
    		                }, 2700);

                        }


                    }

                    //Assincronamente

                });
        }

        //Verifica se o elemento possui a classe cls
        function hasClass(element, cls) {
    	    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    	}

        //Botao de Novo Jogo
        $('#novoJogo').click(function(){

        	//Unbind em todos
    	    $('.neto').unbind('click');

        	//Embaralha o Array de Cartas
        	shuffle(arrayCartas);
        	acertos = 0;
        	verificaCartas = [];
        	arrayNetos = [];
            inicio = undefined;
            fim = undefined;

            //Preenchimento das divs com as cartas desviradas.
            for(var j = 1; j <= 16; j++){

                $("#neto"+j).css("background-image", 'url(' + '_images/'+arrayCartas[j-1]+'.png' + ')');

            	//Caso a div nao tenha classe clicavel, adiciona.
                if(!hasClass(("#neto"+j),'clicavel')){
                	$('#neto'+j).addClass('clicavel');
                }
            }

        	//Preenchimento das divs com as cartas viradas depois de 3 segundos.
        	window.setTimeout(function(){

        		for(var j = 1; j <= 16; j++){
    	        	$("#neto"+j).css("background-image", 'url(' + '_images/cardback2.png' + ')');
    	    	}

    	    	//Evento de Click de cada div com classe neto
    		    $('.neto').each(function() {
    		        animationClick(this, 'flipOutY');
    		    });

                inicio = new Date();
                for(i=0; i<99999999; i++){
                }

                console.log(inicio);

        	}, 3000);

        });

        //Botao de Reiniciar Jogo
        $('#reiniciarJogo').click(function(){

        	//Unbind em todos
    	    $('.neto').unbind('click');

        	acertos = 0;
        	verificaCartas = [];
        	arrayNetos = [];

            //Preenchimento das divs com as cartas desviradas.
            for(var j = 1; j <= 16; j++){

                $("#neto"+j).css("background-image", 'url(' + '_images/'+arrayCartas[j-1]+'.png' + ')');

                //Caso a div nao tenha classe clicavel, adiciona.
                if(!hasClass(("#neto"+j),'clicavel')){
                	$('#neto'+j).addClass('clicavel');
                }
            }

        	//Preenchimento das divs com as cartas viradas depois de 3 segundos.
        	window.setTimeout(function(){

        		for(var j = 1; j <= 16; j++){
    	        	$("#neto"+j).css("background-image", 'url(' + '_images/cardback2.png' + ')');
    	    	}

    	    	//Evento de Click de cada div com classe neto
    		    $('.neto').each(function() {
    		        animationClick(this, 'flipOutY');
    		    });

        	}, 3000);

        });

    }

    app.c1.$ctrl.JogoDaMemoria();
});
