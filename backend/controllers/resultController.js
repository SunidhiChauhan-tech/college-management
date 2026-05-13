const Result = require("../models/Result");

// ADD RESULT
exports.addResult = async (req, res) => {
  try {
    const result = new Result(req.body);
    await result.save();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET RESULTS (populate )
exports.getResults = async (req, res) => {
  try {
    const data = await Result.find()
      .populate("student")
      .populate("course");

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};