const slugifyUtil = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-alphanumeric chars except space and hyphen
    .replace(/[\s_-]+/g, '-')  // replace spaces and underscores with single hyphen
    .replace(/^-+|-+$/g, '');  // trim hyphens
};

module.exports = slugifyUtil;
