let products = [];

// Função para adicionar um produto
function addProduct() {
    const name = document.getElementById('productName').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const batchNumber = document.getElementById('batchNumber').value;
    const quantity = document.getElementById('quantity').value;

    // Verifica se todos os campos foram preenchidos
    if (!name || !expiryDate || !batchNumber || !quantity) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Verifica se o lote já existe para o mesmo produto
    const existingProduct = products.find(p => p.name === name);
    
    if (existingProduct) {
        if (existingProduct.batches.some(batch => batch.number === batchNumber)) {
            alert("Lote já existe para este produto.");
            return;
        }
        existingProduct.batches.push(createBatch(batchNumber, quantity, expiryDate));
    } else {
        products.push({
            name: name,
            batches: [createBatch(batchNumber, quantity, expiryDate)]
        });
    }

    renderProducts();
    resetForm();
}

// Função para criar um lote de produto
function createBatch(batchNumber, quantity, expiryDate) {
    const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
    return {
        number: batchNumber,
        quantity: parseInt(quantity),  // A quantidade de produtos é salva aqui
        expiryDate: expiryDate,
        daysUntilExpiry: daysUntilExpiry,
        status: getBatchStatus(daysUntilExpiry),
    };
}

// Função para calcular os dias restantes até o vencimento
function getDaysUntilExpiry(expiryDate) {
    const currentDate = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - currentDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Retorna a diferença em dias
}

// Função para determinar a cor de cada lote com base nos dias restantes
function getBatchStatus(daysUntilExpiry) {
    if (daysUntilExpiry <= 0) {
        return 'red'; // Vermelho se já tiver vencido
    } else if (daysUntilExpiry <= 5) {
        return 'yellow'; // Amarelo para os próximos 5 dias
    } else if (daysUntilExpiry <= 15) {
        return 'green'; // Verde para validade mais distante
    } else {
        return 'green'; // Verde mais claro
    }
}

// Função para renderizar a lista de produtos
function renderProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('productItem');
        
        const productInfo = document.createElement('div');
        productInfo.classList.add('productBatch');

        product.batches.forEach(batch => {
            const batchDiv = document.createElement('div');
            batchDiv.classList.add(batch.status); // Aplica a classe de cor (verde, amarelo, vermelho)
            batchDiv.innerHTML = `
                <p><strong>Lote:</strong> ${batch.number} | <strong>Quant.: </strong>${batch.quantity} | <strong>Validade: </strong>${batch.expiryDate} | <strong>Faltam: </strong>${batch.daysUntilExpiry} dias</p>
                <span class="deleteBtn" onclick="deleteBatch('${product.name}', '${batch.number}')">🗑️</span>
            `;
            productInfo.appendChild(batchDiv);
        });

        const titleDiv = document.createElement('div');
        titleDiv.innerHTML = `
            <h3>${product.name} 
            <span class="deleteProductBtn" onclick="deleteProduct('${product.name}')">🗑️</span></h3>
        `;
        productDiv.appendChild(titleDiv);
        productDiv.appendChild(productInfo);
        productList.appendChild(productDiv);
    });
}

// Função para deletar um lote individualmente
function deleteBatch(productName, batchNumber) {
    const product = products.find(p => p.name === productName);
    if (!product) return;

    const batchIndex = product.batches.findIndex(batch => batch.number === batchNumber);
    if (batchIndex > -1) {
        product.batches.splice(batchIndex, 1);
        renderProducts();
    }
}

// Função para deletar um produto completo
function deleteProduct(productName) {
    const productIndex = products.findIndex(p => p.name === productName);
    if (productIndex > -1) {
        products.splice(productIndex, 1);
        renderProducts();
    }
}

// Função para resetar o formulário após adicionar um produto
function resetForm() {
    document.getElementById('productName').value = '';
    document.getElementById('expiryDate').value = '';
    document.getElementById('batchNumber').value = '';
    document.getElementById('quantity').value = '';
}
