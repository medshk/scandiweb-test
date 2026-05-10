<?php

namespace App\Models;

class TextAttribute extends Attribute
{
    public function getDisplayType(): string
    {
        return 'text';
    }

    public function formatDisplayValue(string $value): string
    {
        return strtoupper($value);
    }

    public function getInputType(): string
    {
        return 'button';
    }
}
