// Cursor shape movement
document.addEventListener("mousemove", (e) => {
  document.querySelectorAll(".shape").forEach((shape) => {
    const speed = shape.dataset.speed || 15;
    const x = (window.innerWidth - e.pageX * speed) / 100;
    const y = (window.innerHeight - e.pageY * speed) / 100;
    shape.style.transform = `translate(${x}px, ${y}px)`;
  });
});

// EmailJS form submission
document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault();

  emailjs.sendForm("service_7ov4npt", "template_y7bqugn", this)
    .then(() => {
      alert("Message sent successfully!");
      this.reset();
    }, (err) => {
      alert("Failed to send message. Please try again.");
      console.error("EmailJS error:", err);
    });
});
