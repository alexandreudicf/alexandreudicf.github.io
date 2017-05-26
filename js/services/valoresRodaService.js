/**
 * Created by alexandre on 26/05/17.
 */

/**
 * Created by mateus on 07/04/2016.
 */
(function() {
    'use strict';
    angular.module('myApp').factory('RodaService', RodaService);
    // ValoresRodaService.$inject = ['HttpResource', '$http'];

    function RodaService() {

        var valoresRoda = [
            {descricao :"100 BARRAS DE OURO" , valor: 100},
            {descricao :"200 BARRAS DE OURO" , valor: 200},
            {descricao :"200 BARRAS DE OURO" , valor: 200},
            {descricao :"200 BARRAS DE OURO" , valor: 200},
            {descricao :"350 BARRAS DE OURO" , valor: 350},
            {descricao :"100 BARRAS DE OURO" , valor: 100},
            {descricao :"800 BARRAS DE OURO" , valor: 800},
            {descricao :"700 BARRAS DE OURO" , valor: 700},
            {descricao :"400 BARRAS DE OURO" , valor: 400}
        ];

        var participantes  = [{nome : "Mario", valor : 0},{nome : "Jose", valor : 0},{nome : "Ronaldo", valor : 0}];

        return {
            valores : valoresRoda,
            participantes : participantes,
            palavraSecreta : "Alexandre"
        };
    }

})();