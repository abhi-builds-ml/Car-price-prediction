
 const API_URL = "https://car-price-prediction-2nd8.onrender.com/predict";
// Company and model dropdown data
// Model names must match the categories used during training.

const cars = {
    "Maruti": [
        "Maruti Suzuki Swift",
        "Maruti Suzuki Wagon R",
        "Maruti Suzuki Alto",
        "Maruti Suzuki Dzire",
        "Maruti Suzuki Ritz",
        "Maruti Suzuki Baleno"
    ],

    "Hyundai": [
        "Hyundai i20",
        "Hyundai Grand i10",
        "Hyundai Verna",
        "Hyundai Santro",
        "Hyundai Creta"
    ],

    "Honda": [
        "Honda City",
        "Honda Amaze",
        "Honda Civic",
        "Honda Brio"
    ],

    "Mahindra": [
        "Mahindra Scorpio",
        "Mahindra XUV500",
        "Mahindra Bolero",
        "Mahindra Thar"
    ],

    "Toyota": [
        "Toyota Innova",
        "Toyota Fortuner",
        "Toyota Corolla"
    ],

    "Tata": [
        "Tata Nexon",
        "Tata Tiago",
        "Tata Indigo",
        "Tata Safari"
    ],

    "Ford": [
        "Ford EcoSport",
        "Ford Figo",
        "Ford Endeavour"
    ],

    "Renault": [
        "Renault Duster",
        "Renault Kwid",
        "Renault Lodgy"
    ],

    "Volkswagen": [
        "Volkswagen Polo",
        "Volkswagen Vento"
    ]
};


// Get HTML elements

const companySelect = document.getElementById("company");
const carSelect = document.getElementById("name");
const form = document.getElementById("carForm");

const predictBtn = document.getElementById("predictBtn");
const buttonText = document.getElementById("buttonText");

const loading = document.getElementById("loading");
const result = document.getElementById("result");
const priceElement = document.getElementById("price");
const errorElement = document.getElementById("error");


// Populate company dropdown

Object.keys(cars).forEach(company => {
    const option = document.createElement("option");

    option.value = company;
    option.textContent = company;

    companySelect.appendChild(option);
});


// When company changes, update car models

companySelect.addEventListener("change", function () {

    const selectedCompany = companySelect.value;

    // Reset model dropdown
    carSelect.innerHTML = `
        <option value="" disabled selected>Select car model</option>
    `;

    // Enable model dropdown
    carSelect.disabled = false;

    // Get models of selected company
    const models = cars[selectedCompany];

    models.forEach(model => {

        const option = document.createElement("option");

        option.value = model;
        option.textContent = model;

        carSelect.appendChild(option);

    });

});


// Format Indian currency

function formatIndianPrice(price) {

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(price);

}


// Animate price counter

function animatePrice(finalPrice) {

    let currentPrice = 0;

    const duration = 1000;
    const steps = 50;
    const increment = finalPrice / steps;
    const intervalTime = duration / steps;

    const interval = setInterval(() => {

        currentPrice += increment;

        if (currentPrice >= finalPrice) {

            currentPrice = finalPrice;

            clearInterval(interval);

        }

        priceElement.textContent = formatIndianPrice(currentPrice);

    }, intervalTime);

}


// Form submission

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    // Hide previous output
    result.classList.add("hidden");
    errorElement.classList.add("hidden");

    // Show loading
    loading.classList.remove("hidden");

    // Disable button
    predictBtn.disabled = true;
    buttonText.textContent = "Predicting...";


    // Collect input values

    const carData = {

        name: carSelect.value,

        company: companySelect.value,

        year: Number(document.getElementById("year").value),

        kms_driven: Number(
            document.getElementById("kms_driven").value
        ),

        fuel_type: document.getElementById("fuel_type").value

    };


    try {

        // Send data to FastAPI

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(carData)

        });


        // Check response

        if (!response.ok) {

            throw new Error(
                `Server error: ${response.status}`
            );

        }


        // Convert response into JavaScript object

        const data = await response.json();


        // Get predicted price

        const predictedPrice = data.predicted_price;


        // Show result

        loading.classList.add("hidden");

        result.classList.remove("hidden");

        animatePrice(predictedPrice);


    } catch (error) {

        loading.classList.add("hidden");

        errorElement.classList.remove("hidden");

        errorElement.textContent =
            "Unable to predict price. Please make sure your FastAPI backend is running. " +
            error.message;

        console.error("Prediction error:", error);

    }


    // Reset button

    predictBtn.disabled = false;

    buttonText.textContent = "Predict Car Price";

});
