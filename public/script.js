const showLoadingCircle = active => {
  const loadingCircle = document.querySelector(".loading-circle");
  if (active) {
    return loadingCircle.classList.add("active");
  }
  loadingCircle.classList.remove("active");
};

const fetchData = async url => {
  const response = await fetch(url);
  const body = await response.json();

  return new Promise((resolve, reject) => {
    if (response.status !== 200) {
      return reject(new Error("Error getting data"));
    }
    return resolve(body);
  });
};

const loadFn = () => {
  const body = document.body;
  const modalTriggers = document.querySelectorAll("[data-popup-trigger]");
  const bodyBlackout = document.querySelector(".popup-blackout");
  const closePopupBtn = document.querySelector(".popup-modal__close");

  modalTriggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const { popupTrigger } = trigger.dataset;
      const popupModal = document.querySelector(".popup-modal");

      fetchData(`/api/module/${popupTrigger}`)
        .then(data => {
          openPopup(popupModal, data);

          closePopupBtn.addEventListener("click", () => {
            closePopup(popupModal);
          });
          bodyBlackout.addEventListener("click", () => {
            closePopup(popupModal);
          });
        })
        .catch(err => console.log("Error: ", err));
    });
  });

  const openPopup = (popupModal, data) => {
    let toggleContent = false;
    popupModal.querySelector(".popup-modal__title").innerHTML = data.title;
    popupModal.querySelector(".popup-modal__content").innerHTML = data.excerpt;
    popupModal.querySelector(".popup-modal__action").innerHTML = "Load more";

    popupModal.querySelector(".popup-modal__action").addEventListener("click", () => {
      toggleContent = !toggleContent;
      popupModal.querySelector(".popup-modal__content").insertAdjacentHTML("beforeend", data.content);
      popupModal.querySelector(".popup-modal__action").innerHTML = toggleContent ? "Show less" : "Load more";
    });

    popupModal.classList.add("is--visible");
    bodyBlackout.classList.add("is--blacked-out");
    body.classList.add("is--noscroll");
  };

  const closePopup = popupModal => {
    popupModal.classList.remove("is--visible");
    bodyBlackout.classList.remove("is--blacked-out");
    body.classList.remove("is--noscroll");
    popupModal.querySelector(".popup-modal__title").innerHTML = "";
    popupModal.querySelector(".popup-modal__content").innerHTML = "";
  };
};

const loadContent = () => {
  showLoadingCircle(true);
  const container = document.querySelector(".container");

  fetchData("/api/index")
    .then(body => {
      setTimeout(() => {
        container.innerHTML = body.content;
        document.title = body.title;
        showLoadingCircle(false);

        loadFn();
      }, 1000);
    })
    .catch(err => console.log("Error: ", err));
};
