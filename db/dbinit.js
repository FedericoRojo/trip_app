const {Client} = require("pg");


const SQL = `
CREATE TABLE IF NOT EXISTS passenger(
    dni INTEGER PRIMARY KEY,
    name VARCHAR(40)
);

CREATE TABLE IF NOT EXISTS driver(
    dni INTEGER PRIMARY KEY,
    name VARCHAR(40)
);

CREATE TABLE IF NOT EXISTS location(
    zipCode INTEGER PRIMARY KEY,
    name VARCHAR(40)
);

CREATE TABLE IF NOT EXISTS trip(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    fromDate DATE,
    toDate DATE,
    locationFrom INTEGER,
    locationTo INTEGER,
    name VARCHAR(50),
    maxPassengers INTEGER,
    FOREIGN KEY (locationFrom) REFERENCES location(zipCode) ON DELETE CASCADE,
    FOREIGN KEY (locationTo) REFERENCES location(zipCode) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS travels(
    passenger INTEGER,
    trip INTEGER,
    FOREIGN KEY (passenger) REFERENCES passenger(dni),
    FOREIGN KEY (trip) REFERENCES trip(id) ON DELETE CASCADE,
    PRIMARY KEY (passenger, trip)
);

CREATE TABLE IF NOT EXISTS drives(
    driver INTEGER,
    trip INTEGER,
    FOREIGN KEY (driver) REFERENCES driver(dni) ON DELETE CASCADE,
    FOREIGN KEY (trip) REFERENCES trip(id) ON DELETE CASCADE,
    PRIMARY KEY(driver, trip)
);

INSERT INTO driver (dni, name) VALUES
(2001, 'Robert Brown'),
(2002, 'Michael White');

INSERT INTO passenger (dni, name) VALUES
(1001, 'John Doe'),
(1002, 'Jane Smith'),
(1003, 'Alice Johnson');

INSERT INTO location (zipCode, name) VALUES
(12345, 'New York'),
(54321, 'Los Angeles'),
(11111, 'Chicago');

INSERT INTO trip (fromDate, toDate, locationFrom, locationTo, name, maxPassengers) VALUES
('2024-11-01', '2024-11-05', 12345, 54321, 'NY to LA Trip', 5),
('2024-12-10', '2024-12-15', 11111, 54321, 'Chicago to LA Trip', 3);

INSERT INTO travels (passenger, trip) VALUES
(1001, 1),
(1002, 1),
(1003, 2);

INSERT INTO drives (driver, trip) VALUES
(2001, 1), 
(2002, 2);
`;

async function main (){
    console.log("seeding..");
    const client = new Client({
        connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
}

main();