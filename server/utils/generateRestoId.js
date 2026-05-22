function generateRestoId(restaurantName) {
    const prefix = restaurantName
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 6)
        .toUpperCase();

    const random = Math.floor(1000 + Math.random() * 9000);

    return `${prefix || "RESTO"}-${random}`;
}

module.exports = generateRestoId;