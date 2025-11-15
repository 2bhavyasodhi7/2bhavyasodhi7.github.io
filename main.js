// VoyageFlow - Main JavaScript File
// Interactive Travel Experience Simulator
// Global Variables
let currentPage = 'page-1';
let selectedOptions = {
    travel: null,
    food: [], // Changed to array for multiple selections
    activities: [] // Changed to array for multiple selections
};
let totalPrice = 0;
let priceChart = null;
let selectedCity = null;
// City-specific travel prices (in INR)
const cityTravelPrices = {
    paris: { train: 14999, road: 12499, economy: 24999, premium: 37499, business: 54999, first: 94999, private: 199999 },
    tokyo: { train: 12999, road: 10499, economy: 22999, premium: 35499, business: 52999, first: 92999, private: 189999 },
    rome: { train: 13499, road: 10999, economy: 23999, premium: 36499, business: 53999, first: 93999, private: 194999 },
    bali: { train: 11999, road: 9499, economy: 21999, premium: 34499, business: 51999, first: 91999, private: 184999 },
    newyork: { train: 15999, road: 13499, economy: 25999, premium: 38499, business: 55999, first: 95999, private: 204999 }
};
// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});
function initializeApp() {
    setupFormValidation();
    setupPageNavigation();
    setupPriceCalculator(); // FIX: Use unified event delegation
    setupScrollEffects();
    setupAnimations();
    setupExploreButtons();
    initializePriceChart();
    loadState();
    console.log('VoyageFlow initialized successfully');
}
function setupPriceCalculator() {
    // FIX: Use event delegation on document for all price-option clicks
    document.addEventListener('click', function(e) {
        const option = e.target.closest('.price-option');
        if (!option) return; // Not clicking on a price option
       
        const category = option.getAttribute('data-category');
        if (!category) return;
       
        const price = parseInt(option.getAttribute('data-price'));
        if (isNaN(price)) return;
       
        if (category === 'travel') {
            // Single selection with deselect capability
            const wasSelected = option.classList.contains('selected');
            // Deselect all in travel category
            document.querySelectorAll('.price-option[data-category="travel"]').forEach(opt => {
                opt.classList.remove('selected');
            });
            if (!wasSelected) {
                // Select only if not already selected
                option.classList.add('selected');
                selectedOptions.travel = {
                    element: option,
                    price: price
                };
            } else {
                // Deselect
                selectedOptions.travel = null;
            }
        } else {
            // Multi-selection: Toggle the clicked option
            const isSelected = option.classList.contains('selected');
           
            if (isSelected) {
                // Deselect
                option.classList.remove('selected');
                selectedOptions[category] = selectedOptions[category].filter(
                    item => item.element !== option
                );
            } else {
                // Select
                option.classList.add('selected');
                selectedOptions[category].push({
                    element: option,
                    price: price
                });
            }
        }
       
        console.log(`Selection changed: ${category}`, selectedOptions);
        updateTotalPrice();
        updatePriceChart();
        saveState();
    });
}
function setupExploreButtons() {
    const cityDetails = {
        paris: {
            title: "Paris, France",
            image: "https://wallpaperaccess.com/full/383916.jpg ",
            description: "Experience the City of Light in all its glory. From the iconic Eiffel Tower to the world-renowned Louvre Museum, Paris offers an unparalleled blend of art, culture, and romance.",
            attractions: ["Eiffel Tower & Seine River Cruises", "Louvre Museum & Mona Lisa", "Champs-Élysées & Arc de Triomphe", "Montmartre & Sacré-Cœur", "Notre-Dame Cathedral"],
            bestTime: "April to June & September to October",
            travelTips: "Book museum tickets in advance, learn basic French phrases, use metro for transport, try local bistros"
        },
        tokyo: {
            title: "Tokyo, Japan",
            image: "https://wallpaperaccess.com/full/26365.jpg ",
            description: "Discover the perfect harmony of ancient tradition and cutting-edge technology. From serene temples to neon-lit streets, Tokyo offers a unique journey through time.",
            attractions: ["Shibuya Crossing & Harajuku", "Senso-ji Temple in Asakusa", "Mount Fuji day trips", "Tsukiji Fish Market", "Cherry blossom viewing in spring"],
            bestTime: "March to May & September to November",
            travelTips: "Get JR Pass for trains, try convenience store food, respect local customs, carry cash"
        },
        rome: {
            title: "Rome, Italy",
            image: "https://wallpaperaccess.com/full/129471.jpg ",
            description: "Step into the eternal city where history comes alive at every corner. Marvel at ancient ruins, explore Vatican treasures, and indulge in authentic Italian cuisine.",
            attractions: ["Colosseum & Roman Forum", "Vatican Museums & Sistine Chapel", "Trevi Fountain & Spanish Steps", "Pantheon & Piazza Navona", "Trastevere neighborhood"],
            bestTime: "April to June & September to October",
            travelTips: "Buy skip-the-line tickets, dress modestly for churches, try gelato, explore on foot"
        },
        bali: {
            title: "Bali, Indonesia",
            image: "https://wallpaperaccess.com/full/3525907.jpg ",
            description: "Find your paradise in the Island of Gods. Experience spiritual awakening in Ubud's rice terraces and discover ancient temples in this tropical haven.",
            attractions: ["Ubud Rice Terraces & Monkey Forest", "Uluwatu Temple & Kecak Dance", "Seminyak Beach & Sunset", "Tirta Empul Holy Spring Temple", "Mount Batur sunrise trek"],
            bestTime: "April to October (dry season)",
            travelTips: "Respect temple dress codes, try local warungs, bargain at markets, stay hydrated"
        },
        newyork: {
            title: "New York City, USA",
            image: "https://wallpaperaccess.com/full/283006.jpg ",
            description: "Experience the city that never sleeps in all its vibrant energy. From Broadway shows to Central Park, NYC offers an unparalleled urban adventure.",
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
   
    container.innerHTML = travelOptions.map(option => `
        <div class="price-option border-2 border-gray-200 rounded-lg p-4" data-price="${prices[option.key]}" data-category="travel">
            <div class="flex justify-between items-center">
                <div>
                    <h4 class="font-semibold text-gray-800">${option.name}</h4>
                    <p class="text-sm text-gray-600">${option.desc}</p>
                </div>
                <div class="text-right">
                    <div class="font-bold text-lg text-${option.color}">₹${prices[option.key].toLocaleString('en-IN')}</div>
                </div>
            </div>
        </div>
    `).join('');
   
    // FIX: Restore selection if exists and update element reference
    if (selectedOptions.travel) {
        const selectedElement = container.querySelector(`[data-price="${selectedOptions.travel.price}"]`);
        if (selectedElement) {
            selectedElement.classList.add('selected');
            selectedOptions.travel.element = selectedElement;
        }
    }
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
       
        if (pageId === 'page-3') updateTravelPricesForCity();
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
   
    // Add travel price (single)
    if (selectedOptions.travel) {
        totalPrice += selectedOptions.travel.price;
    }
   
    // Add food prices (multiple)
    selectedOptions.food.forEach(option => {
        totalPrice += option.price;
    });
   
    // Add activities prices (multiple)
    selectedOptions.activities.forEach(option => {
        totalPrice += option.price;
    });
   
    console.log(`Price updated: ₹${oldTotal} → ₹${totalPrice}`, selectedOptions);
   
    const priceElement = document.getElementById('totalPrice');
    if (priceElement) {
        // FIX: Removed immediate set to prevent jump; let animation handle from current (old) to new
        anime({
            targets: { value: oldTotal },
            value: totalPrice,
            duration: 800,
            easing: 'easeOutQuart',
            update: function(anim) {
                const value = Math.round(anim.animatables[0].target.value);
                priceElement.textContent = '₹' + value.toLocaleString('en-IN');
            }
        });
    }
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
   
    // Build data array with all selected items
    const data = [];
   
    if (selectedOptions.travel && selectedOptions.travel.element) {
        const name = selectedOptions.travel.element.querySelector('h4')?.textContent || 'Travel';
        data.push({
            name: name,
            value: selectedOptions.travel.price
        });
    }
   
    selectedOptions.food.forEach(option => {
        if (option.element) {
            const name = option.element.querySelector('h4')?.textContent || 'Food';
            data.push({
                name: name,
                value: option.price
            });
        }
    });
   
    selectedOptions.activities.forEach(option => {
        if (option.element) {
            const name = option.element.querySelector('h4')?.textContent || 'Activity';
            data.push({
                name: name,
                value: option.price
            });
        }
    });
   
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: ₹{c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: '0%',
            bottom: '10%',
            data: data.map(item => item.name)
        },
        series: [
            {
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
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '16',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: data,
                color: ['#1e3a8a', '#f97316', '#10b981', '#fbbf24', '#ec4899', '#8b5cf6', '#06b6d4', '#84cc16', '#f59e0b']
            }
        ]
    };
   
    priceChart.setOption(option);
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
        finalTotalElement.textContent = '₹' + totalPrice.toLocaleString('en-IN');
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
        selectedCity: selectedCity
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
                // Restore selected states in DOM and update element references
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
                if (priceElement) priceElement.textContent = '₹' + totalPrice.toLocaleString('en-IN');
            }
           
            if (state.selectedCity) selectedCity = state.selectedCity;
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
    // Clear selections
    document.querySelectorAll('.price-option').forEach(opt => opt.classList.remove('selected'));
    // Reset travel container
    const container = document.getElementById('travelOptionsContainer');
    if (container) container.innerHTML = '';
    // Reset form
    const form = document.getElementById('registrationForm');
    if (form) form.reset();
    // Clear localStorage
    localStorage.removeItem('voyageflow-state');
    localStorage.removeItem('voyageflow-registration');
    // Update displays
    const priceElement = document.getElementById('totalPrice');
    if (priceElement) priceElement.textContent = '₹0';
    if (priceChart) priceChart.clear();
    showPage('page-1');
}
window.addEventListener('error', function(e) {
    console.error('VoyageFlow Error:', e.error);
});
window.addEventListener('load', function() {
    console.log('VoyageFlow loaded successfully');
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
    }
});