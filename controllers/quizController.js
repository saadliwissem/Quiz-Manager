const express = require("express");
const router = express.Router();
const Quiz = require("../models/quiz/QuizModel");
const Question = require("../models/quiz/QuestionModel");
const Option = require("../models/quiz/OptionModel");


// Create a new quiz
router.post('/quiz', async (req, res) => {
  try {
    const { title, description } = req.body;
    const quiz = new Quiz({ title, description });
    await quiz.save();

    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all quizzes
router.get('/quiz', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Get a single quiz by ID with questions and options populated
router.get('/quiz/:id', async (req, res) => {
  try {
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId)
      .populate({
        path: 'questions',
        populate: {
          path: 'options'
        }
      })
      .exec();

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Create a new question
router.post('/question', async (req, res) => {
  try {
    const text = req.body.text;
    const quizId = req.body.quizId
    const question = new Question({ text });
    await question.save();

    const quiz = await Quiz.findById(quizId);
    quiz.questions.push(question);
    await quiz.save();

    res.status(201).json({ message: "Question created successfully", question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all questions for a quiz
router.get('/question/:quizId', async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId).populate('questions');
    res.status(200).json(quiz.questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new option for a question
router.post('/option', async (req, res) => {
  try {
    const { text, isCorrect, questionId } = req.body;
    const option = new Option({ text, isCorrect });
    await option.save();
    const question = await Question.findById(questionId);
    question.options.push(option);
    await question.save();

    res.status(201).json({ message: "Option created successfully", option });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all options for a question
router.get('/option/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await Question.findById(questionId).populate('options');
    res.status(200).json(question.options);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Update a quiz
router.put('/quiz/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const quiz = await Quiz.findByIdAndUpdate(id, { title, description }, { new: true });
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.status(200).json({ message: "Quiz updated successfully", quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a quiz
router.delete('/quiz/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findByIdAndDelete(id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a question
router.put('/question/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const question = await Question.findByIdAndUpdate(id, { text }, { new: true });
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.status(200).json({ message: "Question updated successfully", question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a question
router.delete('/question/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByIdAndDelete(id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update an option
router.put('/option/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, isCorrect } = req.body;
    const option = await Option.findByIdAndUpdate(id, { text, isCorrect }, { new: true });
    if (!option) {
      return res.status(404).json({ error: "Option not found" });
    }
    res.status(200).json({ message: "Option updated successfully", option });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete an option
router.delete('/option/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const option = await Option.findByIdAndDelete(id);
    if (!option) {
      return res.status(404).json({ error: "Option not found" });
    }
    res.status(200).json({ message: "Option deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
