// Initialize Scrollama
const scroller = scrollama();

// Money visualization state
let currentAmount = 125000;
const targetAmount = 1200000;
const moneyAmountEl = document.getElementById("moneyAmount");
const growthFillEl = document.getElementById("growthFill");
const moneyVisualEl = document.getElementById("moneyVisual");
let moneyAnimationInterval = null;

// Setup scroll triggers
scroller
    .setup({
        step: ".scroll-section",
        offset: 0.6,
        debug: false,
    })
    .onStepEnter((response) => {
        response.element.classList.add("active");
        const step = parseInt(response.element.dataset.step);

        // Trigger different effects based on step
        switch (step) {
            case 1:
                setTimeout(() => {
                    document.getElementById("chatBubble1").classList.add("visible");
                    document
                        .getElementById("portraitSection")
                        .classList.add("active");
                }, 300);
                break;
            case 2:
                setTimeout(() => {
                    document.getElementById("infoBox1").classList.add("visible");
                }, 400);
                break;
            case 3:
                moneyVisualEl.classList.remove("hidden");
                animateMoney(targetAmount);
                break;
            case 4:
                const fact = response.element.querySelector(".fact-box");
                if (fact) fact.classList.add("visible");
                break;

            case 5:
                moneyVisualEl.classList.add("hidden");
                document.body.classList.add("dark-turn");
                document.getElementById("warningOverlay").classList.add("active");
                setTimeout(() => {
                    document.getElementById("alertBox").classList.add("visible");
                }, 500);
                break;
            case 7:
                setTimeout(() => {
                    document.getElementById("infoBox2").classList.add("visible");
                }, 400);
                break;
            case 8:
                document
                    .getElementById("warningOverlay")
                    .classList.remove("active");
                document.body.classList.remove("dark-turn");
                break;
            case 9:
                setTimeout(() => {
                    document.getElementById("infoBox3").classList.add("visible");
                    const chartSection2 = document.querySelector(
                        '.chart-section[data-chart="2"]'
                    );
                    if (chartSection2) chartSection2.classList.add("visible");
                    createLineChart();
                    const chartSection1 = response.element.querySelector(
                        '.chart-section[data-chart="1"]'
                    );
                    if (chartSection1) chartSection1.classList.add("visible");
                    createPieChart();
                }, 400);
        }
        document.querySelector(".pub-photo").classList.add("active");
    })
    .onStepExit((response) => {
        const step = parseInt(response.element.dataset.step);

        // Reverse effects when scrolling up
        if (response.direction === "up") {
            response.element.classList.remove("active");

            switch (step) {
                case 1:
                    document
                        .getElementById("chatBubble1")
                        .classList.remove("visible");
                    document
                        .getElementById("portraitSection")
                        .classList.remove("active");
                    break;
                case 2:
                    document.getElementById("infoBox1").classList.remove("visible");
                    break;
                case 3:
                    moneyVisualEl.classList.add("hidden");
                    resetMoney();
                    break;
                case 4:
                    const fact = response.element.querySelector(".fact-box");
                    if (fact) fact.classList.remove("visible");
                    break;
                case 5:
                    moneyVisualEl.classList.remove("hidden");
                    document.body.classList.remove("dark-turn");
                    document
                        .getElementById("warningOverlay")
                        .classList.remove("active");
                    document.getElementById("alertBox").classList.remove("visible");
                    break;
                case 7:
                    document.getElementById("infoBox2").classList.remove("visible");
                    break;
                case 8:
                    document.body.classList.add("dark-turn");
                    document
                        .getElementById("warningOverlay")
                        .classList.add("active");
                    break;
                case 9:
                    document.getElementById("infoBox3").classList.remove("visible");
                    const chartSection =
                        response.element.querySelector(".chart-section");
                    if (chartSection) chartSection.classList.remove("visible");
                    const chartSection2 = document.querySelector(
                        '.chart-section[data-chart="2"]'
                    );
                    if (chartSection2) chartSection2.classList.remove("visible");
                    break;
            }
        }
    });

// Animate money counter
function animateMoney(target) {
    if (moneyAnimationInterval) {
        clearInterval(moneyAnimationInterval);
    }

    const duration = 2000;
    const steps = 60;
    const startAmount = 125000;
    const increment = (target - startAmount) / steps;
    const stepDuration = duration / steps;
    let current = startAmount;

    moneyAnimationInterval = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(moneyAnimationInterval);
        }
        moneyAmountEl.textContent =
            Math.round(current).toLocaleString("no-NO") + " kr";

        const percentage = (current / target) * 100;
        growthFillEl.style.width = percentage + "%";
    }, stepDuration);
}

// Reset money visualization
function resetMoney() {
    if (moneyAnimationInterval) {
        clearInterval(moneyAnimationInterval);
    }
    moneyAmountEl.textContent = "125 000 kr";
    growthFillEl.style.width = "0%";
}

let pieChartInstance = null;
function createPieChart() {
    if (pieChartInstance) return;

    const ctx = document
        .getElementById("distributionChart")
        .getContext("2d");
    pieChartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: [
                "Phishing (40%)",
                "Investeringssvindel (30%)",
                "Netthandelssvindel (20%)",
                "Annet (10%)",
            ],
            datasets: [
                {
                    data: [40, 30, 20, 10],
                    backgroundColor: ["#ef4444", "#10b981", "#6366f1", "#f59e0b"],
                    borderWidth: 3,
                    borderColor: "#fff",
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 2000,
                easing: "easeOutQuart",
            },
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        font: { size: 14, family: "'IBM Plex Sans', sans-serif" },
                        padding: 20,
                        boxWidth: 20,
                        boxHeight: 20,
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.label;
                        },
                    },
                },
            },
        },
    });
}

let lineChartInstance = null;
function createLineChart() {
    if (lineChartInstance) return;

    const ctx = document.getElementById("lossChart").getContext("2d");

    // Animate line drawing
    const data = [260, 340, 380, 410, 520, 610];
    const animatedData = [0, 0, 0, 0, 0, 0];

    lineChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: [
                "H1 2022",
                "H2 2022",
                "H1 2023",
                "H2 2023",
                "H1 2024",
                "H2 2024",
            ],
            datasets: [
                {
                    label: "Tap i millioner kr",
                    data: animatedData,
                    borderColor: "#ef4444",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointBackgroundColor: "#ef4444",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 3,
                    pointHoverRadius: 8,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                duration: 2500,
                easing: "easeOutQuart",
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.parsed.y + " millioner kr";
                        },
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return value + " mill";
                        },
                        font: { family: "'IBM Plex Sans', sans-serif" },
                    },
                    grid: { color: "rgba(0, 0, 0, 0.05)" },
                },
                x: {
                    ticks: { font: { family: "'IBM Plex Sans', sans-serif" } },
                    grid: { display: false },
                },
            },
        },
    });

    // Animate data points appearing
    data.forEach((value, index) => {
        setTimeout(() => {
            lineChartInstance.data.datasets[0].data[index] = value;
            lineChartInstance.update("active");
        }, index * 300);
    });
}

// Handle window resize
window.addEventListener("resize", scroller.resize);