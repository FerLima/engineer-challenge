const { setLog } = require('../helpers/log');

module.exports = () => { 
    const controller = {};

    //Aqui interpretei que a tabela inventory_entry vai ter as entradas de estoque do pedido, 
    //logo dentro dela é que deve ser consultado se o item tem algum inventario disponivel
    //pega as entradas de estoque da tabela inventory_entry, 
    //procura um registro que tem estoque disponivel
    //caso nao tenha nenhum com maior quantidade que a do pedido, retorna um temEstoque = falso para o fluxo principal
    //se tem estoque disponivel, retorna um temEstoque true e as informações da entrada
    const validaEntrada = (estoques, itemPedido) => {
        
        const estoqueDisponivel = estoques.find((estoque) =>{
            return estoque.quantity >= itemPedido.Quantity
        })
        if (estoqueDisponivel){
            return { "temEstoque": true, ...estoqueDisponivel}
        }else{
            return{ "temEstoque":false}
        }
    }

    //Função do desafio 1 que salva o pedido no banco e gera um id
    const save_order_to_db = (order) =>{
        // -- inserção no banco -- 
        return Math.round(Math.random() * 10000000)
    }

    //Função que faz um registro na tabela do estoque reservado
    const set_estoque_reservado = (sku, id_entrada, quantidadeReservada) =>{
        // -- inserção no banco -- 
        return "success";
    }

    const reservaEstoque = (item, entrada, pedido) => {
        //Faria uma tabela de relacionamento entre a inventory_entry e a SKU, chamada estoque_reservado
        //onde teriam as colunas Sku, id_entrada, quantidadeReservada
        set_estoque_reservado(item.Sku, entrada.id, item.Quantity)

        //chamar a função pra retirar da entrada de estoque selecionada a quantidade reservada
        set_inventory_entry(entrada, item.Quantity)

        //Salva o id do pedido no banco com a função do desafio 1, e gera um id 
        const idPedido = save_order_to_db(pedido)

        return idPedido
    }

    //Função que retorna as entradas do inventario ( ja existe no desafio)
    const get_inventory_entries = (sku) => {
        const inventory =  require('../data/inventory.json');
        return inventory
    }

    //Função que tiraria a quantidade X do estoque quando o item for reservado
    const set_inventory_entry = (entrada, quantidadeRetirada) => {
        entrada.quantity = entrada.quantity - quantidadeRetirada
        // -- inserção no banco -- 
        return {message:"informação alterada com sucesso"}
    }

    controller.controleEstoque = (req, res) => { 
        // recebe o pedido na estrutura mencionada
        const pedido = req.body;

        try{
            const outOfStock = []
            const pedidos = []
            //itera os items de dentro do pedido
            pedido.Items.map((item) => {
                //pega as entradas de estoque disponiveis pro pedido
                const estoque = get_inventory_entries(item.Sku)
                //valida se alguma entrada de estoque tem estoque suficiente para esse pedido
                const inventarioSelecionado = validaEntrada(estoque, item)
                //se tem estoque faz um registro na tabela de reserva e desconta da entrada de estoque
                if (inventarioSelecionado.temEstoque){
                    console.log(item,inventarioSelecionado, pedido)
                    pedidos.push(reservaEstoque(item,inventarioSelecionado, pedido))
                }else{
                    // se não tem estoque nao gera salva na tabela de pedidos e retorna no final da requisição o id
                    outOfStock.push({"sku":item.Sku})
                }
            })
            // retorna na API os ids dos pedidos criados e os items sem estoque 
            res.status(200).json({message: "Validação de estoque realizada com sucesso ", pedidosCriados: pedidos, itemSemEstoque: outOfStock})
        }catch(err){
            setLog(err)
            console.log('err', err);
            res.status(500).json({message: "Erro na validação de estoque, tente novamente mais tarde"})
        }
    }
    return controller;
}