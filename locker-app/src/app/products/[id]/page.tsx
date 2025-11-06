interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        cache: "no-store",
    })
    const product = await res.json()

    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <strong>R$ {product.price}</strong>
        </div>
    )
}
