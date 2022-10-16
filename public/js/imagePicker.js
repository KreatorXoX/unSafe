const img = document.querySelectorAll(".img-thumbnail");
const checkbox = document.getElementsByClassName("form-check-input");

img.forEach((image) => {
  image.addEventListener("click", function (e) {
    const id = e.target.id;
    document.getElementById(`images-${id}`).checked = !document.getElementById(
      `images-${id}`
    ).checked;
  });
});
