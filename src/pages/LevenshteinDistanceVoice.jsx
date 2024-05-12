import { Button, Textarea } from "flowbite-react";
import React, { useState, useEffect } from "react";

function LevenshteinDistance() {
  const [paragraph1, setParagraph1] = useState("");
  const [scores, setScores] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [englishDictionary, setEnglishDictionary] = useState({ words: [] });

  const [isRecording, setIsRecording] = useState(false); // New state for recording status

  let recognition = null;

  if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
    // Create speech recognition object
    recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US"; // Set language
    recognition.continuous = false; // Set continuous listening to false

    // Event listener for when speech recognition gets a result
    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      setParagraph1(transcript);
      setIsRecording(false);
    };

    // Event listener for speech recognition errors
    recognition.onerror = function (event) {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };
  } else {
    console.error("Speech recognition not supported");
  }

  useEffect(() => {
    loadDictionary();
  }, []);

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

  function startRecording() {
    setIsRecording(true);
    recognition.start();
  }

  function stopRecording() {
    setIsRecording(false);
    recognition.stop();
  }
  // Function to calculate Levenshtein distance
  function levenshteinDistance(s1, s2) {
    const m = s1.length;
    const n = s2.length;

    const dp = [];
    for (let i = 0; i <= m; i++) {
      dp[i] = [i];
    }
    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
    }

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }

    return dp[m][n];
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
      let minDistance = Infinity;
      let suggestion = "";
      for (const word2 of englishDictionary.words) {
        const distance = levenshteinDistance(word1, word2);
        if (distance < minDistance) {
          minDistance = distance;
          suggestion = word2;
        }
      }
      const similarity =
        1 - minDistance / Math.max(word1.length, suggestion.length);
      scoresArray.push(similarity.toFixed(2));
      suggestionsArray.push(similarity < 1.0 ? suggestion : "");
    }
    setScores(scoresArray);
    setSuggestions(suggestionsArray);
  }

  return (
    <div className="container px-28 h-[80vh]">
      <h2 className="text-center font-semibold sm:text-xl md:text-2xl mt-5">
        Levenshtein Distance Similarity Calculator
      </h2>
      <form className="mt-5" onSubmit={handleSubmit}>
        <Textarea
          placeholder="Enter paragraph"
          required
          rows={4}
          value={paragraph1}
          onChange={(e) => setParagraph1(e.target.value)}
        />
        <div className="mt-5 flex justify-center gap-2">
          <Button
            color={isRecording ? "red" : "blue"}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
          <Button color="blue" type="submit" disabled={isRecording}>
            Check Similarity
          </Button>
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

export default LevenshteinDistance;
