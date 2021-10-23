const models = require("../models");

module.exports = () => models.sequelize.sync();
