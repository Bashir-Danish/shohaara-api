import Poet from "../models/poet.js";
import { catchAsync } from "../middlewares.js";

export const getAllPoets = catchAsync(async (req, res) => {
  const poets = await Poet.find();
  res.status(200).json({ message: "", poets: poets });
});

export const deletePoet = catchAsync(async (req, res) => {
  const { id } = req.params;

  try {
    const poet = await Poet.findById(id);

    if (poet) {
      await poet.deleteOne();
      return res.status(200).json({ message: "Poet Deleted", poet: poet });
    }
    return res.status(404).json({ message: "Poet not Found" });
  } catch (err) {
    res.status(500).json({ message: "Invalid Operation" });
  }
});

export const updatePoet = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { updatedPoet } = req.body;

  try {
    const poet = await Poet.findById(id);
    if (!poet) {
      return res.status(404).json({ message: "Poet doesn't exist" });
    }

    poet.name = updatedPoet.name;
    poet.photo = updatedPoet.photo;
    poet.biography = updatedPoet.biography;
    await poet.save();

    res.status(200).json({ message: "Poet updated", poet: poet });
  } catch (err) {
    res.status(500).json({ message: "Invalid Poet Info", error: err.message });
  }
});

export const createPoet = catchAsync(async (req, res) => {
  const { name, photo, biography } = req.body;

  const newPoet = await Poet.create({
    name: name,
    photo: photo,
    biography: biography,
  });

  return res.status(201).json({ poet: newPoet });
});
