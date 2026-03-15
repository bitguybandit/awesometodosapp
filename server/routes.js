const express = require("express");
const router = express.Router();
const { getCollection } = require("./models/index");  // ./ instead of ../
const { ObjectId } = require("mongodb");

// GET all todos
router.get("/todos", async (req, res) => {
  try {
    const collection = getCollection();
    const todos = await collection.find({}).toArray();
    res.status(200).json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// POST new todo
router.post("/todos", async (req, res) => {
  try {
    const collection = getCollection();
    const { todo } = req.body;


    if (!todo) {
      return res.status(400).json({ error: "Todo text is required" });
    }

    const newTodo = await collection.insertOne({ todo, status: false });
    res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// DELETE a todo by ID
router.delete("/todos/:id", async (req, res) => {
  try {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);

    const deletedTodo = await collection.deleteOne({ _id });
    if (deletedTodo.deletedCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted", deletedCount: deletedTodo.deletedCount });
  } catch (error) {
    console.error(error);
    if (error.name === "BSONTypeError") {
      return res.status(400).json({ error: "Invalid todo ID" });
    }
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// PUT (toggle status) by ID
router.put("/todos/:id", async (req, res) => {
  try {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const { status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updatedTodo = await collection.updateOne(
      { _id },
      { $set: { status: !status } } // toggle the incoming status
    );

    if (updatedTodo.matchedCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json({ message: "Todo updated", modifiedCount: updatedTodo.modifiedCount });
  } catch (error) {
    console.error(error);
    if (error.name === "BSONTypeError") {
      return res.status(400).json({ error: "Invalid todo ID" });
    }
    res.status(500).json({ error: "Failed to update todo" });
  }
});

module.exports = router;