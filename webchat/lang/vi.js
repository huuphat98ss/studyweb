export const transValidation = {
  email_incorrect: "email phai co dang example@abc.com",
  gender_incorrect: "khong dc F12 nha =]]",
  password_incorrect:
    "password toi thieu 8 ki tu, bao gom chu hoa , chu thuong, chu so va ky tu dat biet",
  password_confirmation_incorrect: "pass ko giong roi",
  keyword_finduser: "loi tu khoa tim kiem",
  message_text_emoji: "tin nhan khong hop le ",
  update_username: "ten khong hop le",
  update_gender: "khong dc F12 nha =]]",
  update_address: "dia chi ko hop le",
  update_phone: "so dien thoai khong hop le",
  update_password: "mat khau khong hop le",
  update_confirm_password: " confirm password khong dung",
  add_user_group: "so luong thanh vien toi thieu 3 nguoi toi da 17 nguoi",
  create_name_group: "ten nhom toi thieu 5 ki tu toi da 30 ki tu",
};

export const transErrors = {
  account_in_use: " email nay da dc dung.",
  account_removed: "tai khoan nay da bi go khoi he thong",
  account_not_active: "Email nay chua dc Active tai khoan",
  login_failed: "Sai tai khoan hoac mat khau",
  server_error: "co loi o phia server",
  token_undefined: "mail da duoc active roi !!",
  conversation_not_found: "cuoc tro chuyen khong ton tai",
  avatar_type: "file khong hop le - phai la jpg,png,jpeg",
  image_message_type: "file khong hop le - phai la jpg,png,jpeg",
  avatar_size: " file co dung luong lon hon 1MB",
  image_message_size: " file co dung luong lon hon 1MB roi",
  check_account: "tai khoan ko ton tai",
  check_password: "mat khau khong chinh xac",
};

export const transSuccess = {
  userCreated: (userEmail) => {
    return `Tai khoan <strong>${userEmail}</strong> da dc tao truy cap mail de tien hanh active tai khoan`;
  },
  account_actived: " kich hoat tai khoan thanh cong",
  loginSuccess: (username) => {
    return `xin chao${username},chuc ban mot ngay tot lanh`;
  },
  logout_success: "ban da logout thanh cong",
  avatar_updated: "cap nhat Avatar thanh cong",
  userInfor_updated: "cap nhat thong tin thanh cong",
  user_update_password: "cap nhat mat khau thanh cong",
};

export const transMail = {
  subject: "web chat: xac nhan kich hoat",
  template: (linkVerify) => {
    return `
        <h2>Ban nha duoc email nay khi dang ky web chat</h2>
        <h3>Vui long nhan vao ben duoi de kich hoat tai khoan</h3>
        <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>
        `;
  },
  send_failed: "co loi trong qua trinh gui mail",
};
