CREATE TYPE food_category AS ENUM (
    'Burger',
    'Burrito',
    'Sushi',
    'Pizza',
    'Gyro',
    'Coffee'
);

ALTER TABLE restaurants
    ADD COLUMN
        food_category food_category;