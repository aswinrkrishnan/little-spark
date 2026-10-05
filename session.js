// Remove only legacy Little Spark data; all new state lives in sessionStorage.
try {
  ['spark-learning-v1','spark-journal','spark-sentence-bag','spark-math-limit','spark-voice'].forEach(key => localStorage.removeItem(key));
} catch (_) {}
