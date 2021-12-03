'use strict'

const chai = require('chai')
const expect = chai.expect
const should = chai.should()

const {main} = require('../src/controllers/controleEstoque');

describe('controleEstoque recebe um item com estoque', ()=>{
    // item com a mesma quantidade da entrada de estoque, para retornar com sucesso
    const {body1:body} = require('./dataTest/controleEstoque.json');
    it('teria que retornar alguns pedidos criados', ()=>{
        const request = main({body}, null)
        const response = request.json

        response.should.have.property('pedidosCriados').with.lengthOf(1)
    })
    it('teria que retornar nenhum item sem estoque', ()=>{
        const request = main({body}, null)
        const response = request.json

        response.should.have.property('itemSemEstoque').with.lengthOf(0)
    })
    it('id dos pedidos retornados devem ser do tipo inteiro', ()=>{
        const request = main({body}, null)
        const response = request.json

        expect(response.pedidosCriados[0]).to.be.a('Number')
    })
})

describe('controleEstoque recebe item sem estoque', ()=> {
    const {body2:body} = require('./dataTest/controleEstoque.json');
    it('teria que retornar items sem estoque', ()=>{
        const request = main({body}, null)
        const response = request.json
        response.should.have.property('itemSemEstoque').with.lengthOf(1)
    })
    it('teria que retornar nenhum pedido criado', ()=>{
        const request = main({body}, null)
        const response = request.json

        response.should.have.property('pedidosCriados').with.lengthOf(0)
    })
    it('teria que retornar propriedade sku', ()=>{
        const request = main({body}, null)
        const response = request.json

        expect(response.itemSemEstoque[0]).to.have.property('sku')
    })
    it('teria que retornar propriedade sku com string valida', ()=>{
        const request = main({body}, null)
        const response = request.json

        expect(response.itemSemEstoque[0].sku).to.be.a('string')
    })
})