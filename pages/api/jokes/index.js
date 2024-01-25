import dbConnect from "../../../db/connect";
import Joke from "../../../db/models/Joke";

export default async function handler(request, response) {
  await dbConnect();

  try {
    if (request.method === "GET") {
      const jokes = await Joke.find();
      response.status(200).json(jokes);
    } else if (request.method === "POST") {
      const jokeData = request.body;
      const newJoke = await Joke.create(jokeData);
      response
        .status(201)
        .json({ status: "success", message: "Joke created", data: newJoke });
    } else {
      response
        .status(405)
        .json({ status: "error", message: "Method not allowed" });
    }
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
