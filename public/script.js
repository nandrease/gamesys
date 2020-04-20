const showLoadingCircle = active => {
  const loadingCircle = document.querySelector(".loading-circle");
  if (!loadingCircle) return;
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
    setTimeout(() => {
      showLoadingCircle(false);
      return resolve(body);
    }, 500);
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
      showLoadingCircle(true);
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
    const { id, title, excerpt } = data;
    const modalTitle = popupModal.querySelector(".popup-modal__title"),
      modalContent = popupModal.querySelector(".popup-modal__content"),
      modalAction = popupModal.querySelector(".popup-modal__action");
    let expandContent = false;

    modalTitle.innerHTML = title;
    modalContent.innerHTML = excerpt;
    modalAction.innerHTML = "Load more";

    popupModal.querySelector(".popup-modal__action").addEventListener("click", async () => {
      if (!data.content) {
        showLoadingCircle(true);
        fetchData(`/api/module/${id}/full`)
          .then(({ content }) => {
            data.content = content;
            modalContent.insertAdjacentHTML("beforeend", content);

            expandContent = true;
            if (expandContent) {
              modalContent.classList.add("is--expanded");
              modalAction.innerHTML = "Show less";
            }
          })
          .catch(err => console.log("Error: ", err));
      } else {
        expandContent = !expandContent;
        if (expandContent) {
          modalContent.classList.add("is--expanded");
          modalAction.innerHTML = "Show less";
        } else {
          modalContent.classList.remove("is--expanded");
          modalAction.innerHTML = "Load more";
        }
      }
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

const loadFullContent = id => {
  fetchData(`/api/module/${id}/full`).then(({ content }) => content).catch(err => console.log("Error: ", err));
};

const loadPage = () => {
  showLoadingCircle(true);
  const container = document.querySelector(".container");

  fetchData("/api/index")
    .then(({ content, title }) => {
      container.innerHTML = content;
      document.title = title;
      loadFn();
    })
    .catch(err => console.log("Error: ", err));
};

document.addEventListener("DOMContentLoaded", loadPage);
