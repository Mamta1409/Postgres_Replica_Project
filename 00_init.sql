CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    sender VARCHAR(100),
    receiver VARCHAR(100),
    amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create user replicator with replication encrypted password 'replicator_password';
select pg_create_physical_replication_slot('replication_slot');
