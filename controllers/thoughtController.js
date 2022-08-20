const { User, Thought } = require('../models');

module.exports = {
    // Get all thoughts
    getThoughts(req, res) {
        Thought.find()
            .then(async (thoughts) => {
                const thoughtObj = {
                    thoughts,
                };
                return res.json(thoughtObj);
            });
    },
    // Get a single thought
    getSingleThought(req, res) {
        Thought.findOne({_id: req.params.thoughtId})
            .select('-__v')
            .then(async (thought) => 
                !thought
                ? res.status(404).json({ message: 'No thought with that ID' })
                : res.json({
                    thought
                })

            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
              });
    },
    // Create a new thought
    createThought(req,res) {
        Thought.create(req.body)
          .then((thought) => res.json(thought))
          .catch((err) => res.status(500).json(err));
    },
    // Update a thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                ? res.status(404).json({ message: 'No such thought exists' })
                :res.json({ message: 'Thought successfully updated'})
            )
            .catch((err) => {
            console.log(err);
            res.status(500).json(err);
            });
    },
    // Delete a thought
    deleteThought(req, res) {
        Thought.findOneAndRemove({_id: req.params.thoughtId})
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No such thought exists' })
                    : Thought.deleteMany({ _id: { $in: thought.reactions } })
            )
            .then(() => res.json({ message: 'Thought and reactions deleted!' }))
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
              });
    },
    // Add a reaction to a Thought
    createReaction(req, res) {
        console.log('You are adding a reaction');
        console.log(req.body);
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            { $addToSet: {reactions: req.body}},
            { runValidators: true, new: true}
        )
        .then((thought) =>
        !thought
            ? res
                .status(404)
                .json({message: 'No thought found with that ID :(' })
                : res.json(thought)
                )
                .catch((err) => res.status(500).json(err));
    },
    // Remove friend from a user
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId},
            { $pull: {reactions: { reactionId: req.params.reactionId}}},
            { runValidators: true, new: true },
        )
        .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No thought found with that ID :(' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
    },
};