<?php

namespace App\GraphQL\Resolvers;

use App\Database;
use App\Factories\AttributeFactory;

class AttributeSetResolver
{
    public static function resolve(string $productId): array
    {
        $db = new Database();
        $items = $db->query(
            'SELECT 
                pa.*, 
                a.name as attribute_name, 
                a.type as attribute_type
            FROM 
                product_attributes pa
            JOIN 
                attributes a
            ON 
                pa.attribute_id = a.id 
            WHERE 
                product_id = :productId',
            [
                'productId' => $productId,
            ]
        )->get();

        $grouped = [];
        foreach ($items as $item) {
            $attributeId = $item['attribute_id'];

            if (!isset($grouped[$attributeId])) {
                $grouped[$attributeId] = [
                    'id' => $attributeId,
                    'attribute_id' => $attributeId,
                    'name' => $item['attribute_name'],
                    'type' => $item['attribute_type'],
                    'items' => [],
                ];
            }

            $grouped[$attributeId]['items'][] = [
                'id' => $item['displayvalue'] ?? $item['value'],
                'attribute_id' => $attributeId,
                'value' => $item['value'],
                'displayValue' => $item['displayvalue'] ?? $item['value'],
            ];
        }

        $result = [];
        foreach ($grouped as $attributeSetData) {
            $result[] = AttributeFactory::createAttributeSet($attributeSetData);
        }

        return $result;
    }
}
