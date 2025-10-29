# PHP + Apache (1 container, đơn giản để deploy)
FROM php:8.2-apache

# Bật mod_rewrite và cài extension cần cho Laravel (Postgres/MySQL, zip, mbstring, bcmath…)
RUN a2enmod rewrite headers \
 && apt-get update \
 && apt-get install -y git unzip libpq-dev libzip-dev \
 && docker-php-ext-install pdo pdo_mysql pdo_pgsql zip bcmath

# DocumentRoot -> public/
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf \
    && sed -ri -e 's!<Directory /var/www/>!<Directory ${APACHE_DOCUMENT_ROOT}>!g' /etc/apache2/apache2.conf \
    && sed -ri -e 's!AllowOverride None!AllowOverride All!g' /etc/apache2/apache2.conf

WORKDIR /var/www/html

# Copy mã nguồn
COPY . .

# Cài Composer (dùng binary từ image composer chính thức)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress

# Quyền cho storage/bootstrap/cache
RUN chown -R www-data:www-data storage bootstrap/cache \
 && chmod -R 775 storage bootstrap/cache

# Mặc định Apache lắng nghe 8080; khi chạy trên Koyeb sẽ đổi theo $PORT
ENV PORT=8080
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["apache2-foreground"]
