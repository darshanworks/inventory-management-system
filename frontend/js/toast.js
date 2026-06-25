const showToast = (
  message,
  type = "success"
) => {

  const toast =
    document.getElementById("toast");

  toast.textContent = message;

  toast.classList.remove(
    "hidden",
    "bg-green-500",
    "bg-red-500"
  );

  if (type === "success") {

    toast.classList.add(
      "bg-green-500"
    );

  } else {

    toast.classList.add(
      "bg-red-500"
    );

  }

  setTimeout(() => {

    toast.classList.add("hidden");

  }, 3000);
};