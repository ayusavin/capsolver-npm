require("dotenv").config();
const solver = new (require("../../../src/Solver"))(process.env.APIKEY);

(async function () {
    // https://docs.capsolver.com/guide/captcha/ReCaptchaV3.html
    await solver.recaptchav3({
        websiteURL: "https://www.freemans.com/",
        websiteKey: "6LfA5nobAAAAAMxwekgF_DnCofaDlm-YqHX5v1BI",
        pageAction: "sign_in",
        proxy: process.env.PROXYSTRING
    })
        .then((solution) => { console.log(solution); })
        .catch(e => { console.log(e); });
})();