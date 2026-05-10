<?php

namespace App\GraphQL\Resolvers;

use App\Models\Attribute;
use App\Factories\AttributeFactory;

class AttributeSetResolver
{
    public static function resolve(string $productId): array
    {
        $attributes = Attribute::getByProductId($productId);

        $result = [];
        foreach ($attributes as $attributeSetData) {
            $result[] = AttributeFactory::createAttributeSet($attributeSetData);
        }

        return $result;
    }
}