import React, { useState, useEffect } from "react";
import { Button, Textarea } from "flowbite-react";

function JaroWinklerDistance() {
  const [paragraph1, setParagraph1] = useState("");
  const [scores, setScores] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [englishDictionary, setEnglishDictionary] = useState({ words: [] });
  const [isRecording, setIsRecording] = useState(false);
  const [processingTime, setProcessingTime] = useState(0); // State to store processing time

  let recognition = null;

  if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.continuous = false;

    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      setParagraph1(transcript);
      setIsRecording(false);
    };

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
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/words.json`);
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

  function jaroWinklerDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    const m = s1.length;
    const n = s2.length;
    if (s1 === s2) return 1;
    if (m === 0 || n === 0) return 0;
    const matchDistance = Math.floor(Math.max(m, n) / 2) - 1;
    const s1Matches = new Array(m).fill(false);
    const s2Matches = new Array(n).fill(false);
    let matches = 0;
    let transpositions = 0;
    let prefix = 0;
    for (let i = 0; i < m; i++) {
      const start = Math.max(0, i - matchDistance);
      const end = Math.min(i + matchDistance + 1, n);
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
    let k = 0;
    while (k < m && s1[k] === s2[k] && k < 4) {
      prefix++;
      k++;
    }
    return (
      (matches / m + matches / n + (matches - transpositions / 2) / matches) / 3 +
      (prefix > 0.1 ? prefix * 0.1 * (1 - matches / m) : 0)
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    const startTime = Date.now(); // Start time
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
    const endTime = Date.now(); // End time
    setProcessingTime(endTime - startTime); // Calculate processing time
  }

  function handleSaveToLocalStorage() {
    const dataToStore = {
      scores,
      words: paragraph1.split(/\s+/),
      suggestions,
      processingTime
    };
    localStorage.setItem('jaroWinklerData', JSON.stringify(dataToStore));
    alert('Results and suggestions stored in localStorage!');
  }

  return (
    <div className="container px-28 h-[80vh]">
      <h2 className="text-center font-semibold sm:text-xl md:text-2xl mt-5">
        Jaro-Winkler Similarity Calculator
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
          <Button color="green" onClick={handleSaveToLocalStorage}>
            Save Results
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
        <div>Processing Time: {processingTime} ms</div>
      </div>
    </div>
  );
}

export default JaroWinklerDistance;
