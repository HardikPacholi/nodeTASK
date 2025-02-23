import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  gender: String,
  age: Number,
  dob: Date,
  country: String,
});

const User = mongoose.model('User', userSchema);

export {User};
