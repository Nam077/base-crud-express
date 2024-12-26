const API_URL = "http://localhost:3000/api/v1/users";

const testCreateUser = async () => {
  const userData = {
    email: `user${Date.now()}@example.com`,
    password: "Test@123456",
    firstName: "John",
    lastName: "Doe",
    isActive: true,
  };

  try {
    console.log("Sending request with data:", userData);
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const contentType = response.headers.get("content-type");
    console.log("Response content-type:", contentType);

    if (!response.ok) {
      const text = await response.text();
      console.error("Error response:", text);
      return;
    }

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// Test validation error
const testValidationError = async () => {
  const invalidData = {
    email: "invalid-email",
    password: "123",
    firstName: "",
    lastName: "Doe",
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invalidData),
    });

    const data = await response.json();
    console.log("Validation Test Status:", response.status);
    console.log("Validation Errors:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// Test tạo một user hợp lệ
console.log("\n=== Testing Valid User Creation ===");
testCreateUser();

// Test validation errors
setTimeout(() => {
  console.log("\n=== Testing Validation Errors ===");
  testValidationError();
}, 1000);
