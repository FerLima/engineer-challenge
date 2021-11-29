const {index} = require("../controllers/controleEstoque");

module.exports = app => {
    const controller = index()
  
    app.route('/api/v1/controleEstoque')
      .post(controller.controleEstoque);
  }