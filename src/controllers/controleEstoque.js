module.exports = () => { 
    const controller = {};

    //função que itera os items do pedido retornando suas entradas de estoque
    const verificaEstoque = (pedido) => {
        const estoques = []
        pedido.Items.map((item) =>{
            const productInventory = get_inventory_entries(item.Sku) 
            
            estoques.push()
        })
        return estoques
    }

    const reservaEstoque = (sku) => {
        

    }

    //função que retorna a entrada do inventario ( ja existe no desafio)
    const get_inventory_entries = (sku) => {
        const inventory =  require('../data/inventory.json');
        return inventory
    }

    controller.controleEstoque = (req, res) => { 
        // recebe o pedido na estrutura mencionada
        console.log("res", req.body);
        const pedido = req.body;
        try{
            const estoques = verificaEstoque(pedido)
            const outOfStock = []
            const reservado = []
            estoques.map((estoque, index) => {
                const item = pedido.Items[index] 
                if (item.Quantity <= estoque.quantity){
                    reservaEstoque(sku)
                }else{
                    outOfStock.push({"sku":item.Sku})
                }
            }) 
            
            res.status(200).json({message: "Validação de estoque realizada com sucesso "})
        }catch(err){
            res.status(500).json({message: "Erro na validação de estoque, tente novamente mais tarde"})
        }
    }
    return controller;
}