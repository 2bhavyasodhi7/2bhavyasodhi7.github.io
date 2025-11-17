// Global Variables
let currentPage = 'page-1';
let selectedOptions = {
    travel: null,
    food: [],
    activities: []
};
let totalPrice = 0;
let priceChart = null;
let selectedCity = null;
let currentCurrency = 'INR';

// City-specific travel prices (in INR)
const cityTravelPrices = {
    paris: { train: 14999, road: 12499, economy: 24999, premium: 37499, business: 54999, first: 94999, private: 199999 },
    tokyo: { train: 12999, road: 10499, economy: 22999, premium: 35499, business: 52999, first: 92999, private: 189999 },
    rome: { train: 13499, road: 10999, economy: 23999, premium: 36499, business: 53999, first: 93999, private: 194999 },
    bali: { train: 11999, road: 9499, economy: 21999, premium: 34499, business: 51999, first: 91999, private: 184999 },
    newyork: { train: 15999, road: 13499, economy: 25999, premium: 38499, business: 55999, first: 95999, private: 204999 }
};

// NEW: Food packages data (base prices in INR)
const foodPackages = [
    { name: 'Street Food Tour', desc: 'Local delicacies', price: 2999, color: 'orange-600', key: 'street' },
    { name: 'Local Cuisine', desc: 'Authentic flavors', price: 5499, color: 'blue-600', key: 'local' },
    { name: 'Vegetarian Special', desc: 'Plant-based meals', price: 8999, color: 'green-600', key: 'vegetarian' },
    { name: 'International Dining', desc: 'Global tastes', price: 12499, color: 'purple-600', key: 'international' },
    { name: 'Seafood Deluxe', desc: 'Ocean fresh', price: 17499, color: 'teal-600', key: 'seafood' },
    { name: 'Gourmet Experience', desc: 'Michelin stars', price: 24999, color: 'pink-600', key: 'gourmet' },
    { name: 'Wine & Dine', desc: 'Premium pairing', price: 34999, color: 'red-600', key: 'wine' }
];

// NEW: Activity packages data (base prices in INR)
const activityPackages = [
    { name: 'City Sightseeing', desc: 'Must-see attractions', price: 1999, color: 'indigo-600', key: 'sightseeing' },
    { name: 'Museum Pass', desc: 'Cultural access', price: 3499, color: 'blue-600', key: 'museum' },
    { name: 'Adventure Tours', desc: 'Thrilling experiences', price: 5499, color: 'orange-600', key: 'adventure' },
    { name: 'Water Sports', desc: 'Beach activities', price: 7499, color: 'green-600', key: 'water' },
    { name: 'Nightlife Experience', desc: 'Evening entertainment', price: 6499, color: 'purple-600', key: 'nightlife' },
    { name: 'Cultural Experiences', desc: 'Deep immersion', price: 8999, color: 'pink-600', key: 'cultural' },
    { name: 'Spa & Wellness', desc: 'Relaxation & health', price: 12499, color: 'teal-600', key: 'spa' },
    { name: 'Shopping Tour', desc: 'Retail therapy', price: 5999, color: 'red-600', key: 'shopping' }
];

// NEW: Currency conversion rates
const currencyRates = {
    INR: { symbol: '₹', rate: 1 },
    EUR: { symbol: '€', rate: 0.011 },
    USD: { symbol: '$', rate: 0.012 },
    JPY: { symbol: '¥', rate: 1.80 },
    IDR: { symbol: 'Rp', rate: 192 }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupFormValidation();
    setupPageNavigation();
    setupPriceCalculator();
    setupScrollEffects();
    setupAnimations();
    setupExploreButtons();
    setupAdditionalExploreButtons();
    setupDestinationFilter();
    initializePriceChart();
    setupCurrencySelector();
    renderFoodOptions();
    renderActivityOptions();
    loadState();
    console.log('VoyageFlow initialized successfully');
}

// NEW: Check if city is international
function isInternationalCity(cityId) {
    return ['paris', 'tokyo', 'rome', 'bali', 'newyork'].includes(cityId);
}

// NEW: Format price based on current currency
function formatPrice(amount) {
    const currency = currencyRates[currentCurrency];
    const convertedAmount = amount * currency.rate;
    
    if (currentCurrency === 'INR' || currentCurrency === 'IDR') {
        return `${currency.symbol}${convertedAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    } else {
        return `${currency.symbol}${convertedAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    }
}

// NEW: Render food options dynamically
function renderFoodOptions() {
    const container = document.getElementById('foodOptionsContainer');
    if (!container) return;

    container.innerHTML = foodPackages.map(pkg => `
        <div class="price-option border-2 border-gray-200 rounded-lg p-4" data-price="${pkg.price}" data-category="food">
            <div class="flex justify-between items-center">
                <div>
                    <h4 class="font-semibold text-gray-800">${pkg.name}</h4>
                    <p class="text-sm text-gray-600">${pkg.desc}</p>
                </div>
                <div class="text-right">
                    <div class="font-bold text-lg text-${pkg.color}">${formatPrice(pkg.price)}</div>
                </div>
            </div>
        </div>
    `).join('');

    // Restore selections
    if (selectedOptions.food.length > 0) {
        selectedOptions.food.forEach(option => {
            const element = container.querySelector(`[data-price="${option.price}"]`);
            if (element) {
                element.classList.add('selected');
                option.element = element;
            }
        });
    }
}

// NEW: Render activity options dynamically
function renderActivityOptions() {
    const container = document.getElementById('activityOptionsContainer');
    if (!container) return;

    container.innerHTML = activityPackages.map(pkg => `
        <div class="price-option border-2 border-gray-200 rounded-lg p-4" data-price="${pkg.price}" data-category="activities">
            <div class="flex justify-between items-center">
                <div>
                    <h4 class="font-semibold text-gray-800">${pkg.name}</h4>
                    <p class="text-sm text-gray-600">${pkg.desc}</p>
                </div>
                <div class="text-right">
                    <div class="font-bold text-lg text-${pkg.color}">${formatPrice(pkg.price)}</div>
                </div>
            </div>
        </div>
    `).join('');

    // Restore selections
    if (selectedOptions.activities.length > 0) {
        selectedOptions.activities.forEach(option => {
            const element = container.querySelector(`[data-price="${option.price}"]`);
            if (element) {
                element.classList.add('selected');
                option.element = element;
            }
        });
    }
}

function setupPriceCalculator() {
    document.addEventListener('click', function(e) {
        const option = e.target.closest('.price-option');
        if (!option) return;
       
        const category = option.getAttribute('data-category');
        if (!category) return;
       
        const price = parseInt(option.getAttribute('data-price'));
        if (isNaN(price)) return;
       
        if (category === 'travel') {
            const wasSelected = option.classList.contains('selected');
            document.querySelectorAll('.price-option[data-category="travel"]').forEach(opt => {
                opt.classList.remove('selected');
            });
            if (!wasSelected) {
                option.classList.add('selected');
                selectedOptions.travel = { element: option, price: price };
            } else {
                selectedOptions.travel = null;
            }
        } else {
            const isSelected = option.classList.contains('selected');
            if (isSelected) {
                option.classList.remove('selected');
                selectedOptions[category] = selectedOptions[category].filter(item => item.element !== option);
            } else {
                option.classList.add('selected');
                selectedOptions[category].push({ element: option, price: price });
            }
        }
       
        updateTotalPrice();
        updatePriceChart();
        updatePriceDetailsList();
        saveState();
    });
}

function setupFormValidation() {
    const form = document.getElementById('registrationForm');
    const inputs = form.querySelectorAll('input');
    const submitBtn = document.getElementById('submitBtn');
   
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
            updateSubmitButton();
        });
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
   
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission();
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldId = field.id;
    let isValid = true;
    let errorMessage = '';
   
    field.classList.remove('error', 'valid');
    hideMessage(fieldId + 'Error');
    hideMessage(fieldId + 'Success');
   
    switch(fieldId) {
        case 'fullName':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long';
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
        case 'phone':
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Phone number must be exactly 10 digits';
            } else {
                showMessage(fieldId + 'Success');
            }
            break;
        case 'pin':
            const pinRegex = /^\d{6}$/;
            if (!pinRegex.test(value)) {
                isValid = false;
                errorMessage = 'PIN code must be exactly 6 digits';
            } else {
                showMessage(fieldId + 'Success');
            }
            break;
    }
   
    if (!isValid) {
        field.classList.add('error');
        showMessage(fieldId + 'Error', errorMessage);
    } else if (fieldId !== 'phone' && fieldId !== 'pin') {
        field.classList.add('valid');
    }
   
    return isValid;
}

function updateSubmitButton() {
    const form = document.getElementById('registrationForm');
    const submitBtn = document.getElementById('submitBtn');
    const inputs = form.querySelectorAll('input');
    let allValid = true;
   
    inputs.forEach(input => {
        if (!input.value.trim() || input.classList.contains('error')) {
            allValid = false;
        }
    });
   
    submitBtn.disabled = !allValid;
}

function handleFormSubmission() {
    const form = document.getElementById('registrationForm');
    const inputs = form.querySelectorAll('input');
    let allValid = true;
   
    inputs.forEach(input => {
        if (!validateField(input)) {
            allValid = false;
        }
    });
   
    if (allValid) {
        showSuccessModal();
        saveRegistrationData();
    }
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    const progressBar = document.getElementById('progressBar');
   
    modal.classList.remove('hidden');
    anime({
        targets: progressBar,
        width: '100%',
        duration: 2000,
        easing: 'easeInOutQuad',
        complete: function() {
            setTimeout(() => {
                modal.classList.add('hidden');
                showPage('page-2');
            }, 500);
        }
    });
}

function setupPageNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            showPage(targetPage);
        });
    });
   
    const destinationLinks = document.querySelectorAll('a[href^="#"]');
    destinationLinks.forEach(link => {
        if (!link.hasAttribute('data-page')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    });
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page-container');
    pages.forEach(page => page.classList.remove('active'));
   
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;
        updateNavigationState();
       
        if (pageId === 'page-3') {
            updateTravelPricesForCity();
        }
        if (pageId === 'page-4') initializeConfirmationPage();
       
        saveState();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateNavigationState() {
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === currentPage) {
            link.classList.add('active');
        }
    });
}

function updateTotalPrice() {
    let oldTotal = totalPrice;
    totalPrice = 0;
   
    if (selectedOptions.travel) {
        totalPrice += selectedOptions.travel.price;
    }
   
    selectedOptions.food.forEach(option => {
        totalPrice += option.price;
    });
   
    selectedOptions.activities.forEach(option => {
        totalPrice += option.price;
    });
   
    const priceElement = document.getElementById('totalPrice');
    if (priceElement) {
        anime({
            targets: { value: oldTotal },
            value: totalPrice,
            duration: 800,
            easing: 'easeOutQuart',
            update: function(anim) {
                const value = Math.round(anim.animatables[0].target.value);
                priceElement.textContent = formatPrice(value);
            }
        });
    }
}

// NEW: Setup currency selector event listener
function setupCurrencySelector() {
    const currencySelector = document.getElementById('currencySelector');
    if (currencySelector) {
        currencySelector.addEventListener('change', function() {
            currentCurrency = this.value;
            updateTravelPricesForCity();
            renderFoodOptions();
            renderActivityOptions();
            updateTotalPrice();
            updatePriceChart();
            updatePriceDetailsList();
        });
    }
}

function updateTravelPricesForCity() {
    if (!selectedCity || !cityTravelPrices[selectedCity]) return;
   
    const prices = cityTravelPrices[selectedCity];
    const container = document.getElementById('travelOptionsContainer');
   
    const travelOptions = [
        { key: 'train', name: 'Train Journey', desc: 'Scenic rail routes', color: 'blue-600' },
        { key: 'road', name: 'Road Trip', desc: 'Drive yourself', color: 'green-600' },
        { key: 'economy', name: 'Economy Flight', desc: 'Standard comfort', color: 'orange-600' },
        { key: 'premium', name: 'Premium Economy', desc: 'Extra legroom', color: 'purple-600' },
        { key: 'business', name: 'Business Class', desc: 'Premium comfort', color: 'red-600' },
        { key: 'first', name: 'First Class', desc: 'Ultimate luxury', color: 'pink-600' },
        { key: 'private', name: 'Private Jet', desc: 'Exclusive charter', color: 'indigo-600' }
    ];
   
    const selectedTravelPrice = selectedOptions.travel ? selectedOptions.travel.price : null;
   
    container.innerHTML = travelOptions.map(option => `
        <div class="price-option border-2 border-gray-200 rounded-lg p-4" data-price="${prices[option.key]}" data-category="travel">
            <div class="flex justify-between items-center">
                <div>
                    <h4 class="font-semibold text-gray-800">${option.name}</h4>
                    <p class="text-sm text-gray-600">${option.desc}</p>
                </div>
                <div class="text-right">
                    <div class="font-bold text-lg text-${option.color}">${formatPrice(prices[option.key])}</div>
                </div>
            </div>
        </div>
    `).join('');
   
    if (selectedTravelPrice) {
        const selectedElement = container.querySelector(`[data-price="${selectedTravelPrice}"]`);
        if (selectedElement) {
            selectedElement.classList.add('selected');
            selectedOptions.travel = { element: selectedElement, price: selectedTravelPrice };
        } else {
            selectedOptions.travel = null;
        }
    }
    
    const currencySelectorContainer = document.getElementById('currencySelectorContainer');
    if (currencySelectorContainer) {
        if (isInternationalCity(selectedCity)) {
            currencySelectorContainer.classList.remove('hidden');
        } else {
            currencySelectorContainer.classList.add('hidden');
            currentCurrency = 'INR';
            document.getElementById('currencySelector').value = 'INR';
            renderFoodOptions();
            renderActivityOptions();
        }
    }
}

function setupScrollEffects() {
    window.addEventListener('scroll', function() {
        updateScrollProgress();
        handleScrollAnimations();
    });
}

function updateScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    }
}

function handleScrollAnimations() {
    const elements = document.querySelectorAll('.destination-card');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
       
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

function setupAnimations() {
    anime({
        targets: '.floating-element',
        translateY: [-20, 0],
        opacity: [0, 0.1],
        duration: 2000,
        delay: anime.stagger(200),
        easing: 'easeOutQuart'
    });
   
    const destinationCards = document.querySelectorAll('.destination-card');
    destinationCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
       
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime({
                        targets: entry.target,
                        opacity: [0, 1],
                        translateY: [50, 0],
                        duration: 800,
                        delay: index * 100,
                        easing: 'easeOutQuart'
                    });
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(card);
    });
}

function showMessage(elementId, message = '') {
    const element = document.getElementById(elementId);
    if (element) {
        if (message) element.textContent = message;
        element.classList.add('show');
    }
}

function hideMessage(elementId) {
    const element = document.getElementById(elementId);
    if (element) element.classList.remove('show');
}

function saveRegistrationData() {
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        pin: document.getElementById('pin').value,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('voyageflow-registration', JSON.stringify(formData));
}

function saveState() {
    const state = {
        currentPage: currentPage,
        selectedOptions: selectedOptions,
        totalPrice: totalPrice,
        selectedCity: selectedCity,
        currentCurrency: currentCurrency
    };
    localStorage.setItem('voyageflow-state', JSON.stringify(state));
}

function loadState() {
    const savedState = localStorage.getItem('voyageflow-state');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
           
            if (state.selectedOptions) {
                selectedOptions = state.selectedOptions;
                Object.entries(selectedOptions).forEach(([category, options]) => {
                    if (options) {
                        if (category === 'travel' && options.element) {
                            const element = document.querySelector(`[data-category="travel"][data-price="${options.price}"]`);
                            if (element) {
                                element.classList.add('selected');
                                selectedOptions.travel.element = element;
                            }
                        } else if (Array.isArray(options)) {
                            options.forEach(option => {
                                if (option.element && option.price !== undefined) {
                                    const element = document.querySelector(`[data-category="${category}"][data-price="${option.price}"]`);
                                    if (element) {
                                        element.classList.add('selected');
                                        option.element = element;
                                    }
                                }
                            });
                        }
                    }
                });
            }
           
            if (state.totalPrice) {
                totalPrice = state.totalPrice;
                const priceElement = document.getElementById('totalPrice');
                if (priceElement) priceElement.textContent = formatPrice(totalPrice);
            }
           
            if (state.selectedCity) selectedCity = state.selectedCity;
            if (state.currentCurrency) currentCurrency = state.currentCurrency;
            if (state.currentPage && state.currentPage !== 'page-1') {
                showPage(state.currentPage);
            }
        } catch (error) {
            console.error('Error loading saved state:', error);
        }
    }
}

function startOver() {
    selectedOptions = { travel: null, food: [], activities: [] };
    totalPrice = 0;
    selectedCity = null;
    currentCurrency = 'INR';
    document.querySelectorAll('.price-option').forEach(opt => opt.classList.remove('selected'));
    const container = document.getElementById('travelOptionsContainer');
    if (container) container.innerHTML = '';
    const form = document.getElementById('registrationForm');
    if (form) form.reset();
    localStorage.removeItem('voyageflow-state');
    localStorage.removeItem('voyageflow-registration');
    const priceElement = document.getElementById('totalPrice');
    if (priceElement) priceElement.textContent = formatPrice(0);
    if (priceChart) priceChart.clear();
    document.getElementById('currencySelector').value = 'INR';
    document.getElementById('currencySelectorContainer').classList.add('hidden');
    showPage('page-1');
}

// City Details Modal Functions
function setupExploreButtons() {
    const cityDetails = {
        paris: {
            title: "Paris, France",
            image: "https://wallpaperaccess.com/full/383916.jpg",
            description: "Experience the City of Light in all its glory. From the iconic Eiffel Tower to the world-renowned Louvre Museum, Paris offers an unparalleled blend of art, culture, and romance. Stroll along the Seine, indulge in exquisite French cuisine, and immerse yourself in the timeless elegance that has captivated visitors for centuries.",
            attractions: ["Eiffel Tower & Seine River Cruises", "Louvre Museum & Mona Lisa", "Champs-Élysées & Arc de Triomphe", "Montmartre & Sacré-Cœur", "Notre-Dame Cathedral"],
            bestTime: "April to June & September to October",
            travelTips: "Book museum tickets in advance, learn basic French phrases, use metro for transport, try local bistros"
        },
        tokyo: {
            title: "Tokyo, Japan",
            image: "https://wallpaperaccess.com/full/26365.jpg",
            description: "Discover the perfect harmony of ancient tradition and cutting-edge technology. Experience the energy of Shibuya Crossing, find tranquility in cherry blossom season, and savor world-class sushi. Tokyo offers a unique journey through time where futuristic skyscrapers stand beside historic temples.",
            attractions: ["Shibuya Crossing & Harajuku", "Senso-ji Temple in Asakusa", "Mount Fuji day trips", "Tsukiji Fish Market", "Cherry blossom viewing in spring"],
            bestTime: "March to May & September to November",
            travelTips: "Get JR Pass for trains, try convenience store food, respect local customs, carry cash"
        },
        rome: {
            title: "Rome, Italy",
            image: "https://wallpaperaccess.com/full/129471.jpg",
            description: "Step into the eternal city where history comes alive at every corner. Marvel at the Colosseum's grandeur, explore the Vatican's treasures, and indulge in authentic Italian cuisine. Rome offers an immersive journey through 3,000 years of civilization, art, and culinary excellence.",
            attractions: ["Colosseum & Roman Forum", "Vatican Museums & Sistine Chapel", "Trevi Fountain & Spanish Steps", "Pantheon & Piazza Navona", "Trastevere neighborhood"],
            bestTime: "April to June & September to October",
            travelTips: "Buy skip-the-line tickets, dress modestly for churches, try gelato, explore on foot"
        },
        bali: {
            title: "Bali, Indonesia",
            image: "https://wallpaperaccess.com/full/3525907.jpg",
            description: "Find your paradise in the Island of Gods. Experience spiritual awakening in Ubud's rice terraces, practice yoga in serene retreats, and discover ancient temples. Bali offers a perfect blend of natural beauty, spiritual culture, and tropical relaxation that will rejuvenate your soul.",
            attractions: ["Ubud Rice Terraces & Monkey Forest", "Uluwatu Temple & Kecak Dance", "Seminyak Beach & Sunset", "Tirta Empul Holy Spring Temple", "Mount Batur sunrise trek"],
            bestTime: "April to October (dry season)",
            travelTips: "Respect temple dress codes, try local warungs, bargain at markets, stay hydrated"
        },
        newyork: {
            title: "New York City, USA",
            image: "https://wallpaperaccess.com/full/283006.jpg",
            description: "Experience the city that never sleeps in all its vibrant energy. From the bright lights of Times Square to the tranquility of Central Park, New York offers an unparalleled urban adventure. Catch a Broadway show, explore diverse neighborhoods, and feel the pulse of American culture.",
            attractions: ["Times Square & Broadway Shows", "Central Park & Statue of Liberty", "Empire State Building", "Metropolitan Museum of Art", "Brooklyn Bridge & DUMBO"],
            bestTime: "April to June & September to November",
            travelTips: "Buy NYC Pass for attractions, use subway, book Broadway tickets early, tip 15-20%"
        }
    };
    const exploreButtons = document.querySelectorAll('#paris button, #tokyo button, #rome button, #bali button, #newyork button');
    exploreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.closest('section');
            const cityId = section.id;
            openCityDetailsModal(cityId, cityDetails);
        });
    });
}

function openCityDetailsModal(cityId, cityData) {
    const modal = document.getElementById('cityDetailsModal');
    const title = document.getElementById('cityDetailsTitle');
    const content = document.getElementById('cityDetailsContent');
   
    const city = cityData[cityId];
    if (!city) return;
   
    title.textContent = city.title;
    content.innerHTML = `
        <img src="${city.image}" alt="${city.title}" class="w-full h-64 object-cover rounded-lg mb-6">
        <p class="text-gray-700 text-lg leading-relaxed mb-6">${city.description}</p>
       
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <h4 class="font-semibold text-gray-800 mb-3 text-lg">🎯 Top Attractions</h4>
                <ul class="space-y-2">
                    ${city.attractions.map(attraction => `<li class="flex items-start"><span class="text-blue-600 mr-2">•</span><span class="text-gray-600">${attraction}</span></li>`).join('')}
                </ul>
            </div>
            <div>
                <h4 class="font-semibold text-gray-800 mb-3 text-lg">💡 Travel Tips</h4>
                <p class="text-gray-600 mb-3"><strong>Best Time:</strong> ${city.bestTime}</p>
                <p class="text-gray-600"><strong>Tips:</strong> ${city.travelTips}</p>
            </div>
        </div>
       
        <div class="text-center pt-4 border-t border-gray-200">
            <button onclick="selectCityAndShowCalculator('${cityId}')" class="btn-secondary px-6 py-3 text-white rounded-lg font-semibold">
                Plan Trip to ${city.title.split(',')[0]}
            </button>
        </div>
    `;
   
    modal.classList.remove('hidden');
    anime({
        targets: modal.querySelector('.modal-content'),
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutQuad'
    });
}

function closeCityDetailsModal() {
    const modal = document.getElementById('cityDetailsModal');
    anime({
        targets: modal.querySelector('.modal-content'),
        scale: [1, 0.8],
        opacity: [1, 0],
        duration: 300,
        easing: 'easeInQuad',
        complete: () => modal.classList.add('hidden')
    });
}

function selectCityAndShowCalculator(cityId) {
    selectedCity = cityId;
    closeCityDetailsModal();
    showPage('page-3');
}

function initializePriceChart() {
    const chartElement = document.getElementById('priceChart');
    if (chartElement) {
        priceChart = echarts.init(chartElement);
        updatePriceChart();
    }
}

function updatePriceChart() {
    if (!priceChart) return;
   
    const data = [];
   
    if (selectedOptions.travel && selectedOptions.travel.element) {
        const name = selectedOptions.travel.element.querySelector('h4')?.textContent || 'Travel';
        data.push({ name: name, value: selectedOptions.travel.price });
    }
   
    selectedOptions.food.forEach(option => {
        if (option.element) {
            const name = option.element.querySelector('h4')?.textContent || 'Food';
            data.push({ name: name, value: option.price });
        }
    });
   
    selectedOptions.activities.forEach(option => {
        if (option.element) {
            const name = option.element.querySelector('h4')?.textContent || 'Activity';
            data.push({ name: name, value: option.price });
        }
    });
   
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: ' + currencyRates[currentCurrency].symbol + '{c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: '0%',
            bottom: '10%',
            data: data.map(item => item.name)
        },
        series: [{
            name: 'Trip Cost',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: { show: false, position: 'center' },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '16',
                    fontWeight: 'bold',
                    formatter: function(params) {
                        return params.name + '\n' + currencyRates[currentCurrency].symbol + params.value;
                    }
                }
            },
            labelLine: { show: false },
            data: data,
            color: ['#1e3a8a', '#f97316', '#10b981', '#fbbf24', '#ec4899', '#8b5cf6', '#06b6d4', '#84cc16', '#f59e0b']
        }]
    };
   
    priceChart.setOption(option);
}

// NEW: Update price details list with animations
function updatePriceDetailsList() {
    const detailsList = document.getElementById('priceDetailsList');
    if (!detailsList) return;
    
    detailsList.innerHTML = '';
    
    const allOptions = [];
    
    if (selectedOptions.travel && selectedOptions.travel.element) {
        const name = selectedOptions.travel.element.querySelector('h4')?.textContent || 'Travel';
        allOptions.push({ name, price: selectedOptions.travel.price, category: 'Travel' });
    }
    
    selectedOptions.food.forEach(option => {
        if (option.element) {
            const name = option.element.querySelector('h4')?.textContent || 'Food';
            allOptions.push({ name, price: option.price, category: 'Food' });
        }
    });
    
    selectedOptions.activities.forEach(option => {
        if (option.element) {
            const name = option.element.querySelector('h4')?.textContent || 'Activity';
            allOptions.push({ name, price: option.price, category: 'Activity' });
        }
    });
    
    allOptions.forEach((option, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'price-item flex justify-between items-center p-3 bg-gray-50 rounded-lg border-l-4 border-blue-600';
        itemDiv.innerHTML = `
            <div>
                <span class="font-semibold text-gray-800">${option.name}</span>
                <span class="text-xs text-gray-500 ml-2">${option.category}</span>
            </div>
            <div class="font-bold text-gray-800">${formatPrice(option.price)}</div>
        `;
        detailsList.appendChild(itemDiv);
        
        setTimeout(() => {
            itemDiv.classList.add('show');
        }, index * 100);
    });
    
    if (allOptions.length > 0) {
        const totalDiv = document.createElement('div');
        totalDiv.className = 'price-item flex justify-between items-center p-4 bg-blue-100 rounded-lg border-l-4 border-blue-600 mt-4';
        totalDiv.innerHTML = `
            <div class="font-bold text-gray-800 text-lg">Total</div>
            <div class="font-bold text-gray-800 text-lg">${formatPrice(totalPrice)}</div>
        `;
        detailsList.appendChild(totalDiv);
        setTimeout(() => {
            totalDiv.classList.add('show');
        }, allOptions.length * 100);
    }
}

function confirmBooking() {
    if (!selectedOptions.travel) {
        alert('Please select a travel option before confirming.');
        return;
    }
    showConfirmationModal();
}

function showConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    modal.classList.remove('hidden');
}

function closeConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    modal.classList.add('hidden');
}

function proceedToConfirmation() {
    closeConfirmationModal();
    showPage('page-4');
}

function initializeConfirmationPage() {
    const finalTotalElement = document.getElementById('finalTotal');
    if (finalTotalElement) {
        finalTotalElement.textContent = formatPrice(totalPrice);
    }
   
    const selectedOptionsElement = document.getElementById('selectedOptions');
    if (selectedOptionsElement) {
        selectedOptionsElement.innerHTML = '';
       
        if (selectedOptions.travel && selectedOptions.travel.element) {
            const travelDiv = document.createElement('div');
            const travelName = selectedOptions.travel.element.querySelector('h4')?.textContent || 'Travel Option';
            travelDiv.innerHTML = `<strong>🚗 Travel:</strong> ${travelName}`;
            selectedOptionsElement.appendChild(travelDiv);
        }
       
        if (selectedOptions.food.length > 0) {
            const foodDiv = document.createElement('div');
            const foodNames = selectedOptions.food
                .filter(option => option.element)
                .map(option => option.element.querySelector('h4')?.textContent || 'Food Option')
                .join(', ');
            foodDiv.innerHTML = `<strong>🍽️ Food:</strong> ${foodNames}`;
            selectedOptionsElement.appendChild(foodDiv);
        }
       
        if (selectedOptions.activities.length > 0) {
            const activitiesDiv = document.createElement('div');
            const activityNames = selectedOptions.activities
                .filter(option => option.element)
                .map(option => option.element.querySelector('h4')?.textContent || 'Activity')
                .join(', ');
            activitiesDiv.innerHTML = `<strong>🎯 Activities:</strong> ${activityNames}`;
            selectedOptionsElement.appendChild(activitiesDiv);
        }
    }
   
    startConfettiAnimation();
    initializeTypewriter();
}

function startConfettiAnimation() {
    const confettiContainer = document.getElementById('confettiContainer');
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = ['#1e3a8a', '#f97316', '#10b981', '#fbbf24', '#ec4899'][Math.floor(Math.random() * 5)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confettiContainer.appendChild(confetti);
        anime({
            targets: confetti,
            translateY: window.innerHeight + 100,
            translateX: (Math.random() - 0.5) * 200,
            rotate: Math.random() * 360,
            opacity: [1, 0],
            duration: Math.random() * 3000 + 2000,
            easing: 'easeInQuad',
            complete: function() {
                confetti.remove();
            }
        });
    }
}

function initializeTypewriter() {
    const thankYouElement = document.getElementById('thankYouText');
    if (thankYouElement && !thankYouElement.hasAttribute('data-typed')) {
        thankYouElement.setAttribute('data-typed', 'true');
        thankYouElement.textContent = '';
        new Typed('#thankYouText', {
            strings: ['Congratulations!', 'Your Journey Awaits!', 'Adventure Begins Now!'],
            typeSpeed: 80,
            backSpeed: 50,
            backDelay: 2000,
            loop: false,
            showCursor: false
        });
    }
}

// Indian Destinations & Filter Functionality
const additionalCityDetails = {
    jaipur: {
        title: "Jaipur, Rajasthan",
        image: "https://wallpaperaccess.com/full/1266890.jpg",
        description: "Experience the royal heritage of Rajasthan in the Pink City. Explore magnificent forts, palaces, and vibrant bazaars. Jaipur offers a perfect blend of history, architecture, and culture that transports you to the era of Maharajas.",
        attractions: ["Amber Fort & Elephant Ride", "Hawa Mahal & City Palace", "Jantar Mantar Observatory", "Local Bazaars & Handicrafts", "Rajasthani Folk Performances"],
        bestTime: "October to March",
        travelTips: "Hire a local guide, try Rajasthani thali, bargain in bazaars, stay in heritage hotels"
    },
    kerala: {
        title: "Kerala - God's Own Country",
        image: "https://wallpaperaccess.com/full/1635209.jpg",
        description: "Discover tranquility in God's Own Country. Cruise through serene backwaters, experience Ayurvedic wellness, and enjoy lush green landscapes. Kerala offers a rejuvenating tropical escape with its unique culture and natural beauty.",
        attractions: ["Alleppey Backwaters & Houseboats", "Munnar Tea Plantations", "Kochi Fort & Chinese Nets", "Kathakali Performances", "Periyar Wildlife Sanctuary"],
        bestTime: "September to March",
        travelTips: "Book houseboats in advance, try Ayurvedic massage, taste Kerala sadya, carry mosquito repellent"
    },
    goa: {
        title: "Goa - Beach Paradise",
        image: "https://wallpaperaccess.com/full/14949598.jpg",
        description: "Find your bliss in Goa's sun-kissed beaches and vibrant nightlife. From Portuguese heritage to seafood delights, Goa offers the perfect coastal getaway with a unique blend of Indian and European cultures.",
        attractions: ["Calangute & Baga Beaches", "Basilica of Bom Jesus", "Dudhsagar Waterfalls", "Fontainhas Latin Quarter", "Anjuna Flea Market"],
        bestTime: "November to February",
        travelTips: "Rent a scooter for travel, try seafood shacks, visit both North & South Goa, respect beach safety"
    },
    udaipur: {
        title: "Udaipur - City of Lakes",
        image: "https://wallpaperaccess.com/full/6373674.jpg",
        description: "Fall in love with the romantic City of Lakes. With its stunning palaces, tranquil lakes, and royal charm, Udaipur is a dream destination for every traveler seeking beauty and serenity.",
        attractions: ["Lake Pichola Boat Ride", "City Palace & Museum", "Jag Mandir & Jag Niwas", "Sunset at Monsoon Palace", "Vintage Car Museum"],
        bestTime: "September to March",
        travelTips: "Book lake-view hotels, enjoy rooftop dining, visit during festivals, shop for mini paintings"
    },
    leh: {
        title: "Leh - Himalayan Adventure",
        image: "https://wallpaperaccess.com/full/1398665.jpg",
        description: "Conquer the Himalayas in Leh-Ladakh. Experience dramatic landscapes, Buddhist monasteries, and thrilling adventures at one of the highest inhabited places on Earth.",
        attractions: ["Pangong Tso Lake", "Nubra Valley & Diskit Monastery", "Khardung La Pass", "Thiksey & Hemis Monasteries", "Magnetic Hill"],
        bestTime: "May to September",
        travelTips: "Acclimatize for altitude, carry altitude sickness meds, pack warm clothes, get inner line permits"
    },
    amritsar: {
        title: "Amritsar - Spiritual Journey",
        image: "https://imgs.search.brave.com/bNGdjaYBxL4enjvjGnn3VsinV_TaXtgT94je_1PU1MA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi93YWdh/aC1ib3JkZXItd2Fn/YWgtYm9yZGVyLWF0/dGFyaS1wdW5qYWIt/YW1yaXRzYXItY3Jv/d2QtaW5kaWEtMTYy/NzI3ODMyLmpwZw",
        description: "Experience spiritual bliss in Amritsar. Visit the Golden Temple, witness the Wagah Border ceremony, and savor authentic Punjabi cuisine in this sacred city that embodies the heart of Sikh culture.",
        attractions: ["Golden Temple & Langar", "Wagah Border Ceremony", "Jallianwala Bagh", "Partition Museum", "Amritsari Food Tour"],
        bestTime: "October to March",
        travelTips: "Cover head at Golden Temple, try langar food, arrive early for Wagah ceremony, taste Amritsari kulcha"
    }
};

function setupAdditionalExploreButtons() {
    const indianCityIds = ['jaipur', 'kerala', 'goa', 'udaipur', 'leh', 'amritsar'];
    const exploreButtons = document.querySelectorAll(
        indianCityIds.map(id => `#${id} button`).join(', ')
    );
    
    exploreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.closest('section');
            const cityId = section.id;
            openCityDetailsModal(cityId, additionalCityDetails);
        });
    });
}

function setupDestinationFilter() {
    const filterIndiaBtn = document.getElementById('filterIndia');
    const filterInternationalBtn = document.getElementById('filterInternational');
    if (!filterIndiaBtn || !filterInternationalBtn) return;
    
    function showIndianDestinations() {
        document.querySelectorAll('#paris, #tokyo, #rome, #bali, #newyork').forEach(section => {
            section.style.display = 'none';
        });
        document.querySelectorAll('#jaipur, #kerala, #goa, #udaipur, #leh, #amritsar').forEach(section => {
            section.style.display = 'block';
        });
        filterIndiaBtn.classList.add('bg-blue-600', 'text-white');
        filterIndiaBtn.classList.remove('bg-gray-200', 'text-gray-700');
        filterInternationalBtn.classList.add('bg-gray-200', 'text-gray-700');
        filterInternationalBtn.classList.remove('bg-blue-600', 'text-white');
        document.getElementById('navLinks').classList.add('india-mode');
    }
    
    function showInternationalDestinations() {
        document.querySelectorAll('#paris, #tokyo, #rome, #bali, #newyork, #jaipur, #kerala, #goa, #udaipur, #leh, #amritsar').forEach(section => {
            section.style.display = 'block';
        });
        filterInternationalBtn.classList.add('bg-blue-600', 'text-white');
        filterInternationalBtn.classList.remove('bg-gray-200', 'text-gray-700');
        filterIndiaBtn.classList.add('bg-gray-200', 'text-gray-700');
        filterIndiaBtn.classList.remove('bg-blue-600', 'text-white');
        document.getElementById('navLinks').classList.remove('india-mode');
    }
    
    filterIndiaBtn.addEventListener('click', showIndianDestinations);
    filterInternationalBtn.addEventListener('click', showInternationalDestinations);
    filterInternationalBtn.click();
}

// Add Indian cities to travel prices
cityTravelPrices.jaipur = { train: 4999, road: 2999, economy: 8999, premium: 14999, business: 24999, first: 44999, private: 89999 };
cityTravelPrices.kerala = { train: 5999, road: 3999, economy: 9999, premium: 15999, business: 25999, first: 45999, private: 91999 };
cityTravelPrices.goa = { train: 5499, road: 3499, economy: 9499, premium: 15499, business: 25499, first: 45499, private: 90999 };
cityTravelPrices.udaipur = { train: 4799, road: 2799, economy: 8799, premium: 14799, business: 24799, first: 44799, private: 89799 };
cityTravelPrices.leh = { train: 8999, road: 6999, economy: 14999, premium: 22499, business: 34999, first: 54999, private: 109999 };
cityTravelPrices.amritsar = { train: 5299, road: 3299, economy: 9299, premium: 15299, business: 25299, first: 45299, private: 90299 };
