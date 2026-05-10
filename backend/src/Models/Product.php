<?php

namespace App\Models;

use App\Database;

abstract class Product extends Model
{
    protected static string $table = 'products';

    abstract public function getCategoryType(): string;

    public static function all(?string $category = null): array
    {
        $db = new Database();
        $query = 'SELECT * FROM ' . static::$table;
        $params = [];

        if ($category && strtolower($category) !== 'all') {
            $query .= ' WHERE category = :category';
            $params['category'] = $category;
        }

        $products = $db->query($query, $params)->get();

        foreach ($products as &$product) {
            self::fetchProductDetails($product);
        }

        return $products;
    }

    public static function find(string $value, ?string $column = null): ?array
    {
        $product = parent::find($value);

        if ($product) {
            self::fetchProductDetails($product);
        }

        return $product;
    }

    public static function findBasic(string $id): ?array
    {
        $db = new Database();
        $product = $db->query(
            'SELECT id, name, inStock FROM ' . static::$table . ' WHERE id = :id LIMIT 1',
            ['id' => $id]
        )->fetch();

        if ($product && isset($product['instock'])) {
            $product['inStock'] = $product['instock'];
            unset($product['instock']);
        }

        return $product ?: null;
    }

    private static function fetchProductDetails(&$product)
    {
        // Map lowercase column names to camelCase for GraphQL
        if (isset($product['instock'])) {
            $product['inStock'] = $product['instock'];
            unset($product['instock']);
        }

        $gallery = json_decode($product['gallery'], true);
        $product['gallery'] = $gallery !== null && is_array($gallery) ? $gallery : [];
    }
}
