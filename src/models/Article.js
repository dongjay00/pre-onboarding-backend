module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    "Article",
    {
      aricle_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  Article.associate = (models) => {
    Article.belongsTo(models.User);
  };
  return Article;
};
