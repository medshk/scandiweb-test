<?php

namespace App\Factories;

use App\Models\Attribute;
use App\Models\TextAttribute;
use App\Models\SwatchAttribute;
use App\Models\GenericAttribute;

class AttributeFactory
{
    public static function getClassForType(string $type): string
    {
        return match (strtolower($type)) {
            'text' => TextAttribute::class,
            'swatch' => SwatchAttribute::class,
            default => GenericAttribute::class,
        };
    }

    public static function createFromType(string $type): Attribute
    {
        $class = self::getClassForType($type);
        return new $class();
    }

    public static function resolveDisplayType(string $type): string
    {
        $instance = self::createFromType($type);
        return $instance->getDisplayType();
    }

    public static function createAttributeSet(array $attributeData): array
    {
        $type = $attributeData['type'] ?? 'text';
        $instance = self::createFromType($type);

        return [
            'id' => $attributeData['id'],
            'attribute_id' => $attributeData['attribute_id'],
            'name' => $attributeData['name'],
            'type' => $instance->getDisplayType(),
            'items' => array_map(function ($item) use ($instance) {
                return [
                    'id' => $item['id'],
                    'attribute_id' => $item['attribute_id'],
                    'value' => $item['value'],
                    'displayValue' => $instance->formatDisplayValue($item['displayValue']),
                ];
            }, $attributeData['items']),
        ];
    }
}
