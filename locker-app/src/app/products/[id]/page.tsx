interface PageProps {
    params: { id: string };
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await (params);

    // Aqui você buscaria os dados do produto pelo ID
    // Por exemplo, com uma API ou banco de dados
    const product = {
        name: `Produto ${id}`,
        description: `Descrição do produto ${id}`,
        price: 99.9,
    };

    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <strong>R$ {product.price}</strong>
        </div>
    );
}
