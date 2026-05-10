<?php

namespace App\Models;

class GenericAttribute extends Attribute
{
    public function getDisplayType(): string
    {
        return 'text';
    }

    public function formatDisplayValue(string $value): string
    {
        return $value;
    }

    public function getInputType(): string
    {
        return 'button';
    }
}
