require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    timezone: '+07:00',
    query: {
      raw: true
    }
    // thêm raw: true sẽ không sửa và xoá được user
    // vì nó không phải là instance của sequelize
    // nếu set global raw là true 
    // thì trong các câu lệnh query phải set raw là false 
    // sau đó mới có thể thực hiện hàm save(), destroy() của sequelize được.
  },
  test: {
    username: process.env.DB_USERNAME,
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_USERNAME,
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql'
  }
};
