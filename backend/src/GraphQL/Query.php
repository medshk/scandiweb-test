<?php

namespace App\GraphQL;

use GraphQL\Type\Definition\Type;
use App\GraphQL\Types\ProductType;
use App\GraphQL\Types\CategoryType;
use App\GraphQL\Types\CurrencyType;
use GraphQL\Type\Definition\ObjectType;

class Query
{
    public static function defineQueries()
    {
        $productType = new ProductType();

        return new ObjectType([
            'name' => 'Query',
            'fields' => [
                'echo' => [
                    'type' => Type::string(),
                    'args' => [
                        'message' => ['type' => Type::string()],
                    ],
                    'resolve' => static fn ($rootValue, array $args): string => $rootValue['prefix'] . $args['message'],
                ],
                'categories' => [
                    'type' => Type::listOf(new CategoryType()),
                    'resolve' => static fn () => Resolvers\CategoriesResolver::index(),
                ],
                'currencies' => [
                    'type' => Type::listOf(new \GraphQL\Type\Definition\ObjectType([
                        'name' => 'CurrencyItem',
                        'fields' => [
                            'label' => Type::string(),
                            'symbol' => Type::string(),
                        ],
                    ])),
                    'resolve' => static fn () => \App\Models\Currency::all(),
                ],
                'products' => [
                    'type' => Type::listOf($productType),
                    'args' => [
                        'category' => ['type' => Type::string()],
                    ],
                    'resolve' => static fn ($rootValue, array $args) => Resolvers\ProductsResolver::index($args['category'] ?? null),
                ],
                'product' => [
                    'type' => $productType,
                    'args' => [
                        'id' => ['type' => Type::nonNull(Type::string())],
                    ],
                    'resolve' => static fn ($rootValue, array $args) => Resolvers\ProductsResolver::show($args['id']),
                ],
            ],
        ]);
    }
}
