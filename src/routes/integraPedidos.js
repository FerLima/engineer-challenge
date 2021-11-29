module.exports = app => {
    const controller = app.controllers.integraPedidos
  
    app.route('/api/v1/integraPedidos')
      .get(controller.integraPedidos);
  }