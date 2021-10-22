// 양식 검토 함수
const validation = (form, kind, res) => {
  const validationErrors = {};
  if (form === undefined || form === "" || form === null) {
    validationErrors[kind] = `${kind} is required!`;
  }

  if (Object.keys(validationErrors).length > 0) {
    res.status(422).json({
      result: "failed",
      data: validationErrors,
    });
    return true;
  } else {
    return false;
  }
};

module.exports = { validation };
