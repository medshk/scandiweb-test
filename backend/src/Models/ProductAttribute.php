<?php

namespace App\Models;

class ProductAttribute extends Model
{
    protected static string $table = 'product_attributes';

    public static function countByProductId(string $productId): int
    {
        return (int) (new static)->db->query(
            'SELECT COUNT(DISTINCT attribute_id) FROM ' . static::$table . ' WHERE product_id = :productId',
            ['productId' => $productId]
        )->fetchColumn();
    }

    public static function valueExists(string $productId, string $attributeId, string $value): bool
    {
        $count = (new static)->db->query(
            'SELECT COUNT(*) FROM ' . static::$table . ' WHERE product_id = :productId AND attribute_id = :attributeId AND value = :value LIMIT 1',
            ['productId' => $productId, 'attributeId' => $attributeId, 'value' => $value]
        )->fetchColumn();

        return $count > 0;
    }
}
