const {index} = require("../controllers/integraPedidos");

module.exports = app => {
    const controller = index()
  
    app.route('/api/v1/integraPedidos')
      .get(controller.integraPedidos);
  }