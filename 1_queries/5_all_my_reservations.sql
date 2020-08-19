SELECT reservations.*, properties.*, AVG(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON property_reviews.property_id = properties.id
  WHERE reservations.guest_id = 1 
    AND now()::date > end_date
  GROUP BY properties.id, reservations.id
  ORDER BY start_date
  LIMIT 10;