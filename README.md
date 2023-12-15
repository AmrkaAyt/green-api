
# Проект "Async HTTP Processing"

Этот проект разработан для демонстрации механизма асинхронной обработки HTTP запросов с использованием NodeJS и RabbitMQ.

## Установка и Запуск

```bash
# Шаг 1: Клонирование репозитория
git clone <[URL репозитория](https://github.com/AmrkaAyt/green-api.git
)>
cd <green-api>

# Шаг 2: Установка зависимостей
npm install
# Шаг 3: Установка RabbitMQ
# Убедитесь, что у вас установлен и запущен RabbitMQ.
# Если нет, скачайте и установите RabbitMQ по ссылке:
# https://www.rabbitmq.com/download.html
# Шаг 4: Настройка переменных окружения
# В корневой папке проекта создайте файл .env
# и укажите в нем параметры подключения к RabbitMQ.
echo "RABBITMQ_URL=amqp://localhost" > .env
echo "PORT=5050" >> .env
# Шаг 5: Запуск микросервиса M1
node m1/server.js
# Шаг 6: Запуск микросервиса M2
node m2/worker.js
