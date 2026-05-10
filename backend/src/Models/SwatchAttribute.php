<?php

namespace App\Models;

class SwatchAttribute extends Attribute
{
    public function getDisplayType(): string
    {
        return 'swatch';
    }

    public function formatDisplayValue(string $value): string
    {
        return $value;
    }

    public function getInputType(): string
    {
        return 'color-swatch';
    }

    public function validateColorFormat(string $value): bool
    {
        return preg_match('/^#[0-9A-Fa-f]{6}$/', $value) === 1;
    }
}
