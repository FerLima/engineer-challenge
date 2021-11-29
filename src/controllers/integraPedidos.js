  const { setLog } = require('../helpers/log');

  const integraPedidosDB =  require('../data/getOrders.json');


  //função que retorna o dia de hoje formatado 
  const getTodayFormatted = () => {
    const hoje = new Date()
    return `${hoje.getFullYear()}-${hoje.getMonth()}-${hoje.getDate()}`
  }
  //função que retorna os pedidos da integração (ja existe no desafio)
  const get_orders = () => {
    return integraPedidosDB
  }
  // função que recebe um array de pedidos e retorna os que são dos ultimos 5 minutos
  const filtrarPedidos = (orders) => {

    const pedidosDB = orders.filter((order)=> {
      const dataPedido = new Date(order.created_at)
      const lastUpdate = new Date()
      lastUpdate.setMinutes(lastUpdate.getMinutes() - 5 )
      return dataPedido > lastUpdate
    })
    return pedidosDB
  }

  // salva o pedido no banco e gera um ID de pedido (ja existe no desafio)
  const save_order_to_db = (order) =>{
    // -- inserção no banco -- 
    return Math.round(Math.random() * 10000000)
  }

  const main = () =>{
    try {
      // pega o dia de hoje formatado para os filtros
      const _filters = getTodayFormatted()

      //consulta os pedidos feitos hoje no ERP 
      const orders = get_orders(_filters)

      //filtra os pedidos por periodo, se tem pedidos novos nesses ultimos 5 minutos (periodo da ultima consulta)
      const pedidosDB = filtrarPedidos(orders)

      // se tem pedidos novos nos ultimos 5 minutos insere dentro do banco de dados
      if (pedidosDB.length){
        const pedidos = []
        pedidosDB.map((pedido)  =>{
          const idPedido = save_order_to_db(pedido)
          pedidos.push({id:idPedido})
        })
        res.status(200).json({message:"Pedidos incluidos com sucesso", pedidos})
      }
      // se não tem pedidos novos retorna mensagem de nenhum pedido incluido
      else{
        res.status(200).json({message: "Nenhum pedido incluido "})
      }
    }catch(err) {
      // salva o log do erro
      setLog(err)
      res.status(500).json({message:"Algo deu errado, tente novamente mais tarde"})
    }
  }

  const index = () =>{
    // 1 - Integração de pedidos
    const controller = {};
    controller.integraPedidos = (req, res) => main(req,res)
    return controller;
  }
  module.exports = {index,main}