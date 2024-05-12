import React, { useState, useEffect } from "react";
import { Button, Textarea } from "flowbite-react";

function JaroWinklerDistance() {
  const [paragraph1, setParagraph1] = useState("");
  const [scores, setScores] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [englishDictionary, setEnglishDictionary] = useState({ words: [] });

  // Function to calculate Jaro-Winkler distance
  function jaroWinklerDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    const m = s1.length;
    const n = s2.length;

    // Return 1 if both strings are identical
    if (s1 === s2) return 1;

    // Exit if either of the strings is empty
    if (m === 0 || n === 0) return 0;

    // Matching distance threshold
    const matchDistance = Math.floor(Math.max(m, n) / 2) - 1;

    // Arrays to mark if a character is matched
    const s1Matches = new Array(m).fill(false);
    const s2Matches = new Array(n).fill(false);

    // Count of matched characters
    let matches = 0;

    // Count of transpositions
    let transpositions = 0;

    // Count of prefix similarity
    let prefix = 0;

    // Iterate over the first string
    for (let i = 0; i < m; i++) {
      const start = Math.max(0, i - matchDistance);
      const end = Math.min(i + matchDistance + 1, n);

      // Iterate over the second string
      for (let j = start; j < end; j++) {
        if (!s2Matches[j] && s1[i] === s2[j]) {
          s1Matches[i] = true;
          s2Matches[j] = true;
          matches++;
          if (i === j) transpositions++;
          break;
        }
      }
    }

    // Count the prefix similarity
    let k = 0;
    while (k < m && s1[k] === s2[k] && k < 4) {
      prefix++;
      k++;
    }

    // Return Jaro similarity with Winkler modification
    return (
      (matches / m + matches / n + (matches - transpositions / 2) / matches) /
        3 +
      (prefix > 0.1 ? prefix * 0.1 * (1 - matches / m) : 0)
    );
  }

  // Function to load English dictionary from JSON file
  async function loadDictionary() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/words.json`
      );
      const data = await response.json();
      setEnglishDictionary(data);
    } catch (error) {
      console.error("Error loading dictionary:", error);
    }
  }

  // Load English dictionary when component mounts
  useEffect(() => {
    loadDictionary();
  }, []);

  // Function to handle form submit and calculate similarity
  function handleSubmit(event) {
    event.preventDefault();
    const scoresArray = [];
    const suggestionsArray = [];
    const words1 = paragraph1.split(/\s+/);
    for (const word1 of words1) {
      let maxScore = 0;
      let suggestion = "";
      for (const word2 of englishDictionary.words) {
        const similarity = jaroWinklerDistance(word1, word2);
        if (similarity > maxScore) {
          maxScore = similarity;
          suggestion = word2;
        }
      }
      scoresArray.push(maxScore.toFixed(2));
      suggestionsArray.push(maxScore < 1.0 ? suggestion : "");
    }
    setScores(scoresArray);
    setSuggestions(suggestionsArray);
  }

  return (
    <div className="container px-28 h-[80vh]">
      <h2 className="text-center font-semibold sm:text-xl md:text-2xl mt-5">
        Jaro-Winkler Similarity Calculator
      </h2>
      <form
        className="mt-5"
        onSubmit={handleSubmit}
      >
        <Textarea
          placeholder="Enter paragraph"
          required
          rows={4}
          value={paragraph1}
          onChange={(e) => setParagraph1(e.target.value)}
        />
        <div className="mt-5 flex justify-center">
            <Button color="blue" type="submit">Check Similarity</Button>
        </div>
      </form>
      <div>
        {scores.map((score, index) => (
          <div key={index}>
            <span>Score: {score}</span>
            {suggestions[index] && (
              <span style={{ marginLeft: "10px" }}>
                Do you mean: {suggestions[index]}?
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default JaroWinklerDistance;
