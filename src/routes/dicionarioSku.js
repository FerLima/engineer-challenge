const {index} = require("../controllers/dicionarioSku");

module.exports = app => {
    const controller = index()
  
    app.route('/api/v1/dicionarioSku')
      .post(controller.dicionarioSku);
  }