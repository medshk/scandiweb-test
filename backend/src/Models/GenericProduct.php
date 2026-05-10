<?php

namespace App\Models;

class GenericProduct extends Product
{
    public function getCategoryType(): string
    {
        return 'all';
    }

    public function getDefaultDescription(): string
    {
        return 'A great product for everyday use.';
    }
}
