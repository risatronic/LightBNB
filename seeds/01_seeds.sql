INSERT INTO users (name, email, password) VALUES 
('Marisa D.', 'mdoig@doig.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), 
('Timothy', 'timroxx42@yahoo.ru', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), ('Jeremiah', 'jq@coolguys.net', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active) VALUES 
(1, 'Chateau Chat', 'description', 'https://images.com/img1-1.jpg', 'https://images.com/img1-2.jpg', 100, 1, 2, 4, 'Canada', '123 123rd Street', 'Vancouver', 'BC', 'V5X 2T9', TRUE), 
(2, 'Chateau Chien', 'description', 'https://images.com/img2-1.jpg', 'https://images.com/img2-2.jpg', 190, 2, 3, 5, 'Canada', '125 125th Crescent', 'Fort Saskatchewan', 'AB', 'T3Z 4N8', TRUE), 
(3, 'Chateau Cochon', 'description', 'https://images.com/img3-1.jpg', 'https://images.com/img3-2.jpg', 500, 10, 20, 49, 'Canada', '129 129th Boulevard', 'Yellowknife', 'NT', 'X1A 1Q4', TRUE);


INSERT INTO reservations (start_date, end_date, property_id, guest_id) VALUES 
('2018-06-04T07:00:00.000Z', '2018-06-09T07:00:00.000Z', 1, 3), 
('2019-07-04T07:00:00.000Z', '2019-08-01T07:00:00.000Z', 2, 1),
('2020-04-17T07:00:00.000Z', '2020-05-17T07:00:00.000Z', 3, 2);


INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) VALUES 
(1, 3, 1, 0, 'bad time bruh'), 
(2, 1, 2, 3, 'satisfactory time bruh'), 
(3, 2, 3, 5, 'gr8 time bruh');