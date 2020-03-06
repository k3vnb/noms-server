CREATE TABLE restaurants (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    address TEXT,
    subtitle TEXT,
    date_nominated TIMESTAMP DEFAULT now() NOT NULL
);