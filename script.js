const loginPage = document.getElementById("loginPage");
const studentSection = document.getElementById("studentSection");
const staffSection = document.getElementById("staffSection");

let tickets = [];
let loggedInUser = { role: "", email: "" };

// Load tickets from localStorage
function loadTickets() {
  tickets = JSON.parse(localStorage.getItem("tickets")) || [];
}

// Save tickets to localStorage
function saveTickets() {
  localStorage.setItem("tickets", JSON.stringify(tickets));
}

// User credentials
const users = {
  student: { username: "student", password: "student" },
  staff: { username: "staff", password: "staff" }
};

// Login button
document.getElementById("loginBtn").addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === users.student.username && password === users.student.password) {
    loginPage.style.display = "none";
    studentSection.style.display = "block";
    loggedInUser.role = "student";
    loggedInUser.email = username;
  } else if (username === users.staff.username && password === users.staff.password) {
    loginPage.style.display = "none";
    staffSection.style.display = "block";
    loggedInUser.role = "staff";
    renderTickets();
  } else {
    alert("❌ Invalid credentials!");
  }
});

// Student ticket submission
document.getElementById("studentForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("stuName").value.trim();
  const email = document.getElementById("stuEmail").value.trim();
  const category = document.getElementById("stuCategory").value;
  const issue = document.getElementById("stuIssue").value.trim();

  if (!name || !email || !category || !issue) {
    alert("⚠️ Please fill all fields!");
    return;
  }

  const ticket = {
    id: Date.now(),
    name,
    email,
    category,
    issue,
    solution: "",
    status: "Pending"
  };

  tickets.push(ticket);
  saveTickets();
  e.target.reset();

  // Show "Done!" message near Submit button
  const btn = e.target.querySelector("button[type='submit']");
  const msg = document.createElement("span");
  msg.textContent = " ✅ Done!";
  msg.style.color = "green";
  msg.style.fontWeight = "bold";
  msg.style.marginLeft = "10px";
  btn.parentNode.insertBefore(msg, btn.nextSibling);

  setTimeout(() => {
    msg.remove();
  }, 2000);
});

// View tickets on login page
document.getElementById("viewTicketsBtn").addEventListener("click", () => {
  const name = document.getElementById("viewName").value.trim();
  const email = document.getElementById("viewEmail").value.trim();
  const container = document.getElementById("viewTicketsList");
  container.innerHTML = "<h3>Your Tickets</h3>";

  if (!name || !email) {
    alert("⚠️ Enter both Name and Email!");
    return;
  }

  const userTickets = tickets.filter(t => t.name === name && t.email === email);

  if (userTickets.length === 0) {
    container.innerHTML += "<p>No tickets found.</p>";
    return;
  }

  userTickets.forEach(ticket => {
    const div = document.createElement("div");
    div.classList.add("ticket");
    div.innerHTML = `
      <strong>ID:</strong> ${ticket.id}<br>
      <strong>${ticket.name}</strong> (${ticket.email})
      <span class="status ${ticket.status.toLowerCase()}">${ticket.status}</span><br>
      <em>${ticket.category}</em><br>
      <p>${ticket.issue}</p>
      ${ticket.solution ? `<div class="solution"><strong>Solution:</strong> ${ticket.solution}</div>` : ""}
    `;
    container.appendChild(div);
  });
});

// Render tickets for staff panel
function renderTickets() {
  loadTickets();

  if (loggedInUser.role === "staff") {
    const staffTickets = document.getElementById("staffTickets");
    staffTickets.innerHTML = "<h2>All Tickets</h2>";

    if (tickets.length === 0) {
      staffTickets.innerHTML += "<p>No tickets submitted yet.</p>";
      return;
    }

    tickets.forEach(ticket => {
      const div = document.createElement("div");
      div.classList.add("ticket");
      div.innerHTML = `
        <strong>ID:</strong> ${ticket.id}<br>
        <strong>${ticket.name}</strong> (${ticket.email})
        <span class="status ${ticket.status.toLowerCase()}">${ticket.status}</span><br>
        <em>${ticket.category}</em><br>
        <p>${ticket.issue}</p>
        <textarea rows="2" placeholder="Write solution...">${ticket.solution}</textarea>
        <button class="saveReply">Save Reply</button>
        <button class="deleteTicket" style="background:#e74c3c; margin-left:10px;">Delete</button>
      `;

      const btn = div.querySelector(".saveReply");
      const delBtn = div.querySelector(".deleteTicket");
      const txt = div.querySelector("textarea");

      btn.addEventListener("click", () => {
        ticket.solution = txt.value;
        ticket.status = txt.value.trim() ? "Solved" : "Pending";
        saveTickets();
        renderTickets();
      });

      delBtn.addEventListener("click", () => {
        tickets = tickets.filter(t => t.id !== ticket.id);
        saveTickets();
        renderTickets();
      });

      staffTickets.appendChild(div);
    });
  }
}

// Logout
function logout() {
  loginPage.style.display = "block";
  studentSection.style.display = "none";
  staffSection.style.display = "none";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  loggedInUser = { role: "", email: "" };
}

// Load tickets on page load
loadTickets();
