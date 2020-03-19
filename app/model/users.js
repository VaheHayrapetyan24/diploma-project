module.exports = ({ mongoose }) => {
  const UsersSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true, index: true },
    role: { type: String },
    password: { type: String },
    passwordSalt: { type: String },
  });

  return mongoose.model('users', UsersSchema);
};
