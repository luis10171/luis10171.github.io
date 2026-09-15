/* PROJECT INTERACTIONS
   All data below is synthetic. These are explanatory portfolio demonstrations,
   not face recognition, a medical database, an AI API, or a school record system.
   1. STEP walkthrough  2. Similarity threshold  3. Design constraints
   4. AtlasOne prerequisite example and shared role views */

// 1. STEP: five stages from a capture to a reviewed candidate.
const recognitionStages = [
  {
    title: "Start with a capture.",
    description:
      "The desktop app accepts a webcam frame or an existing photo. Processing happens on the same device. Enrollment requires exactly one detected face.",
    note: "The actual app processes captures in memory rather than saving them as photographs.",
  },
  {
    title: "Find the face. Align the crop.",
    description:
      "YuNet locates faces and their landmarks. OpenCV uses those landmarks to align and crop the face before the recognition model sees it.",
    note: "Alignment helps put the face into a consistent position. This schematic shows landmark positions, not a real person.",
  },
  {
    title: "Turn the crop into numbers.",
    description:
      "SFace produces a 128-value embedding: a learned numerical representation used for comparison. During enrollment, SQLite stores this template alongside the patient details and unique ID.",
    note: "An embedding is still biometric data. The colored grid is an illustration, not an actual face template.",
  },
  {
    title: "Compare with enrolled templates.",
    description:
      "The application computes cosine similarity between the new embedding and the stored templates. It selects the highest score, then checks whether that score meets the configured threshold.",
    note: "Similarity is not a confidence percentage. Try changing the threshold in the illustration below.",
  },
  {
    title: "Offer a candidate for review.",
    description:
      "If the highest score passes the threshold, its unique ID points to a candidate record. Otherwise the result is unknown. An operator can review the candidate before opening the record.",
    note: "Recognition can be wrong. The app also supports direct ID lookup without face matching.",
  },
];

if (document.querySelector("[data-step]")) {
  const buttons = [...document.querySelectorAll("[data-step]")];
  const visuals = [...document.querySelectorAll("[data-stage-visual]")];
  let currentStep = 0;
  function selectStep(index) {
    currentStep = index;
    const stage = recognitionStages[index];
    buttons.forEach((button, i) =>
      button.setAttribute("aria-pressed", String(i === index)),
    );
    visuals.forEach((visual, i) => {
      visual.hidden = i !== index;
    });
    document.querySelector("#stage-counter").textContent =
      `Step 0${index + 1} of 05`;
    document.querySelector("#stage-title").textContent = stage.title;
    document.querySelector("#stage-description").textContent =
      stage.description;
    document.querySelector("#stage-note").textContent = stage.note;
    document.querySelector("#step-back").disabled = index === 0;
    document.querySelector("#step-next").textContent =
      index === 4 ? "Start again ↺" : "Next step →";
  }
  buttons.forEach((button, index) =>
    button.addEventListener("click", () => selectStep(index)),
  );
  document
    .querySelector("#step-back")
    .addEventListener("click", () => selectStep(Math.max(0, currentStep - 1)));
  document
    .querySelector("#step-next")
    .addEventListener("click", () =>
      selectStep((currentStep + 1) % recognitionStages.length),
    );
  const grid = document.querySelector(".embedding-grid");
  for (let i = 0; i < 128; i++) {
    const cell = document.createElement("span");
    cell.style.opacity = (0.25 + ((i * 37) % 100) / 135).toFixed(2);
    cell.setAttribute("aria-hidden", "true");
    grid.append(cell);
  }
}

// 2. STEP: same >= decision as best_match(), with fixed, made-up scores.
const thresholdInput = document.querySelector("#match-threshold");
if (thresholdInput) {
  const scenarioInput = document.querySelector("#match-scenario");
  const samples = {
    known: [0.78, 0.51, 0.22],
    unknown: [0.24, 0.18, 0.09],
    empty: [],
  };
  function updateMatch() {
    const threshold = Number(thresholdInput.value);
    const scores = samples[scenarioInput.value];
    document.querySelector("#threshold-value").textContent =
      threshold.toFixed(3);
    thresholdInput.setAttribute("aria-valuetext", threshold.toFixed(3));
    document.querySelector("#score-bars").hidden = scores.length === 0;
    document.querySelectorAll(".score-row").forEach((row, index) => {
      row.querySelector("meter").value = scores[index] ?? 0;
      row.querySelector("output").textContent = (scores[index] ?? 0).toFixed(3);
    });
    const result = document.querySelector("#match-decision");
    const hasCandidate = scores.length > 0 && scores[0] >= threshold;
    result.textContent =
      scores.length === 0
        ? "No enrolled records → no candidate"
        : hasCandidate
          ? "Candidate A → operator review"
          : "Unknown → no candidate meets the threshold";
    result.dataset.result = hasCandidate ? "candidate" : "unknown";
  }
  thresholdInput.addEventListener("input", updateMatch);
  scenarioInput.addEventListener("change", updateMatch);
  document.querySelector("#reset-threshold").addEventListener("click", () => {
    thresholdInput.value = "0.363";
    scenarioInput.value = "known";
    updateMatch();
  });
  updateMatch();
}

// 3. STEP: explain potential benefits without inventing clinical outcomes.
const impactScenarios = {
  connectivity: {
    title: "Keep the core workflow local.",
    description:
      "After installation and model downloads, enrollment, recognition, and record lookup work offline. Losing connectivity does not require sending a new image to a cloud service.",
  },
  hardware: {
    title: "Start with accessible equipment.",
    description:
      "The design targets existing computers and affordable webcams. YuNet and SFace run on the CPU without a dedicated GPU. Performance on lower-end devices still needs evaluation.",
  },
  records: {
    title: "Give staff another route to information.",
    description:
      "A face-assisted candidate can help an operator look for an enrolled record when a patient ID is not at hand. Direct ID lookup remains available. Less time searching is the goal; a clinical time-saving benefit has not been measured.",
  },
};
document.querySelectorAll("[data-impact]").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll("[data-impact]")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
    const scenario = impactScenarios[button.dataset.impact];
    document.querySelector("#impact-title").textContent = scenario.title;
    document.querySelector("#impact-description").textContent =
      scenario.description;
  });
});

// 4. ATLASONE: one prerequisite chain and a fictional three-credit math target.
// A changed transcript clears requests so no stale eligibility can remain.
const geometryInput = document.querySelector("#geometry-status");
if (geometryInput) {
  const requests = new Set();
  const familyLanguage = document.querySelector("#family-language");
  const geometryStates = {
    progress: {
      label: "In progress",
      transcript: "In progress · 0 credits",
      credits: 1,
      eligibility: "Conditional",
      className: "conditional",
      explanation:
        "Algebra II can be requested for next year, conditional on passing Geometry. Geometry has not earned credit yet.",
      requestNote: "Conditional on passing Geometry",
    },
    passed: {
      label: "Passed",
      transcript: "Passed · 1 credit",
      credits: 2,
      eligibility: "Eligible",
      className: "completed",
      explanation:
        "Geometry is complete, so Algebra II’s prerequisite is satisfied. Two math credits are earned in this example.",
      requestNote: "Ready to request · Geometry completed",
    },
    failed: {
      label: "Not passed",
      transcript: "Not passed · 0 credits",
      credits: 1,
      eligibility: "Blocked",
      className: "blocked",
      explanation:
        "Geometry did not earn credit. Algebra II cannot be requested in this example until its prerequisite is satisfied.",
      requestNote: "Prerequisite not met · Geometry must be passed",
    },
  };

  function selectRole(role) {
    document
      .querySelectorAll("[data-role-view]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.roleView === role),
        ),
      );
    document.querySelectorAll("[data-role-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.rolePanel !== role;
    });
  }
  document
    .querySelectorAll("[data-role-view]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        selectRole(button.dataset.roleView),
      ),
    );

  function updateFamilySummary() {
    const state = geometryStates[geometryInput.value];
    const english = {
      progress:
        "Geometry is still in progress. Algebra II can be requested for next year if Geometry is passed.",
      passed:
        "Geometry is complete. Avery can request Algebra II and discuss the next step with a counselor.",
      failed:
        "Geometry has not been passed. Avery should discuss how to complete it with a counselor before requesting Algebra II.",
    };
    const spanish = {
      progress:
        "Geometría todavía está en curso. Se puede solicitar Álgebra II para el próximo año con la condición de aprobar Geometría.",
      passed:
        "Geometría está aprobada. Avery puede solicitar Álgebra II y hablar con su orientador sobre el siguiente paso.",
      failed:
        "Geometría no está aprobada. Avery debe hablar con su orientador sobre cómo completarla antes de solicitar Álgebra II.",
    };
    const summary = document.querySelector("#family-summary");
    summary.lang = familyLanguage.value;
    summary.textContent =
      familyLanguage.value === "es"
        ? `Avery ha obtenido ${state.credits} de los 3 créditos de matemáticas de este ejemplo. ${spanish[geometryInput.value]}`
        : `Avery has earned ${state.credits} of the 3 math credits in this example. ${english[geometryInput.value]}`;
  }

  function updateRequests() {
    const algebraButton = document.querySelector("#request-algebra");
    algebraButton.disabled =
      geometryInput.value === "failed" || requests.has("Algebra II");
    algebraButton.textContent = requests.has("Algebra II")
      ? "Requested ✓"
      : geometryInput.value === "failed"
        ? "Prerequisite not met"
        : "Request Algebra II";
    const chemistryButton = document.querySelector("#request-chemistry");
    chemistryButton.disabled = requests.has("Chemistry");
    chemistryButton.textContent = requests.has("Chemistry")
      ? "Requested ✓"
      : "Request Chemistry";
    const list = document.querySelector("#counselor-requests");
    list.replaceChildren();
    if (!requests.size) {
      const empty = document.createElement("li");
      empty.textContent =
        "No requests yet. Try requesting a class from the Student view.";
      list.append(empty);
    }
    requests.forEach((course) => {
      const row = document.createElement("li");
      const title = document.createElement("strong");
      title.textContent = course;
      const note = document.createElement("span");
      note.textContent =
        course === "Algebra II" && geometryInput.value === "progress"
          ? "Pending review · conditional on passing Geometry"
          : "Pending review · completed prerequisite";
      row.append(title, note);
      list.append(row);
    });
  }

  function updatePlanner() {
    const state = geometryStates[geometryInput.value];
    document.querySelector("#geometry-transcript").textContent =
      state.transcript;
    document.querySelector("#math-credit-count").textContent = state.credits;
    document.querySelector("#credit-percentage").textContent =
      `${Math.round((state.credits / 3) * 100)}%`;
    const ring = document.querySelector("#credit-ring");
    ring.style.setProperty("--progress", `${(state.credits / 3) * 100}%`);
    ring.setAttribute(
      "aria-label",
      `${state.credits} of 3 example math credits earned`,
    );
    const geometryNode = document.querySelector("#geometry-node");
    geometryNode.className = `course-node ${geometryInput.value === "passed" ? "completed" : geometryInput.value === "failed" ? "blocked" : "current"}`;
    geometryNode.querySelector("span").textContent = state.label;
    const algebraNode = document.querySelector("#algebra-node");
    algebraNode.className = `course-node ${state.className}`;
    algebraNode.querySelector("span").textContent = state.eligibility;
    document.querySelector("#rule-explanation").textContent = state.explanation;
    document.querySelector("#algebra-eligibility").textContent =
      state.requestNote;
    updateRequests();
    updateFamilySummary();
  }

  geometryInput.addEventListener("change", () => {
    const hadRequests = requests.size > 0;
    requests.clear();
    document.querySelector("#request-feedback").textContent = hadRequests
      ? "Transcript changed. Example requests were cleared so you can reconsider the updated plan."
      : "";
    updatePlanner();
  });
  familyLanguage.addEventListener("change", updateFamilySummary);
  [
    ["#request-algebra", "Algebra II"],
    ["#request-chemistry", "Chemistry"],
  ].forEach(([selector, course]) => {
    document.querySelector(selector).addEventListener("click", () => {
      if (course === "Algebra II" && geometryInput.value === "failed") return;
      requests.add(course);
      updateRequests();
      document.querySelector("#request-feedback").textContent =
        `${course} added to this example. Open the Counselor view to see the pending request.`;
    });
  });
  document.querySelector("#reset-planner").addEventListener("click", () => {
    geometryInput.value = "progress";
    familyLanguage.value = "en";
    requests.clear();
    selectRole("student");
    document.querySelector("#request-feedback").textContent = "Example reset.";
    updatePlanner();
  });
  updatePlanner();
}
