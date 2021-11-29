module.exports = app => {
    const controller = app.controllers.controleEstoque
  
    app.route('/api/v1/controleEstoque')
      .post(controller.controleEstoque);
  }