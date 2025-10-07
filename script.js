// Social Network Graph (Adjacency List)
let graph = {
    "Alice": ["Bob", "David"],
    "Bob": ["Alice", "Cathy", "Ella"],
    "Cathy": ["Bob", "Frank"],
    "David": ["Alice", "Ella"],
    "Ella": ["Bob", "David"],
    "Frank": ["Cathy"]
  };
  
  // BFS for Friend Suggestions
  function bfsSuggestions(graph, startUser) {
    let visited = new Set();
    let queue = [[startUser, 0]];
    let suggestions = new Set();
  
    while (queue.length > 0) {
      let [user, level] = queue.shift();
      if (!visited.has(user)) {
        visited.add(user);
        if (level === 2) {
          suggestions.add(user);
        }
        (graph[user] || []).forEach(friend => {
          if (!visited.has(friend)) {
            queue.push([friend, level + 1]);
          }
        });
      }
    }
  
    // Remove original user + direct friends
    (graph[startUser] || []).forEach(f => suggestions.delete(f));
    suggestions.delete(startUser);
  
    return Array.from(suggestions);
  }
  
  // Show suggestions
  function getSuggestions() {
    const user = document.getElementById("user").value.trim();
    const resultList = document.getElementById("result");
    resultList.innerHTML = "";
  
    if (!graph[user]) {
      resultList.innerHTML = `<li>⚠️ User not found in network</li>`;
      return;
    }
  
    const suggestions = bfsSuggestions(graph, user);
    if (suggestions.length === 0) {
      resultList.innerHTML = `<li>No suggestions available</li>`;
    } else {
      suggestions.forEach(s => {
        const li = document.createElement("li");
        li.textContent = s;
        resultList.appendChild(li);
      });
    }
  
    drawGraph(user, suggestions);
  }
  
  // Add new friendship
  function addFriendship() {
    const f1 = document.getElementById("friend1").value.trim();
    const f2 = document.getElementById("friend2").value.trim();
    const status = document.getElementById("addStatus");
  
    if (!f1 || !f2 || f1 === f2) {
      status.textContent = "⚠️ Please enter two different names.";
      status.style.color = "red";
      return;
    }
  
    // Add nodes if they don’t exist
    if (!graph[f1]) graph[f1] = [];
    if (!graph[f2]) graph[f2] = [];
  
    // Add undirected edge
    if (!graph[f1].includes(f2)) graph[f1].push(f2);
    if (!graph[f2].includes(f1)) graph[f2].push(f1);
  
    status.textContent = `✅ Friendship added between ${f1} and ${f2}`;
    status.style.color = "#27ae60";
  
    // Update graph visualization
    drawGraph();
  }
  
  // Draw graph visualization
  function drawGraph(currentUser = null, suggestedFriends = []) {
    const ctx = document.getElementById('networkGraph').getContext('2d');
  
    if (window.networkChart) {
      window.networkChart.destroy();
    }
  
    const labels = Object.keys(graph);
    const data = labels.map(u => graph[u].length);
  
    window.networkChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Connections',
          data: data,
          backgroundColor: labels.map(u =>
            u === currentUser ? '#2980b9' :
            suggestedFriends.includes(u) ? '#27ae60' : '#95a5a6'
          )
        }]
      },
      options: {
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
  
  // Initialize graph at start
  drawGraph();
  