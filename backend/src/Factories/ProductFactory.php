<?php

namespace App\Factories;

use App\Models\Product;
use App\Models\ClothingProduct;
use App\Models\TechProduct;
use App\Models\GenericProduct;

class ProductFactory
{
    public static function getClassForCategory(string $category): string
    {
        return match ($category) {
            'clothes' => ClothingProduct::class,
            'tech' => TechProduct::class,
            default => GenericProduct::class,
        };
    }

    public static function createFromData(array $data): Product
    {
        $class = self::getClassForCategory($data['category'] ?? 'all');
        return new $class();
    }

    public static function resolveCategoryType(string $category): string
    {
        $instance = self::createFromData(['category' => $category]);
        return $instance->getCategoryType();
    }
}
