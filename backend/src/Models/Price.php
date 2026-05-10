<?php

namespace App\Models;

class Price extends Model
{
    protected static string $table = 'prices';
    public static function getByProductId($productId)
    {
        $prices = (new static)->db->query(
            'SELECT 
                p.amount, c.label, c.symbol 
            FROM 
                prices p
            JOIN
                currencies c
            ON
                p.currency = c.label
            WHERE
                p.product_id = :productId',
            [
                'productId' => $productId,
            ]
        )->get();

        $productPrices = [];
        foreach ($prices as $price) {
            $productPrices[] = [
                'amount' => number_format($price['amount'], 2, thousands_separator: ''),
                'currency' => [
                    'label' => $price['label'],
                    'symbol' => $price['symbol'],
                ],
            ];
        }

        return $productPrices;
    }

    public static function findByProductId(string $productId): ?array
    {
        $price = (new static)->db->query(
            'SELECT amount, currency FROM ' . static::$table . ' WHERE product_id = :productId LIMIT 1',
            ['productId' => $productId]
        )->fetch();

        return $price ?: null;
    }
}