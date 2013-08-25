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
        * Values uses in everywhere are setted here
        */
        var cpt = 1;
        var nbrElts = 0;
        var thumbHover = 0;
        var nbrThbnls = 0;
        var wLucarne = 0;
        var widthElt = 0;
        var SmallestUnitMove;
        var thumbnail = false;
        var interval = false;
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
        var fnName1 = function(){_slideNext("action");};
        var fnName2 = function(){_slidePrev("action");};
        var fnName4 = function(){_gotothepic(0);};

        listElt = params.noeud;
        thumbnail = params.thumbnail;
        thumbHover = params.thumbHover;
        if(params.timer){eachTime = params.timer;}
        pagination = params.compteur;
        btNext = params.btNext;
        btPrev = params.btPrev;
        if(params.AnimFrequency){anF = params.AnimFrequency;}
        if(params.AnimSplitdistance){originalanD = anD = params.AnimSplitdistance;}
        endOfWorld = params.endRotation;
        interactStopAll = params.interactStopAll;

        nbrElts = listElt.length;

        if(nbrElts>1){

            //var wContainer = 0;
            var Lucarne = listElt[0].parentNode;
            wLucarne = Lucarne.offsetWidth;
            widthElt = listElt[0].offsetWidth;
            $.addClass(listElt[0],"active");

            /* On calcule la largeur du conteneur principal */
            //wContainer = nbrElts*widthElt;

            $.setCssAttribute(Lucarne,"position:relative;");
            for(var k=0; k<nbrElts; k++){
                $.setCssAttribute(listElt[k],"position:absolute;left:"+widthElt*k+"px;");
            }

            if(endOfWorld){
                setTimeout(function(){
                    clearInterval(interval);
                }, endOfWorld);
            }

            _initCarousel(eachTime);

            var next = document.getElementById(btNext);
            var prev = document.getElementById(btPrev);
            _btClick(next,prev);

        }

            /* = functions ================================================================= */
            function _animation(targetNode,from,to){
                /* show the current frame */
                anD += 1;
                var currentP = 0;
                if(direction==="left"){
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
                }, anF);
            }

            /* Gere la class "active" */
            function _prepareMove(targetNode,movefrom,moveto){
                if(moveto === 0){
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

            /* Function eventClickSlieDirectTo */
            function _gototheslide(o){
                return function(){
                    _slideDirectTo("action",o+1);
                };
            }

            /* Function eventClickSlieDirectTo */
            function _gotothepic(r){
                return function(){
                    _displayDirect("action",r+1);
                };
            }

            /* = initialisation miniatures ================================================================= */
            function _initThumbnail(){
                if(thumbnail){
                    nbrThbnls = thumbnail.length;
                    for(var n=0; n<nbrThbnls; n++){
                        thumbnail[n].numerous = n+1;
                        if(cpt === n+1){
                            $.addClass(thumbnail[n],"activeSlide");
                        }else{
                            $.removeClass(thumbnail[n],"activeSlide");
                        }
                        var fnName3 = _gototheslide(n);
                        $.attachEventClick(thumbnail[n],fnName3);
                    }
                    
                    if(thumbHover===1){
                        for(var q=0; q<nbrThbnls; q++){
                            /*thumbnail[q].addEventListener(
                                "onmouseover",_displayDirect("action",q+1)
                            );*/
                            //thumbnail[q].onmouseover = function(){
                                fnName4 = _gotothepic(q);
                                $.attachEventHover(thumbnail[q],fnName4);
                            //};
                        }
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
            }

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
                if(action === "action"){_anteTreatment();}
                if(!isAnimationRunning){
                    if(nbrElts !== 0){
                        var moveto = 0;
                        var movefrom = 0; 
                        if(cpt === nbrElts){//Quand on arrive au bout du carrousel
                            listElt[0].style.left = (widthElt*nbrElts)+widthElt;
                            for(var l=0; l<nbrElts; l++){
                                if(l === nbrElts-1){//at the end, last element is init on first position
                                    moveto = 0-widthElt;
                                    movefrom = 0;
                                }else{
                                    cpt = 0;
                                    moveto = (widthElt*l)-(widthElt*cpt);
                                    movefrom = (widthElt*l)-(widthElt*(cpt-1));
                                }
                                _prepareMove(listElt[l],movefrom,moveto);
                            }
                            _paginate(1);
                            cpt++;
                        }else{// Ajout +1 au compteur (nous allons sur la diapositive suivante)
                            for(var p=0; p<nbrElts; p++){
                                if(cpt>0){
                                    movefrom = (widthElt*p)-(widthElt*(cpt-1));
                                    moveto = (widthElt*p)-(widthElt*cpt);
                                }else{//si on est à la première slide
                                    movefrom = (widthElt*p)-(widthElt*cpt);
                                    moveto = (widthElt*p)-widthElt;
                                }
                                _prepareMove(listElt[p],movefrom,moveto);
                            }
                            cpt++;
                            _paginate(cpt);
                        }

                    }
                }
            }

            /**
            * recule le carrousel d'une diapositive
            * si dernière diapo, on revient à la première
            */
            function _slidePrev(action){
                direction = "right";
                _btUnClick(next,prev);
                if(action === "action"){_anteTreatment();}
                if(!isAnimationRunning){
                    clearInterval(interval);
                    var movefrom = 0;
                    var moveto = 0;
                    var m = 0;
                    if(nbrElts !== 0){
                        if(cpt === 1){//Quand on arrive au bout du carrousel
                            listElt[nbrElts-1].style.left = -widthElt;
                            for(var l=0; l<nbrElts; l++){
                                if(l === nbrElts-1){//arrivé au début, on déplace le dernier élément en position -1
                                    movefrom = -widthElt;
                                    moveto = 0;
                                }else{
                                    m = l+1;
                                    movefrom = (widthElt*m)-(widthElt*cpt);
                                    moveto = ((widthElt*m)-(widthElt)*cpt)+widthElt;
                                }
                                _prepareMove(listElt[l],movefrom,moveto);
                            }
                            cpt = nbrElts;
                            _paginate(nbrElts);
                        }else{// Ajout -1 au compteur (nous allons sur la diapositive suivante)
                            for(var r=0; r<nbrElts; r++){
                                m = r+1;
                                movefrom = (widthElt*m)-(widthElt*cpt);
                                moveto = ((widthElt*m)-(widthElt)*cpt)+widthElt;
                                _prepareMove(listElt[r],movefrom,moveto);
                            }
                            cpt--;
                            _paginate(cpt);
                        }

                    }
                    if(!endOfWorld){//Si il n'y a pas de compte a rebours initialisé, on relance le carousel
                        _initCarousel(eachTime);
                    }
                }
            }

            /**
            * Move directly on the slide corresponding to the thumbnail in mouseover
            */
            function _slideDirectTo(action,to){
                _btUnClick(next,prev);
                if(action === "action"){_anteTreatment();}//On désactive le clique sur les boutons si il y en a.
                if(!isAnimationRunning){
                    direction = "left";
                    clearInterval(interval);
                    if(nbrElts !== 0){
                        var movefrom = 0;
                        var moveto = 0;
                        var pp = 0;
                        for(var p=0; p<nbrElts; p++){
                            pp = p+1;
                            if(p===cpt-1  && cpt!==to){//On déplace l'élément courant (modulo l'utilisateur n'as pas cliqué dessus)
                                movefrom = 0;
                                moveto = -widthElt;
                                _prepareMove(listElt[p],movefrom,moveto);
                            }else if(pp===to && cpt!==to){//On déplace vers l'élément désigné
                                movefrom = widthElt;
                                moveto = 0;
                                _prepareMove(listElt[p],movefrom,moveto);
                            }
                        }
                        cpt = to;
                        //_initCarousel(eachTime);
                        _paginate(cpt);
                    }
                    if(!endOfWorld){//Si il n'y a pas de compte a rebours initialisé, on relance le carousel
                        _initCarousel(eachTime);
                    }
                }
            }

            function _displayDirect(action,to){
                _btUnClick(next,prev);
                if(action === "action"){_anteTreatment();}//On désactive le clique sur les boutons si il y en a.
                if(!isAnimationRunning){
                    direction = "left";
                    clearInterval(interval);
                    var moveto = 0;
                    var pp = 0;
                    if(nbrElts !== 0){
                        for(var p=0; p<nbrElts; p++){
                            pp = p+1;
                            if(thumbHover === 1){
                                $.detachEventHover(thumbnail,fnName4);
                            }
                            if(p===cpt-1  && cpt!==to){//On déplace l'élément courant (modulo l'utilisateur n'as pas cliqué dessus)
                                moveto = -widthElt;
                                listElt[p].style.left = moveto+"px";
                            }else if(pp===to && cpt!==to){//On déplace vers l'élément désigné
                                moveto = 0;
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
        if(document.querySelector===undefined){
            var a = [];
            var re = new RegExp('(^| )'+classname+'( |$)');
            var els = wrapNode.getElementsByTagName("*");
            for(var i=0,j=els.length; i<j; i++){
                if(re.test(els[i].className)){
                    a.push(els[i]);
                }
            }
            return a;
        }else{
            return wrapNode.querySelectorAll("." + classname);
        }
    };

    $.setCSS = function(domNode,keyValue){
        var existant = domNode.getAttribute("style");
        var itsanew = 0;
        var newString = "";
        var oldKey = "";
        var newKey = "";
        var newValue = [];
        var toSave = [];
        var oldValue = [];
        newValue = keyValue.split(";");
        if(document.all){//Ie
            if(existant!==null){
                oldValue = existant.split(";",0);
                for(var s=0;s<oldValue.length-1;s++){
                    for(var k=0;k<newValue.length-1;k++){
                        newKey = newValue[k].split(":");
                        oldKey = oldValue[s].split(":");
                        if(newKey[0] === oldKey[0]){
                            itsanew = 1;
                            toSave[s] = oldKey[0]+":"+newKey[1]+";";
                        }
                    }
                    if(itsanew === 1){
                        newString += toSave[s];
                    }else{
                        newString = newString+oldValue[s]+";";
                    }
                    itsanew = 0;
                }
                domNode.style.setAttribute("cssText",newString);
            }else{
                domNode.style.setAttribute("cssText",keyValue);
            }
        }else{
            if(existant !== null){
                oldValue = existant.split(";",0);
                for(var m=0;m<oldValue.length-1;m++){
                    for(var t=0;t<newValue.length-1;t++){
                        newKey = newValue[t].split(":");
                        oldKey = oldValue[m].split(":");
                        if(newKey[0] ===oldKey[0]){
                            itsanew = 1;
                            toSave[m] = oldKey[0]+":"+newKey[1]+";";
                        }
                    }
                    if(itsanew === 1){
                        newString += toSave[m];
                    }else{
                        newString = newString+oldValue[m]+";";
                    }
                    itsanew = 0;
                }
                domNode.setAttribute("style",newString);
            }else{
                domNode.setAttribute("style",keyValue);
            }
        }
    };

    $.setCssAttribute = function(domNode, keyValue){
        //if(domNode == undefined){return $;}//Retourne rien du tout si node est inexistant
        if(domNode.length === undefined){//Si le param domNode est le noeud directement...
            $.setCSS(domNode,keyValue);
        }else{//... ou une liste de noeud contenu dans un tableau.
            for(var j=0; j<domNode.length; j++){
                $.setCSS(domNode[j],keyValue);
            }
        }
    };

    $.addClass = function(nodeToCheck, cl){
        nodeToCheck.className = nodeToCheck.className+" "+cl;
    };

    $.removeClass = function(nodeToCheck, cl){
        var trimStr = "";
        trimStr = nodeToCheck.className;
        var clsss = trimStr.split(" ");
        var nwClass = "";
        for(var o=0; o<clsss.length; o++){
            if(clsss[o] !== cl){   
                nwClass = nwClass+" "+clsss[o];
            }
        }
        nwClass = nwClass.replace(/ +/g,' ');
        nwClass = nwClass.substring(1);
        nodeToCheck.className = nwClass;
    };

    $.attachEventHover = function(NId,fnName){
        if(NId.addEventListener){
          NId.addEventListener("mouseover", fnName, false);
        }else if(NId.attachEvent){
          NId.attachEvent("mouseover", fnName);
        }
    };

    $.detachEventHover = function(NId,fnName){
        if(NId.removeEventListener){
          NId.removeEventListener("mouseover", fnName, false);
        }else if(NId.attachEvent){
          NId.detachEvent("mouseover", fnName);
        }
    };

    $.attachEventClick = function(NId,fnName){
        if(NId.addEventListener){
          NId.addEventListener("click", fnName, false);
        }else if(NId.attachEvent){
          NId.attachEvent("onclick", fnName);
        }
    };

    $.detachEventClick = function(NId,fnName){
        if(NId.removeEventListener){
          NId.removeEventListener("click", fnName, false);
        }else if(NId.attachEvent){
          NId.detachEvent("onclick", fnName);
        }
    };

    window.$ = $;

})();

