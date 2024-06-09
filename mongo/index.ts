import mongoose from 'mongoose';

const DatabaseConnection = () => {
  let mongoConnectionURL = process.env.DB_CONNECTION_URL;
  mongoose.connect(mongoConnectionURL)
    .then((data) => {
      console.log("Database Server Connected");
    })
    .catch((err) => {
      console.log("Database Connection Error", err);
    });
}

export default DatabaseConnection;
