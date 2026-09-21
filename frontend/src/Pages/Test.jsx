import { useState, useEffect } from "react";

const Test = () => {
  // Step 1: Make a place to store it
  const [pieces, setPieces] = useState([]);

  // Step 2: Fetch it when the page loads
  useEffect(() => {
    fetch("http://localhost:1337/api/pieces?populate=*")
      .then((res) => res.json())
      // Step 3: Put the response in state
      .then((data) => setPieces(data.data));
  }, []);

  return (
    <ul>
      {pieces.map((piece) => (
        <li key={piece.id}>{piece.Name}</li>
      ))}
    </ul>
  );
};

export default Test;
