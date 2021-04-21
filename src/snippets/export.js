export default {
  name: "Export",
  language: null,
  webhook_support: true,
  generateFrom(data) {
    return JSON.stringify(data, null, "  ");
  },
};
