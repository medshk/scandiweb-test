FROM php:8.1-cli

# Install required PHP extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Copy application files
COPY . .

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html

# Start PHP built-in server
CMD php -S 0.0.0.0:$PORT -t public
