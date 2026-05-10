<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;
use App\GraphQL\Resolvers\AttributeSetResolver;
use App\Models\Price;

class ProductType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Product',
            'fields' => [
                'id' => Type::string(),
                'name' => Type::string(),
                'inStock' => Type::boolean(),
                'gallery' => Type::listOf(Type::string()),
                'description' => Type::string(),
                'category' => Type::string(),
                'attributes' => [
                    'type' => Type::listOf(new AttributeSetType()),
                    'resolve' => static fn ($product) => AttributeSetResolver::resolve($product['id']),
                ],
                'prices' => [
                    'type' => Type::listOf(new PriceType()),
                    'resolve' => static fn ($product) => Price::getByProductId($product['id']),
                ],
                'brand' => Type::string(),
            ],
        ]);
    }
}
