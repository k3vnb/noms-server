-- space for writing raw sql queries before knex wrapping

SELECT * FROM restaurants AS rez left join likes_and_comments AS lc on rez.id=lc.restaurant_id;

SELECT rez.id, rez.name, COUNT(lc.user_id) AS vote_count FROM restaurants AS rez left join likes_and_comments AS lc on rez.id=lc.restaurant_id GROUP BY rez.id;


-- provides basic table with vote tally
SELECT rez.*, COUNT(lc.user_id) AS vote_count FROM restaurants AS rez left join likes_and_comments AS lc on rez.id=lc.restaurant_id GROUP BY rez.id;


-- provides full comment list, does not play nice with vote_count, but vote_count can be obtained by taking table.length
SELECT lc.*, noms.* from likes_and_comments AS lc LEFT JOIN restaurants AS noms ON lc.restaurant_id=noms.id WHERE lc.restaurant_id=1;

-- provides restaurant info w/ vote_count for single restaurant only
SELECT noms.*, COUNT(lc.user_id) AS vote_count FROM restaurants AS noms LEFT JOIN likes_and_comments AS lc ON noms.id=lc.restaurant_id  WHERE noms.id=1 GROUP BY noms.id; 

-- provides comments and usernames of commenters for a given restaurant
SELECT lc.*, u.user_name FROM likes_and_comments AS lc LEFT JOIN users AS u ON lc.user_id=u.id WHERE lc.restaurant_id=1;

-- post (nominate) new restaurant // naive approach
INSERT INTO restaurants (name, food_category, nominated_by_user)  VALUES ( 'Pigsty', 'Burger', 2 );
INSERT INTO likes_and_comments (user_id, restaurant_id, comment) VALUES (2, 4, 'Get the PigBurger in a Banquet');

-- post (nominate) new restaurant requires two INSERT statements, the second needs to get the values for user_id and rez_id from the first, this requires a subquery

INSERT INTO restaurants (name, food_category, nominated_by_user)  VALUES ( 'Salt and Straw', 'Ice Cream', 3 );
INSERT INTO likes_and_comments (user_id, restaurant_id, comment) VALUES ((SELECT nominated_by_user FROM restaurants WHERE name='Salt and Straw'), (SELECT id FROM restaurants WHERE name='Salt and Straw'), 'Rotating special flavors and free samples');

--

