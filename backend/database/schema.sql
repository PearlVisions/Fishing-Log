CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    display_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    waterbody VARCHAR(150) NOT NULL,
    area_name VARCHAR(150),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fish_species (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE lures (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(100),
    manufacturer VARCHAR(100),
    color VARCHAR(100),
    length_mm INTEGER,
    weight_g DECIMAL(6,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fishing_trips (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    weather VARCHAR(150),
    air_temperature DECIMAL(5,2),
    water_temperature DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE catches (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES fishing_trips(id) ON DELETE CASCADE,
    species_id INTEGER REFERENCES fish_species(id) ON DELETE SET NULL,
    lure_id INTEGER REFERENCES lures(id) ON DELETE SET NULL,
    caught_at TIMESTAMP,
    length_cm DECIMAL(6,2),
    weight_g INTEGER,
    depth_m DECIMAL(6,2),
    released BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
