document.getElementById("scrapeButton").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    if (activeTab.url.includes("linkedin.com")) {
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          func: scrapeProfile,
        },
        (result) => {
          if (result && result[0]?.result) {
            const data = result[0].result;
            displayData(data);
          } else {
            alert("Failed to scrape profile data");
          }
        }
      );
    } else {
      alert("Not on a LinkedIn page.");
    }
  });
});

function scrapeProfile() {
  const nameElement = document.querySelector(
    ".qYVRLPCjyOKnAgQzmXUbsDZgrcLSSOFihfKs"
  );
  const name = nameElement ? nameElement.textContent.trim() : "No name found";

  const jobTitleElement = document.querySelector(
    'div.rguopyxnsfpKsgZqiItnPoIdUxQZMuAPSmdPxg span[aria-hidden="true"]'
  );
  const jobTitle = jobTitleElement
    ? jobTitleElement.textContent.trim()
    : "No job title found";

  const companyElement = document.querySelector(
    ".BNYrioAyXastFSGytKbBNGGsBAEGqoFIlk"
  );
  const companyName = companyElement
    ? companyElement.textContent.trim()
    : "No company name found";

  const locationElement = document.querySelector(
    ".sDnWRTYdCVhMXgJCqpVQksJHhOVjjyiNwRZxFPs > span"
  );

  const location = locationElement
    ? locationElement.textContent.trim()
    : "No location found";
  const [firstName = "No first name", ...lastNameParts] = name.split(" ");
  const lastName = lastNameParts.join(" ") || "No last name";
  const email =
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${companyName.toLowerCase()}.com`
      .toString()
      .trim();

  return {
    name,
    jobTitle,
    companyName,
    location,
    email,
  };
}

function displayData(data) {
  document.getElementById("email").textContent = `Email: ${data.email}`;
  document.getElementById("name").textContent = `Name: ${data.name}`;
  document.getElementById(
    "jobTitle"
  ).textContent = `job-Title: ${data.jobTitle}`;
  document.getElementById(
    "companyName"
  ).textContent = `company-Name: ${data.companyName}`;
  document.getElementById(
    "location"
  ).textContent = `location: ${data.location}`;
}
