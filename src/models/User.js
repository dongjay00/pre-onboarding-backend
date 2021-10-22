module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      username: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      isAdmin: { type: DataTypes.BOOLEAN, allowNull: false },
    },
    { timestamps: false }
  );

  User.associate = (models) => {
    User.hasMany(models.Article, { foreignKey: "user_id" });
  };
  return User;
};
