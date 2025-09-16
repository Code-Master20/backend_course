import { Schema, model } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: { type: Schema.Types.ObjectId, ref: "User" }, //one woho is subscribing
    channel: { type: Schema.Types.ObjectId, ref: "User" }, // one to whom "subscriber" is subscribing
  },
  {
    timestamps: true,
  }
);

export const Subscription = model("Subscription", subscriptionSchema);

// What is Aggregation in MongoDB?

// Simple query (find) → fetches documents that match conditions.Example: Video.find({ isPublished: true })

// Aggregation → a pipeline of multiple stages where documents flow through and are transformed, grouped, joined, or calculated.Think of it like a data processing pipeline inside MongoDB itself.

// Why is it powerful?

// Instead of pulling raw data into Node.js and processing with JavaScript, MongoDB can:-->>>>>(1)-->Filter ($match),(2)-->Group ($group),(3)-->Sort ($sort), (4)-->Join collections ($lookup), (5)-->Transform fields ($project), (6)-->Paginate ($skip, $limit), (7)-->Count / sum / average  ......all directly in the database, which is faster and more efficient.
