BEGIN;

TRUNCATE   
    noms_restaurants,
    users,
    likes_and_comments
    RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, password) VALUES
('charlie_pdx', 'charlie_pdx!'),
('jane_doh!', 'jane_doh!!'),
('simmons_is_a_foodie', 'simmons_is_a_foodie!'),
('salsa_champion12', 'salsa_champion12!'),
('sideshow_kabob87', 'sideshow_kabob87!'),
('rabbit007', 'rabbit007!'),
('pdx_eater', 'pdx_eater!'),
('ken_haz_cheezburger', 'ken_haz_cheezburger!');

INSERT INTO noms_restaurants (name, food_category, nominated_by_user) VALUES 
    ('Burger Blam!', 'Burger', 1),
    ('Sally''s Burgers', 'Burger', 1),
    ('Downtown Deli & Grill', 'Burger', 2);

INSERT INTO likes_and_comments (user_id, restaurant_id, comment) VALUES
    (1, 1, 'perfectly grilled!'),
    (2, 1, 'Yes! This is the best burger'),
    (3, 1, 'I came here hoping to see this on the list!'),
    (4, 1, 'Grilled onions are the bomb!'),
    (1, 2, 'Scrumptious burger, the pickles are bombastic!'),
    (2, 2, 'I come here every Saturday for the Burger Special'),
    (3, 3, 'Whatever is in the sauce is amazing'),
    (4, 3, 'By far my favorite burger in PDX!!');

COMMIT;
