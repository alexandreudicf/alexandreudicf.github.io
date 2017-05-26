/**
 * Created by alexandre on 23/05/17.
 */
var app = angular.module('myApp', []);
app.controller('myCtrl', ['$scope','$timeout','$q','$http','RodaService',function($scope,$timeout,$q,$http,RodaService) {
    $scope.palavra = RodaService.palavraSecreta;

    $scope.valores = RodaService.valores;
    $scope.pessoas = RodaService.participantes;

    $scope.indexPessoa = 0;
    $scope.letra = "";
    $scope.letras = [];

    $scope.passos = 3;
    $scope.passoAtual = 1;

    $scope.btnLetra = true;
    $scope.btnPessoa = true;
    $scope.btnRoda = false;

    $scope.drawColourTriangle = drawColourTriangle;
    $scope.playSpinWheel = playSpinWheel;

    init();

    function init() {

        // $scope.valorSelecionado = $scope.valores[Math.floor(Math.random() * $scope.valores.length)];
        $scope.pessoaSelecionada = $scope.pessoas[$scope.indexPessoa];

        var letrasI = $scope.palavra.toLowerCase().split("");
        $scope.painelLetras = [];

        for (i = 0; i < letrasI.length ; i++) {
            $scope.painelLetras.push({letra : letrasI[i],mostrar : false});
        }


        initSpinWheel();
    }

    $scope.proximaPessoa = function() {
        if ($scope.indexPessoa + 1 == $scope.pessoas.length) {
            $scope.indexPessoa = 0;
        } else {
            $scope.indexPessoa++;
        }

        $scope.pessoaSelecionada = $scope.pessoas[$scope.indexPessoa];
        $scope.proximoPasso();
    };

    $scope.girarRoda = function() {
        var position = Math.floor(Math.random() * $scope.valores.length);
        $scope.valorSelecionado = $scope.valores[position];

        var stopAt = $scope.spinWheel.getRandomForSegment(position) - 90;
        $scope.spinWheel.animation.stopAngle = stopAt;

        $scope.playSpinWheel();
        $scope.proximoPasso();
    };

    $scope.proximoPasso = function() {
        $scope.passoAtual ++;
        if ($scope.passoAtual == 1) {
            $scope.btnLetra = true;
            $scope.btnPessoa = true;
            $scope.btnRoda = false;
            initSpinWheel();
            $scope.passoAtual ++;
        } else if ($scope.passoAtual == 2) {
            $scope.btnLetra = false;
            $scope.btnPessoa = true;
            $scope.btnRoda = true;
        } else {
            $scope.btnLetra = true;
            $scope.btnPessoa = false;
            $scope.btnRoda = true;

            $scope.passoAtual = 0;
        }
    };

    $scope.escolherLetra = function() {
        if ($scope.validarLetraJaFoiEscolhido()) {
            return alert('Letra já foi escolhida!');
        }

        var letras = $scope.palavra.toLowerCase().split("");
        var encontrou = false;

        $scope.letras.push($scope.letra);


        for (i = 0; i < letras.length ; i++) {
            if (letras[i] == $scope.letra.toLowerCase()) {
                $scope.pessoaSelecionada.valor = $scope.pessoaSelecionada.valor + $scope.valorSelecionado.valor;
                encontrou = true;
            }
        }

        $scope.mostrarLetras();
        if (!encontrou) {
            $scope.proximoPasso();
        }
        $scope.letra = "";
    };

    $scope.validarLetraJaFoiEscolhido = function() {
        return _.contains($scope.letras,$scope.letra);
    };

    $scope.mostrarLetras = function() {

        angular.forEach($scope.painelLetras,function (value)  {
            if (value.letra == $scope.letra) {
                value.mostrar = true;
            }
        });
    };


    function initSpinWheel() {

        initSegments();

        $scope.spinWheel = new Winwheel({
            'drawMode': 'segmentImage',
            'numSegments': $scope.valores.length,
            'drawText': true,
            'imageOverlay': true,
            //'numSegments'     : 4,
            'lineWidth': 4,
            //'innerRadius'     : 40,
            'outerRadius': 320,
            'textAlignment': 'center',
            'canvasId': 'spinWheel',
            'pointerAngle': 90,
            'imageDirection': 'NW',
            'segments': $scope.segments,
            'animation': {
                'type': 'spinToStop',
                'duration': 5,
                'spins': 8,
                'easing': 'Power2.easeInOut',

                // Remember to do something after the animation has finished specify callback function.
                'callbackFinished': winAnimation,

                // During the animation need to call the drawTriangle()
                // to re-draw the pointer each time.
                'callbackAfter': drawColourTriangle
            }
        });

        var loadedImg = new Image();

// Create callback to execute once the image has finished loading.
        loadedImg.onload = function()
        {
            $scope.spinWheel.wheelImage = loadedImg;    // Make wheelImage equal the loaded image object.
            $scope.spinWheel.draw();                    // Also call draw function to render the wheel.

            $timeout(
                function() {
                    $scope.drawColourTriangle();
                    if (typeof boundObject == 'object') {
                        boundObject.loaded();
                    }
                },1000
            );
        };

// Set the image source, once complete this will trigger the onLoad callback (above).
        loadedImg.src = "images/reduce_logo.png";


        // Call draw triangle to initially draw the pointer.
        $scope.drawColourTriangle();
    }

    function winAnimation() {
        // Get the audio with the sound it in.
        //var winsound = document.getElementById('winsound');
        //winsound.play();

        // Get the number of the winning segment.
        var winningSegmentNumber = $scope.spinWheel.getIndicatedSegmentNumber();

        // Loop and set fillStyle of all segments to gray.
        for (var x = 1; x < $scope.spinWheel.segments.length; x ++)
        {
            if (winningSegmentNumber != x) {
                $scope.spinWheel.segments[x].textFillStyle = '#E0E0E0';
                $scope.spinWheel.segments[x].gradientStyle = null;
                $scope.spinWheel.segments[x].fillStyle = '#E0E0E0';
            }
        }

        // Make the winning one yellow.
        //$scope.spinWheel.segments[winningSegmentNumber].fillStyle = '#00802b';

        // Call draw function to render changes.
        $scope.spinWheel.draw();

        // Also re-draw the pointer, otherwise it disappears.
        $scope.drawColourTriangle();

        // if (typeof boundObject == 'object') {
        //     boundObject.prizeDelegate($scope.wheelPrizeEntry.prize.id, $scope.wheelPrizeEntry.prize.name);
        // }

        return true;
    }

    function drawColourTriangle() {
        // Get context used by the wheel.
        var ctx2 = $scope.spinWheel.ctx;

        ctx2.strokeStyle = '#115C7E';  // Set line colour.
        ctx2.fillStyle   = '#115C7E';  // Set fill colour.
        //ctx2.lineWidth   = 3;
        ctx2.beginPath();           // Begin path.

        ctx2.moveTo(687, 296);      // Move to initial position.
        ctx2.lineTo(687, 348);      // Draw lines to make the shape.
        ctx2.lineTo(647, 322);
        ctx2.lineTo(687, 297);
        ctx2.stroke();              // Complete the path by stroking (draw lines).
        ctx2.fill();

        return true;
    }

    // Draw pointer on canvas, this time on the right.
    function drawColourTriangle() {
        // Get context used by the wheel.
        var ctx2 = $scope.spinWheel.ctx;

        ctx2.strokeStyle = '#115C7E';  // Set line colour.
        ctx2.fillStyle   = '#115C7E';  // Set fill colour.
        //ctx2.lineWidth   = 3;
        ctx2.beginPath();           // Begin path.

        ctx2.moveTo(687, 296);      // Move to initial position.
        ctx2.lineTo(687, 348);      // Draw lines to make the shape.
        ctx2.lineTo(647, 322);
        ctx2.lineTo(687, 297);
        ctx2.stroke();              // Complete the path by stroking (draw lines).
        ctx2.fill();

        return true;
    }

    function playSpinWheel() {
        // if(!$scope.animated) {
        //     $scope.animated = true;
            //$('#Hammer').hide();
            $scope.spinWheel.startAnimation();
        // }
    }


    function initSegments() {

        $scope.segments = [];

        var strokeStyle = 'white';
        var fillStyles = [
            {offSet0:'#C88B03'  ,offSet1:'#BB7420',textFillStyle: 'white'},
            {offSet0:'#3E8EA9'  ,offSet1:'#5199B2',textFillStyle: 'white'},
            {offSet0:'#FF6F40' ,offSet1:'#FF7D53',textFillStyle: '#DAD2C1'},
            {offSet0:'#78907B' ,offSet1:'#9AB087',textFillStyle: '#2D5566'},
            {offSet0:'#A9553A' ,offSet1:'#C78F7E',textFillStyle: '#2D5566'},
            {offSet0:'#E99616' ,offSet1:'#BD7912',textFillStyle: 'white'},
            {offSet0:'#C9BF8E' ,offSet1: '#777054',textFillStyle: 'white'},
            {offSet0:'#202C82' ,offSet1:'#5C65A4',textFillStyle: 'white'}
        ];

        var lengthStyles = fillStyles.length;
        var startStyles = 0;

        for (var wheelPrize in $scope.valores) {
            var offSet0;
            var offSet1;
            var textStyle;
            if (startStyles != lengthStyles) {
                offSet0 = fillStyles[startStyles].offSet0;
                offSet1 = fillStyles[startStyles].offSet1;
                textStyle = fillStyles[startStyles].textFillStyle;
                startStyles++;
            } else {
                startStyles = 0;
                offSet0 = fillStyles[startStyles].offSet0;
                offSet1 = fillStyles[startStyles].offSet1;
                textStyle = fillStyles[startStyles].textFillStyle;
            }

            $scope.segments.push({
                'gradientStyle':{offSet0:offSet0,offSet1:offSet1},
                'textFontFamily':"Arial",
                'textFillStyle': textStyle,
                'textFontSize': 20,
                'text' : $scope.valores[wheelPrize].descricao,
                'image': 'images/segment.png',
                'strokeStyle' : strokeStyle
            });
        }
    }



}]);