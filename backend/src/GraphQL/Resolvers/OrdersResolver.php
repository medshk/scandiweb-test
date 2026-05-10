<?php

namespace App\GraphQL\Resolvers;

use App\Models\Order;
use App\Database;
use App\Models\OrderItem;
use App\Models\Price;
use App\Models\Product;
use App\Models\ProductAttribute;
use RuntimeException;

class OrdersResolver
{
    public static function store(array $args): string
    {
        if (empty($args['items'])) {
            throw new RuntimeException('Items are required');
        }

        $db = new Database();
        $db->beginTransaction();

        try {
            $orderResult = Order::create($db);
            if (!$orderResult['success']) {
                throw new RuntimeException($orderResult['error']);
            }
            $orderId = $orderResult['orderId'];

            $totalAmount = 0;
            $currency = null;

            foreach ($args['items'] as $item) {
                self::validateItemAttributes($item);

                $productDetails = self::calculatePaidAmount($item);

                $insertItemResult = OrderItem::insertItem($db, $orderId, $productDetails);
                if (!$insertItemResult['success']) {
                    throw new RuntimeException($insertItemResult['error']);
                }
                $totalAmount += $productDetails['paidAmount'];
                if ($currency === null) {
                    $currency = $productDetails['paidCurrency'];
                }
            }

            $updateOrderResult = Order::update($db, $orderId, $totalAmount, $currency);
            if (!$updateOrderResult['success']) {
                throw new RuntimeException($updateOrderResult['error']);
            }

            $db->commit();

            return "Order placed successfully! Order ID: $orderId";
        } catch (\Exception $e) {
            $db->rollback();
            throw $e;
        }
    }

    private static function validateItemAttributes(array $item): void
    {
        $productId = $item['productId'];

        if (!isset($productId)) {
            throw new RuntimeException('Product ID is required');
        }

        $product = Product::findBasic($productId);

        if (!$product) {
            throw new RuntimeException('Product not found');
        }

        if (!$product['inStock']) {
            throw new RuntimeException("Unfortunately, '{$product['name']}' is out of stock. Please check back later.");
        }

        $attributeCount = ProductAttribute::countByProductId($productId);

        if (!isset($item['attributeValues']) || $attributeCount !== count($item['attributeValues'])) {
            throw new RuntimeException('Attribute values are required');
        }

        foreach ($item['attributeValues'] as $attribute) {
            if (!ProductAttribute::valueExists($productId, $attribute['attributeId'], $attribute['value'])) {
                throw new RuntimeException("Oops! '{$product['name']}' with '{$attribute['value']}' attribute does not exist or is invalid. Please check and try again.");
            }
        }
    }

    private static function calculatePaidAmount(array $item): array
    {
        $productId = $item['productId'];
        $quantity = $item['quantity'] ?? 1;

        $product = Product::findBasic($productId);

        if (!$product) {
            throw new RuntimeException('Product not found');
        }

        $price = Price::findByProductId($productId);

        if (!$price) {
            throw new RuntimeException('Price not found for product');
        }

        $paidAmount = $price['amount'] * $quantity;
        $paidCurrency = $price['currency'];

        $formattedAttributeValues = [];
        foreach ($item['attributeValues'] as $attribute) {
            $formattedAttributeValues[strtolower($attribute['attributeId'])] = $attribute['value'];
        }
        $attributeValuesJson = json_encode([$formattedAttributeValues]);

        return [
            'productId' => $productId,
            'productName' => $product['name'],
            'attributeValues' => $attributeValuesJson,
            'quantity' => $quantity,
            'paidAmount' => $paidAmount,
            'paidCurrency' => $paidCurrency,
        ];
    }
}
