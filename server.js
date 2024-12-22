const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Use express.json() middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to fetch questions
app.get('/get-questions', (req, res) => {
  fs.readFile(path.join(__dirname, 'questions.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading questions file.');
    } else {
      const questions = JSON.parse(data);
      res.json(questions);
    }
  });
});

// Endpoint to save questions (POST request)
app.post('/save-questions', (req, res) => {
  const questions = req.body;  // Get the questions from the request body

  // Validate that questions is an array
  if (!Array.isArray(questions)) {
    return res.status(400).json({ error: 'Invalid data format' });
  }

  // Save questions to the JSON file
  fs.writeFile(path.join(__dirname, 'questions.json'), JSON.stringify(questions, null, 2), 'utf8', (err) => {
    if (err) {
      res.status(500).send('Error saving questions to file.');
    } else {
      res.status(200).send('Questions saved successfully!');
    }
  });
});

// Endpoint to save quiz results (POST request)
app.post('/save-score', (req, res) => {
    const { username, score , date} = req.body;
  
    // Validate that the data is correct
    if (!username || typeof score !== 'number') {
      return res.status(400).json({ error: 'Invalid score data format' });
    }
  
    const result = { username, score , date};
  
    fs.readFile(path.join(__dirname, 'results.json'), 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error reading results file.');
      }
  
      const results = data ? JSON.parse(data) : [];
      results.push(result);
  
      fs.writeFile(path.join(__dirname, 'results.json'), JSON.stringify(results, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).send('Error saving score to file.');
        }
  
        // Send a JSON response confirming the score was saved
        res.status(200).json({
          message: 'Score saved successfully!',
          result: result
        });
      });
    });
  });
  
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
