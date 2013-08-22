/*
* simple javascript carousel 0.0.1
* Twenga Company
*
* Params :
* ========================
* noeud > Le noeud DOM contenant tous les elements
* thumbnail > Les noeuds DOM de chaque thumbnail > ex > 
* thumbHover > Valeur booléenne qui prend en compte ou pas le survol des thumbnails
* timer > le temps en millisecondes entre deux début de rotations respectives.
* endRotation > temps en millisecondes au bout duquel la rotation automatique peut stopper. Si omit, pas de fin.
* compteur > chaine de l'attribut ID ou doit s'afficher la slide active
* btNext > chaine de l'attribut ID ou s'attache l'action "slide suivante"
* btPrev > chaine de l'attribut ID ou s'attache l'action "slide précédente"
* AnimFrequency > temps en millisecondes qui est l'intervalle entre laquelle l'animation de transition va se jouer
* AnimSplitdistance > valeur numérique indiquant la distance parcourue a chaque intervalle de temps
* interactStopAll > Valeur booléenne pour indiquer si oui ou non on stop le carousel lors d'une action sur les fleches.
* ========================
*
*/

(function(){

	var $ = {};

	$.carouselize = function(params){

		/**
	    * Initialisation des valeurs utilisées un peu partout
	    */
	    var cpt = 1;
	    var nbrElts = 0;
	    var thumbHover = 0;
	    var nbrThbnls = 0;
	    var wLucarne = 0;
	    var widthElt = 0;
	    var SmallestUnitMove;
	    var isAnimationRunning = false;
	    var pagination = false;
		var btNext = false;
		var btPrev = false;
		var listElt = false;
		var endOfWorld = false;
		var interactStopAll = false;
		var direction = "left";
		var eachTime = 2000;
	    var anF = 30;
	    var anD = 1;
	    var originalanD = 1;
		var fnName1 = function(){_slideNext("action")};
		var fnName2 = function(){_slidePrev("action")};

		listElt = params["noeud"];
		thumbnail = params["thumbnail"];
		thumbHover = params["thumbHover"];
		if(params["timer"]){eachTime = params["timer"];}
		pagination = params["compteur"];
		btNext = params["btNext"];
		btPrev = params["btPrev"];
		if(params["AnimFrequency"]){anF = params["AnimFrequency"];}
        if(params["AnimSplitdistance"]){originalanD = anD = params["AnimSplitdistance"];}
        endOfWorld = params["endRotation"];
        interactStopAll = params["interactStopAll"];

		nbrElts = listElt.length;

		if(nbrElts>1){

			var Lucarne = listElt[0].parentNode;
			wLucarne = Lucarne.offsetWidth;
			widthElt = listElt[0].offsetWidth;
			$.addClass(listElt[0],"active");

			/* On calcule la largeur du conteneur principal */
			var wContainer = nbrElts*widthElt;

			$.setCssAttribute(Lucarne,"position:relative;");
			for(var k=0; k<nbrElts; k++){
				$.setCssAttribute(listElt[k],"position:absolute;left:"+widthElt*k+"px;");
			}

			if(endOfWorld){
				setTimeout(function(){
					clearInterval(interval);
				}, endOfWorld)
			}

			_initCarousel(eachTime);

			next = document.getElementById(btNext);
		 	prev = document.getElementById(btPrev);
			_btClick(next,prev);

        }

        	/* = functions ================================================================= */
			function _animation(targetNode,from,to){
				/* show the current frame */
				anD += 1;
				if(direction=="left"){
					if(from>to){
						currentP = from-anD;
						if(currentP<to){
							currentP = to;
						}
						targetNode.style.left = currentP+"px";
						_anime(targetNode,currentP,to);
					}else{
						currentP = from+anD;
						isAnimationRunning = false;
						anD = originalanD;
						_btClick(next,prev);
					}
				}else{
					if(from<to){
						currentP = from+anD;
						if(currentP>to){
							currentP = to;
						}
						targetNode.style.left = currentP+"px";
						_anime(targetNode,currentP,to);
					}else{
						currentP = from-anD;
						isAnimationRunning = false;
						anD = originalanD;
						_btClick(next,prev);
					}
				}
			}

			/* = functions ================================================================= */
			function _anteTreatment(){
				if(interactStopAll){//Si la désactivation du carousel a été désactivé lors du clic
					clearInterval(interval);
					endOfWorld = 1;
				}
			}

			/* = functions ================================================================= */
			function _anime(targetNode,from,to){
				isAnimationRunning = true;
				SmallestUnitMove = setTimeout(function(){
					_animation(targetNode,from,to);
				}, anF)
			}

			/* Gere la class "active" */
			function _prepareMove(targetNode,movefrom,moveto){
		    	if(moveto == 0){
		    		$.addClass(targetNode,"active");
		    	}else{
		    		$.removeClass(targetNode,"active");
		    	}
				_anime(targetNode,movefrom,moveto);
			}

			/* = Gestion pagination ================================================================= */
			function _paginate(cpt){
		        if(pagination){
		        	document.getElementById(pagination).innerHTML = cpt;
		        }
			}

			/* = initialisation miniatures ================================================================= */
			function _initThumbnail(){
		        if(thumbnail){
		        	nbrThbnls = thumbnail.length;
		        	for(var n=0; n<nbrThbnls; n++){
		        		thumbnail[n].numerous = n+1;
		        		if(cpt == n+1){
		        			$.addClass(thumbnail[n],"activeSlide");
		        		}else{
		        			$.removeClass(thumbnail[n],"activeSlide");
		        		}
		        		thumbnail[n].onclick = function(){
		        			_slideDirectTo("action",this.numerous);
		        		};
		        		//$.attachEventClick(thumbnail[n],fnName3);
						//thumbnail[n]
					}
		    		if(thumbHover==1){
		    			for(var q=0; q<nbrThbnls; q++){
			        		thumbnail[q].onmouseover = function(){
			        			_displayDirect("action",this.numerous);
			        		};
		        		}
		        		/*if(!interactStopAll){
			    			for(var r=0; r<nbrThbnls; r++){
			    				if(!interval){
					        		thumbnail[r].onmouseout = function(){
					        			$.initCarousel(eachTime);
					        		};
				        		}
			        		}
		        		}*/
		    		}
		        }
			}

			/* = initialisation carousel ================================================================= */
			function _initCarousel(eachTime){
				_initThumbnail();
				interval = window.setInterval(function(){
		        	if(!isAnimationRunning){
		            	_slideNext();
		            	_initThumbnail();
		        	}
		        }, eachTime);
			}

			/* = initialisation clicks ================================================================= */
			function _btClick(NbtNext,NbtPrev){
				if(NbtNext){
					$.attachEventClick(NbtNext,fnName1);
				}
				if(NbtPrev){
					$.attachEventClick(NbtPrev,fnName2);
				}
			};

			/* = désinitialisation clicks ================================================================= */
			function _btUnClick(NbtNext,NbtPrev){
				if(NbtNext){
					$.detachEventClick(NbtNext,fnName1);
				}
				if(NbtPrev){
					$.detachEventClick(NbtPrev,fnName2);
				}
			}

		    /**
		    * avance le carrousel d'une diapositive
		    * si dernière diapo, on revient à la première
		    */
		    function _slideNext(action){
		    	direction = "left";
		    	_btUnClick(next,prev);
		    	if(action == "action"){_anteTreatment();}
		    	if(!isAnimationRunning){
			        if(nbrElts != 0){
			            if(cpt === nbrElts){//Quand on arrive au bout du carrousel
			                listElt[0].style.left = (widthElt*nbrElts)+widthElt;
			                for(var l=0; l<nbrElts; l++){
			                	if(l==nbrElts-1){//arrivé a la fin, on déplace le dernier élément en position -1
				            		var moveto = 0-widthElt;
				            		var movefrom = 0;
			                	}else{
				            		cpt = 0;
				            		var moveto = (widthElt*l)-(widthElt*cpt);
				            		var movefrom = (widthElt*l)-(widthElt*(cpt-1));
				            	}
				            	_prepareMove(listElt[l],movefrom,moveto);
			                }
			                _paginate(1);
			                cpt++;
			            }else{// Ajout +1 au compteur (nous allons sur la diapositive suivante)
			                for(var l=0; l<nbrElts; l++){
			                	if(cpt>0){
			                		var movefrom = (widthElt*l)-(widthElt*(cpt-1));
			                		var moveto = (widthElt*l)-(widthElt*cpt);
			                	}else{//si on est à la première slide
			                		var movefrom = (widthElt*l)-(widthElt*cpt);
			                		var moveto = (widthElt*l)-widthElt;
			                	}
			                	_prepareMove(listElt[l],movefrom,moveto);
			                }
			                //console.log("=======================================================");
			                cpt++;
			                _paginate(cpt);
			            }

			        }
		        }
		    };

		    /**
		    * recule le carrousel d'une diapositive
		    * si dernière diapo, on revient à la première
		    */
		    function _slidePrev(action){
		    	direction = "right";
		    	_btUnClick(next,prev);
		    	if(action == "action"){_anteTreatment();}
		    	if(!isAnimationRunning){
		    		clearInterval(interval);
			        if(nbrElts != 0){
			            if(cpt === 1){//Quand on arrive au bout du carrousel
			                listElt[nbrElts-1].style.left = -widthElt;
			                for(var l=0; l<nbrElts; l++){
			                	if(l==nbrElts-1){//arrivé au début, on déplace le dernier élément en position -1
				            		var movefrom = -widthElt;
				            		var moveto = 0;
			                	}else{
			                		m = l+1;
				            		var movefrom = (widthElt*m)-(widthElt*cpt);
				            		var moveto = ((widthElt*m)-(widthElt)*cpt)+widthElt;
				            	}
				            	_prepareMove(listElt[l],movefrom,moveto);
			                }
			                cpt = nbrElts;
			                _paginate(nbrElts);
			            }else{// Ajout -1 au compteur (nous allons sur la diapositive suivante)
			                for(var l=0; l<nbrElts; l++){
		                		m = l+1;
		                		var movefrom = (widthElt*m)-(widthElt*cpt);
		                		var moveto = ((widthElt*m)-(widthElt)*cpt)+widthElt;
			                	_prepareMove(listElt[l],movefrom,moveto);
			                }
			                cpt--;
			                _paginate(cpt);
			            }

			        }
			        if(!endOfWorld){//Si il n'y a pas de compte a rebours initialisé, on relance le carousel
			        	_initCarousel(eachTime);
			        }
		        }
		    };

		    /**
		    * Move directly on the slide selected
		    */
		    function _slideDirectTo(action,to){
		    	//console.log(to);
		    	_btUnClick(next,prev);
		    	if(action == "action"){_anteTreatment();}//On désactive le clique sur les boutons si il y en a.
		    	if(!isAnimationRunning){
		    		direction = "left";
		    		clearInterval(interval);
			        if(nbrElts != 0){
						for(var p=0; p<nbrElts; p++){
							pp = p+1;
							if(p==cpt-1  && cpt!=to){//On déplace l'élément courant (modulo l'utilisateur n'as pas cliqué dessus)
			            		var movefrom = 0;
			            		var moveto = -widthElt;
			            		_prepareMove(listElt[p],movefrom,moveto);
							}else if(pp==to && cpt!=to){//On déplace vers l'élément désigné
								var movefrom = widthElt;
			            		var moveto = 0;
								_prepareMove(listElt[p],movefrom,moveto);
							}
						}
						cpt = to;
						//_initCarousel(eachTime);
						_paginate(cpt);
					}
			        if(!endOfWorld){//Si il n'y a pas de compte a rebours initialisé, on relance le carousel
			        	//_initCarousel(eachTime);
			        }
		        }
		    };

		    function _displayDirect(action,to){
		    	_btUnClick(next,prev);
		    	if(action == "action"){_anteTreatment();}//On désactive le clique sur les boutons si il y en a.
		    	if(!isAnimationRunning){
		    		direction = "left";
		    		clearInterval(interval);
			        if(nbrElts != 0){
						for(var p=0; p<nbrElts; p++){
							pp = p+1;
							if(p==cpt-1  && cpt!=to){//On déplace l'élément courant (modulo l'utilisateur n'as pas cliqué dessus)
			            		var moveto = -widthElt;
			            		listElt[p].style.left = moveto+"px";
							}else if(pp==to && cpt!=to){//On déplace vers l'élément désigné
			            		var moveto = 0;
			            		listElt[p].style.left = moveto+"px";
							}
						}
						cpt = to;
						_paginate(cpt);
						if(!interactStopAll){
							_initCarousel(eachTime);
						}else{
							_initThumbnail();
						}
					}
			        if(!endOfWorld){//Si il n'y a pas de compte a rebours initialisé, on relance le carousel
			        	_initCarousel(eachTime);
			        }
		        }
		    }

    /* Fin de la méthode carousselize */
	};


/* = Public functions ================================================================= */
	$.getElementsByClassName = function(wrapNode, classname){
		if(document.querySelector==undefined){
		    var a = [];
		    var re = new RegExp('(^| )'+classname+'( |$)');
		    var els = wrapNode.getElementsByTagName("*");
		    for(var i=0,j=els.length; i<j; i++)
		        if(re.test(els[i].className))a.push(els[i]);
		    return a;
		}else{
		    return wrapNode.querySelectorAll("." + classname);
		}
	};

	$.setCSS = function(domNode,keyValue){
		var existant = domNode.getAttribute("style");
		var newValue = keyValue.split(";");
		var itsanew = 0;
		var newString = "";
		var toSave = new Array();
		if(document.all){//Ie
			if(existant!=null){
				oldValue = existant.split(";",0);
				for(var m=0;m<oldValue.length-1;m++){
					for(var k=0;k<newValue.length-1;k++){
						newKey = newValue[k].split(":");
						oldKey = oldValue[m].split(":");
						if(newKey[0]==oldKey[0]){
							itsanew = 1;
							toSave[m] = oldKey[0]+":"+newKey[1]+";";
						}
					}
					if(itsanew==1){
						newString += toSave[m];
					}else{
						newString = newString+oldValue[m]+";";
					}
					itsanew = 0;
				};
				domNode.style.setAttribute("cssText",newString);
			}else{
				domNode.style.setAttribute("cssText",keyValue);
			}
		}else{
			if(existant!=null){
				oldValue = existant.split(";",0);
				for(var m=0;m<oldValue.length-1;m++){
					for(var k=0;k<newValue.length-1;k++){
						newKey = newValue[k].split(":");
						oldKey = oldValue[m].split(":");
						if(newKey[0]==oldKey[0]){
							itsanew = 1;
							toSave[m] = oldKey[0]+":"+newKey[1]+";";
						}
					}
					if(itsanew==1){
						newString += toSave[m];
					}else{
						newString = newString+oldValue[m]+";";
					}
					itsanew = 0;
				};
				domNode.setAttribute("style",newString);
			}else{
				domNode.setAttribute("style",keyValue);
			}
		}
		
	}

	$.setCssAttribute = function(domNode, keyValue){
		//if(domNode == undefined){return $;}//Retourne rien du tout si node est inexistant
		if(domNode.length == undefined){//Si le param domNode est le noeud directement...
			$.setCSS(domNode,keyValue);
		}else{//... ou une liste de noeud contenu dans un tableau.
			for(j=0; j<domNode.length; j++){
				$.setCSS(domNode[j],keyValue);
			}
		}
	};

	$.addClass = function(nodeToCheck, cl){
		nodeToCheck.className = nodeToCheck.className+" "+cl;
	}

	$.removeClass = function(nodeToCheck, cl){
		trimStr = nodeToCheck.className;
		var clsss = trimStr.split(" ");
		var nwClass = "";
		for(var o=0; o<clsss.length; o++){
			if(clsss[o]!=cl){	
				nwClass = nwClass+" "+clsss[o];
			}
		}
		nwClass = nwClass.replace(/ +/g,' ');
		nwClass = nwClass.substring(1);
		nodeToCheck.className = nwClass;
	}


	$.attachEventClick = function(NId,fnName){
		if(NId.addEventListener){
		  NId.addEventListener("click", fnName, false);
		}else if(NId.attachEvent){
		  NId.attachEvent("onclick", fnName);
		}
	}

	$.detachEventClick = function(NId,fnName){
		if(NId.removeEventListener){
		  NId.removeEventListener("click", fnName, false);
		}else if(NId.attachEvent){
		  NId.detachEvent("onclick", fnName);
		}
	}

	window['$'] = $;

})()

