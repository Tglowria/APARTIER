CREATE TABLE shortlets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    apartmentName VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    numberOfRooms INT NOT NULL,
    address VARCHAR(255) NOT NULL,
    amountPerNight DECIMAL(10, 2) NOT NULL,
    numberOfNights INT NOT NULL,
    booked TINYINT NOT NULL DEFAULT 0,
    image1Url VARCHAR(255),
    image2Url VARCHAR(255)
);
