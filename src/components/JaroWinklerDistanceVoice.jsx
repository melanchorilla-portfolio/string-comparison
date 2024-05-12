import React, { useState, useEffect } from 'react';

function JaroWinklerDistanceVoice() {
  const [paragraph1, setParagraph1] = useState('');
  const [scores, setScores] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [englishDictionary, setEnglishDictionary] = useState({ words: [] });
  const [recording, setRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

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
      (matches / m +
        matches / n +
        (matches - transpositions / 2) / matches) /
      3 +
      (prefix > 0.1 ? prefix * 0.1 * (1 - matches / m) : 0)
    );
  }

  // Function to load English dictionary from JSON file
  async function loadDictionary() {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/words.json`);
      const data = await response.json();
      setEnglishDictionary(data);
    } catch (error) {
      console.error('Error loading dictionary:', error);
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
      let suggestion = '';
      for (const word2 of englishDictionary.words) {
        const similarity = jaroWinklerDistance(word1, word2);
        if (similarity > maxScore) {
          maxScore = similarity;
          suggestion = word2;
        }
      }
      scoresArray.push(maxScore.toFixed(2));
      suggestionsArray.push(maxScore < 1.00 ? suggestion : '');
    }
    setScores(scoresArray);
    setSuggestions(suggestionsArray);
  }

  // Function to start recording voice input
  function startRecording() {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Web Speech API is not supported by this browser.");
    } else {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onstart = () => {
        setRecording(true);
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setParagraph1(transcript);
      };
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setRecording(false);
      };
      recognition.onend = () => {
        setRecording(false);
      };
      recognition.start();
      setRecognition(recognition);
    }
  }

  // Function to stop recording voice input
  function stopRecording() {
    if (recognition) {
      recognition.stop();
    }
  }

  return (
    <div>
      <h2>Jaro-Winkler Similarity Calculator</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter paragraph 1"
          value={paragraph1}
          onChange={(e) => setParagraph1(e.target.value)}
        />
        <button type="button" onClick={startRecording} disabled={recording}>
          Start Recording
        </button>
        <button type="button" onClick={stopRecording} disabled={!recording}>
          Stop Recording
        </button>
        <button type="submit">Check Similarity</button>
      </form>
      <div>
        {scores.map((score, index) => (
          <div key={index}>
            <span>Score: {score}</span>
            {suggestions[index] && (
              <span style={{ marginLeft: '10px' }}>
                Do you mean: {suggestions[index]}?
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default JaroWinklerDistanceVoice;
