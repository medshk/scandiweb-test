<?php

namespace App\Models;

class ClothingProduct extends Product
{
    public function getCategoryType(): string
    {
        return 'clothes';
    }

    public function getSizeRange(): array
    {
        return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    }

    public function getCareInstructions(): string
    {
        return 'Machine wash cold, tumble dry low.';
    }
}
