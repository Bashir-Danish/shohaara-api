import mongoose from 'mongoose';

const poetSchema = new mongoose.Schema({
  name: String,
  photo: String,
  biography: String,
});

const Poet = mongoose.model('Poet', poetSchema);

export default Poet;
