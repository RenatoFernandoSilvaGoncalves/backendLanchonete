CREATE TABLE pedido (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    data DATE,
    valorTotal DECIMAL(10,2)
);

CREATE TABLE itemPedido (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    codigoPedido INT,
    codigoProduto INT,
    quantidade INT,
    valorUnitario DECIMAL(10,2),
    FOREIGN KEY (codigoPedido) REFERENCES pedido(codigo),
    FOREIGN KEY (codigoProduto) REFERENCES produto(codigo)
);
