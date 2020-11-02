import { validationResult } from "express-validator"; //kiem tra check
import authService from "./../services/authService";
import { transSuccess } from "../../lang/vi";
// kiem tra ca gia tri tra  ve isEmpty mapped... de bac loi dang ky
let getLoginRegister = (req, res) => {
  return res.render("auth/loginRegister", {
    errorsregister: req.flash("errors-register"),
    errors: req.flash("errors"),
    success: req.flash("success"),
  });
};
let postRegister = async (req, res) => {
  //console.log(req.body);
  let errorArr = [];
  let successArr = [];
  let validationErrors = validationResult(req);
  //console.log(validationErrors.isEmpty());
  //console.log(validationErrors.mapped());// tra ve 1 mang json cac thong bao ve loi msg ...
  if (!validationErrors.isEmpty()) {
    //console.log(validationErrors.isEmpty());
    let errors = Object.values(validationErrors.mapped()); //gom thanh Array
    errors.forEach((item) => {
      errorArr.push(item.msg);
    });
    //console.log(errorArr);
    req.flash("errors-register", errorArr);
    return res.redirect("/login-register"); // chuyen huong
  }
  //console.log(req.body);
  try {
    let createUserSuccess = await authService.register(
      req.body.email,
      req.body.gender,
      req.body.password,
      req.protocol,
      req.get("host")
    );
    successArr.push(createUserSuccess);
    req.flash("success", successArr);
    return res.redirect("/login-register");
  } catch (error) {
    errorArr.push(error);
    req.flash("errors-register", errorArr);
    return res.redirect("/login-register");
  }
};
let verifyAccount = async (req, res) => {
  let errorArr = [];
  let successArr = [];
  try {
    let verfyStatus = await authService.verifyAccount(req.params.token);
    successArr.push(verfyStatus);
    req.flash("success", successArr);
    return res.redirect("/login-register");
  } catch (error) {
    errorArr.push(error);
    req.flash("errors", errorArr);
    return res.redirect("/login-register");
  }
};
let getLogout = (req, res) => {
  req.logout(); // xoa session passport
  req.flash("success", transSuccess.logout_success);
  return res.redirect("/login-register");
};
// isAuthenticated() ham thuoc passport
let checkLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login-register");
  }
  next();
};
let checkLoggedOut = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
};
module.exports = {
  getLoginRegister: getLoginRegister,
  postRegister: postRegister,
  verifyAccount: verifyAccount,
  getLogout: getLogout,
  checkLoggedIn: checkLoggedIn,
  checkLoggedOut: checkLoggedOut,
};
