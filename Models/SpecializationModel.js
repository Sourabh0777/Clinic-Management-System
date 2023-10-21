const { mongoose } = require("mongoose");

const specializationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the specialization name"],
      trim: true,
      unique: true,
    },
    relatedSymptoms: {
      type: [String],
      required: [true, "Please enter related symptoms"],
    },
  },
  { timestamps: true }
);

const Specialization = mongoose.model("Specialization", specializationSchema);

module.exports = Specialization;
//Short hand
// name relatedSymptoms
