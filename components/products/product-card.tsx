import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="aspect-square relative mb-4">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-muted-foreground text-sm">{product.description}</p>
        <p className="text-lg font-bold mt-2">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4">
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}