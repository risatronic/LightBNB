const { Pool } = require('pg');

const pool = new Pool({
  teacher: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(`
  SELECT * FROM users
  WHERE email = $1
  `, [email])
    .then(res => res.rows[0]);
};
exports.getUserWithEmail = getUserWithEmail;

///Users

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
  SELECT * FROM users
  WHERE id = $1;
  `, [id])
    .then(res => res.rows[0]);
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param user {{name: string, password: string, email: string}}
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  const name = user.name;
  const email = user.email;
  const password = user.password;

  const values = [name, email, password];

  return pool.query(`
  INSERT INTO users (name, email, password) VALUES ($1, $2, $3)
  RETURNING *;
  `, values)
    .then(res => res.rows[0]);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const values = [guest_id, limit];

  return pool.query(`
  SELECT reservations.*, properties.*, AVG(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON property_reviews.property_id = properties.id
  WHERE reservations.guest_id = $1 
    AND now()::date < end_date
  GROUP BY properties.id, reservations.id
  ORDER BY start_date
  LIMIT $2
  `, values)
    .then(res => res.rows);
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  LEFT OUTER JOIN property_reviews ON properties.id = property_id
  `;

  for (const option in options) {
    if (options[option] !== options.minimum_rating && options[option]) {
      if (queryParams.length === 0) {
        queryString += 'WHERE ';
      } else {
        queryString += 'AND ';
      }

      switch (options[option]) {
      case options.city:
        queryParams.push(`%${options[option]}%`);
        queryString += `city LIKE $${queryParams.length} `;
        break;
      case options.owner_id:
        queryParams.push(options[option]);
        queryString += `owner_id = $${queryParams.length} `;
        break;
      case options.minimum_price_per_night:
        queryParams.push(options[option] * 100);
        queryString += `cost_per_night >= $${queryParams.length} `;
        break;
      case options.maximum_price_per_night:
        queryParams.push(options[option] * 100);
        queryString += `cost_per_night <= $${queryParams.length} `;
        break;
      default:
        break;
      }
    }
  }

  queryString += 'GROUP BY properties.id ';

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING AVG(property_reviews.rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);

  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length}
  `;

  console.log(queryString, queryParams);

  return pool.query(queryString, queryParams)
    .then(res => res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const values = [];
  let queryString = 'INSERT INTO properties (';

  for (const key in property) {
    queryString += `${key}, `;
    values.push(`${property[key]}`);
  }
  queryString = queryString.slice(0, -2);
  queryString += ') VALUES (';

  for (const value of values) {
    const num = values.indexOf(value) + 1;

    if (num === values.length) {
      queryString += `$${num}`;
    } else {
      queryString += `$${num}, `;
    }
  }

  queryString += ') RETURNING *;';

  return pool.query(queryString, values)
    .then(res => res.rows[0]);
};
exports.addProperty = addProperty;
