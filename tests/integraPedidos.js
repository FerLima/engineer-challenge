'use strict'

const chai = require('chai')
const expect = chai.expect
const should = chai.should()

const ordersValidos = [
    {
        "id": "21b1c6e4-9d7f-4f78-8e82-19491a0f5a12",
        "external_id": "32",
        "store_id": "208a4cef-2b7b-4790-b369-e5636cdf466a",
        "created_at": new Date(),
        "is_picked": false,
        "is_stockout": false
    },
    {
        "id": "21b1c6e4-9d7f-4f78-8e82-19491a0f5a12",
        "external_id": "32",
        "store_id": "208a4cef-2b7b-4790-b369-e5636cdf466a",
        "created_at": new Date(new Date().setMinutes(new Date().getMinutes()-2)),
        "is_picked": false,
        "is_stockout": false
    },
    {
        "id": "21b1c6e4-9d7f-4f78-8e82-19491a0f5a12",
        "external_id": "32",
        "store_id": "208a4cef-2b7b-4790-b369-e5636cdf466a",
        "created_at": new Date(new Date().setMinutes(new Date().getMinutes()-3)),
        "is_picked": false,
        "is_stockout": false
    }
]

const ordersInvalidos = [
    {
        "id": "21b1c6e4-9d7f-4f78-8e82-19491a0f5a12",
        "external_id": "32",
        "store_id": "208a4cef-2b7b-4790-b369-e5636cdf466a",
        "created_at": "2021-02-15T10:23:23",
        "is_picked": false,
        "is_stockout": false
    },
    {
        "id": "21b1c6e4-9d7f-4f78-8e82-19491a0f5a12",
        "external_id": "32",
        "store_id": "208a4cef-2b7b-4790-b369-e5636cdf466a",
        "created_at": "2021-03-23T10:23:23",
        "is_picked": false,
        "is_stockout": false
    },
    {
        "id": "21b1c6e4-9d7f-4f78-8e82-19491a0f5a12",
        "external_id": "32",
        "store_id": "208a4cef-2b7b-4790-b369-e5636cdf466a",
        "created_at": "2021-04-27T10:23:23",
        "is_picked": false,
        "is_stockout": false
    },
    {
        "id": "21b1c6e4-9d7f-4f78-8e82-19491a0f5a12",
        "external_id": "32",
        "store_id": "208a4cef-2b7b-4790-b369-e5636cdf466a",
        "created_at": "2021-05-30T10:23:23",
        "is_picked": false,
        "is_stockout": false
    }
]
const {main, filtrarPedidos} = require('../src/controllers/integraPedidos');

describe('filtrar pedidos do integraPedidos ', function(){ 
    

    it('teria item novos nos ultimos 5 minutos', function(){
        const response = filtrarPedidos(ordersValidos)

        response.should.be.a('Array').with.lengthOf(3)
    })

    it('teria que retornar 0 pedidos novos nos ultimos 5 minutos ', function(){
        const response = filtrarPedidos(ordersInvalidos)

        response.should.be.a('Array').with.lengthOf(0)
    })
})


describe('função principal do integraPedidos', function(){  
    
    it('retorna array de pedidos criados com pedidos novos nos ultimos 5 minutos', function(){
        const response = main({test: ordersValidos})

        response.json.pedidos.should.be.a('Array').with.lengthOf(3)
    })

    it('retorna um array de objetos com id quando tem pedidos novos nos ultimos 5 minutos', function(){
        const response = main({test: ordersValidos})

        expect(response.json.pedidos[0]).to.have.property('id')
        expect(response.json.pedidos[1]).to.have.property('id')
        expect(response.json.pedidos[2]).to.have.property('id')
    })

    it('retorna um array com id de pedidos com pedidos novos nos ultimos 5 minutos', function(){
        const response = main({test: ordersValidos})

        expect(response.json.pedidos[0].id).to.be.a('Number')
        expect(response.json.pedidos[1].id).to.be.a('Number')
        expect(response.json.pedidos[2].id).to.be.a('Number')
    })

    it('retorna mensagem de sucesso com pedidos novos nos ultimos 5 minutos', function(){
        const response = main({test: ordersValidos})

        expect(response.json.message).to.equal('Pedidos incluidos com sucesso')
    })

    it('retorna mensagem de falha quando não tem pedidos novos nos ultimos 5 minutos', function(){
        const response = main({test: ordersInvalidos})

        expect(response.json.message).to.equal('Nenhum pedido incluido ')
    })

    it(' não retorna nenhum array de pedidos', function(){
        const response = main({test: ordersInvalidos})
        
       expect(response.json).to.deep.equal({message:'Nenhum pedido incluido '})
    })
})