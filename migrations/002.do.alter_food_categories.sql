CREATE TYPE food_category AS ENUM (
    'Burger',
    'Burrito',
    'Sushi',
    'Pizza',
    'Ice Cream',
    'Coffee'
);

ALTER TABLE restaurants
    ADD COLUMN
        food_category food_category;