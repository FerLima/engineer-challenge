module.exports = (app) => {
    const integraPedidosDB = app.data.integraPedidos
    const controller = {};

    const getYesterday = () => {
      const hoje = new Date()
      const ontem = new Date(hoje.getTime()) 
      ontem.setDate(hoje.getDate() - 1 );
      return `${ontem.getFullYear}-${ontem.getMonth}-${ontem.getDate()}`
    }
    controller.integraPedidos = (req, res) => {


      //consulta os pedidos no ERP feitos no dia anterior, 
      // pensando em uma funcionalidade de scheduler que rodaria uma vez ao dia de madrugada
      const _filters = getYesterday()
      console.log("_filters",  _filters);
      const pedidos = get_orders(_filters)



      res.status(200).json(integraPedidosDB)
      
    };
  
    return controller;
  }