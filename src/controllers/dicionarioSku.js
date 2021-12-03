
    const {parseRequest} = require('../helpers/api')
    

    //consultar uma tabela de controle interno nosso ou uma api de terceiros da transportadora
    //que tenha uma faixa de CEP e sua media de tempo pra entrega 
    //Informações essas que deveriam ser disponibilizadas pela transportadora na hora que o contrato de parceria é feito
    //Aqui fiz pensando em uma tabela nossa, teria as colunas: 
    //faixaCEPInicial, faixaCEPFinal, mediaDias, nomeTransportadora, id, dataCriacao
    const consultarTransportadora = (deliveryInformation, CEPs) =>{
        // utilizei dessa fonte para pegar as faixas de CEP do Brasil
        // https://suporte.boxloja.pro/article/90-faixa-de-ceps-do-brasil
        const transportadoras = require('../data/transportadoras.json');
        // essa função fica no lugar de uma consulta passando como parametro o nome da transportadora
        //e as faixas de CEP 
        //Percorrer o array de informações de entrega, procurando pela transportadora correspondente dele na base de dados
        return deliveryInformation.map((delivery,index) => {

            return transportadoras.find((transportadora) => {
                if (!CEPs[index]) return
                const CEP = Number(CEPs[index].cep.replace('-',''));

                return delivery.Transporter === transportadora.nomeTransportadora &&
                CEP >= transportadora.faixaCEPInicial &&
                CEP <= transportadora.faixaCEPFinal
            })
        })

    } 

    //Pensando na estrutura do JSON de delivery do orders que não tem CEP, consultar uma rota
    //dos correios para consultar o CEP daquele endereço, passando como parametro UF, Cidade e Logradouro(Rua) respectivamente
    //usei essa Documentação como base: https://viacep.com.br/
    const consultaCEP = async (delivery)  => {

        //Percorre o array do "Delivery" pegando o CEP de todos os objetos que tem la dentro
        return Promise.all(delivery.map(async (deliveryInformation) => {
            const {State, City, Address} = deliveryInformation
            
            //Retorna um array de CEPs pois existem avenidas/bairros grandes onde tem mais de um CEP, mas para esse exercicio, estarei considerando o primeiro resultado
            return (await parseRequest(`http://viacep.com.br/ws/${encodeURI(State)}/${encodeURI(City)}/${encodeURI(Address)}/json/`))[0]
        }))
    }

    const main = async (req) => {
        
        const body = req.body;
        if (!body.hasOwnProperty('Delivery')) return  {status:500, json:{message: "Pedido sem informações de entrega, corrija e tente mais tarde"}}
        
        // busca CEP do endereço
        const todosCEP = await consultaCEP(body.Delivery);

        
        //busca na tabela da transportadora
        const transportadoras  = consultarTransportadora(body.Delivery, todosCEP);

        //monta o dicionario de SKUs com a data de finalização media para tal transportadora em tal CEP
        const dicionario = transportadoras.map((transportadora,index) => {
            return {
                mediaEntrega: transportadora.mediaDias,
                infoProduto: {Id: body.Items[index].Id, Sku:  body.Items[index].Sku, Name: body.Items[index].Name},
                infoEntrega: {nomeTransportadora: transportadora['nomeTransportadora'],nomeRegistro:transportadora['nomeRegistro'], CEP: todosCEP[index].cep,TrackingNumber: body.Delivery[index]['Tracking number']}
            }
        })
        
        return {status: 200, json:dicionario}
    }

    const index = () => {
        const controller = {};
        controller.dicionarioSku = async (req, res) => {
            const response = await main(req,res)
            res.status(response.status).json(response.json)
        }
        return controller;
    }

    module.exports = {index,main}