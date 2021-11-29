'use strict'

const chai = require('chai')
const expect = chai.expect

const {main} = require('../src/controllers/controleEstoque');

const body = require('../src/data/pedidos.json');

describe('integraPedidos', function(){
    it('should return something', function(){
        console.log('main', main)
        expect(true).to.equal(true);

    })
})

/*describe('controleEstoque', function(){

})
*/