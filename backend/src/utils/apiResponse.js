exports.success = (res, data, message = "Success", status = 200, meta = undefined) => {
  return res.status(status).json({ success: true, message, data, meta });
};

exports.created = (res, data, message = "Created") => exports.success(res, data, message, 201);
