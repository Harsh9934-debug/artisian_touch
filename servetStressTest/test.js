const autocannon = require("autocannon");

const instance = autocannon({
    // We should hit an actual API endpoint that queries the database
    url: "http://localhost:5001/api/shop/products/get",
    connections: 100, // Simulating 100 concurrent users
    duration: 40, // Testing for 40 seconds as requested
});

// Displays a real-time progress bar while the test runs
autocannon.track(instance, { renderProgressBar: true });

// Log a nice summary when the 40 seconds are up
instance.on('done', (result) => {
    console.log("🔥 Stress Test Completed! 🔥");
    console.log("-----------------------------------------");
    console.log(`Total Requests Handled : ${result.requests.total}`);
    console.log(`Average Requests/Sec   : ${result.requests.average}`);
    console.log(`Average Latency        : ${result.latency.average} ms`);
    console.log(`Errors / Timeouts      : ${result.errors + result.timeouts}`);
    console.log("-----------------------------------------");
});