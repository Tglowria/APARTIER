
const { faker } = require('@faker-js/faker'); // For generating fake data
const bcrypt = require('bcryptjs');
const db = require('./database/db');




const seedShortlets = async () => {

  for (let i = 0; i < 20; i++) {
    const apartmentName = faker.commerce.productName();
    const state = faker.location.state();
    const numberOfRooms = faker.number.int({ min: 1, max: 5 });
    const address = faker.location.streetAddress();
    const amountPerNight = faker.number.int({ min: 20, max: 200 });
   

    await db.execute(
      'INSERT INTO shortlets (apartmentName, state, numberOfRooms, address, amountPerNight) VALUES (?, ?, ?, ?, ?)',
      [apartmentName, state, numberOfRooms, address, amountPerNight]
    );
  }
};

const seedDatabase = async () => {
  try {
    
    await seedShortlets();
    console.log('Shortlets seeded successfully.');

    await db.end();
  } catch (err) {
    console.error('Error seeding database:', err);
  }
};

seedDatabase();
