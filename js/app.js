(() => {
    "use strict";
    function functions_getHash() {
      if (location.hash) return location.hash.replace("#", "");
    }
    function setHash(hash) {
      hash = hash ? `#${hash}` : window.location.href.split("#")[0];
      history.pushState("", "", hash);
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
      if (!target.classList.contains("_slide")) {
        target.classList.add("_slide");
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = `${target.offsetHeight}px`;
        target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = showmore ? `${showmore}px` : `0px`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
          target.hidden = !showmore ? true : false;
          !showmore ? target.style.removeProperty("height") : null;
          target.style.removeProperty("padding-top");
          target.style.removeProperty("padding-bottom");
          target.style.removeProperty("margin-top");
          target.style.removeProperty("margin-bottom");
          !showmore ? target.style.removeProperty("overflow") : null;
          target.style.removeProperty("transition-duration");
          target.style.removeProperty("transition-property");
          target.classList.remove("_slide");
          document.dispatchEvent(
            new CustomEvent("slideUpDone", {
              detail: {
                target,
              },
            })
          );
        }, duration);
      }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
      if (!target.classList.contains("_slide")) {
        target.classList.add("_slide");
        target.hidden = target.hidden ? false : null;
        showmore ? target.style.removeProperty("height") : null;
        let height = target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = showmore ? `${showmore}px` : `0px`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = height + "px";
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        window.setTimeout(() => {
          target.style.removeProperty("height");
          target.style.removeProperty("overflow");
          target.style.removeProperty("transition-duration");
          target.style.removeProperty("transition-property");
          target.classList.remove("_slide");
          document.dispatchEvent(
            new CustomEvent("slideDownDone", {
              detail: {
                target,
              },
            })
          );
        }, duration);
      }
    };
    let _slideToggle = (target, duration = 500) => {
      if (target.hidden) return _slideDown(target, duration);
      else return _slideUp(target, duration);
    };
  
    function spollers() {
      const spollersArray = document.querySelectorAll("[data-spollers]");
      if (spollersArray.length > 0) {
        const spollersRegular = Array.from(spollersArray).filter(function (
          item,
          index,
          self
        ) {
          return !item.dataset.spollers.split(",")[0];
        });
        if (spollersRegular.length) initSpollers(spollersRegular);
        let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
        if (mdQueriesArray && mdQueriesArray.length)
          mdQueriesArray.forEach((mdQueriesItem) => {
            mdQueriesItem.matchMedia.addEventListener("change", function () {
              initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            });
            initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
          });
        function initSpollers(spollersArray, matchMedia = false) {
          spollersArray.forEach((spollersBlock) => {
            spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
            if (matchMedia.matches || !matchMedia) {
              spollersBlock.classList.add("_spoller-init");
              initSpollerBody(spollersBlock);
              spollersBlock.addEventListener("click", setSpollerAction);
            } else {
              spollersBlock.classList.remove("_spoller-init");
              initSpollerBody(spollersBlock, false);
              spollersBlock.removeEventListener("click", setSpollerAction);
            }
          });
        }
        function initSpollerBody(spollersBlock, hideSpollerBody = true) {
          let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
          if (spollerTitles.length) {
            spollerTitles = Array.from(spollerTitles).filter(
              (item) => item.closest("[data-spollers]") === spollersBlock
            );
            spollerTitles.forEach((spollerTitle) => {
              if (hideSpollerBody) {
                spollerTitle.removeAttribute("tabindex");
                if (!spollerTitle.classList.contains("_spoller-active"))
                  spollerTitle.nextElementSibling.hidden = true;
              } else {
                spollerTitle.setAttribute("tabindex", "-1");
                spollerTitle.nextElementSibling.hidden = false;
              }
            });
          }
        }
        function setSpollerAction(e) {
          const el = e.target;
          if (el.closest("[data-spoller]")) {
            const spollerTitle = el.closest("[data-spoller]");
            const spollersBlock = spollerTitle.closest("[data-spollers]");
            const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
            const spollerSpeed = spollersBlock.dataset.spollersSpeed
              ? parseInt(spollersBlock.dataset.spollersSpeed)
              : 500;
            if (!spollersBlock.querySelectorAll("._slide").length) {
              if (
                oneSpoller &&
                !spollerTitle.classList.contains("_spoller-active")
              )
                hideSpollersBody(spollersBlock);
              spollerTitle.classList.toggle("_spoller-active");
              _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
            }
            e.preventDefault();
          }
        }
        function hideSpollersBody(spollersBlock) {
          const spollerActiveTitle = spollersBlock.querySelector(
            "[data-spoller]._spoller-active"
          );
          const spollerSpeed = spollersBlock.dataset.spollersSpeed
            ? parseInt(spollersBlock.dataset.spollersSpeed)
            : 500;
          if (
            spollerActiveTitle &&
            !spollersBlock.querySelectorAll("._slide").length
          ) {
            spollerActiveTitle.classList.remove("_spoller-active");
            _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
          }
        }
        const spollersClose = document.querySelectorAll("[data-spoller-close]");
        if (spollersClose.length)
          document.addEventListener("click", function (e) {
            const el = e.target;
            if (!el.closest("[data-spollers]"))
              spollersClose.forEach((spollerClose) => {
                const spollersBlock = spollerClose.closest("[data-spollers]");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed
                  ? parseInt(spollersBlock.dataset.spollersSpeed)
                  : 500;
                spollerClose.classList.remove("_spoller-active");
                _slideUp(spollerClose.nextElementSibling, spollerSpeed);
              });
          });
      }
    }
  
    //-----------------------tabs-----------------------------
  
  
  
    /*------------popups----------------*/
  
    const modalTrigger = document.querySelectorAll("[data-modal]"),
      modal = document.querySelector(".modal"),
      modalCloseBtn = document.querySelector("[data-close]");
    const modalLink = document.querySelector(".modal__btn");
  
    function showModal() {
      modal.classList.remove("hide");
      modal.classList.add("show");
  
      document.body.style.overflow = "hidden";
    }
  
    
    function closeMode() {
      modal.classList.add("hide");
      modal.classList.remove("show");
      document.body.style.overflow = "";
    }
    modalCloseBtn.addEventListener("click", closeMode);
    modalLink.addEventListener("click", closeMode);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeMode();
    });
    document.addEventListener("keydown", (e) => {
      if (e.code === "Escape" && modal.classList.contains("show")) closeMode();
    });
  
    /*------------langs----------------*/
  
    const langButtons = document.querySelectorAll("[data-btn]");
    const allLangs = ["ukr", "en"];
    const currentPathName = window.location.pathname;
    let currentLang =
      localStorage.getItem("language") || checkBrowserLang() || "ukr";
    let currentTexts = {};
    const homeTexts = {
      "home_page-title": {
        ukr: "Волонтерський Рух України",
        en: "Volunteer Movement of Ukraine",
      },
      "home_page-logo": {
        ukr: "Волонтерський Рух України",
        en: "Volunteer Movement of Ukraine",
      },
      "footer_page-logo": {
        ukr: "Волонтерський Рух України",
        en: "Volunteer Movement of Ukraine",
      },
      "home_page-1": {
        ukr: "Ми – Волонтерський Рух України",
        en: "We are the Volunteer Movement of Ukraine",
      },
      "home_page-2": {
        ukr: "Благодійний Фонд створено з метою надання  підтримки захисникам України. Ми робимо те, що в нас виходить найкраще – допомогаємо на автомобільному фронті",
        en: "The Charitable Fund was created to provide support to defenders of Ukraine. We do what we do best - help on the automotive front",
      },
      "home_page-3": {
        ukr: "Підтримати",
        en: "Support",
      },
      "home_page-4": {
        ukr: "Діяльність фонду",
        en: "Fund activity",
      },
      "home_page-5": {
        ukr: "Про Благодійний фонд",
        en: "About the Charitable Fund",
      },
      "home_page-6": {
        ukr: "Наш фонд займається закупівлею позашляховиків та мінібусів. Ми передаємо авто на фронт та забезпечуємо їх технічний супровід",
        en: "Our fund is engaged in the purchase of SUVs and minibuses. We deliver cars to the front and provide their technical support",
      },
      "home_page-7": {
        ukr: "У нас відкрито збір на авто для ЗСУ. Приєднуйтесь! Все буде Україна!",
        en: "We launch a fundraiser to purchase cars for the Armed Forces of Ukraine. Join us and support Ukraine!",
      },
      "home_page-8": {
        ukr: "Підтримати",
        en: "Support",
      },
      "home_page-9": {
        ukr: "Наші партнери",
        en: "Our partners",
      },
      "home_page-10": {
        ukr: "Офіційний сервіс",
        en: "Official service",
      },
      "home_page-11": {
        ukr: "Дніпро, Україна",
        en: "Dnipro, Ukraine",
      },
      "home_page-12": {
        ukr: "Офіційний сервіс",
        en: "Official service",
      },
      "home_page-13": {
        ukr: "Черкаси, Україна",
        en: "Cherkasy, Ukraine",
      },
      "home_page-14": {
        ukr: "Кропивницький, Україна",
        en: "Kropyvnytskyi, Ukraine",
      },
      "home_page-15": {
        ukr: "Офіційний сервіс",
        en: "Official service",
      },
      "home_page-16": {
        ukr: "Черкаси, Україна",
        en: "Cherkasy, Ukraine",
      },
      "home_page-17": {
        ukr: "Кропивницький, Україна",
        en: "Kropyvnytskyi, Ukraine",
      },
      "home_page-18": {
        ukr: "Офіційний сервіс",
        en: "Official service",
      },
      "home_page-19": {
        ukr: "Черкаси, Україна",
        en: "Cherkasy, Ukraine",
      },
      "home_page-20": {
        ukr: "Офіційний сервіс",
        en: "Official service",
      },
      "home_page-21": {
        ukr: "Кропивницький, Україна",
        en: "Kropyvnytskyi, Ukraine",
      },
      "home_page-22": {
        ukr: "Більше про партнерів",
        en: "More about partners",
      },
      "home_page-23": {
        ukr: "Найпоширеніші авто, що ми закуповуємо",
        en: "Types of cars our foundation purchase",
      },
      "home_page-24": {
        ukr: "Позашляховики",
        en: "Off-roaders",
      },
      "home_page-25": {
        ukr: "Підтримати",
        en: "Support",
      },
      "home_page-26": {
        ukr: "Мікроавтобуси",
        en: "Minivans",
      },
      "home_page-27": {
        ukr: "Підтримати",
        en: "Support",
      },
      "home_page-28": {
        ukr: "Підтримати",
        en: "Support",
      },
      "home_page-29": {
        ukr: "Запит на авто",
        en: "Request for a car",
      },
      "home_page-30": {
        ukr: "Чому важливо донатити на авто для ЗСУ?",
        en: "Why is it important to donate on a car for the Armed Forces?",
      },
      "home_page-31": {
        ukr: "Автомобілі на фронті відіграють дуже важливу роль у веденні бойових дій, адже завдяки ним наші захисники мають змогу проводити розвідувальні операції, транспортувати потерпілих з гарячих точок та підвищувати свою мобільність.",
        en: "Cars at the front play a very important role in the conduct of hostilities, because thanks to them, our defenders are able to conduct reconnaissance operations, transport victims from hot spots and increase their mobility.",
      },
      "home_page-32": {
        ukr: "Нажаль, автомоболі на фронті є розхідним матеріалом, тому гостра потреба в них залишається завжди.",
        en: "Unfortunately, the life of cars at the front line is very fleeting, so there is always an urgent need for them.",
      },
      "home_page-33": {
        ukr: "Підтримати",
        en: "Support",
      },
      "home_page-34": {
        ukr: "Як ти можеш долучитись?",
        en: "How can you get involved?",
      },
      "home_page-35": {
        ukr: "Ти можеш підтримати нашу ініціативу своїм донатом. Давай наближувати перемогу разом!",
        en: "You can support our initiative with your donation. Let's get closer to victory together!",
      },
      "home_page-37": {
        ukr: "Зробити внесок",
        en: "Make a donation",
      },
      "home_page-38": {
        ukr: "Для нас буде великою цінністю, якщо ти будеш ділитися із друзями та знайомими нашою ініціативою. Це буде твоїм дуже вагомим внеском у досягнення нашої спільної мети!",
        en: "It will be of great value to us if you share our initiative with your friends. This will be your very significant contribution to achieving our common goal!",
      },
      "home_page-39": {
        ukr: "Поділитись сайтом",
        en: "Share a website",
      },
      "home_page-40": {
        ukr: "Ви можете подати запит на авто для військової частини в містах: Дніпро, Кропивницький, Черкаси. Для цього необхідно перейти за посиланням та заповнити форму зворотнього зв’язку.",
        en: "You can submit a request for a car for a military unit in the following cities: Dnipro, Kropyvnytskyi, Cherkasy. To do this, you need to follow the link and fill out the feedback form.",
      },
      "home_page-41": {
        ukr: "Запит на авто",
        en: "Request for a car",
      },
      "home_page-42": {
        ukr: "Наші досягнення",
        en: "Our achievements",
      },
      "home_page-43": {
        ukr: "Переказ карткою",
        en: "Transfer by card",
      },
      "home_page-44": {
        ukr: "Mono банка",
        en: "Monobank",
      },
      "home_page-45": {
        ukr: "Реквізити",
        en: "Bank details",
      },
      "home_page-46": {
        ukr: "Підтримати збір на авто для ЗСУ",
        en: "Support the fundraising for cars for the Armed Forces of Ukraine",
      },
      "home_page-47": {
        ukr: "Сума внеску",
        en: "Contribution amount",
      },
      "home_page-48": {
        ukr: "Ви будете отримувати звітності на email по вашому внеску",
        en: "You will receive reports on your contribution",
      },
      "home_page-49": {
        ukr: "Підтримати",
        en: "Support",
      },
      "home_page-50": {
        ukr: "Оформити підписку",
        en: "Get a subscription",
      },
      "home_page-51": {
        ukr: "Mono банка",
        en: "Monobank",
      },
      "home_page-52": {
        ukr: "Вам надійде квитанція на email та ви будете отримувати звітності по вашому внеску",
        en: "You will receive a receipt by email and you will receive reports on your contribution",
      },
      "home_page-53": {
        ukr: "Оформити підписку",
        en: "Get a subscription",
      },
      "home_page-54": {
        ukr: "Реквізити",
        en: "Bank details in Ukraine",
      },
      "home_page-55": {
        ukr: "Перекази в іноземній валюті",
        en: "International bank transfers",
      },
      "home_page-56": {
        ukr: "Заповнюйте форму і ми з вами зв’яжемось",
        en: "Fill out the form and we will contact you",
      },
      "home_page-57": {
        ukr: "Ім’я",
        en: "Name",
      },
      "home_page-58": {
        ukr: "Номер телефону",
        en: "Phone number",
      },
      "home_page-59": {
        ukr: "Надіслати",
        en: "Send",
      },
      "home_page-60": {
        ukr: "Залишай свою електронну пошту та отримуй звітність про діяльність фонду. Будь завжди в курсі !",
        en: "Leave your e-mail and receive reports on the fund's activities. Always be informed!",
      },
      "home_page-61": {
        ukr: "Звітність",
        en: "Reports",
      },
      "home_page-62": {
        ukr: "Підписка",
        en: "Subscription",
      },
      "home_page-63": {
        ukr: "Партнери",
        en: "Partners",
      },
      "home_page-64": {
        ukr: "Вакансії",
        en: "Vacansies",
      },
      "home_page-65": {
        ukr: "Часті запитання",
        en: "FAQ",
      },
      "home_page-66": {
        ukr: "Інформаційна лінія",
        en: "Information line",
      },
      "home_page-67": {
        ukr: "Підтримати",
        en: "Support",
      },
      "home_page-68": {
        ukr: "Дякуємо, що залишили запит на нашому сайті. Очікуйте, найближчим часом з вами зв’яжуться.",
        en: "Thank you for leaving a request on our website. Please wait, you will be contacted shortly.",
      },
      "home_page-69": {
        ukr: "Все буде Україна!",
        en: "Everything will be Ukraine!",
      },
      "home_page-70": {
        ukr: "Підтримати збір",
        en: "Support fundraising",
      },
      "home_page-71": {
        ukr: "Поділись сайтом та поширюй збір коштів на авто для ЗСУ!",
        en: "Share the site and spread the fundraiser for cars for the Armed Forces of Ukraine!",
      },
      "home_page-72": {
        ukr: "Копіювати посилання на сайт",
        en: "Copy the link to the site",
      },
      "home_page-73": {
        ukr: "Поділитись у соціальних мережах",
        en: "Share on social networks",
      },
      "home_page-74": {
        ukr: "Партнери",
        en: "Partners",
      },
      "home_page-75": {
        ukr: "Вакансії",
        en: "Vacansies",
      },
      "home_page-76": {
        ukr: "Часті запитання",
        en: "FAQ",
      },
      "home_page-77": {
        ukr: "Адреса",
        en: "Address",
      },
      "home_page-78": {
        ukr: "Україна, 65039 , Одеська обл., місто Одеса, пр.Гагаріна, будинок 12а, офіс 110",
        en: "Ukraine, 65039, Odesa region, Odesa city, Gagarina avenue, building 12a, office 110",
      },
    };
    const partnersTexts = {
      "partners_page-1": {
        ukr: "Наші партнери",
        en: "Our partners",
      },
      "home_page-logo": {
        ukr: "Волонтерський Рух України",
        en: "Volunteer Movement of Ukraine",
      },
      "footer_page-logo": {
        ukr: "Волонтерський Рух України",
        en: "Volunteer Movement of Ukraine",
      },
      "home_page-title": {
        ukr: "Партнери - Волонтерський Рух України",
        en: "Partners - Volunteer Movement of Ukraine",
      },
      "partners_page-2": {
        ukr: "Посилання на сайт",
        en: "website",
      },
      "partners_page-3": {
        ukr: "Дніпро, Україна",
        en: "Dnipro, Ukraine",
      },
      "partners_page-4": {
        ukr: "Запорізьке шосе, 59",
        en: "59, Zaporizhia highway",
      },
      "partners_page-5": {
        ukr: "Посилання на сайт",
        en: "website",
      },
      "partners_page-6": {
        ukr: "Кропивницький, Україна",
        en: "Kropyvnytskyi, Ukraine",
      },
      "partners_page-7": {
        ukr: "вул. Вокзальна, 60-А",
        en: "St. Vokzalna, 60-A",
      },
      "partners_page-8": {
        ukr: "Посилання на сайт",
        en: "website",
      },
      "partners_page-9": {
        ukr: "Черкаси, Україна",
        en: "Cherkasy, Ukraine",
      },
      "partners_page-10": {
        ukr: "вул. 30 років Перемоги, 7/2",
        en: "St. 30 years of Victory, 7/2",
      },
      "partners_page-11": {
        ukr: "Посилання на сайт",
        en: "website",
      },
      "partners_page-12": {
        ukr: "Кропивницький, Україна",
        en: "Kropyvnytskyi, Ukraine",
      },
      "partners_page-13": {
        ukr: "пр-т Винниченка, 2",
        en: "2 Vinnychenka Ave",
      },
      "partners_page-14": {
        ukr: "Посилання на сайт",
        en: "website",
      },
      "partners_page-15": {
        ukr: "Черкаси, Україна",
        en: "Cherkasy, Ukraine",
      },
      "partners_page-16": {
        ukr: "вул. 30 років Перемоги, 7/2",
        en: "St. 30 years of Victory, 7/2",
      },
      "partners_page-17": {
        ukr: "Посилання на сайт",
        en: "website",
      },
      "partners_page-18": {
        ukr: "Кропивницький, Україна",
        en: "Kropyvnytskyi, Ukraine",
      },
      "partners_page-19": {
        ukr: "пр-т Винниченка, 2",
        en: "2 Vinnychenka Ave",
      },
      "partners_page-20": {
        ukr: "Посилання на сайт",
        en: "website",
      },
      "partners_page-21": {
        ukr: "Черкаси, Україна",
        en: "Cherkasy, Ukraine",
      },
      "partners_page-22": {
        ukr: "вул. Чигиринська, 60/2",
        en: "St. Chygyrinska, 60/2",
      },
      "help_page-17": {
        ukr: "Підтримати",
        en: "Support",
      },
      "help_page-18": {
        ukr: "Запит на авто",
        en: "Request for a car",
      },
      "home_page-28": {
        ukr: "Підтримати",
        en: "Support",
      },
      "home_page-29": {
        ukr: "Запит на авто",
        en: "Request for a car",
      },
      "home_page-43": {
        ukr: "Переказ карткою",
        en: "Transfer by card",
      },
      "home_page-44": {
        ukr: "Mono банка",
        en: "Monobank",
      },
      "home_page-45": {
        ukr: "Реквізити",
        en: "Bank details",
      },
      "home_page-46": {
        ukr: "Підтримати збір на авто для ЗСУ",
        en: "Support the fundraising for cars for the Armed Forces of Ukraine",
      },
      "home_page-47": {
        ukr: "Сума внеску",
        en: "Contribution amount",
      },
      "home_page-48": {
        ukr: "Ви будете отримувати звітності на email по вашому внеску",
        en: "You will receive reports on your contribution",
      },
      "home_page-49": {
        ukr: "Підтримати",
        en: "Support",
      },
      "home_page-50": {
        ukr: "Оформити підписку",
        en: "Get a subscription",
      },
      "home_page-51": {
        ukr: "Mono банка",
        en: "Monobank",
      },
      "home_page-52": {
        ukr: "Вам надійде квитанція на email та ви будете отримувати звітності по вашому внеску",
        en: "You will receive a receipt by email and you will receive reports on your contribution",
      },
      "home_page-53": {
        ukr: "Оформити підписку",
        en: "Get a subscription",
      },
      "home_page-54": {
        ukr: "Реквізити",
        en: "Bank details in Ukraine",
      },
      "home_page-55": {
        ukr: "Перекази в іноземній валюті",
        en: "International bank transfers",
      },
      "home_page-56": {
        ukr: "Заповнюйте форму і ми з вами зв’яжемось",
        en: "Fill out the form and we will contact you",
      },
      "home_page-57": {
        ukr: "Ім’я",
        en: "Name",
      },
      "home_page-58": {
        ukr: "Номер телефону",
        en: "Phone number",
      },
      "home_page-59": {
        ukr: "Надіслати",
        en: "Send",
      },
      "home_page-60": {
        ukr: "Залишай свою електронну пошту та отримуй звітність про діяльність фонду. Будь завжди в курсі !",
        en: "Leave your e-mail and receive reports on the fund's activities. Always be informed!",
      },
      "home_page-61": {
        ukr: "Звітність",
        en: "Reports",
      },
      "home_page-62": {
        ukr: "Підписка",
        en: "Subscription",
      },
      "home_page-63": {
        ukr: "Партнери",
        en: "Partners",
      },
      "home_page-64": {
        ukr: "Вакансії",
        en: "Vacansies",
      },
      "home_page-65": {
        ukr: "Часті запитання",
        en: "FAQ",
      },
      "home_page-66": {
        ukr: "Інформаційна лінія",
        en: "Information line",
      },
      "home_page-67": {
        ukr: "Підтримати",
        en: "Support",
      },
      "home_page-68": {
        ukr: "Дякуємо, що залишили запит на нашому сайті. Очікуйте, найближчим часом з вами зв’яжуться.",
        en: "Thank you for leaving a request on our website. Please wait, you will be contacted shortly.",
      },
      "home_page-69": {
        ukr: "Все буде Україна!",
        en: "Everything will be Ukraine!",
      },
      "home_page-70": {
        ukr: "Підтримати збір",
        en: "Support fundraising",
      },
      "home_page-74": {
        ukr: "Партнери",
        en: "Partners",
      },
      "home_page-75": {
        ukr: "Вакансії",
        en: "Vacansies",
      },
      "home_page-76": {
        ukr: "Часті запитання",
        en: "FAQ",
      },
      "home_page-77": {
        ukr: "Адреса",
        en: "Address",
      },
      "home_page-78": {
        ukr: "Україна, 65039 , Одеська обл., місто Одеса, пр.Гагаріна, будинок 12а, офіс 110",
        en: "Ukraine, 65039, Odesa region, Odesa city, Gagarina avenue, building 12a, office 110",
      },
    };
    const vacancyTexts = {
      "vacancy_page-1": {
        ukr: "Вакансії",
        en: "Vacansies",
      },
      "vacancy_page-title": {
        ukr: "Вакансії - Волонтерський Рух України",
        en: "Vacansies - Volunteer Movement of Ukraine",
      },
      "home_page-logo": {
        ukr: "Волонтерський Рух України",
        en: "Volunteer Movement of Ukraine",
      },
      "footer_page-logo": {
        ukr: "Волонтерський Рух України",
        en: "Volunteer Movement of Ukraine",
      },
      "vacancy_page-2": {
        ukr: "Координатор-юрист",
        en: "Lawyer-coordinator",
      },
      "vacancy_page-3": {
        ukr: "Одеса, Україна",
        en: "Odesa, Ukraine",
      },
      "vacancy_page-4": {
        ukr: "вул. Гагаріна, 12 а",
        en: "St. Gagarina, 12 a",
      },
      "vacancy_page-5": {
        ukr: "Регіональний координатор БФ",
        en: "Regional coordinator of foundation",
      },
      "vacancy_page-6": {
        ukr: "Одеса, Україна",
        en: "Odesa, Ukraine",
      },
      "vacancy_page-7": {
        ukr: "вул. Гагаріна, 12 а",
        en: "St. Gagarina, 12 a",
      },
      "help_page-17": {
        ukr: "Підтримати",
        en: "Support",
      },
      "help_page-18": {
        ukr: "Запит на авто",
        en: "Request for a car",
      },
      "home_page-28": {
        ukr: "Підтримати",
        en: "Support",
      },
      "home_page-29": {
        ukr: "Запит на авто",
        en: "Request for a car",
      },
      "home_page-43": {
        ukr: "Переказ карткою",
        en: "Transfer by card",
      },
      "home_page-44": {
        ukr: "Mono банка",
        en: "Monobank",
      },
      "home_page-45": {
        ukr: "Реквізити",
        en: "Bank details",
      },
      "home_page-46": {
        ukr: "Підтримати збір на авто для ЗСУ",
        en: "Support the fundraising for cars for the Armed Forces of Ukraine",
      },
      "home_page-47": {
        ukr: "Сума внеску",
        en: "Contribution amount",
      },
      "home_page-48": {
        ukr: "Ви будете отримувати звітності на email по вашому внеску",
        en: "You will receive reports on your contribution",
      },
      "home_page-49": {
        ukr: "Підтримати",
        en: "Support",
      },
      "home_page-50": {
        ukr: "Оформити підписку",
        en: "Get a subscription",
      },
      "home_page-51": {
        ukr: "Mono банка",
        en: "Monobank",
      },
      "home_page-52": {
        ukr: "Вам надійде квитанція на email та ви будете отримувати звітності по вашому внеску",
        en: "You will receive a receipt by email and you will receive reports on your contribution",
      },
      "home_page-53": {
        ukr: "Оформити підписку",
        en: "Get a subscription",
      },
      "home_page-54": {
        ukr: "Реквізити",
        en: "Bank details in Ukraine",
      },
      "home_page-55": {
        ukr: "Перекази в іноземній валюті",
        en: "International bank transfers",
      },
      "home_page-56": {
        ukr: "Заповнюйте форму і ми з вами зв’яжемось",
        en: "Fill out the form and we will contact you",
      },
      "home_page-57": {
        ukr: "Ім’я",
        en: "Name",
      },
      "home_page-58": {
        ukr: "Номер телефону",
        en: "Phone number",
      },
      "home_page-59": {
        ukr: "Надіслати",
        en: "Send",
      },
      "home_page-60": {
        ukr: "Залишай свою електронну пошту та отримуй звітність про діяльність фонду. Будь завжди в курсі !",
        en: "Leave your e-mail and receive reports on the fund's activities. Always be informed!",
      },
      "home_page-61": {
        ukr: "Звітність",
        en: "Reports",
      },
      "home_page-62": {
        ukr: "Підписка",
        en: "Subscription",
      },
      "home_page-63": {
        ukr: "Партнери",
        en: "Partners",
      },
      "home_page-64": {
        ukr: "Вакансії",
        en: "Vacansies",
      },
      "home_page-65": {
        ukr: "Часті запитання",
        en: "FAQ",
      },
      "home_page-66": {
        ukr: "Інформаційна лінія",
        en: "Information line",
      },
      "home_page-67": {
        ukr: "Підтримати",
        en: "Support",
      },
      "home_page-68": {
        ukr: "Дякуємо, що залишили запит на нашому сайті. Очікуйте, найближчим часом з вами зв’яжуться.",
        en: "Thank you for leaving a request on our website. Please wait, you will be contacted shortly.",
      },
      "home_page-69": {
        ukr: "Все буде Україна!",
        en: "Everything will be Ukraine!",
      },
      "home_page-70": {
        ukr: "Підтримати збір",
        en: "Support fundraising",
      },
      "home_page-74": {
        ukr: "Партнери",
        en: "Partners",
      },
      "home_page-75": {
        ukr: "Вакансії",
        en: "Vacansies",
      },
      "home_page-76": {
        ukr: "Часті запитання",
        en: "FAQ",
      },
      "home_page-77": {
        ukr: "Адреса",
        en: "Address",
      },
      "home_page-78": {
        ukr: "Україна, 65039 , Одеська обл., місто Одеса, пр.Гагаріна, будинок 12а, офіс 110",
        en: "Ukraine, 65039, Odesa region, Odesa city, Gagarina avenue, building 12a, office 110",
      },
    };
    const helpTexts = {
      "help_page-1": {
        ukr: "Часті запитання",
        en: "FAQ",
      },
      "home_page-title": {
        ukr: "Запитання - Волонтерський Рух України",
        en: "FAQ - Volunteer Movement of Ukraine",
      },
      "home_page-logo": {
        ukr: "Волонтерський Рух України",
        en: "Volunteer Movement of Ukraine",
      },
      "footer_page-logo": {
        ukr: "Волонтерський Рух України",
        en: "Volunteer Movement of Ukraine",
      },
      "help_page-2": {
        ukr: "Кому допомагає фонд?",
        en: "Who does the fund help?",
      },
      "help_page-3": {
        ukr: "Фонд закуповує та передає авто військовим частинам ЗСУ. Також фонд забезпечує сервісний ремонт авто, що видає та надає безкоштовний технічний супровід та ремонт для кожного переданого автомобіля на сервісних станціях наших партнерів Української Автомобільної Групи «АВТОКРАФТ».",
        en: 'The fund purchases and transfers cars to the military units of the Armed Forces of Ukraine. The fund also provides car service repair, issuing and providing free technical support and repair for each transferred car at the service stations of our partners of the Ukrainian Automotive Group "AUTOKRAFT".',
      },
      "help_page-4": {
        ukr: "Подати запит на авто",
        en: "Submit a request for a car",
      },
      "help_page-5": {
        ukr: "Як отримати допомогу від фонду?",
        en: "How to get help from the fund?",
      },
      "help_page-6": {
        ukr: "Для того щоб отримати автівку для військової частини, вам необхідно заповнити форму зворотнього зв’язку. З вами зв’яжуться наші спеціалісти та опрацюють ваш запит",
        en: "In order to get a car for a military unit, you need to fill out a feedback form. Our specialists will contact you and process your request",
      },
      "help_page-7": {
        ukr: "Подати запит на авто",
        en: "Submit a request for a car",
      },
      "help_page-8": {
        ukr: "Чому тільки авто?",
        en: "Why only cars?",
      },
      "help_page-9": {
        ukr: "Авто відіграють дуже важливу роль на фронті. Завдяки нашим партнерам сервісним центрам, ми не тільки закуповуємо автомобілі, ми також проводимо ретельну перевірку їх технічного стану, виправляємо недоліки та перефарбовуємо.",
        en: "Cars play a very important role at the front line. Thanks to our partners – service centers, we not only buy cars, we also carry out a thorough inspection of their technical condition, correct defects and repaint.",
      },
      "help_page-10": {
        ukr: "Для кожного переданого ЗСУ автомобіля ми забезпечуємо безкоштовний технічний супровід та ремонт на сервісних станціях наших партнерів Української Автомобільної Групи «АВТОКРАФТ».",
        en: 'For each transferred car for the Armed Forces, we provide free technical support and repair at the service stations of our partners of the Ukrainian Automotive Group "AUTOKRAFT".',
      },
      "help_page-11": {
        ukr: "Підтримати",
        en: "Support",
      },
      "help_page-12": {
        ukr: "Які авто надає фонд?",
        en: "What cars does the fund provide?",
      },
      "help_page-13": {
        ukr: "Фонд закуповує позашляховики та мінібуси Hyundai. Наш партнер сервісний центр Hyundai у місті Дніпро видає автомобілі та забезпечує їх технічний супровід.",
        en: "The fund purchase Hyundai off-roaders and minivans. Our partner, the Hyundai service center in Dnipro, issues cars and provides their technical support.",
      },
      "help_page-14": {
        ukr: "В подальшому за вашої підтримки, ми плануємо масшабуватись та задіювати сервісні центри наших партнерів у містах Черкаси та Кропивницький. Так ми зможемо допомогти більшій кількості наших військових, забезпечивши їх автомобілями та безкоштовним технічним супровідом.",
        en: "In the future, with your support, we plan to expand and use the service centers of our partners in the cities of Cherkasy and Kropyvnytskyi. So we will be able to help more of our military by providing them with cars and free technical support.",
      },
      "help_page-15": {
        ukr: "Подати запит на авто",
        en: "Submit a request for a car",
      },
      "help_page-16": {
        ukr: "Підтримати",
        en: "Support",
      },
      "help_page-17": {
        ukr: "Підтримати",
        en: "Support",
      },
      "help_page-18": {
        ukr: "Запит на авто",
        en: "Request for a car",
      },
      "help_page-20": {
        ukr: "В якому місті можна отримати авто?",
        en: "In which city can you get a car?",
      },
      "help_page-19": {
        ukr: "В подальшому за вашої підтримки, ми плануємо масшабуватись та задіювати сервісні центри наших партнерів у містах Черкаси та Кропивницький. Так ми зможемо допомогти більшій кількості наших військових, забезпечивши іх автомобілями та безкоштовним технічним супровідом.",
        en: "In the future, with your support, we plan to expand and use the service centers of our partners in the cities of Cherkasy and Kropyvnytskyi. So we will be able to help more of our military by providing them with cars and free technical support.",
      },
      "help_page-21": {
        ukr: "Підтримати",
        en: "Support",
      },
      "help_page-22": {
        ukr: "Запит на авто",
        en: "Request for a car",
      },
      "home_page-28": {
        ukr: "Підтримати",
        en: "Support",
      },
      "home_page-29": {
        ukr: "Запит на авто",
        en: "Request for a car",
      },
      "home_page-43": {
        ukr: "Переказ карткою",
        en: "Transfer by card",
      },
      "home_page-44": {
        ukr: "Mono банка",
        en: "Monobank",
      },
      "home_page-45": {
        ukr: "Реквізити",
        en: "Bank details",
      },
      "home_page-46": {
        ukr: "Підтримати збір на авто для ЗСУ",
        en: "Support the fundraising for cars for the Armed Forces of Ukraine",
      },
      "home_page-47": {
        ukr: "Сума внеску",
        en: "Contribution amount",
      },
      "home_page-48": {
        ukr: "Ви будете отримувати звітності на email по вашому внеску",
        en: "You will receive reports on your contribution",
      },
      "home_page-49": {
        ukr: "Підтримати",
        en: "Support",
      },
      "home_page-50": {
        ukr: "Оформити підписку",
        en: "Get a subscription",
      },
      "home_page-51": {
        ukr: "Mono банка",
        en: "Monobank",
      },
      "home_page-52": {
        ukr: "Вам надійде квитанція на email та ви будете отримувати звітності по вашому внеску",
        en: "You will receive a receipt by email and you will receive reports on your contribution",
      },
      "home_page-53": {
        ukr: "Оформити підписку",
        en: "Get a subscription",
      },
      "home_page-54": {
        ukr: "Реквізити",
        en: "Bank details in Ukraine",
      },
      "home_page-55": {
        ukr: "Перекази в іноземній валюті",
        en: "International bank transfers",
      },
      "home_page-56": {
        ukr: "Заповнюйте форму і ми з вами зв’яжемось",
        en: "Fill out the form and we will contact you",
      },
      "home_page-57": {
        ukr: "Ім’я",
        en: "Name",
      },
      "home_page-58": {
        ukr: "Номер телефону",
        en: "Phone number",
      },
      "home_page-59": {
        ukr: "Надіслати",
        en: "Send",
      },
      "home_page-60": {
        ukr: "Залишай свою електронну пошту та отримуй звітність про діяльність фонду. Будь завжди в курсі !",
        en: "Leave your e-mail and receive reports on the fund's activities. Always be informed!",
      },
      "home_page-61": {
        ukr: "Звітність",
        en: "Reports",
      },
      "home_page-62": {
        ukr: "Підписка",
        en: "Subscription",
      },
      "home_page-63": {
        ukr: "Партнери",
        en: "Partners",
      },
      "home_page-64": {
        ukr: "Вакансії",
        en: "Vacansies",
      },
      "home_page-65": {
        ukr: "Часті запитання",
        en: "FAQ",
      },
      "home_page-66": {
        ukr: "Інформаційна лінія",
        en: "Information line",
      },
      "home_page-67": {
        ukr: "Підтримати",
        en: "Support",
      },
      "home_page-68": {
        ukr: "Дякуємо, що залишили запит на нашому сайті. Очікуйте, найближчим часом з вами зв’яжуться.",
        en: "Thank you for leaving a request on our website. Please wait, you will be contacted shortly.",
      },
      "home_page-69": {
        ukr: "Все буде Україна!",
        en: "Everything will be Ukraine!",
      },
      "home_page-70": {
        ukr: "Підтримати збір",
        en: "Support fundraising",
      },
      "home_page-74": {
        ukr: "Партнери",
        en: "Partners",
      },
      "home_page-75": {
        ukr: "Вакансії",
        en: "Vacansies",
      },
      "home_page-76": {
        ukr: "Часті запитання",
        en: "FAQ",
      },
      "home_page-77": {
        ukr: "Адреса",
        en: "Address",
      },
      "home_page-78": {
        ukr: "Україна, 65039 , Одеська обл., місто Одеса, пр.Гагаріна, будинок 12а, офіс 110",
        en: "Ukraine, 65039, Odesa region, Odesa city, Gagarina avenue, building 12a, office 110",
      },
    };
    function checkPagePathName() {
      switch (currentPathName) {
        case "/index.html":
          currentTexts = homeTexts;
          break;
  
        case "/partners.html":
          currentTexts = partnersTexts;
          break;
  
        case "/vacancy.html":
          currentTexts = vacancyTexts;
          break;
  
        case "/help.html":
          currentTexts = helpTexts;
          break;
  
        default:
          currentTexts = homeTexts;
          break;
      }
    }
    checkPagePathName();
    function changeLang() {
      for (const key in currentTexts) {
        let elem = document.querySelector(`[data-lang=${key}]`);
        if (elem) elem.textContent = currentTexts[key][currentLang];
      }
    }
    changeLang();
    langButtons.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        if (!event.target.classList.contains("header__btns-btn--active")) {
          currentLang = event.target.dataset.btn;
          localStorage.setItem("language", event.target.dataset.btn);
          resetActiveClass(langButtons, "header__btns-btn--active");
          btn.classList.add("header__btns-btn--active");
          changeLang();
        }
      });
    });
  
    function resetActiveClass(arr, activeClass) {
      arr.forEach((elem) => {
        elem.classList.remove(activeClass);
      });
    }
    function checkActiveLangButton() {
      switch (currentLang) {
        case "ukr":
            document.querySelectorAll('[data-btn="ukr"]').forEach((item) => {
              item.classList.add("header__btns-btn--active");
            });
          break;
  
        case "en":
          document.querySelectorAll('[data-btn="en"]').forEach((item) => {
            item.classList.add("header__btns-btn--active");
          });
         
          break;
  
        default:
          document
            .querySelector('[data-btn="ukr"]')
            .classList.add("header__btn_active");
          break;
      }
    }
    checkActiveLangButton();
    function checkBrowserLang() {
      const navLang = navigator.language.slice(0, 2).toLowerCase();
      const result = allLangs.some((elem) => elem === navLang);
      if (result) return navLang;
    }
    console.log("navigator.language", checkBrowserLang());
  

    
   
    /*-----------copy-------------------*/
  
    function copy() {
      const textToCopyOne = document.querySelector("#copy-text-one");
      const copyBtn = document.querySelector("#copy-one");
      const textToCopySecond = document.querySelector("#copy-text-second");
      const copyBtnSecond = document.querySelector("#copy-second");
      const textToCopyThird = document.querySelector("#copy-text-third");
      const copyBtnThird = document.querySelector("#copy-third");
      const textToCopyFourth = document.querySelector("#copy-text-fourth");
      const copyBtnFourth = document.querySelector("#copy-fourth");
  
      copyBtn.addEventListener("click", function copyTextOne() {
        navigator.clipboard.writeText(textToCopyOne.innerText);
      });
  
      copyBtnSecond.addEventListener("click", function copyTextSecond() {
        navigator.clipboard.writeText(textToCopySecond.innerText);
      });
  
      copyBtnThird.addEventListener("click", function copyTextThird() {
        navigator.clipboard.writeText(textToCopyThird.innerText);
      });
      copyBtnFourth.addEventListener("click", function copyTextFourth() {
        navigator.clipboard.writeText(textToCopyFourth.innerText);
      });
    }
  
    /*------------forms----------------*/
  
    const form = document.querySelector("#contact-form");
    const url = "https://volonteer-cars.onrender.com/api/feedback"; // замінити на актуальний
    const message = {
      loading: "Почекайте...",
      failure: "Помилка",
    };
    form.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const name = form.querySelector("#contact__name").value;
      const phone = form.querySelector("#contact__tel").value;
      const email = form.querySelector("#contact__email").value;
  
      const data = { name, phone, email };
  
      let statusMessage = document.createElement("div");
      statusMessage.classList.add("status");
      form.appendChild(statusMessage);
      document.querySelector(".status").textContent = message.loading;
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((responseData) => {
          console.log(responseData);
          showModal();
        })
        .catch((error) => {
          console.log(error);
          statusMessage.textContent = message.failure;
        })
        .finally(() => {
          form.reset();
          setTimeout(() => {
            statusMessage.remove();
          }, 5000);
        });
    });
  



    window.onscroll = function () {
      myFunction();
    };
  
    const header = document.querySelector("header");
    const sticky = header.offsetTop;
  
    function myFunction() {
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
      } else {
        header.classList.remove("sticky");
      }
    }
  
    /*----------------------------*/
    let menuBtn = document.querySelector(".menu-btn");
    let menu = document.querySelector(".menu");
    menuBtn.addEventListener("click", (function() {
        menuBtn.classList.toggle("active");
        menu.classList.toggle("active");
        if (menuBtn.classList.contains("active")) document.body.style.overflow = "hidden"; else document.body.style.overflow = "";
    }));
    menu.addEventListener("click", (e => {
        if (e.target === menu) {
            menu.classList.remove("active");
            menuBtn.classList.remove("active");
            document.body.style.overflow = "";
        }
    }));

    /*----------------------------*/
    copy();
    spollers();
    tabs();
  })();
  