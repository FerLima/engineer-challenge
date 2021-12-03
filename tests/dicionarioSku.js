'use strict'

const chai = require('chai')
const expect = chai.expect
const should = chai.should()

const {main} = require('../src/controllers/dicionarioSku');

const body = require('./dataTest/dicionarioSku.json');

describe('dicionarioSku recebe um pedido', ()=>{ 
    
    it('teria que retornar um array de 2 objetos', async ()=>{
        const request = await main({body}, null)
        const response = request.json
        response.should.be.a('Array').with.lengthOf(2).should.be.a('object')
    })
    it('teria que retornar uma "Media de Entrega" com string valida', async ()=>{
        const request = await main({body}, null)
        const response = request.json
        response.map((obj) => {
            expect(obj).to.have.property('mediaEntrega').to.be.a('string')
        })
    })

    it('teria que retornar um objeto "infoProduto" com as propriedades corretas', async ()=>{
        const request = await main({body}, null)
        const response = request.json
        response.map((obj) => {
            expect(obj).to.have.property('infoProduto').to.be.a('object')
            expect(obj.infoProduto).to.have.property('Id').to.be.a('string')
            expect(obj.infoProduto).to.have.property('Sku').to.be.a('string')
            expect(obj.infoProduto).to.have.property('Name').to.be.a('string')
        })
    })
    it('teria que retornar um objeto "infoEntrega" com as propriedades corretas', async ()=>{
        const request = await main({body}, null)
        const response = request.json
        response.map((obj) => {
            expect(obj).to.have.property('infoEntrega').to.be.a('object')
            expect(obj.infoEntrega).to.have.property('nomeTransportadora').to.be.a('string')
            expect(obj.infoEntrega).to.have.property('nomeRegistro').to.be.a('string')
            expect(obj.infoEntrega).to.have.property('CEP').to.be.a('string')
            expect(obj.infoEntrega).to.have.property('TrackingNumber').to.be.a('string')
        })
    })
    it('teria que retornar uma média de 6 dias para o primeiro produto de entrega em São Paulo', async ()=>{
        const request = await main({body}, null)
        const response = request.json
        expect(response[0]).to.have.property('mediaEntrega').to.equal('6 dias')
    })
    it('teria que retornar uma média de 5 dias para o segundo produto de entrega no Rio de Janeiro', async ()=>{
        const request = await main({body}, null)
        const response = request.json
        expect(response[1]).to.have.property('mediaEntrega').to.equal('5 dias')
    })
})