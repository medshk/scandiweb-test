<?php

namespace App;

use PDO;

class Database
{
    private $connection;
    private $statement;

    public function __construct()
    {
        $dbConfig = require base_path('src/config/database.php') ?? [];
        $dsn = 'pgsql:host=' . $dbConfig['host'] . ';port=' . $dbConfig['port'] . ';dbname=' . $dbConfig['dbname'];

        try {
            $this->connection = new PDO($dsn, $dbConfig['user'], $dbConfig['password'], [
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            ]);
        } catch (\Exception $e) {
            file_put_contents(base_path('error.log'), $e->getMessage() . "\n", FILE_APPEND);
            abort(500, 'Database connection failed: ' . $e->getMessage());
        }
    }

    public function query($query, $params = [])
    {
        try {
            $this->statement = $this->connection->prepare($query);
            $this->statement->execute($params);
        } catch (\Exception $e) {
            file_put_contents(base_path('error.log'), 'Query Error: ' . $e->getMessage() . "\nQuery: " . $query . "\n", FILE_APPEND);
            throw $e;
        }

        return $this;
    }

    public function get()
    {
        return $this->statement->fetchAll();
    }

    public function fetch()
    {
        return $this->statement->fetch();
    }

    public function fetchOrFail()
    {
        $result = $this->fetch();

        if (!$result) {
            abort();
        }

        return $result;
    }

    public function fetchColumn()
    {
        return $this->statement->fetchColumn();
    }

    public function getLastInsertId()
    {
        return $this->connection->lastInsertId();
    }

    public function beginTransaction()
    {
        return $this->connection->beginTransaction();
    }

    public function commit()
    {
        return $this->connection->commit();
    }

    public function rollback()
    {
        return $this->connection->rollBack();
    }
}