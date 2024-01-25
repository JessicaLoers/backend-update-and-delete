import dbConnect from "../../../db/connect";
import Joke from "../../../db/models/Joke";

export default async function handler(request, response) {
  await dbConnect();

  try {
    const { id } = request.query;

    if (request.method === "GET") {
      const joke = await Joke.findById(id);
      if (!joke) {
        return response
          .status(404)
          .json({ status: "error", message: "Not Found" });
      }
      response.status(200).json(joke);
    } else if (request.method === "PUT") {
      const jokeData = request.body;
      await Joke.findByIdAndUpdate(id, jokeData);
      response
        .status(200)
        .json({ status: "success", message: "Joke updated!" });
    } else if (request.method === "DELETE") {
      await Joke.findByIdAndDelete(id);
      response
        .status(200)
        .json({ status: "success", message: "Joke deleted!" });
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
