function generateTableToken(tableNumber) {
    const random = Math.random().toString(36).substring(2, 8);
    return `tbl_${tableNumber}_${random}`;
}

module.exports = generateTableToken;