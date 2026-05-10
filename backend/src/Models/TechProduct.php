<?php

namespace App\Models;

class TechProduct extends Product
{
    public function getCategoryType(): string
    {
        return 'tech';
    }

    public function getWarrantyPeriodMonths(): int
    {
        return 24;
    }

    public function getTechSpecs(): array
    {
        return ['CPU', 'RAM', 'Storage', 'Display'];
    }
}
