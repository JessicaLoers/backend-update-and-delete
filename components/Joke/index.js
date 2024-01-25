import useSWR from "swr";
import { useState } from "react";
import { useRouter } from "next/router";
import JokeForm from "../JokeForm";
import Link from "next/link";

export default function Joke() {
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const { data: joke, isLoading, mutate } = useSWR(`/api/jokes/${id}`);

  // Define an asynchronous function to handle the edit operation
  async function handleEdit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const jokeData = Object.fromEntries(formData);

    /*
    Send a PUT request to the server with the jokeData
    The request is sent to a specific joke's endpoint, identified by `"id"
    */
    const response = await fetch(`/api/jokes/${id}`, {
      // Specify the HTTP method (PUT for updating data 🙂)
      method: "PUT",
      // Set headers to indicate JSON content
      headers: { "Content-Type": "application/json" },
      // Convert the joke data object to a JSON string
      body: JSON.stringify(jokeData),
    });

    /* 
    Check if the response status is "OK" ➡️ (status code 200-299) that indicates that the request was successful
    */
    if (response.ok) {
      /* 
      Call SWR's "mutate function" to revalidate and update local data
      helps in synchronizing the local UI state with the server state.
      */
      mutate();
    }
  }

  // Define an asynchronous function to handle the delete operation
  async function handleDelete() {
    /* 
    Send a DELETE request to the server for a specific joke.
    The request is sent to the joke's endpoint, identified by "id".
    */
    const response = await fetch(`/api/jokes/${id}`, {
      method: "DELETE",
    });
    // Check if the response is successful  (status code 200-299)
    if (response.ok) {
      // If the response is successful navigate to the home page ('/'), by using  next.js push() methoth of the useRouter-Hook
      router.push("/");
      // Return from the function to prevent further execution
      return;
    }
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!joke) return;

  return (
    <>
      <small>ID: {joke._id}</small>
      <h1>{joke.joke} </h1>
      <div>
        <button
          onClick={() => {
            setIsEditMode(!isEditMode);
          }}
        >
          <span role="img" aria-label="A pencil">
            ✏️
          </span>
        </button>
        <button onClick={handleDelete} disabled={isEditMode}>
          <span role="img" aria-label="A cross indicating deletion">
            ❌
          </span>
        </button>
      </div>
      {isEditMode && (
        <JokeForm onSubmit={handleEdit} value={joke.joke} isEditMode={true} />
      )}
      <Link href="/">Back to all</Link>
    </>
  );
}
