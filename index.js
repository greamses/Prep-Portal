document.addEventListener('DOMContentLoaded', () => {
  const textElement = document.getElementById('typewriter');
  // ADD YOUR CATCHY PHRASES HERE
  const phrases = [
    "WAEC.",
    "NECO.",
    "JAMB.",
    "SAT.",
    "IGCSE.",
  ];
  
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 150;
  
  function type() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      // Remove a character
      textElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 80; // Faster when deleting
    } else {
      // Add a character
      textElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 150; // Normal typing speed
    }
    
    // If word is complete
    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typeSpeed = 2000; // PAUSE at the end of the word
    }
    // If word is fully deleted
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500; // Small pause before typing next word
    }
    
    setTimeout(type, typeSpeed);
  }
  
  // Start the animation
  type();
});