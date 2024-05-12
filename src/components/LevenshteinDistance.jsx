import React, { useState, useEffect } from 'react';

function LevenshteinDistance() {
  const [paragraph1, setParagraph1] = useState('');
  const [scores, setScores] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [englishDictionary, setEnglishDictionary] = useState({ words: [] });

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
      let minDistance = Infinity;
      let suggestion = '';
      for (const word2 of englishDictionary.words) {
        const distance = levenshteinDistance(word1, word2);
        if (distance < minDistance) {
          minDistance = distance;
          suggestion = word2;
        }
      }
      const similarity = 1 - minDistance / Math.max(word1.length, suggestion.length);
      scoresArray.push(similarity.toFixed(2));
      suggestionsArray.push(similarity < 1.00 ? suggestion : '');
    }
    setScores(scoresArray);
    setSuggestions(suggestionsArray);
  }

  return (
    <div>
      <h2>Levenshtein Distance Similarity Calculator</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter paragraph 1"
          value={paragraph1}
          onChange={(e) => setParagraph1(e.target.value)}
        />
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

export default LevenshteinDistance;