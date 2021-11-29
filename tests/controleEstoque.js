'use strict'

const chai = require('chai')
const expect = chai.expect
const should = chai.should()

const {main} = require('../src/controllers/controleEstoque');

describe('controleEstoque recebe um item com estoque', function(){
    // item com a mesma quantidade da entrada de estoque, para retornar com sucesso
    const body = {
        "Items": [{
            "Id": "12_1",
            "Sku": "PRODUCT_1",
            "Name": "Awesome Super Product",
            "Quantity": "1.0",
            "Price": "2.5"
        }]
    }
    it('teria que retornar alguns pedidos criados', function(){
        const request = main({body}, null)
        const response = request.json

        response.should.have.property('pedidosCriados').with.lengthOf(1)
    })
    it('teria que retornar nenhum item sem estoque', function(){
        const request = main({body}, null)
        const response = request.json

        response.should.have.property('itemSemEstoque').with.lengthOf(0)
    })
    it('id dos pedidos retornados devem ser do tipo inteiro', function(){
        const request = main({body}, null)
        const response = request.json

        expect(response.pedidosCriados[0]).to.be.a('Number')
    })
})

describe('controleEstoque recebe item sem estoque', function() {
    const body = {
        "Items": [{
            "Id": "12_1",
            "Sku": "PRODUCT_1",
            "Name": "Awesome Super Product",
            "Quantity": "2.0",
            "Price": "2.5"
        }]
    }
    it('teria que retornar items sem estoque', function(){
        const request = main({body}, null)
        const response = request.json
        response.should.have.property('itemSemEstoque').with.lengthOf(1)
    })
    it('teria que retornar nenhum pedido criado', function(){
        const request = main({body}, null)
        const response = request.json

        response.should.have.property('pedidosCriados').with.lengthOf(0)
    })
    it('teria que retornar propriedade sku', function(){
        const request = main({body}, null)
        const response = request.json

        expect(response.itemSemEstoque[0]).to.have.property('sku')
    })
    it('teria que retornar propriedade sku com string valida', function(){
        const request = main({body}, null)
        const response = request.json

        expect(response.itemSemEstoque[0].sku).to.be.a('string')
    })
})