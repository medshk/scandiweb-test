<?php

namespace App\GraphQL\Resolvers;

use App\Models\Product;
use App\Factories\ProductFactory;

class ProductsResolver
{
    public static function index(?string $category = null): array
    {
        return Product::all($category);
    }

    public static function show(string $productId): array
    {
        $product = Product::find($productId);

        if ($product) {
            $productInstance = ProductFactory::createFromData($product);
            $product['categoryType'] = $productInstance->getCategoryType();
        }

        return $product;
    }
}
