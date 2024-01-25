import dbConnect from "../../../db/connect";
import Joke from "../../../db/models/Joke";

export default async function handler(request, response) {
  await dbConnect();
  const { id } = request.query;

  if (request.method === "GET") {
    const joke = await Joke.findById(id);

    if (!joke) {
      return response.status(404).json({ status: "Not Found" });
    }

    response.status(200).json(joke);
  }

  // ☝️ Simple, less secure way without error handling

  // Check if the request is a PUT method
  if (request.method === "PUT") {
    // Get the joke data from the request body
    const jokeData = request.body;
    // Update the joke in the database with the given ID and new data
    await Joke.findByIdAndUpdate(id, jokeData);
    // Return a 200 status indicating the joke has been updated
    return response.status(200).json({ status: "Joke updated!" });
  }

  // Check if the request is a DELETE method
  if (request.method === "DELETE") {
    // Delete the joke with the specified ID from the database
    await Joke.findByIdAndDelete(id);
    // Return a success message
    return response.json({ message: "success!" });
  }
}
